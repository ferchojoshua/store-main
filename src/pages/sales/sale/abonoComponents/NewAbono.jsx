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
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../../services/Account";
import moment from "moment";
import {
  addAbonoAsync,
  getQuotesBySaleAsync,
} from "../../../../services/SalesApi";
import { isEmpty } from "lodash";
import NoData from "../../../../components/NoData";
import { Table } from "react-bootstrap";

const NewAbono = ({ selectedVenta }) => {
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
  } = selectedVenta;
  let navigate = useNavigate();
  const token = getToken();

  const [quoteList, setQuoteList] = useState([]);

  const [newAbono, setNewAbono] = useState("");
  const [newSaldo, setNewSaldo] = useState(saldo);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getQuotesBySaleAsync(token, id);
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
      setIsLoading(false);
      setQuoteList(result.data);
    })();
  }, [reload]);

  const funcCantidad = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString()) || value === "") {
      if (value > saldo) {
        toastError("No puede abonar mas de lo que debe...");
        return;
      }
      setNewSaldo(saldo - value);
      setNewAbono(value);
      return;
    }
  };

  const addAbono = async () => {
    if (newAbono === "" || newAbono === 0) {
      toastError("Debe ingresar un abono mayor que cero...");
      return;
    }
    const data = {
      IdSale: id,
      monto: newAbono,
    };
    setIsLoading(true);
    const result = await addAbonoAsync(token, data);
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
    setIsLoading(false);
    setReload(!reload);
    setNewAbono("");
    toastSuccess("Abono Agregado...");
  };

  const totalAbonado = () => {
    let result = 0;
    quoteList.map((item) => {
      result += item.monto;
    });
    return result;
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
            // textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              // justifyContent: "space-around",
              // textAlign: "center",
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
              {client.nombreCliente}
            </Typography>
          </div>
        </div>

        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <h4>Lista de Abonos</h4>
          </div>

          {isEmpty(quoteList) ? (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <hr />
              <NoData />
            </div>
          ) : (
            <Table hover size="sm">
              <caption style={{ color: "#4caf50" }}>
                <Typography variant="body1" style={{ textAlign: "right" }}>
                  {`Total Abonado: ${new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(totalAbonado())}`}
                </Typography>
              </caption>
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ textAlign: "center" }}>Fecha Abono</th>
                  <th style={{ textAlign: "center" }}>Monto Abono</th>
                  <th style={{ textAlign: "left" }}>Realizado por</th>
                </tr>
              </thead>
              <tbody>
                {quoteList.map((item) => {
                  // setTotalAbonado(totalAbonado + item.monto);
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td style={{ textAlign: "center" }}>
                        {moment(item.fechaAbono).format("L")}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.monto)}
                      </td>
                      <td style={{ textAlign: "left" }}>
                        {item.realizedBy.fullName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          <TextField
            fullWidth
            required
            variant="standard"
            onChange={(e) => funcCantidad(e.target.value)}
            label={"Ingrese Abono"}
            value={newAbono}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">C$</InputAdornment>
              ),
            }}
          />

          <Button
            onClick={() => {
              addAbono();
            }}
            style={{ marginTop: 20, borderRadius: 20 }}
            variant="outlined"
            fullWidth
          >
            <FontAwesomeIcon
              style={{ marginRight: 10, fontSize: 20 }}
              icon={faSave}
            />
            Agregar Abono
          </Button>
        </Paper>

        <div
          style={{
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
            <Typography variant="body1">Facturado por:</Typography>
            <Typography
              variant="body1"
              style={{ color: "#2196f3", fontWeight: "bold", marginLeft: 10 }}
            >
              {facturedBy.fullName}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography variant="body1">Monto Venta:</Typography>
            <Typography
              variant="body1"
              style={{ color: "#4caf50", fontWeight: "bold", marginLeft: 10 }}
            >
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(montoVenta)}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography variant="body1">Saldo:</Typography>
            <Typography
              variant="body1"
              style={{ color: "#f50057", fontWeight: "bold", marginLeft: 10 }}
            >
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(newSaldo)}
            </Typography>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NewAbono;
