import React, { useState, useContext } from "react";
import { DataContext } from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../../helpers/Helpers";
import {
  Button,
  Divider,
  Container,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleMinus,
  faSave,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../../services/Account";
import moment from "moment";
import {
  anularSaleAsync,
  AnularVentaParcialAsync,
} from "../../../../services/SalesApi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Table } from "react-bootstrap";

const SaleReturn = ({ selectedVenta, setVisible }) => {
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
  const {
    id,
    fechaVencimiento,
    fechaVenta,
    saldo,
    montoVenta,
    client,
    saleDetails,
    nombreCliente,
    isCanceled,
    isAnulado,
  } = selectedVenta;

  const totalAbonado = montoVenta - saldo;
  const [detalleVenta, setDetalleVenta] = useState(saleDetails);

  const [saleMount, setSaleMount] = useState(montoVenta);
  const [saldoVenta, setSaldoVenta] = useState(saldo);

  const MySwal = withReactContent(Swal);
  let navigate = useNavigate();
  const token = getToken();

  const devolucionTotal = async () => {
    MySwal.fire({
      icon: "question",
      title: <p>Anular Venta</p>,
      text: `Esta seguro de anular esta venta?`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
      iconColor: "#f50057",
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          setIsLoading(true);
          const result = await anularSaleAsync(token, id);
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
        toastSuccess("Venta Anulada...");
        setReload(!reload);
        setVisible(false);
      }
    });
  };

  const cantidadUpdate = async (item) => {
    const {
      cantidad,
      costoTotal,
      costoUnitario,
      descuento,
      id,
      isAnulado,
      product,
      pvd,
      pvm,
      store,
    } = item;

    let newCantidad = cantidad;
    let totalCost = costoTotal;

    if (cantidad - 1 === 0) {
      toastError("Cantidad no puede ser cero(0)");
      return;
    }
    newCantidad = newCantidad - 1;

    totalCost = costoUnitario * newCantidad;

    const editedItem = detalleVenta.map((item) =>
      item.id === id
        ? {
            cantidad: newCantidad,
            costoTotal: totalCost,
            costoUnitario,
            descuento,
            id,
            isAnulado,
            product,
            pvd,
            pvm,
            store,
          }
        : item
    );
    let suma = 0;
    editedItem.map((item) => (suma += item.costoTotal));
    setSaldoVenta(suma - totalAbonado);
    setSaleMount(suma);
    setDetalleVenta(editedItem);
  };

  const devolucionParcial = async (item) => {
    if (detalleVenta.length === 1) {
      toastError("La factura no puede quedar vacia...");
      return;
    }
    const filtered = detalleVenta.filter((i) => i.id !== item.id);
    setDetalleVenta(filtered);
    let suma = 0;
    filtered.map((item) => (suma += item.costoTotal));
    setSaleMount(suma);
    setSaldoVenta(suma - totalAbonado);
  };

  const saveChanges = async () => {
    MySwal.fire({
      icon: "question",
      title: <p>Actualizar Venta</p>,
      text: `Esta seguro de aplicar cambios?`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
      iconColor: "#f50057",
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          setIsLoading(true);
          const data = {
            idSale: id,
            monto: saleMount,
            saldo: saldoVenta,
            saleDetails: detalleVenta,
          };
          const result = await AnularVentaParcialAsync(token, data);
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
        toastSuccess("Venta Actualizada...");
        setReload(!reload);
        setVisible(false);
      }
    });
  };
  return (
    <div>
      <Container>
        <Divider />
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography variant="body1">Id Venta:</Typography>
            <Typography
              variant="body1"
              style={{ color: "#2196f3", fontWeight: "bold", marginLeft: 10 }}
            >
              {id}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography variant="body1">Fecha Venta</Typography>
            <Typography
              variant="body1"
              style={{ color: "#4caf50", fontWeight: "bold", marginLeft: 10 }}
            >
              {moment(fechaVenta).format("L")}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography variant="body1">Fecha Vencimiento:</Typography>
            <Typography
              variant="body1"
              style={{ color: "#f50057", fontWeight: "bold", marginLeft: 10 }}
            >
              {moment(fechaVencimiento).format("L")}
            </Typography>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography variant="body1">Cliente:</Typography>
            <Typography
              variant="body1"
              style={{
                color: "#2196f3",
                fontWeight: "bold",
                marginLeft: 10,
              }}
            >
              {client
                ? client.nombreCliente
                : nombreCliente === ""
                ? "SIN NOMBRE"
                : nombreCliente}
            </Typography>
          </div>
        </div>

        <Divider />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <h4
            style={{
              marginTop: 20,
              color: isAnulado ? "#f50057" : "#4caf50",
            }}
          >
            {isAnulado ? "Detalle de Venta Anulada" : "Detalle de Venta"}
          </h4>
          {isAnulado ? (
            <></>
          ) : isCanceled ? (
            <Typography
              variant="body2"
              style={{
                color: "#4caf50",
                fontWeight: "bold",
                marginTop: 20,
              }}
            >
              {`Saldo: ${new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(0)}`}
            </Typography>
          ) : (
            <div>
              <Typography
                variant="body2"
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#ff9800",
                }}
              >
                {`Monto de Venta: ${new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(saleMount)}`}
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: "#4caf50",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                {`Total Abonado: ${new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(totalAbonado)}`}
              </Typography>
              <Divider />
              <Typography
                variant="body2"
                style={{
                  color: saldoVenta > 0 ? "#f50057" : "#4caf50",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                {`Saldo: ${new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(saldoVenta)}`}
              </Typography>
            </div>
          )}
        </div>
        <Divider />

        <Table
          hover={!isDarkMode}
          size="sm"
          responsive
          className="text-primary"
        >
          {isCanceled ? (
            <caption style={{ color: "#4caf50", paddingRight: 75 }}>
              <Typography variant="body1" style={{ textAlign: "right" }}>
                {`Monto de Venta: ${new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(saleMount)}`}
              </Typography>
            </caption>
          ) : (
            <></>
          )}
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left" }}>Producto</th>
              <th style={{ textAlign: "center" }}>Cantidad </th>
              <th style={{ textAlign: "center" }}>Descuento</th>
              <th style={{ textAlign: "center" }}>Costo Unitario</th>
              <th style={{ textAlign: "center" }}>Costo Total</th>
              {isAnulado ? (
                <></>
              ) : isAccess(access, "SALES DELETE") ? (
                <th style={{ textAlign: "center" }}>Eliminar</th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody className={isDarkMode ? "text-white" : "text-dark"}>
            {detalleVenta.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td style={{ textAlign: "left" }}>
                    {item.product.description}
                  </td>

                  <td style={{ textAlign: "center", width: 90 }}>
                    {item.cantidad}
                    {isAnulado ? (
                      <></>
                    ) : isAccess(access, "SALES DELETE") ? (
                      <Tooltip title="Quitar">
                        <IconButton
                          size="small"
                          style={{ marginRight: 5, color: "#ff9800" }}
                          onClick={() => {
                            cantidadUpdate(item);
                          }}
                        >
                          <FontAwesomeIcon icon={faCircleMinus} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                  </td>

                  <td
                    style={{ textAlign: "center" }}
                  >{`${item.descuento}%`}</td>

                  <td style={{ textAlign: "center" }}>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(item.costoUnitario)}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(item.costoTotal)}
                  </td>
                  {isAnulado ? (
                    <></>
                  ) : isAccess(access, "SALES DELETE") ? (
                    <td style={{ textAlign: "center" }}>
                      <Tooltip title="Eliminar">
                        <IconButton
                          style={{ marginRight: 10, color: "#f50057" }}
                          onClick={() => {
                            devolucionParcial(item);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </IconButton>
                      </Tooltip>
                    </td>
                  ) : (
                    <></>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>

        {isAnulado ? (
          <></>
        ) : isAccess(access, "SALES DELETE") ? (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="col-sm-5">
              <Button
                onClick={() => {
                  devolucionTotal();
                }}
                style={{
                  borderRadius: 20,
                  color: "#f50057",
                  borderColor: "#f50057",
                }}
                variant="outlined"
                fullWidth
              >
                <FontAwesomeIcon
                  style={{ marginRight: 10, fontSize: 20 }}
                  icon={faSave}
                />
                Devolucion Total
              </Button>
            </div>
            <div className="col-sm-5">
              <Button
                onClick={() => {
                  saveChanges();
                }}
                style={{ borderRadius: 20 }}
                variant="outlined"
                fullWidth
              >
                <FontAwesomeIcon
                  style={{ marginRight: 10, fontSize: 20 }}
                  icon={faSave}
                />
                Guardar Cambios
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </Container>
    </div>
  );
};

export default SaleReturn;
