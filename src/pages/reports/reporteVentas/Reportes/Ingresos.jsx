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
import { Table } from "react-bootstrap";
import moment from "moment";
import "../../../../components/styles/estilo.css";
import { PrintReport } from "../../../../components/modals/PrintReport";
import { getIngresosAsync } from "../../../../services/ReportApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./estilo.css";
moment.locale("es");

const Ingresos = () => {
  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const { selectedStore, desde, hasta, horaDesde, horaHasta } = dataJson;

  const [data, setData] = useState([]);

  const {
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    isDarkMode,
    setIsDarkMode,
    title,
  } = useContext(DataContext);
  setIsDarkMode(false);
  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  useEffect(() => {
    (async () => {
      const datos = {
        desde: new Date(desde),
        hasta: new Date(hasta),
        storeId: selectedStore === "t" ? 0 : selectedStore,
      };

      setIsLoading(true);
      const result = await getIngresosAsync(token, datos);
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

      setIsLoading(false);
      setIsDarkMode(false);
    })();
  }, []);

  const sumSales = () => {
    let sum = 0;
    data.map((item) => (sum += item.monto));
    return sum;
  };

  const sumContadoSales = () => {
    const contSales = data.filter((item) => item.sale.isContado);
    let sum = 0;
    contSales.map((item) => (sum += item.monto));
    return sum;
  };

  const sumRecuperacion = () => {
    const credSales = data.filter((item) => item.sale.isContado === false);
    let sum = 0;
    credSales.map((item) => (sum += item.monto));
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
            Reporte de Ingresos
          </Typography>
          <span style={{ textAlign: "center" }}>{`Desde: ${moment(desde).format(
            "L"
          )} ${moment(horaDesde).format("hh:mm A")} - Hasta: ${moment(
            hasta
          ).format("L")} ${moment(horaHasta).format("hh:mm A")}`}</span>

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
                  <th style={{ textAlign: "center" }}>Almacen</th>
                  <th style={{ textAlign: "center" }}>#</th>
                  <th style={{ textAlign: "center" }}>Venta</th>
                  <th style={{ textAlign: "left" }}>Cliente</th>
                  <th style={{ textAlign: "center" }}>Es Venta</th>
                  <th style={{ textAlign: "center" }}>Monto</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {data.map((item) => {
                  const { fechaAbono, id, sale, monto, store } = item;
                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: "center" }}>
                        {moment(fechaAbono).format("D/M/yyyy hh:mm A")}
                      </td>
                      <td style={{ textAlign: "center" }}>{store.name}</td>
                      <td style={{ textAlign: "center" }}>{id}</td>
                      <td style={{ textAlign: "center" }}>{sale.id}</td>
                      <td style={{ textAlign: "left" }}>
                        {sale.isEventual
                          ? sale.nombreCliente
                          : sale.client.nombreCliente}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <FontAwesomeIcon
                          style={{
                            color: sale.isContado ? "#00a152" : "#f50057",
                          }}
                          icon={sale.isContado ? faCircleCheck : faCircleXmark}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(monto)}
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
                Total de Registros
              </span>
              <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total Ventas de Contado
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumContadoSales())}
              </span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Recuperacion
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumRecuperacion())}
              </span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Ingresos
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumSales())}
              </span>
            </Stack>
          </Stack>
          <hr />
        </Container>
      </Dialog>

      <div
        style={{
          display: "none",
        }}
      >
        <PrintReport
          ref={compRef}
          fecha={`Desde: ${moment(desde).format("L")} ${moment(
            horaDesde
          ).format("hh:mm A")} - Hasta: ${moment(hasta).format("L")} ${moment(
            horaHasta
          ).format("hh:mm A")}`}
          titulo={"Master de Ventas"}
        >
          <hr />
          <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
            {isEmpty(data) ? (
              <NoData />
            ) : (
              <>
                <Table
                  hover={!isDarkMode}
                  size="sm"
                  responsive
                  className="text-primary"
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Fecha</th>
                      <th style={{ textAlign: "center" }}>Almacen</th>
                      <th style={{ textAlign: "center" }}>#</th>
                      <th style={{ textAlign: "center" }}>Venta</th>
                      <th style={{ textAlign: "left" }}>Cliente</th>
                      <th style={{ textAlign: "center" }}>Es Venta</th>
                      <th style={{ textAlign: "center" }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                    {data.map((item) => {
                      const { fechaAbono, id, sale, monto, store } = item;
                      return (
                        <tr key={item.id}>
                          <td style={{ textAlign: "center" }}>
                            {moment(fechaAbono).format("D/M/yyyy hh:mm A")}
                          </td>
                          <td style={{ textAlign: "center" }}>{store.name}</td>
                          <td style={{ textAlign: "center" }}>{id}</td>
                          <td style={{ textAlign: "center" }}>{sale.id}</td>
                          <td style={{ textAlign: "left" }}>
                            {sale.isEventual
                              ? sale.nombreCliente
                              : sale.client.nombreCliente}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <FontAwesomeIcon
                              style={{
                                color: sale.isContado ? "#00a152" : "#f50057",
                              }}
                              icon={
                                sale.isContado ? faCircleCheck : faCircleXmark
                              }
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(monto)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <div className="page-break" />
              </>
            )}

            <hr />

            <Stack direction="row" flex="row" justifyContent="space-around">
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total de Registros
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI").format(data.length)}
                </span>
              </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Ventas de Contado
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumContadoSales())}
                </span>
              </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total de Recuperacion
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumRecuperacion())}
                </span>
              </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total de Ingresos
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumSales())}
                </span>
              </Stack>
            </Stack>
            <hr />
          </Container>
        </PrintReport>
      </div>
    </div>
  );
};

export default Ingresos;
