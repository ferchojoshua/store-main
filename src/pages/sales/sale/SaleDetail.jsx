import React, { useContext, useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import {
  Paper,
  Divider,
  IconButton,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faSave,
  faPrint,
  faEdit,
  faSearch,
  faReceipt,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../../context/DataContext";
import withReactContent from "sweetalert2-react-content";
import {
  GetContadoSalesByProfAsync,
  UpdateSaleDetailsAsync,
  deleteProformAsync,
} from "../../../services/SalesApi";
import Swal from "sweetalert2";

import { getRuta, toastError, toastSuccess, isAccess } from "../../../helpers/Helpers";
import {
  getToken,
  deleteUserData,
  deleteToken,
  getUser
} from "../../../services/Account";
import { useNavigate, useLocation } from "react-router-dom";
import MediumModal from "../../../components/modals/MediumModal";
import SmallModal from "../../../components/modals/SmallModal";
import EditDetailProforma from "../../sales/sale/EditDetailProforma";
import moment from "moment";
import { isEmpty } from "lodash";
import PaginationComponent from "../../../components/PaginationComponent";
import NoData from "../../../components/NoData";
import { finishSaleStatusAsync,  } from "../../../services/SalesApi";
import { BillComponent } from "./printBill/BillComponent";
import ProformaComponent from "./printBill/ProformaComponent";

import { getStoresByUserAsync } from "../../../services/AlmacenApi";

const SaleDetail = ({
  selectedProductList,
  setSelectedProductList,
  addProformma,
  addToProductList,
  setShowFacturarModal,
  montoVentaDespuesDescuento,
  setMontoVentaDespuesDescuento,
  descuentoGlobal,
  montoVentaAntesDescuento,
  setMontoVentaAntesDescuento,
  isFacturar,
  addNewVenta,
  idClient,
  userId,
  storeid,
  setSelectedStore,
}) => {
  const [active, setActive] = useState(0);
  const token = getToken();
  const [showModalSave, setShowModalSave] = useState(false);
  let ruta = getRuta();
  const location = useLocation();
  const { setIsLoading, setIsLogged, setIsDefaultPass, reload, setReload } =
    useContext(DataContext);
  let navigate = useNavigate();
  const { isDarkMode, access } = useContext(DataContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataRecords, setDataRecords] = useState([]);
  const [proforList, setProforList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [descuento, setDescuento] = useState("");
  const [descuentoXPercent, setDescuentoXPercent] = useState("");
  const [descuentoXMonto, setDescuentoXMonto] = useState("");

  const [descuentoCod, setDescuentoCod] = useState("");
  const [descuentoGlobalMonto, setDescuentoGlobalMonto] = useState("");
  const [descuentoGlobalPercent, setDescuentoGlobalPercent] = useState("");
  const [isDescPercent, setIsDescPercent] = useState(false);
  const [typeVenta, setTypeVenta] = useState("contado");
  const [selectedTipopago, setSelectedTipoPago] = useState(1);
  const [reference, setReference] = useState("");
  const [typeClient, setTypeClient] = useState(true);
  const [selectedClient, setSelectedClient] = useState("");
  const [eventualClient, setEventualClient] = useState("");
  const [dataBill, setDataBill] = useState([]);
  const [montoVenta, setMontoVenta] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isProforma, setIsProforma] = useState(false);
  const [showReimpresionModal, setShowReimpresionModal] = useState(false);
  const [selectedProforma, setSelectedProforma] = useState(null);
  const MySwal = withReactContent(Swal);
  

  const withSearch = proforList.filter((val) => {
    if (!val) return false;
    const nombreCliente = val.client?.nombreCliente || val.nombreCliente || "CLIENTE EVENTUAL";
    const term = searchTerm || "";
    return (
      term === "" ||
      (val.id?.toString() || "").includes(term) ||
      (val.description?.toString() || "").includes(term) ||
      nombreCliente.includes(term)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(5);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = withSearch.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteFromProductDetailList = (item) => {
    const filtered = selectedProductList.filter(
      (p) => p.product.id !== item.product.id
    );
    setMontoVentaAntesDescuento(montoVentaAntesDescuento - item.costoTotal);
    setMontoVentaDespuesDescuento(montoVentaAntesDescuento - item.costoTotal);
    setSelectedProductList(filtered);
  };

  const clearTable = (id) => {
    setSelectedProductList([]);
  };


  const updateProforma = async () => {
    if (selectedProductList.length === 0) {
        toastError("No hay productos para actualizar");
        return;
    }

    try {
        setIsLoading(true);

        const data = {
            Id: selectedProductList[0].consecutivo,
            proformasDetails: selectedProductList.map((product) => ({
                productId: product.product.id,
                cantidad: product.cantidad,
                costoUnitario: product.costoUnitario,
                costoTotal: product.costoTotal,
                codigoDescuento: product.codigoDescuento,
                descuentoXMonto: product.descuentoXMonto,
                descuento: product.descuento || 0,
                descuentoXPercent: product.descuentoXPercent || 0,
                costoTotalAntesDescuento: product.costoTotalAntesDescuento,
                costoTotalDespuesDescuento: product.costoTotalDespuesDescuento,
                PVD: product.PVD || product.pvd,
                PVM: product.PVM || product.pvm,
                costoCompra: product.costoCompra,
                storeid: product.storeid || storeid,
                consecutivo: product.consecutivo,
                anulatedBy: product.anulatedBy || 0,
            })),
        };

        const result = await UpdateSaleDetailsAsync(token, data);

        if (!result.statusResponse) {
            if (result.error?.request?.status === 401) {
                navigate(`${ruta}/unauthorized`);
                return;
            }
            throw new Error(result.error?.message || "Error al actualizar la proforma");
        }

        if (result.data === "eX01") {
            deleteUserData();
            deleteToken();
            setIsLogged(false);
            return;
        }

        // Actualizar la lista de proformas
        const proformasResult = await GetContadoSalesByProfAsync(token);
        if (proformasResult.statusResponse) {
            setProforList(proformasResult.data);
            setReload(!reload);
            toastSuccess("Proforma actualizada exitosamente");
            clearTable();
            setIsProforma(false);
        }

    } catch (error) {
        console.error("Error al actualizar la proforma:", error);
        toastError(error.message || "Error al actualizar la proforma");
    } finally {
        setIsLoading(false);
    }
};


  const editProform = (item) => {
    if (!item) {
      toastError("No hay datos para procesar");
      return;
    }

    try {
      const details = item.proformasDetails || item.facturaDetails;

      if (!details || details.length === 0) {
        throw new Error("No se encontraron detalles válidos");
      }

      const mappedProducts = details
        .map((detail, index) => {
          if (!detail.product && !detail.producto) {
            return null;
          }

          return {
            product: {
              id: detail.product?.id || detail.productoId,
              description: detail.product?.description,
            },
            storeid: item.store?.id || detail.store?.id,
            cantidad: detail.cantidad,
            costoUnitario: detail.costoUnitario,
            costoTotal: detail.costoTotal,
            descuento: detail.descuento || 0,
            descuentoXPercent: detail.descuentoXPercent || 0,
            costoTotalAntesDescuento: detail.costoTotalAntesDescuento,
            costoTotalDespuesDescuento: detail.costoTotalDespuesDescuento,
            PVD: detail.pvd || detail.PVD,
            PVM: detail.pvm || detail.PVM,
            costoCompra: detail.costoCompra,
            consecutivo: item.id,
            proformaId: item.id
          };
        })
        .filter(Boolean);

      if (mappedProducts.length === 0) {
        throw new Error("No se pudieron mapear los productos correctamente");
      }

      // Establecer el store
      if (typeof setSelectedStore === "function" && item.store?.id) {
        setSelectedStore(item.store.id);
      }

      setSelectedProductList(mappedProducts);
      setMontoVentaAntesDescuento(item.montoVentaAntesDescuento || 0);
      setMontoVentaDespuesDescuento(item.montoVenta || 0);
    } catch (error) {
      console.error("Error al procesar los detalles:", error);
      toastError("Error al cargar los detalles");
    }
  };
  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

  const rePrintProforma = (proforma) => {
    if (!proforma) {
        toastError("No hay datos para reimprimir");
        return;
    }

    try {
        // Preparar los datos para la impresión
        const printData = {
            id: proforma.id,
            nombreCliente: proforma.nombreCliente,
            montoVenta: proforma.montoVenta,
            fechaVenta: proforma.fechaVenta,
            ProformasDetails: proforma.proformasDetails?.map(detail => ({
                product: detail.product,
                cantidad: detail.cantidad,
                costoUnitario: detail.costoUnitario,
                costoTotal: detail.costoTotal,
                descuento: detail.descuento,
                costoTotalAntesDescuento: detail.costoTotalAntesDescuento,
                costoTotalDespuesDescuento: detail.costoTotalDespuesDescuento
            })),  
            storeid : proforma.store.id,


        };

        setSelectedProforma(printData);
        setShowReimpresionModal(true);

    } catch (error) {
        console.error("Error al preparar la reimpresión:", error);
        toastError("Error al preparar la reimpresión");
    }
};

const DeleteProfomr = async (proforma) => {
  if (!proforma) {
    toastError("No hay datos para procesar");
    return;
  }

  try {
    const confirmed = await Swal.fire({
      title: "¿Está seguro?",
      text: "¡No podrá revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmed.isConfirmed) {
      return;
    }

    setIsLoading(true);

    // Validar que exista el ID de la proforma
    if (!proforma.id) { 
      throw new Error("No se encontró el ID de la proforma");
    }

    // Enviar solo el ID como número, no como objeto
    const result = await deleteProformAsync(token, proforma.id);

    if (!result.statusResponse) {
      if (result.error?.request?.status === 401) {
        navigate(`${ruta}/unauthorized`);
        return;
      }
      throw new Error(result.error?.message || "Error al eliminar la proforma");
    }

    if (result.data === "eX01") {
      deleteUserData();
      deleteToken();
      setIsLogged(false);
      return;
    }

    if (result.data?.isDefaultPass) {
      setIsDefaultPass(true);
      return;
    }

    // Actualizar la lista de proformas y limpiar selección actual
    setProforList(prevList => prevList.filter(p => p.id !== proforma.id));
    setSelectedProductList([]);
    setMontoVentaAntesDescuento(0);
    setMontoVentaDespuesDescuento(0);
    
    setReload(!reload);
    toastSuccess("Proforma eliminada exitosamente");

  } catch (error) {
    console.error("Error al eliminar proforma:", error);
    toastError(error.message || "Error al eliminar la proforma");
  } finally {
    setIsLoading(false);
  }
};
  const getTotalProductos = () => {
    if (!selectedProductList || selectedProductList.length === 0) {
      return 0;
    }
    return selectedProductList.reduce((total, item) => {
      return total + (item.cantidad || 0);
    }, 0);
  };

  const getMontoAPagar = () => {
    if (!selectedProductList?.length) return 0;

    const montoTotal = selectedProductList.reduce((total, item) => {
      return total + (item.costoTotal || 0);
    }, 0);

    return montoTotal; // Esto debería dar 3,299.11 (2,926 + 373.11)
  };

  useEffect(() => {
    const hasProforma = selectedProductList.some(
      (product) => product.consecutivo
    );
    setIsProforma(hasProforma);
  }, [selectedProductList]);

 
  useEffect(() => {
    const fetchProformas = async () => {
      try {
        setIsLoading(true);
        const user = getUser();
        
        // Obtener almacenes del usuario
        const resultStore = await getStoresByUserAsync(token);
        
        if (!resultStore.statusResponse) {
          if (resultStore.error?.request?.status === 401) {
            navigate(`${ruta}/unauthorized`);
            return;
          }
          throw new Error(resultStore.error?.message || "Error al cargar los almacenes");
        }
  

        // Obtener proformas
        const result = await GetContadoSalesByProfAsync(token);
        
        if (!result.statusResponse) {
          throw new Error(result.error?.message || "Error al cargar las proformas");
        }
  
        let proformasToShow = result.data;
        
        if (!isAccess(access, "COSTO VER")) {
          proformasToShow = result.data.filter(proforma => {
            const storeMatch = resultStore.data.some(store => store.id === proforma.store?.id);
            const userMatch = proforma.facturedBy.fullName === user;
            return storeMatch && userMatch;
          });
        } 
        setProforList(proformasToShow);
  
      } catch (error) {
        console.error("Error:", error);
        toastError(error.message || "Error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProformas();
  }, [reload]); 

  return (
    <div>
      <Paper
        elevation={10}
        style={{ marginTop: 20, borderRadius: 30, padding: 20 }}
      >
      <h6>
              Detalle de Venta
              {selectedProductList.length > 0 && selectedProductList[0]?.consecutivo 
                  ? `: ${selectedProductList[0].consecutivo}`
                  : ''}
          </h6>
        <Divider style={{ marginBottom: 20 }} />

        <Table
          hover={!isDarkMode}
          size="sm"
          responsive
          className="text-primary"
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Proforma #</th>
              <th style={{ textAlign: "center" }}>Producto</th>
              <th style={{ textAlign: "center" }}>C. Unitario</th>
              <th style={{ textAlign: "center" }}>Descuento</th>
              <th style={{ textAlign: "center" }}>Cost-Desc</th>
              <th style={{ textAlign: "center" }}>Cantidad</th>
              <th style={{ textAlign: "right" }}>Costo Total</th>
              <th style={{ textAlign: "center" }}>Eliminar</th>
            </tr>
          </thead>
          <tbody className={isDarkMode ? "text-white" : "text-dark"}>
            {selectedProductList ? (
              selectedProductList.map((item) => (
                <tr key={selectedProductList.indexOf(item) + 1}>
                  <td style={{ textAlign: "left" }}>
                    {selectedProductList.indexOf(item) + 1}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {" "}
                    {item.product.description.length > 30
                      ? `${item.product.description.slice(0, 30)}...`
                      : item.product.description}
                  </td>
                  <td>
                    {item.costoUnitario.toLocaleString("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    })}
                  </td>
                  <td>{`${parseFloat(item.descuento).toLocaleString("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  })} = ${Math.round(item.descuentoXPercent)}%`}</td>
                  <td>
                    {item.costoTotalDespuesDescuento.toLocaleString("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    })}
                  </td>
                  <td>{item.cantidad}</td>
                  <td>
                    {item.costoTotalAntesDescuento.toLocaleString("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    })}
                  </td>
                  <td>
                  <Tooltip title="Eliminar" arrow>
                  <IconButton
                      style={{ color: "#f44336" }}
                      onClick={() => deleteFromProductDetailList(item)}
                  >
                      <FontAwesomeIcon icon={faTrashAlt} />
                  </IconButton>
              </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No hay productos seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div style={{ marginBottom: 20, display: "flex", gap: "10px" }}>
          <Tooltip
            title={
              typeof idClient === "number"
                ? "Guardar Proforma"
                : "Imprimir Proforma"
            }
            arrow
          >
            <Button
                variant="outlined"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "space-between",
                    borderRadius: 20,
                    borderColor: "#2979ff",
                    color: "#2979ff",
                }}
                onClick={async () => {
                    if (isProforma) {
                        await updateProforma();
                    } else {
                        await addProformma();
                        clearTable();
                        setIsProforma(false);
                    }
                }}
            >
                <FontAwesomeIcon
                    style={{ marginRight: 10, fontSize: 20 }}
                    icon={isProforma ? faEdit : faSave}
                />
                {isProforma ? "Actualizar" : "Proformar"}
            </Button>
          </Tooltip>

          {/* Botón Facturar a la derecha */}
          <Button
        variant="outlined"
        style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            borderRadius: 20,
            borderColor: "#00a152",
            color: "#00a152",
          }}
            onClick={() =>
              isFacturar ? addNewVenta() : setShowFacturarModal(true)
            }
          >
        <FontAwesomeIcon
            style={{ marginRight: 10, fontSize: 20 }}
            icon={faSave}
        />
        Facturar
    </Button>
          {/* Botón Facturar a la derecha */}
          <Tooltip title={"Limpiar Detalle"} arrow>
            <Button
              variant="outlined"
              style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "space-between",
                borderRadius: 20,
                borderColor: "#00a152",
                color: "#00a152",
              }}
              onClick={() => {
                clearTable();
                setIsProforma(false);
              }}
            >
              <FontAwesomeIcon
                style={{ marginRight: 10, fontSize: 20 }}
                icon={faTableCellsLarge}
              />
              Eliminar
            </Button>
          </Tooltip>
        </div>
        <Stack 
  direction="row" 
  spacing={4} 
  justifyContent="center" 
  alignItems="center" 
  sx={{ padding: 2 }}
>
  <Stack 
    direction="row" 
    spacing={4} 
    alignItems="center" 
    divider={<Divider orientation="vertical" flexItem />}
  >
    <Box sx={{ textAlign: 'center', minWidth: 150 }}>
      <Typography
        style={{
          fontSize: 15,
          fontWeight: "bold",
          marginBottom: 1
        }}
      >
        Total de Productos
      </Typography>
      <Typography
        style={{
          fontSize: 14,
          color: "#2196f3",
          fontWeight: "bold",
        }}
      >
        {getTotalProductos()}
      </Typography>
    </Box>

    <Box sx={{ textAlign: 'center', minWidth: 150 }}>
      <Typography
        style={{
          fontSize: 15,
          fontWeight: "bold",
          marginBottom: 1
        }}
      >
        Monto a pagar
      </Typography>
      <Typography
        style={{
          fontSize: 14,
          color: "#f50057",
          fontWeight: "bold",
        }}
      >
        {new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(getMontoAPagar())}
      </Typography>
    </Box>
  </Stack>
</Stack>
      </Paper>
      <Paper
        elevation={10}
        style={{ marginTop: 20, borderRadius: 30, padding: 20 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h6>Proformas</h6>
        </div>
        <Divider style={{ marginBottom: 20 }} />

        <TextField
          style={{ marginBottom: 20, maxWidth: 600 }}
          variant="standard"
          fullWidth
          onChange={(e) => {
            onChangeSearch(e.target.value.toUpperCase());
          }}
          value={searchTerm}
          label={"Buscar Proforma"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: "#03a9f4" }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {isEmpty(withSearch) ? (
          <NoData />
        ) : (
          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>N° Prof</th>
                <th style={{ textAlign: "center" }}>F.Venta</th>
                <th style={{ textAlign: "center" }}>Cliente</th>
                <th style={{ textAlign: "center" }}>Almacen</th>
                <th style={{ textAlign: "center" }}>F.Vencimiento </th>
                <th style={{ textAlign: "center" }}>M.Venta</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem && currentItem.length > 0 ? (
                currentItem.map((selectedProductList) => (
                  <tr key={selectedProductList.id}>
                    <td>{selectedProductList.id}</td>
                    <td style={{ textAlign: "center" }}>{moment(selectedProductList.fechaVenta).format("L")} </td>
                    <td>{selectedProductList.nombreCliente}</td>
                    <td>{selectedProductList.store?.name}</td>                    
                    <td style={{ textAlign: "center" }}>
                      {moment(selectedProductList.fechaVencimiento).format("L")}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {" "}
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(selectedProductList.montoVenta)}{" "}
                    </td>
                    <td>
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip title="Editar" arrow>
                          <IconButton
                            style={{ color: "#2979ff" }}
                            onClick={() => editProform(selectedProductList)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </IconButton>
                        </Tooltip>                             
                        <Tooltip title="Editar" arrow>
                          <IconButton
                            style={{ color: "#FFEB3B" }}
                            onClick={() => rePrintProforma(selectedProductList)}>
                            <FontAwesomeIcon icon={faPrint} />
                          </IconButton>
                        </Tooltip>
                        {isAccess(access, "COSTO VER") &&  (
                        <Tooltip title="Eliminar" arrow>
                        <IconButton
                            style={{
                              color: "#f50057",
                              height: 40,
                              width: 40, }}
                              onClick={() => DeleteProfomr(selectedProductList)}>
                                  <FontAwesomeIcon icon={faTrashAlt} />
                                </IconButton>
                              </Tooltip>     
                            )}               
                          </td>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No hay proformas guardadas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        <PaginationComponent
          data={withSearch}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Paper>

      {showEditModal && (
        <MediumModal
          titulo={`${selectedItem.id} - ${selectedItem.nombreCliente}`}
          isVisible={showEditModal}
          setVisible={setShowEditModal}
        >
          <EditDetailProforma
            selectedItem={selectedItem}
            setShowModal={setShowEditModal}
          />
        </MediumModal>
      )}
<SmallModal
    titulo={"Reimprimir Proforma"}
    isVisible={showReimpresionModal}
    setVisible={setShowReimpresionModal}
>
    <ProformaComponent
        data={selectedProforma}
        setShowModal={setShowReimpresionModal}
    />
</SmallModal>

    </div>
  );
};

export default SaleDetail;
