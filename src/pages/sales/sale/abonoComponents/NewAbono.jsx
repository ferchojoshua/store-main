import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../../helpers/Helpers";
import {
  TextField,
  Button,
  Divider,
  Container,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../../services/Account";
import moment from "moment";
import {
  addAbonoAsync,
  getSalesUncanceledByClient,
} from "../../../../services/SalesApi";
import { isEmpty, sum } from "lodash";
import NoData from "../../../../components/NoData";
import { Table } from "react-bootstrap";
import SmallModal from "../../../../components/modals/SmallModal";
import { NewAbonoEspecifico } from "./NewAbonoEspecifico";

const NewAbono = ({
  selectedVenta,
  active,
  setActive,
  selectedStore,
  setSelectedStore,
}) => {
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

  const { client, store } = selectedVenta;

  let navigate = useNavigate();
  const token = getToken();

  const [quoteList, setQuoteList] = useState([]);
  const [newAbono, setNewAbono] = useState("");

  const [saldo, setSaldo] = useState(0);
  const [newSaldo, setNewSaldo] = useState(0);

  const [montoVenta, setMontoVenta] = useState(0);

  const [uncanceledSales, setUncanceledSales] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getSalesUncanceledByClient(token, client.id);
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

      let s = result.data.map((item) => item.sale);
      setUncanceledSales(s);
      setSaldo(sum(s.map((item) => item.saldo)));

      setMontoVenta(sum(s.map((item) => item.montoVenta)));

      let abonoList = [];

      result.data.map((item) => {
        if (!isEmpty(item.abonos)) {
          item.abonos.map((i) => {
            abonoList.push(i);
          });
        }
      });

      setQuoteList(abonoList);

      setIsLoading(false);
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
      idClient: client.id,
      idStore: store.id,
      monto: newAbono,
    };
    setIsLoading(true);
    const result = await addAbonoAsync(token, data);
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
    setActive(active);
    setSelectedStore(selectedStore);
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
      <Container>
        <Divider />

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
              {client.nombreCliente}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography variant="body1">Facturas Pendientes:</Typography>
            <Typography
              variant="body1"
              style={{
                color: "#2196f3",
                fontWeight: "bold",
                marginLeft: 10,
              }}
            >
              {uncanceledSales.length}
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
            <h6>Facturas Pendientes</h6>
          </div>

          {isEmpty(uncanceledSales) ? (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <hr />
              <NoData />
            </div>
          ) : (
            <Table
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <caption>
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
                    <Typography variant="body1">Monto Venta:</Typography>
                    <Typography
                      variant="body1"
                      style={{
                        color: "#4caf50",
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
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
                      style={{
                        color: "#f50057",
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(saldo)}
                    </Typography>
                  </div>
                </div>
              </caption>
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ textAlign: "center" }}>Fecha Venta</th>
                  <th style={{ textAlign: "center" }}>Monto Venta</th>
                  <th style={{ textAlign: "center" }}>Saldo</th>
                  <th style={{ textAlign: "center" }}>Fecha Venc.</th>
                  <th style={{ textAlign: "center" }}>Almacen</th>
                  {isAccess(access, "PAGO ESPECIFICO CREATE") ? (
                    <th style={{ textAlign: "center" }}>Pagar</th>
                  ) : (
                    <></>
                  )}
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {uncanceledSales.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td style={{ textAlign: "center" }}>
                        {moment(item.fechaVenta).format("L")}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.montoVenta)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.saldo)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {moment(item.fechaVencimiento).format("L")}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.store.name}</td>
                      <td style={{ textAlign: "center" }}>
                        {isAccess(access, "PAGO ESPECIFICO CREATE") ? (
                          <IconButton
                            style={{ color: "#ff9100" }}
                            onClick={() => {
                              setSelectedSale(item);
                              setShowModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faHandHoldingDollar} />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          <hr />

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
            <Table
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
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
                  <th style={{ textAlign: "center" }}># Factura</th>
                  <th style={{ textAlign: "left" }}>Realizado por</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {quoteList.map((item) => {
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
                      <td style={{ textAlign: "center" }}>{item.sale.id}</td>
                      <td style={{ textAlign: "left" }}>
                        {item.realizedBy ? item.realizedBy.fullName : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          <hr />

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
            {newAbono !== "" ? (
              <Typography
                style={{
                  marginLeft: 5,
                  color: newSaldo === 0 ? "#4caf50" : "#f50057",
                  fontWeight: "bold",
                }}
              >
                {`Nuevo Saldo:  ${new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(newSaldo)}`}
              </Typography>
            ) : (
              ""
            )}
          </Button>
        </Paper>
      </Container>

      <SmallModal
        titulo={"Abonar"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <NewAbonoEspecifico
          setVisible={setShowModal}
          selectedVenta={selectedSale}
        />
      </SmallModal>
    </div>
  );
};

export default NewAbono;
