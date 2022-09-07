import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Container,
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Dialog,
  IconButton,
} from "@mui/material";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import NoData from "../../../../components/NoData";
import { DataContext } from "../../../../context/DataContext";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import moment from "moment";
import { Table } from "react-bootstrap";
import { getGetCajaChicaAsync } from "../../../../services/ReportApi";
import { PrintReport } from "../../../../components/modals/PrintReport";

const CajaChica = () => {
  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const { selectedStore, desde, hasta } = dataJson;

  const [data, setData] = useState([]);
  const [saldoAnterior, setSaldoAnterior] = useState(0);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  const {
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    isDarkMode,
    setIsDarkMode,
    title,
  } = useContext(DataContext);
  setIsDarkMode(false);

  useEffect(() => {
    (async () => {
      const datos = {
        desde,
        hasta,
        storeId: selectedStore === "t" ? 0 : selectedStore,
      };

      setIsLoading(true);

      const result = await getGetCajaChicaAsync(token, datos);
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

      setData(result.data);
      setSaldoAnterior(
        result.data[0].saldo - result.data[0].entradas + result.data[0].salidas
      );
      setIsLoading(false);
      setIsDarkMode(false);
    })();
  }, []);

  const sumEntradas = () => {
    let sum = 0;
    data.map((item) => (sum += item.entradas));
    return sum;
  };

  const sumSalidas = () => {
    let sum = 0;
    data.map((item) => (sum += item.salidas));
    return sum;
  };

  return (
    <div>
      <Dialog fullScreen open={true}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <img
              loading="lazy"
              src={require("../../../../components/media/Icono.png")}
              alt="logo"
              style={{ height: 40 }}
            />
            <Typography
              sx={{ ml: 2, flex: 1, textAlign: "center" }}
              variant="h4"
              component="div"
            >
              {`${title} - Chinandega`}
            </Typography>
          </Toolbar>
        </AppBar>

        <Stack display="flex" justifyContent="center">
          <Typography
            sx={{
              color: "#2196f3",
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 2,
            }}
            variant="h5"
            component="div"
          >
            Reporte de Caja Chica
          </Typography>
          <span style={{ textAlign: "center" }}>{`Desde: ${moment(desde).format(
            "L"
          )} - Hasta: ${moment(hasta).format("L")}`}</span>

          <ReactToPrint
            trigger={() => {
              return (
                <IconButton
                  variant="outlined"
                  style={{ position: "fixed", right: 50, top: 75 }}
                >
                  <PrintRoundedIcon
                    style={{ fontSize: 50, color: "#2979ff", width: 50 }}
                  />
                </IconButton>
              );
            }}
            content={() => compRef.current}
          />
        </Stack>

        <hr />
        <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
          {isEmpty(data) ? (
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
                  <th style={{ textAlign: "left" }}>Descripcion</th>
                  <th style={{ textAlign: "center" }}>Entrada</th>
                  <th style={{ textAlign: "center" }}>Salida</th>
                  <th style={{ textAlign: "center" }}>Saldo</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {data.map((item) => {
                  const { id, fecha, description, entradas, salidas, saldo } =
                    item;

                  return (
                    <tr key={id}>
                      <td style={{ textAlign: "center" }}>
                        {moment(fecha).format("L")}
                      </td>
                      <td style={{ textAlign: "left" }}>{description}</td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(entradas)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(salidas)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(saldo)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          <hr />

          <Stack direction="row" flex="row" justifyContent="space-around">
            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Entradas:
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumEntradas())}
              </span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Salidas:
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumSalidas())}
              </span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Saldo Inicial:
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(saldoAnterior)}
              </span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Saldo Final:
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumEntradas() - sumSalidas() + saldoAnterior)}
              </span>
            </Stack>
          </Stack>
        </Container>

        <div
          style={{
            display: "none",
          }}
        >
          <PrintReport
            ref={compRef}
            fecha={`Desde: ${moment(desde).format("L")} - Hasta: ${moment(
              hasta
            ).format("L")}`}
            titulo={"Reporte de Caja Chica"}
          >
            <hr />
            <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
              {isEmpty(data) ? (
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
                      <th style={{ textAlign: "left" }}>Descripcion</th>
                      <th style={{ textAlign: "center" }}>Entrada</th>
                      <th style={{ textAlign: "center" }}>Salida</th>
                      <th style={{ textAlign: "center" }}>Saldo</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                    {data.map((item) => {
                      const {
                        id,
                        fecha,
                        description,
                        entradas,
                        salidas,
                        saldo,
                      } = item;

                      return (
                        <tr key={id}>
                          <td style={{ textAlign: "center" }}>
                            {moment(fecha).format("L")}
                          </td>
                          <td style={{ textAlign: "left" }}>{description}</td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(entradas)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(salidas)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(saldo)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}

              <hr />

              <Stack direction="row" flex="row" justifyContent="space-around">
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Total de Entradas:
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumEntradas())}
                  </span>
                </Stack>

                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Total de Salidas:
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumSalidas())}
                  </span>
                </Stack>

                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Saldo Inicial:
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(saldoAnterior)}
                  </span>
                </Stack>

                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Saldo Final:
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumEntradas() - sumSalidas() + saldoAnterior)}
                  </span>
                </Stack>
              </Stack>
            </Container>
          </PrintReport>
        </div>
      </Dialog>
    </div>
  );
};

export default CajaChica;
