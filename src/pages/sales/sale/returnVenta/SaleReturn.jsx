import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../../helpers/Helpers";
import {
  TextField,
  Button,
  Divider,
  Container,
  Typography,
  Paper,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleMinus,
  faCirclePlus,
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
  addAbonoAsync,
  anularSaleAsync,
  getQuotesBySaleAsync,
} from "../../../../services/SalesApi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isEmpty } from "lodash";
import NoData from "../../../../components/NoData";
import { Table } from "react-bootstrap";
import { width } from "@mui/system";

const SaleReturn = ({ selectedVenta, setVisible }) => {
  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  const {
    id,
    fechaVencimiento,
    fechaVenta,
    facturedBy,
    saldo,
    montoVenta,
    client,
    saleDetails,
    nombreCliente,
  } = selectedVenta;

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
              navigate("/unauthorized");
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

  return (
    <div>
      <Container style={{ width: 700 }}>
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
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h4>Detalle de Venta</h4>
        </div>

        <Table hover size="sm">
          <caption style={{ color: "#4caf50", paddingRight: 75 }}>
            <Typography variant="body1" style={{ textAlign: "right" }}>
              {`Monto de Venta: ${new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(montoVenta)}`}
            </Typography>
          </caption>
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left" }}>Producto</th>
              <th style={{ textAlign: "center" }}>Cantidad </th>
              <th style={{ textAlign: "center" }}>Descuento</th>
              <th style={{ textAlign: "center" }}>Costo Unitario</th>
              <th style={{ textAlign: "center" }}>Costo Total</th>
              <th style={{ textAlign: "center" }}>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {saleDetails.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td style={{ textAlign: "left" }}>
                    {item.product.description}
                  </td>

                  <td style={{ textAlign: "center", width: 90 }}>
                    <Tooltip title="Quitar">
                      <IconButton
                        size="small"
                        style={{ marginRight: 5, color: "#ff9800" }}
                        // onClick={() => {
                        //   setSelectedVenta(item);
                        //   setShowModal(true);
                        // }}
                      >
                        <FontAwesomeIcon icon={faCircleMinus} />
                      </IconButton>
                    </Tooltip>
                    {item.cantidad}
                    <Tooltip title="Agregar">
                      <IconButton
                        size="small"
                        style={{ marginLeft: 5, color: "#ff9800" }}
                        // onClick={() => {
                        //   setSelectedVenta(item);
                        //   setShowModal(true);
                        // }}
                      >
                        <FontAwesomeIcon icon={faCirclePlus} />
                      </IconButton>
                    </Tooltip>
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
                  <td style={{ textAlign: "center" }}>
                    <Tooltip title="Eliminar">
                      <IconButton
                        style={{ marginRight: 10, color: "#f50057" }}
                        // onClick={() => {
                        //   setSelectedVenta(item);
                        //   setShowModal(true);
                        // }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

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
              // onClick={() => {
              //   addAbono();
              // }}
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
      </Container>
    </div>
  );
};

export default SaleReturn;
