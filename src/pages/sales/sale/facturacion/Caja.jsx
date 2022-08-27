import React, { useState, useEffect, useContext, useRef } from "react";

import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
  Stack,
  Container,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHandshake,
  faReceipt,
  faSearch,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import { isEmpty } from "lodash";

import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { DataContext } from "../../../../context/DataContext";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { getStoresByUserAsync } from "../../../../services/AlmacenApi";
import {
  deleteFacturaAsync,
  getFactCancelledByStoreAsync,
  getFactUncancelledByStoreAsync,
} from "../../../../services/FacturationApi";
import NoData from "../../../../components/NoData";
import PaginationComponent from "../../../../components/PaginationComponent";

import Pagar from "./Pagar";
import SmallModal from "../../../../components/modals/SmallModal";
import { BillComponent } from "../printBill/BillComponent";

let controller = "";
if (process.env.NODE_ENV === "production") {
  controller = "http://20.231.75.97:8090/";
} else {
  controller = "https://localhost:7015/";
}

const Caja = () => {
  let ruta = getRuta();
  const {
    reload,
    setReload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
    isDarkMode,
  } = useContext(DataContext);
  let navigate = useNavigate();

  const [facturaList, setFacturaList] = useState([]);
  const [facturaSelected, setFacturaSelect] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const withSearch = facturaList.filter((val) => {
    if (isEmpty(val.client)) {
      if (searchTerm === "") {
        return val;
      } else if (
        val.id.toString().includes(searchTerm) ||
        val.nombreCliente.toString().includes(searchTerm)
      ) {
        return val;
      }
    } else {
      if (searchTerm === "") {
        return val;
      } else if (
        val.id.toString().includes(searchTerm) ||
        val.client.nombreCliente.toString().includes(searchTerm)
      ) {
        return val;
      }
    }
  });

  //Para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = withSearch.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const token = getToken();

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [active, setActive] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [dataBill, setDataBill] = useState([]);

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStores = await getStoresByUserAsync(token);
      if (!resultStores.statusResponse) {
        setIsLoading(false);
        if (resultStores.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultStores.error.message);
        return;
      }

      if (resultStores.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultStores.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setStoreList(resultStores.data);

      if (selectedStore === "") {
        setSelectedStore(resultStores.data[0].id);
        const result = await getFactUncancelledByStoreAsync(
          token,
          resultStores.data[0].id
        );
        if (!result.statusResponse) {
          setIsLoading(false);
          if (result.error.request.status === 401) {
            navigate(`${ruta}/unauthorized`);
            return;
          }
          toastError(result.error.message);
          return;
        }

        if (result.data === "eX01") {
          setIsLoading(false);
          deleteUserData();
          deleteToken();
          setIsLogged(false);
          return;
        }

        if (result.data.isDefaultPass) {
          setIsLoading(false);
          setIsDefaultPass(true);
          return;
        }

        setFacturaList(result.data);
      } else {
        onSelectChange(active);
      }
      setIsLoading(false);
    })();
  }, [reload]);

  const handleChangeStore = async (event) => {
    setSelectedStore(event.target.value);
    if (active === 0) {
      setIsLoading(true);
      const result = await getFactUncancelledByStoreAsync(
        token,
        event.target.value
      );
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error.message);
        return;
      }
      if (result.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }
      if (result.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);

      setFacturaList(result.data);
    } else {
      setIsLoading(true);
      const result = await getFactCancelledByStoreAsync(
        token,
        event.target.value
      );
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error.message);
        return;
      }
      if (result.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }
      if (result.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setFacturaList(result.data);
    }
    //  else {
    //   setIsLoading(true);
    //   const result = await getAnulatedSalesByStoreAsync(
    //     token,
    //     event.target.value
    //   );
    //   if (!result.statusResponse) {
    //     setIsLoading(false);
    //     if (result.error.request.status === 401) {
    //       navigate(`${ruta}/unauthorized`);
    //       return;
    //     }
    //     toastError(result.error.message);
    //     return;
    //   }
    //   if (result.data === "eX01") {
    //     setIsLoading(false);
    //     deleteUserData();
    //     deleteToken();
    //     setIsLogged(false);
    //     return;
    //   }
    //   if (result.data.isDefaultPass) {
    //     setIsLoading(false);
    //     setIsDefaultPass(true);
    //     return;
    //   }
    //   setIsLoading(false);
    //   setListaVentas(result.data);
    // }
  };

  const onSelectChange = async (value) => {
    setActive(value);
    if (value === 0) {
      setIsLoading(true);
      const result = await getFactUncancelledByStoreAsync(token, selectedStore);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error.message);
        return;
      }
      if (result.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }
      if (result.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setFacturaList(result.data);
    } else {
      setIsLoading(true);
      const result = await getFactCancelledByStoreAsync(token, selectedStore);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error.message);
        return;
      }
      if (result.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }
      if (result.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setFacturaList(result.data);
    }
  };

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

  const connection = new HubConnectionBuilder()
    .withUrl(`${controller}newFactHub`)
    .configureLogging(LogLevel.Information)
    .build();

  async function start() {
    try {
      await connection.start();
      connection.on("factListUpdate", () => {
        setReload(!reload);
      });
    } catch (err) {
      setTimeout(start, 5000);
    }
  }

  connection.onclose(async () => {
    await start();
  });

  start();

  const anulateFactura = (fact) => {
    MySwal.fire({
      icon: "warning",
      title: <p>Confirmar Eliminar</p>,
      text: `Elimiar Facturacion: ${fact.id}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          setIsLoading(true);
          const result = await deleteFacturaAsync(token, fact.id);
          if (!result.statusResponse) {
            setIsLoading(false);
            if (result.error.request.status === 401) {
              navigate(`${ruta}/unauthorized`);
              return;
            }
            toastError(result.error.message);
            return;
          }

          if (result.data === "eX01") {
            setIsLoading(false);
            deleteUserData();
            deleteToken();
            setIsLogged(false);
            return;
          }

          if (result.data.isDefaultPass) {
            setIsLoading(false);
            setIsDefaultPass(true);
            return;
          }
        })();
        setIsLoading(false);
        setReload(!reload);
        toastSuccess("Facturacion Eliminada");
      }
    });
  };

  return (
    <div>
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ textAlign: "left" }}>Facturacion Piso</h1>
          <div>
            <FormControl
              variant="standard"
              fullWidth
              style={{
                textAlign: "left",
                width: 200,
                marginTop: 10,
                marginRight: 20,
              }}
            >
              <Select
                labelId="selProc"
                id="demo-simple-select-standard"
                value={selectedStore}
                onChange={handleChangeStore}
              >
                {storeList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              style={{
                textAlign: "left",
                width: 200,
                marginTop: 10,
                marginRight: 20,
              }}
            >
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                onChange={(e) => onSelectChange(e.target.value)}
                value={active}
              >
                <MenuItem key={0} value={0}>
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      color: "#1769aa",
                    }}
                  />
                  Pendiente
                </MenuItem>
                <MenuItem key={1} value={1}>
                  <FontAwesomeIcon
                    icon={faHandshake}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      color: "#00a152",
                    }}
                  />
                  Procesadas
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <hr />

        <TextField
          style={{ marginBottom: 20, width: 600 }}
          variant="standard"
          onChange={(e) => {
            onChangeSearch(e.target.value.toUpperCase());
          }}
          value={searchTerm}
          label={"Buscar Venta"}
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
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th>#</th>
                <th style={{ textAlign: "left" }}>Cliente</th>
                <th style={{ textAlign: "center" }}>Monto Venta</th>
                <th style={{ textAlign: "center" }}>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "center" }}>
                      {moment(item.fechaVenta).format("L")}
                    </td>

                    <td>{item.id}</td>

                    <td
                      style={{
                        textAlign: "left",
                        color: item.isEventual ? "inherit" : "#ff5722",
                        fontWeight: item.isEventual ? "normal" : "bold",
                      }}
                    >
                      {item.isEventual
                        ? item.nombreCliente === ""
                          ? "CLIENTE EVENTUAL - S/N"
                          : `C/E - ${item.nombreCliente}`
                        : item.client.nombreCliente}
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#03a9f4",
                      }}
                    >
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.montoVenta)}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {item.productsCount}
                    </td>

                    <td style={{ width: 100 }}>
                      <Stack
                        spacing={2}
                        direction="row"
                        justifyContent={"center"}
                      >
                        <IconButton
                          style={{ color: "#009688", height: 40, width: 40 }}
                          onClick={() => {
                            setFacturaSelect(item);
                            setShowModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faReceipt} />
                        </IconButton>

                        {active === 0 ? (
                          isAccess(access, "SALES DELETE") ? (
                            <IconButton
                              style={{
                                color: "#f50057",
                                height: 40,
                                width: 40,
                              }}
                              onClick={() => {
                                anulateFactura(item);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </IconButton>
                          ) : (
                            <></>
                          )
                        ) : (
                          <></>
                        )}
                      </Stack>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <PaginationComponent
          data={withSearch}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>

      <SmallModal
        titulo={"Pagar"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <Pagar
          facturaSelected={facturaSelected}
          setVisible={setShowModal}
          setShowBillModal={setShowBillModal}
          setDataBill={setDataBill}
        />
      </SmallModal>

      <SmallModal
        titulo={"Imprimir Recibo"}
        isVisible={showBillModal}
        setVisible={setShowBillModal}
      >
        <BillComponent data={dataBill} setShowModal={setShowBillModal} />
      </SmallModal>
    </div>
  );
};

export default Caja;