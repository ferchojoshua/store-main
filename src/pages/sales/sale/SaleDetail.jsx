import React, { useContext,useState } from "react";
import { Table } from "react-bootstrap";
import {
  Paper,
  Divider,
  IconButton,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faSave, faPrint } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../../context/DataContext";
import { ProformAddAsync } from "../../../services/SalesApi";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import { getToken, deleteUserData, deleteToken } from "../../../services/Account";
import { useNavigate } from "react-router-dom";




const SaleDetail = ({
  selectedProductList,
  setSelectedProductList,
  addProformma,
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
}) => {

const token = getToken();
const [showModalSave, setShowModalSave] = useState(false);
let ruta = getRuta();
const { setIsLoading, setIsLogged, setIsDefaultPass, reload, setReload } =
useContext(DataContext);
let navigate = useNavigate();
const { isDarkMode } = useContext(DataContext);

  const deleteFromProductDetailList = (item) => {
    const filtered = selectedProductList.filter(
      (p) => p.product.id !== item.product.id
    );
    setMontoVentaAntesDescuento(montoVentaAntesDescuento - item.costoTotal);
    setMontoVentaDespuesDescuento(montoVentaAntesDescuento - item.costoTotal);
    setSelectedProductList(filtered);
  };


  const saveProforma = async () => {

    const currentDate = new Date(); 
    const dueDate = new Date(currentDate); 
    dueDate.setDate(currentDate.getDate() + 14); 

    const actionValue = 1;

    const proformaData = {
      Action: actionValue,
      StoreId: storeid,
      NombreCliente: idClient,
      Detalle: selectedProductList[0].product.description,  // Solo mandas el primer producto como detalle
      ProductoId : selectedProductList[0].product.id,
      Cantidad: selectedProductList[0].cantidad,  // Cantidad del primer producto
      PrecioUnitario: selectedProductList[0].costoUnitario,  // Precio del primer producto
      Total: selectedProductList[0].costoTotalDespuesDescuento,  // Total del primer producto
      MontoTotal: montoVentaDespuesDescuento,
      FechaEmision: currentDate.toISOString(),
      FechaVencimiento: dueDate.toISOString(),
      ProformaRealizada: false,
      ProformaVencida: false,
    };

    // const proformaData = {
    //   productos: selectedProductList.map(item => ({
    //     productId: item.product.id,  // ID del producto
    //     Detalle: item.product.description, // Descripción del producto
    //     cantidad: item.cantidad,  // Cantidad de productos
    //     precioUnitario: item.costoUnitario,  // Precio unitario del producto
    //     descuento: item.descuento,  // Descuento aplicado
    //     costoTotalDespuesDescuento: item.costoTotalDespuesDescuento,  // Costo total con descuento
    //   })),
    //   montoAntesDescuento: montoVentaAntesDescuento,  // Monto antes de descuento
    //   montoDespuesDescuento: montoVentaDespuesDescuento,  // Monto después de descuento
    //   descuentoGlobal: descuentoGlobal,  // Descuento global en la proforma
    //   fechaCreacion:  currentDate.toISOString(), 
    //   fechaVencimiento: dueDate.toISOString(),
    //   ProformaRealizada: false,
    //   ProformaVencida: false,   
    //   storeid: storeid, 
    //   nombreCliente: idClient, 
    //   userId: userId, 
    //   action:  'I',
   
    // };
  
    setIsLoading(true);
    try {
    
        const result = await ProformAddAsync(token, proformaData);
        if (!result.statusResponse){
          setIsLoading(false);
          if (result.error?.request.status === 401)
            {
              navigate(`${ruta}/unauthorized`);
              return;
          }
          toastError(result.error?.message || "Ocurrió un error inesperado");
          return;
        }

        if (result.data === "eX01") {
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
        }

        if (result.data.isDefaultPass) {
          setIsDefaultPass(true);
          return;
        }
        toastSuccess("Proforma guardada exitosamente");
        // clearForm();
    setShowModalSave(false);

  } catch (error) {
    setIsLoading(false);
    toastError('Error al guardar la Proforma: ' + error.message);
  }
};

  return (
    <div>
      <Paper
        elevation={10}
        style={{
          marginTop: 5,
          borderRadius: 30,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h6>Detalle de Venta</h6>
        </div>

        <Divider style={{ marginBottom: 20 }} />

        <Table
          hover={!isDarkMode}
          size="sm"
          responsive
          className="text-primary"
        >
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left" }}>Producto</th>
              <th style={{ textAlign: "center" }}>C. Unitario</th>
              <th style={{ textAlign: "center" }}>Descuento</th>
              <th style={{ textAlign: "center" }}>Cost-Desc</th>
              <th style={{ textAlign: "center" }}>Cantidad</th>
              <th style={{ textAlign: "center" }}>Costo Total</th>
              <th style={{ textAlign: "center" }}>Eliminar</th>
            </tr>
          </thead>
          <tbody className={isDarkMode ? "text-white" : "text-dark"}>
            {selectedProductList ? (
              selectedProductList.map((item) => {
                return (
                  <tr key={selectedProductList.indexOf(item) + 1}>
                    <td>{selectedProductList.indexOf(item) + 1}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.product.description}
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
                      {item.costoTotal.toLocaleString("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      })}
                    </td>
                    <td>
                      <IconButton
                        style={{ color: "#f50057" }}
                        onClick={() => deleteFromProductDetailList(item)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </Table>
      </Paper>

      <Paper
        elevation={10}
        style={{
          marginTop: 5,
          borderRadius: 30,
          padding: 20,
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="outlined"
            style={{
              borderRadius: 20,
              borderColor: "#2979ff",
              color: "#2979ff",
            }}
            onClick={() => {
              addProformma();
              saveProforma();
                        }}
          >
            <FontAwesomeIcon
              style={{ marginRight: 10, fontSize: 20 }} icon={faPrint}
            />
            Proformar
          </Button>

          <Stack>
            <Typography
              style={{
                marginBottom: 10,
                fontSize: 15,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Total de Productos
            </Typography>
            <Typography
              style={{
                fontSize: 14,
                color: "#2196f3",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {selectedProductList.length}
            </Typography>
          </Stack>

          <Stack>
            <Typography
              style={{
                marginBottom: 10,
                fontSize: 15,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Monto a pagar
            </Typography>
            <Typography
              style={{
                fontSize: 14,
                color: "#f50057",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {descuentoGlobal
                ? new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(montoVentaDespuesDescuento)
                : new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(montoVentaAntesDescuento)}
            </Typography>
          </Stack>

          <Button
            variant="outlined"
            style={{
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
        </Stack>
      </Paper>
    </div>
  );
};

export default SaleDetail;
