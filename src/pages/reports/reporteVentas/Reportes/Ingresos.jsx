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
import { faDownload } from "@fortawesome/free-solid-svg-icons";
////import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import XLSX from "xlsx";

import "./estilo.css";
moment.locale("es");

const Ingresos = () => {
  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const { selectedStore, desde, hasta, horaDesde, horaHasta } = dataJson;

  const [data, setData] = useState([]);
  const [dataContado, setDataContado] = useState([]);
  const [dataRecuperacion, setDataRecuperacion] = useState([]);

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
      setDataContado(result.data.filter((item) => item.sale.isContado));
      setDataRecuperacion(
        result.data.filter((item) => item.sale.isContado === false)
      );
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

  const downloadExcel = () => {
    exportExcel("Ingresos", "Ingresos", dataContado.length, dataRecuperacion.length, data.length, sumSales(), sumContadoSales(), sumRecuperacion());
  };
  

  const exportExcel = (filename, sheetName, dataContado, dataRecuperacion, data, sumSales, sumContadoSales, sumRecuperacion) => {
    const ws_data = XLSX.utils.book_new();
  
    // Agrega los datos de Ventas de Contado
    const ws_contado = XLSX.utils.table_to_sheet(document.getElementById("table-to-xls"));
    XLSX.utils.book_append_sheet(ws_data, ws_contado, "Ventas de Contado");
  
    // Agrega los datos de Recuperaciones
    const ws_recuperacion = XLSX.utils.table_to_sheet(document.getElementById("table-to-xls2"));
    XLSX.utils.book_append_sheet(ws_data, ws_recuperacion, "Recuperaciones");


    const totalsumContadoSales = [
      { t: "s", v: "Total Ventas de Contado", s: { font: { bold: true } } },
    { t: "n", v: sumContadoSales, z: '"C$"#,##0.00'},
    ];
  
    // Agrega la fila de totales en Ventas de Contado
    const totalRowContado = [
      { t: "s", v: "Contador Ventas de Contado", s: { font: { bold: true } } },
      { t: "n", v: dataContado },
      { t: "s", v: "Contador Recuperacion", s: { font: { bold: true } } },
      { t: "n", v: dataRecuperacion },
      { t: "s", v: " Total de Registros", s: { font: { bold: true } } },
      { t: "n", v: data },
      { t: "s", v: "Total de Ingresos", s: { font: { bold: true } } },
       { t: "n", v: sumSales, z:'"C$"#,##0.00'},
    ];
    XLSX.utils.sheet_add_aoa(ws_data.Sheets["Ventas de Contado"], [totalsumContadoSales], { origin: -1, skipHeader: true, raw: true });
    XLSX.utils.sheet_add_aoa(ws_data.Sheets["Ventas de Contado"], [totalRowContado], { origin: -1 });


    const  totalsumRecuperacion = [
      { t: "s", v: "Total de Recuperaciones:", s: { font: { bold: true } } },
    { t: "n", v: sumRecuperacion, z: '"C$"#,##0.00'},
    ];  
  
    // Agrega la fila de totales en Recuperaciones
    const totalRowRecuperacion = [
      { t: "s", v: "Contador Ventas de Contado", s: { font: { bold: true } } },
      { t: "n", v: dataContado },
      { t: "s", v: "Contador Recuperacion", s: { font: { bold: true } } },
      { t: "n", v: dataRecuperacion },
      { t: "s", v: " Total de Registros", s: { font: { bold: true } } },
      { t: "n", v: data  },
      { t: "s", v: "Total de Ingresos", s: { font: { bold: true } } },
     { t: "n", v: sumSales, z: '"C$"#,##0.00'},
 
    ];
    XLSX.utils.sheet_add_aoa(ws_data.Sheets["Recuperaciones"], [totalsumRecuperacion], { origin: -1, skipHeader: true  });
    XLSX.utils.sheet_add_aoa(ws_data.Sheets["Recuperaciones"], [totalRowRecuperacion], { origin: -1 });
  
    XLSX.writeFile(ws_data, `${filename}.xlsx`);
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

          <Stack
            spacing={3}
            direction="row"
            display="flex"
            justifyContent="right"
          >
            <IconButton
              spacing={3}
              direction="row"
              display="flex"
              justifyContent="right"
              style={{
                fontSize: 40,
                position: "fixed",
                color: "#4caf50",
                right: 50,
                top: 75,
                width: 50,
              }}
            >
              <FontAwesomeIcon icon={faDownload} onClick={downloadExcel} />
            </IconButton>
          </Stack>

          <ReactToPrint
            trigger={() => {
              return (
                <IconButton
                  variant="outlined"
                  style={{ position: "fixed", right: 105, top: 75 }}
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

        <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
          <hr />
          <Typography
            sx={{
              color: "#00a152",
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 2,
            }}
            variant="h5"
            component="div"
          >
            Ventas de Contado
          </Typography>
          {isEmpty(dataContado) ? (
            <NoData />
          ) : (
            <Table
              id="table-to-xls"
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <caption style={{ color: "#00a152" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography style={{ color: "#00a152", fontWeight: "bold" }}>
                    Total Ventas de Contado:
                  </Typography>
                  <Typography variant="h6" style={{ color: "#00a152" }}>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumContadoSales())}
                  </Typography>
                </Stack>
              </caption>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                  <th style={{ textAlign: "center" }}>Almacen</th>
                  <th style={{ textAlign: "center" }}>#</th>
                  <th style={{ textAlign: "center" }}>Venta</th>
                  <th style={{ textAlign: "left" }}>Cliente</th>
                  {/* <th style={{ textAlign: "center" }}>Es Venta</th> */}
                  <th style={{ textAlign: "center" }}>Monto</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {dataContado.map((item) => {
                  const { fechaAbono, id, sale, monto, store } = item;
                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: "center" }}>
                        {moment(fechaAbono).format("D/M/yyyy hh:mm A")}
                      </td>
                      <td style={{ textAlign: "center" }}>{store?.name}</td>
                      <td style={{ textAlign: "center" }}>{id}</td>
                      <td style={{ textAlign: "center" }}>{sale.id}</td>
                      <td style={{ textAlign: "left" }}>
                        {sale.isEventual
                          ? sale.nombreCliente
                          : sale.client.nombreCliente}
                      </td>
                      {/* <td style={{ textAlign: "center" }}>
                        <FontAwesomeIcon
                          style={{
                            color: sale.isContado ? "#00a152" : "#f50057",
                          }}
                          icon={sale.isContado ? faCircleCheck : faCircleXmark}
                        />
                      </td> */}
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
          <Typography
            sx={{
              color: "#00a152",
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 2,
            }}
            variant="h5"
            component="div"
          >
            Recuperaciones
          </Typography>
          {isEmpty(dataRecuperacion) ? (
            <NoData />
          ) : (
            <Table
              id="table-to-xls2"
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <caption style={{ color: "#00a152" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography style={{ color: "#00a152", fontWeight: "bold" }}>
                    Total de Recuperaciones:
                  </Typography>
                  <Typography variant="h6" style={{ color: "#00a152" }}>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumRecuperacion())}
                  </Typography>
                </Stack>
              </caption>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Fecha</th>
                  <th style={{ textAlign: "center" }}>Almacen</th>
                  <th style={{ textAlign: "center" }}>#</th>
                  <th style={{ textAlign: "center" }}>Venta</th>
                  <th style={{ textAlign: "left" }}>Cliente</th>
                  {/* <th style={{ textAlign: "center" }}>Es Venta</th> */}
                  <th style={{ textAlign: "center" }}>Monto</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {dataRecuperacion.map((item) => {
                  const { fechaAbono, id, sale, monto, store } = item;
                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: "center" }}>
                        {moment(fechaAbono).format("D/M/yyyy hh:mm A")}
                      </td>
                      <td style={{ textAlign: "center" }}>{store?.name}</td>
                      <td style={{ textAlign: "center" }}>{id}</td>
                      <td style={{ textAlign: "center" }}>{sale.id}</td>
                      <td style={{ textAlign: "left" }}>
                        {sale.isEventual
                          ? sale.nombreCliente
                          : sale.client.nombreCliente}
                      </td>
                      {/* <td style={{ textAlign: "center" }}>
                        <FontAwesomeIcon
                          style={{
                            color: sale.isContado ? "#00a152" : "#f50057",
                          }}
                          icon={sale.isContado ? faCircleCheck : faCircleXmark}
                        />
                      </td> */}
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
                Contador Ventas de Contado
              </span>
              <span>
                {new Intl.NumberFormat("es-NI").format(dataContado.length)}
              </span>
            </Stack>
            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Contador Recuperacion
              </span>
              <span>
                {new Intl.NumberFormat("es-NI").format(dataRecuperacion.length)}
              </span>
            </Stack>
            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Registros
              </span>
              <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
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
          <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
            <hr />
            <Typography
              sx={{
                color: "#00a152",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 2,
              }}
              variant="h5"
              component="div"
            >
              Ventas de Contado
            </Typography>
            {isEmpty(dataContado) ? (
              <NoData />
            ) : (
              <Table
                id="table-to-xls"
                hover={!isDarkMode}
                size="sm"
                responsive
                className="text-primary w-100"
              >
                <caption style={{ color: "#00a152" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      style={{ color: "#00a152", fontWeight: "bold" }}
                    >
                      Total Ventas de Contado:
                    </Typography>
                    <Typography variant="h6" style={{ color: "#00a152" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumContadoSales())}
                    </Typography>
                  </Stack>
                </caption>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Fecha</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "center" }}>#</th>
                    <th style={{ textAlign: "center" }}>Venta</th>
                    <th style={{ textAlign: "left" }}>Cliente</th>
                    {/* <th style={{ textAlign: "center" }}>Es Venta</th> */}
                    <th style={{ textAlign: "center" }}>Monto</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {dataContado.map((item) => {
                    const { fechaAbono, id, sale, monto, store } = item;
                    return (
                      <tr key={item.id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(fechaAbono).format("D/M/yyyy hh:mm A")}
                        </td>
                        <td style={{ textAlign: "center" }}>{store?.name}</td>
                        <td style={{ textAlign: "center" }}>{id}</td>
                        <td style={{ textAlign: "center" }}>{sale.id}</td>
                        <td style={{ textAlign: "left" }}>
                          {sale.isEventual
                            ? sale.nombreCliente
                            : sale.client.nombreCliente}
                        </td>
                        {/* <td style={{ textAlign: "center" }}>
                        <FontAwesomeIcon
                          style={{
                            color: sale.isContado ? "#00a152" : "#f50057",
                          }}
                          icon={sale.isContado ? faCircleCheck : faCircleXmark}
                        />
                      </td> */}
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
            <Typography
              sx={{
                color: "#00a152",
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 2,
              }}
              variant="h5"
              component="div"
            >
              Recuperaciones
            </Typography>
            {isEmpty(dataRecuperacion) ? (
              <NoData />
            ) : (
              <Table
                id="table-to-xls2"
                hover={!isDarkMode}
                size="sm"
                responsive
                className="text-primary w-100"
              >
                <caption style={{ color: "#00a152" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      style={{ color: "#00a152", fontWeight: "bold" }}
                    >
                      Total de Recuperaciones:
                    </Typography>
                    <Typography variant="h6" style={{ color: "#00a152" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumRecuperacion())}
                    </Typography>
                  </Stack>
                </caption>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Fecha</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "center" }}>#</th>
                    <th style={{ textAlign: "center" }}>Venta</th>
                    <th style={{ textAlign: "left" }}>Cliente</th>
                    {/* <th style={{ textAlign: "center" }}>Es Venta</th> */}
                    <th style={{ textAlign: "center" }}>Monto</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {dataRecuperacion.map((item) => {
                    const { fechaAbono, id, sale, monto, store } = item;
                    return (
                      <tr key={item.id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(fechaAbono).format("D/M/yyyy hh:mm A")}
                        </td>
                        <td style={{ textAlign: "center" }}>{store?.name}</td>
                        <td style={{ textAlign: "center" }}>{id}</td>
                        <td style={{ textAlign: "center" }}>{sale.id}</td>
                        <td style={{ textAlign: "left" }}>
                          {sale.isEventual
                            ? sale.nombreCliente
                            : sale.client.nombreCliente}
                        </td>
                        {/* <td style={{ textAlign: "center" }}>
                        <FontAwesomeIcon
                          style={{
                            color: sale.isContado ? "#00a152" : "#f50057",
                          }}
                          icon={sale.isContado ? faCircleCheck : faCircleXmark}
                        />
                      </td> */}
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(sumSales())}
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
                  Contador Ventas de Contado
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI").format(dataContado.length)}
                </span>
              </Stack>
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Contador Recuperacion
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI").format(
                    dataRecuperacion.length
                  )}
                </span>
              </Stack>
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
