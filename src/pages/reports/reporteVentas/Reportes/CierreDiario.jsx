import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Container,
  Divider,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { getGetCierreDiarioAsync } from "../../../../services/ReportApi";
import moment from "moment";
import { PrintReport } from "../../../../components/modals/PrintReport";
import XLSX from "xlsx";

const CierreDiario = () => {
  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const { selectedStore, fechaDesde, fechaHasta, horaDesde, horaHasta } =
    dataJson;

  const [data, setData] = useState([]);
  const [dataVentasCredito, setDataVentasCredito] = useState([]);
  const [dataVentasContado, setDataVentasContado] = useState([]);
  const [dataDevoluciones, setDataDevoluciones] = useState([]);
  const [dataAnulaciones, setDataAnulaciones] = useState([]);
  const [dataAbonos, setDataAbonos] = useState([]);

  const [sumContadoSales, setSumContadoSales] = useState(0);
  const [sumRecuperacion, setSumRecuperacion] = useState(0);
  const [sumCreditoSales, setSumCreditoSales] = useState(0);
  const [sumAnulatedSales, setSumAnulatedSales] = useState(0);
  const [sumAnulatedforidSales, setSumAnulatedforidSales] = useState(0);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

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
      let fechaD = moment(fechaDesde).format("YYYY-MM-DD");
      let horaD = moment(horaDesde).format("HH:mm");
      let fhDesde = new Date(`${fechaD} ${horaD}`);

      let fechaH = moment(fechaHasta).format("YYYY-MM-DD");
      let horaH = moment(horaHasta).format("HH:mm");
      let fhHasta = new Date(`${fechaH} ${horaH}`);

      setDesde(moment(fhDesde).format("YYYY-MM-DD HH:mm"));
      setHasta(moment(fhHasta).format("YYYY-MM-DD HH:mm"));

      const datos = {
        desde: moment(fhDesde).format("YYYY-MM-DD HH:mm"),
        hasta: moment(fhHasta).format("YYYY-MM-DD HH:mm"),
        storeId: selectedStore === "t" ? 0 : selectedStore,
      };

      setIsLoading(true);
      const result = await getGetCierreDiarioAsync(token, datos);
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
      saleDesgloce(result.data);
      setDataDevoluciones(result.data.anulatedSaleList);
      setDataAnulaciones(result.data.anulatedforIdSaleList);
      setDataAbonos(result.data.abonoList);
      sumRec(result.data.abonoList);
      sumAnulated(result.data.anulatedSaleList);
      sumAnulatedforId(result.data.anulatedforIdSaleList);
      setIsLoading(false);
      setIsDarkMode(false);
    })();
  }, []);

  const saleDesgloce = (datos) => {
    const { saleList } = datos;
    let contSales = saleList.filter((item) => item.isContado === true);
    let credSales = saleList.filter(
      (item) => item.isContado === false && item.isAnulado === false
    );
    setDataVentasContado(contSales);
    setDataVentasCredito(credSales);

    sumContado(contSales);
    sumCredito(credSales);
  };

   const sumContado = (data) => {
     let result = 0;
     data.map((item) => (result += item.montoVenta));
     setSumContadoSales(result);
   };

   const sumCredito = (data) => {
    let result = 0;
    data.map((item) => (result += item.montoVenta));
    setSumCreditoSales(result);
  };

  // const sumContado = (data) => {
  //   let result = data
  //     .filter(item => item.tipoPagoId === 1) // Solo efectivo
  //     .reduce((sum, item) => sum + item.montoVenta, 0);
  //   setSumContadoSales(result);
  // };
  
  const sumRec = (data) => {
    // Todas las recuperaciones son en efectivo
    let result = data.reduce((sum, item) => sum + item.monto, 0);
    setSumRecuperacion(result);
  };
  
  const sumAnulated = (data) => {
    let result = data
      .filter(item => item.ventaAfectada.tipoPagoId === 1) // Solo efectivo
      .reduce((sum, item) => sum + item.montoAnulado, 0);
    setSumAnulatedSales(result);
  };

  const sumAnulatedforId = (data) => {
    let result = data
      .filter(item => item.tipoPagoId === 1) // Solo efectivo
      .reduce((sum, item) => sum + item.montoVenta, 0);
      setSumAnulatedforidSales(result);
  };
  

  // const sumRec = (data) => {
  //   let result = 0;
  //   data.map((item) => (result += item.monto));
  //   setSumRecuperacion(result);
  // };

  // const sumAnulated = (data) => {
  //   let result = 0;
  //   data.map((item) => (result += item.montoAnulado));
  //   setSumAnulatedSales(result);
  // };
  const calcularEfectivoCaja = () => {
    // 1. Calcular ventas en efectivo (tipoPagoId === 1)
    const ventasEfectivo = dataVentasContado
        .filter(venta => venta.tipoPagoId === 1)
        .reduce((sum, venta) => sum + venta.montoVenta, 0);

    // 2. Calcular recuperaciones en efectivo
    const recuperacionesEfectivo = dataAbonos
        .filter(abono => abono.tipoPagoId === 1)
        .reduce((sum, abono) => sum + abono.monto, 0);
   
    // 3. Efectivo total en caja (ventas + recuperaciones)
    const efectivoReal = ventasEfectivo + recuperacionesEfectivo;
    

    // Resto de los tipos de pago (para el reporte completo)
    const ventasTransferencia = dataVentasContado
        .filter(venta => venta.tipoPagoId === 2)
        .reduce((sum, venta) => sum + venta.montoVenta, 0);
    
    const ventasTarjeta = dataVentasContado
        .filter(venta => venta.tipoPagoId === 3)
        .reduce((sum, venta) => sum + venta.montoVenta, 0);
    
    const ventasCheque = dataVentasContado
        .filter(venta => venta.tipoPagoId === 4)
        .reduce((sum, venta) => sum + venta.montoVenta, 0);

    return {
        efectivoReal,         
        ventasEfectivo,       
        recuperacionesEfectivo, 
        ventasTransferencia,
        ventasTarjeta,
        ventasCheque
    };
};

  const TIPO_PAGO = {
    1: "EFECTIVO",
    2: "TRANSFERENCIA",
    3: "TARJETA",
    4: "CHEQUE"
  };
  
  
  const downloadExcel = () => {
    exportExcel("Cierre Diario", "Cierre Diario",
    sumContadoSales,
    sumCreditoSales,
    sumRecuperacion,
    sumAnulatedSales
  );
};

const exportExcel = (
   filename,
   sheetName,
  sumContadoSales,
  sumCreditoSales,
  sumRecuperacion,
  sumAnulatedSales

) => {
  const calculatedEfect =  sumContadoSales + sumRecuperacion - sumAnulatedSales;
    const ws_data = XLSX.utils.book_new();

    // Agrega los datos de Ventas de Contado
     const ws_contado = XLSX.utils.table_to_sheet(document.getElementById("table-to-xls"));
     XLSX.utils.book_append_sheet(ws_data, ws_contado, "Ventas de Contado");
        
     // Agrega los datos de Credito
     const ws_credito = XLSX.utils.table_to_sheet(document.getElementById("table-to-xls2"));
     XLSX.utils.book_append_sheet(ws_data, ws_credito, "Ventas de Credito");

    // Agrega los datos de Recuperaciones
    const ws_recuperacion = XLSX.utils.table_to_sheet(document.getElementById("table-to-xls1"));
    XLSX.utils.book_append_sheet(ws_data, ws_recuperacion, "Recuperacion Sobre Ventas"); 

  // Agrega los datos de Total de Devoluciones:
     const ws_devoluciones = XLSX.utils.table_to_sheet(document.getElementById("table-to-xls3"));
     XLSX.utils.book_append_sheet(ws_data, ws_devoluciones, "Devoluciones");

     const totalContadoSales = [
      { t: "s", v: "Total Ventas de Contado", s: { font: { bold: true } } },
    { t: "n", v: sumContadoSales, z: '"C$"#,##0.00'},
    ];

  const totalrowContadoSales = [
    { t: "s", v: "Ventas de Credito", s: { font: { bold: true } } },
    { t: "n", v: sumCreditoSales, z: '"C$"#,##0.00' },
    { t: "s", v: "Devoluciones", s: { font: { bold: true } } },
    { t: "n", v: sumAnulatedSales, z: '"C$"#,##0.00' },
    { t: "s", v: "Ventas de Contado", s: { font: { bold: true } } },
    { t: "n", v: sumContadoSales, z: '"C$"#,##0.00' },
    { t: "s", v: "Recuperacion Sobre Ventas", s: { font: { bold: true } } },
    { t: "n", v: sumRecuperacion, z: '"C$"#,##0.00' },
    { t: "s", v: "Efectivo en Caja:", s: { font: { bold: true } } },
    { t: "n", v: calculatedEfect, z: '"C$"#,##0.00'},
  ];
  XLSX.utils.sheet_add_aoa(ws_data.Sheets["Total Ventas de Contado"], [totalContadoSales], { origin: -1, skipHeader: true, raw: true });
  XLSX.utils.sheet_add_aoa(ws_data.Sheets["Ventas de Contado"], [totalrowContadoSales], { origin: -1 });

  const totalsumcredSales = [
    { t: "s", v: "Total de Ventas de Credito", s: { font: { bold: true } } },
  { t: "n", v: sumCreditoSales, z: '"C$"#,##0.00'},
  ];

const totalrowcredSales = [
  { t: "s", v: "Ventas de Credito", s: { font: { bold: true } } },
  { t: "n", v: sumCreditoSales, z: '"C$"#,##0.00' },
  { t: "s", v: "Devoluciones", s: { font: { bold: true } } },
  { t: "n", v: sumAnulatedSales, z: '"C$"#,##0.00' },
  { t: "s", v: "Ventas de Contado", s: { font: { bold: true } } },
  { t: "n", v: sumContadoSales, z: '"C$"#,##0.00' },
  { t: "s", v: "Recuperacion Sobre Ventas", s: { font: { bold: true } } },
  { t: "n", v: sumRecuperacion , z: '"C$"#,##0.00'},
  { t: "s", v: "Efectivo en Caja:", s: { font: { bold: true } } },
  { t: "n", v: calculatedEfect, z: '"C$"#,##0.00' },
];
XLSX.utils.sheet_add_aoa(ws_data.Sheets["Total de Ventas de Credito"], [totalsumcredSales], { origin: -1, skipHeader: true, raw: true });
XLSX.utils.sheet_add_aoa(ws_data.Sheets["Ventas de Credito"], [totalrowcredSales], { origin: -1 });

  const totalsumrecupSales = [
    { t: "s", v: "Total de Recuperacion", s: { font: { bold: true } } },
  { t: "n", v: sumRecuperacion, z: '"C$"#,##0.00'},
  ];

const totalrowrecupSales = [
  { t: "s", v: "Ventas de Credito", s: { font: { bold: true } } },
  { t: "n", v: sumCreditoSales, z: '"C$"#,##0.00' },
  { t: "s", v: "Devoluciones", s: { font: { bold: true } } },
  { t: "n", v: sumAnulatedSales, z: '"C$"#,##0.00' },
  { t: "s", v: "Ventas de Contado", s: { font: { bold: true } } },
  { t: "n", v: sumContadoSales, z: '"C$"#,##0.00' },
  { t: "s", v: "Recuperacion Sobre Ventas", s: { font: { bold: true } } },
  { t: "n", v: sumRecuperacion , z: '"C$"#,##0.00'},
  { t: "s", v: "Efectivo en Caja:", s: { font: { bold: true } } },
  { t: "n", v: calculatedEfect, z: '"C$"#,##0.00' },
];
XLSX.utils.sheet_add_aoa(ws_data.Sheets["Total de Recuperacion"], [totalsumrecupSales], { origin: -1, skipHeader: true, raw: true });
XLSX.utils.sheet_add_aoa(ws_data.Sheets["Recuperacion Sobre Ventas"], [totalrowrecupSales], { origin: -1 });



const totalDevSale = [
  { t: "s", v: "Total de Devoluciones", s: { font: { bold: true } } },
{ t: "n", v: sumAnulatedSales, z: '"C$"#,##0.00'},
];

const totalrowDevSales = [
{ t: "s", v: "Ventas de Credito:", s: { font: { bold: true } } },
{ t: "n", v: sumCreditoSales, z: '"C$"#,##0.00' },
{ t: "s", v: "Devoluciones", s: { font: { bold: true } } },
{ t: "n", v: sumAnulatedSales, z: '"C$"#,##0.00' },
{ t: "s", v: "Ventas de Contado", s: { font: { bold: true } } },
{ t: "n", v: sumContadoSales, z: '"C$"#,##0.00' },
{ t: "s", v: "Recuperacion Sobre Ventas", s: { font: { bold: true } } },
{ t: "n", v: sumRecuperacion, z: '"C$"#,##0.00' },
{ t: "s", v: "Efectivo en Caja:", s: { font: { bold: true } } },
{ t: "n", v: calculatedEfect , z: '"C$"#,##0.00' },
];
XLSX.utils.sheet_add_aoa(ws_data.Sheets["Total de Devoluciones"], [totalDevSale], { origin: -1, skipHeader: true, raw: true });
XLSX.utils.sheet_add_aoa(ws_data.Sheets["Devoluciones"], [totalrowDevSales], { origin: -1 });
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
            Cierre Diario
          </Typography>
          <span style={{ textAlign: "center" }}>{`Desde: ${moment(desde).format(
            "YYYY-MM-DD hh:mm A"
          )} - Hasta: ${moment(hasta).format("YYYY-MM-DD hh:mm A")}`}</span>

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
        <hr />
        <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
          {isEmpty(data) ? (
            <NoData />
          ) : (
            <Stack spacing={2}>
              {/* <Typography variant="h5">Ventas de Contado</Typography> */}
              <Typography variant="h5">Ventas </Typography>
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
                      variant="h6"
                      style={{ color: "#00a152", fontWeight: "bold" }}
                    >
                      Total Ventas de Contado:
                    </Typography>
                    <Typography variant="h5" style={{ color: "#00a152" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumContadoSales)}
                    </Typography>
                  </Stack>
                </caption>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>N°</th>
                    <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                    <th style={{ textAlign: "center" }}>#.Factura</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "left" }}>Cliente</th>
                    <th style={{ textAlign: "center" }}>Neto</th>
                    <th style={{ textAlign: "center" }}>Descuento</th>
                    <th style={{ textAlign: "center" }}>Venta Neta</th>
                    {/* <th style={{ textAlign: "center" }}>Tipo de Pago</th> */}
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {dataVentasContado.map((item, index) => {
                    return (
                      <tr
                        key={item.id}
                        style={{ color: item.isAnulado ? "red" : "" }}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td style={{ textAlign: "center" }}>{moment(item.fechaVenta).format("D/M/yyyy hh:mm A")}</td>
                        <td style={{ textAlign: "center" }}>{item.id}</td>
                        <td style={{ textAlign: "center" }}>{item.store?.name}</td>
                        <td style={{ textAlign: "left" }}>{item.client ? item.client.nombreCliente : item.nombreCliente === "" ? "CLIENTE EVENTUAL" : item.nombreCliente}</td>
                        <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO",}).format(item.montoVentaAntesDescuento)}</td>
                        <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO",}).format(item.descuentoXMonto)} </td>
                        <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO",}).format(item.montoVenta)}
                        {/* <td style={{ textAlign: "center" }}> {TIPO_PAGO[item.tipoPagoId] || "N/A"}</td> */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Divider />

              <Typography variant="h5">Recuperacion Sobre Ventas</Typography>
              <Table
                id="table-to-xls1"
                hover={!isDarkMode}
                size="sm"
                responsive
                className="text-primary"
              >
                <caption style={{ color: "#357a38" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      variant="h6"
                      style={{ color: "#357a38", fontWeight: "bold" }}
                    >
                      Total de Recuperacion:
                    </Typography>
                    <Typography variant="h6" style={{ color: "#357a38" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumRecuperacion)}
                    </Typography>
                  </Stack>
                </caption>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                    <th style={{ textAlign: "center" }}>#.Abono</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "center" }}>#.Factura</th>
                    <th style={{ textAlign: "left" }}>Cliente</th>
                    <th style={{ textAlign: "center" }}>Monto Abonado</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {dataAbonos.map((item) => {
                    const { id, monto, sale, store, fechaAbono } = item;

                    return (
                      <tr key={id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(fechaAbono).format("D/M/yyyy hh:mm A")}
                        </td>
                        <td style={{ textAlign: "center" }}>{id}</td>
                        <td style={{ textAlign: "center" }}>{sale.id}</td>
                        <td style={{ textAlign: "center" }}>{store?.name}</td>
                        <td style={{ textAlign: "left" }}>
                          {sale.client
                            ? sale.client.nombreCliente
                            : sale.nombreCliente === ""
                            ? "CLIENTE EVENTUAL"
                            : sale.nombreCliente}
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
              <Divider />

              <Typography variant="h5">Ventas de Credito</Typography>
              <Table
                id="table-to-xls2"
                hover={!isDarkMode}
                size="sm"
                responsive
                className="text-primary w-100"
              >
                <caption style={{ color: "#ffc107" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      variant="h6"
                      style={{ color: "#ffc107", fontWeight: "bold" }}
                    >
                      Total de Ventas de Credito:
                    </Typography>
                    <Typography variant="h6" style={{ color: "#ffc107" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumCreditoSales)}
                    </Typography>
                  </Stack>
                </caption>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                    <th style={{ textAlign: "center" }}>#.Factura</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "left" }}>Cliente</th>
                    <th style={{ textAlign: "center" }}>Neto</th>
                    <th style={{ textAlign: "center" }}>Descuento</th>
                    <th style={{ textAlign: "center" }}>Venta Neta</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {dataVentasCredito.map((item) => {
                    const {
                      id,
                      client,
                      montoVentaAntesDescuento,
                      descuentoXMonto,
                      montoVenta,
                      nombreCliente,
                      fechaVenta,
                      store,
                    } = item;

                    return (
                      <tr key={id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(fechaVenta).format("D/M/yyyy hh:mm A")}
                        </td>
                        <td style={{ textAlign: "center" }}>{id}</td>
                        <td style={{ textAlign: "center" }}>{store.name}</td>
                        <td style={{ textAlign: "left" }}>
                          {client
                            ? client.nombreCliente
                            : nombreCliente === ""
                            ? "CLIENTE EVENTUAL"
                            : nombreCliente}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(montoVentaAntesDescuento)}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(descuentoXMonto)}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(montoVenta)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Divider />

              <Typography variant="h5">Devoluciones</Typography>
              <Table
                id="table-to-xls3"
                hover={!isDarkMode}
                size="sm"
                responsive
                className="text-primary"
              >
                <caption style={{ color: "#ab003c" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      variant="h6"
                      style={{ color: "#ab003c", fontWeight: "bold" }}
                    >
                      Total de Devoluciones:
                    </Typography>
                    <Typography variant="h6" style={{ color: "#ab003c" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumAnulatedSales)}
                    </Typography>
                  </Stack>
                </caption>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                    <th style={{ textAlign: "center" }}>#.Factura</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "left" }}>Cliente</th> 
                    <th style={{ textAlign: "center" }}>Neto En Devolucion</th>
                    <th style={{ textAlign: "center" }}>Devolucion Por</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {dataDevoluciones.map((item) => {
                    const {
                      id,
                      ventaAfectada,
                      fechaAnulacion,
                      montoAnulado,
                      store,
                      anulatedBy,
                    } = item;
                    return (
                      <tr key={id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(fechaAnulacion).format("D/M/yyyy hh:mm A")}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {ventaAfectada.id}
                        </td>
                        <td style={{ textAlign: "center" }}>{store.name}</td>
                        <td style={{ textAlign: "left" }}>
                          {ventaAfectada.client
                            ? ventaAfectada.client.nombreCliente
                            : ventaAfectada.nombreCliente === ""
                            ? "CLIENTE EVENTUAL"
                            : ventaAfectada.nombreCliente}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(montoAnulado)}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {anulatedBy.fullName}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Divider />

              <Typography variant="h5">Anulaciones</Typography>
              <Table
                id="table-to-xls3"
                hover={!isDarkMode}
                size="sm"
                responsive
                className="text-primary"
              >
                <caption style={{ color: " #ef5350" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      variant="h6"
                    >
                      Total de Anulaciones
                    </Typography>
                    <Typography variant="h6" style={{ color: " #ef5350" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumAnulatedforidSales)}
                    </Typography>
                  </Stack>
                </caption>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                    <th style={{ textAlign: "center" }}>#.Factura</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "left" }}>Cliente</th>
                    <th style={{ textAlign: "center" }}>Neto Anulado</th>
                    <th style={{ textAlign: "center" }}>Anulado Por</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {dataAnulaciones.map((item) => {
                    const {
                      id = '',
                      fechaAnulacion = new Date(),
                      store = {},
                      nombreCliente = '',
                      client = {},
                      montoVenta = 0,
                      anulatedBy = {},
                    } = item || {};
                    return (
                      <tr key={id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(fechaAnulacion).format("D/M/yyyy hh:mm A")}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {id}
                        </td>
                        <td style={{ textAlign: "center" }}>{store.name}</td>
                        <td style={{ textAlign: "left" }}>
                          {item.client
                            ? item.client.nombreCliente
                            : item.nombreCliente === ""
                            ? "CLIENTE EVENTUAL"
                            : item.nombreCliente}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(montoVenta)}
                        </td>

                        <td style={{ textAlign: "center" }}>
                            {anulatedBy?.fullName || '-'}
                        </td>
                                              </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Divider />


              <Typography variant="h5">Resumen por Tipo de Pago</Typography>
                        <Table hover={!isDarkMode} size="sm" responsive className="text-primary">
                          <thead>
                            <tr>
                              <th style={{ textAlign: "center" }}>N°</th>
                              <th style={{ textAlign: "center" }}>Tipo de Pago</th>
                              <th style={{ textAlign: "center" }}>Ventas</th>
                              <th style={{ textAlign: "center" }}># Ventas</th>
                              <th style={{ textAlign: "center" }}>Recuperaciones</th>
                              <th style={{ textAlign: "center" }}># Recuperaciones</th>
                              <th style={{ textAlign: "center" }}>Total</th>
                              <th style={{ textAlign: "center" }}>Total Transacciones</th>
                            </tr>
                          </thead>
                          <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                            {Object.entries(TIPO_PAGO).map(([id, descripcion], index) => {
                              // Ventas por tipo de pago
                              const ventasTipo = dataVentasContado
                                .filter(venta => venta.tipoPagoId === parseInt(id))
                                .reduce((sum, venta) => sum + venta.montoVenta, 0);
                              
                              const numVentas = dataVentasContado
                                .filter(venta => venta.tipoPagoId === parseInt(id)).length;

                              // Recuperaciones por tipo de pago (sin filtrar por tipoPagoId)
                              const recuperacionesTipo = dataAbonos
                                .filter(abono => abono.tipoPagoId === parseInt(id))
                                .reduce((sum, abono) => sum + abono.monto, 0);
                              
                              const numRecuperaciones = dataAbonos
                                .filter(abono => abono.tipoPagoId === parseInt(id)).length;

                              const totalTipo = ventasTipo + recuperacionesTipo;

                              // Mostrar la fila si hay ventas O recuperaciones
                              if (ventasTipo > 0 || recuperacionesTipo > 0 || numRecuperaciones > 0) {
                                return (
                                  <tr key={id}>
                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                    <td style={{ textAlign: "center" }}>{descripcion}</td>
                                    <td style={{ textAlign: "center" }}>
                                      {new Intl.NumberFormat("es-NI", {
                                        style: "currency",
                                        currency: "NIO",
                                      }).format(ventasTipo)}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{numVentas}</td>
                                    <td style={{ textAlign: "center" }}>
                                      {new Intl.NumberFormat("es-NI", {
                                        style: "currency",
                                        currency: "NIO",
                                      }).format(recuperacionesTipo)}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{numRecuperaciones}</td>
                                    <td style={{ textAlign: "center" }}>
                                      {new Intl.NumberFormat("es-NI", {
                                        style: "currency",
                                        currency: "NIO",
                                      }).format(totalTipo)}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{numVentas + numRecuperaciones}</td>
                                  </tr>
                                );
                              }
                              return null;
                            })}
                           </tbody>
                        </Table>
                          <Divider />


                                                                <Stack spacing={1}>
  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ color: "#ffc107", fontWeight: "bold" }}>
      Ventas de Credito:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(sumCreditoSales)}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ color: "#1c54b2", fontWeight: "bold" }}>
      Ventas de Contado:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(sumContadoSales)}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ color: "#1c54b2", fontWeight: "bold" }}>
      Recuperacion Sobre Ventas:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(sumRecuperacion)}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ color: "#ab003c", fontWeight: "bold" }}>
      Devoluciones:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(sumAnulatedSales)}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ fontWeight: "bold" }}>
      Pago con tarjeta:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(dataVentasContado
        .filter(venta => venta.tipoPagoId === 3)
        .reduce((sum, venta) => sum + venta.montoVenta, 0))}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ fontWeight: "bold" }}>
      Pago con transferencia:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(dataVentasContado
        .filter(venta => venta.tipoPagoId === 2)
        .reduce((sum, venta) => sum + venta.montoVenta, 0))}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ fontWeight: "bold" }}>
      Pago con cheque:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(dataVentasContado
        .filter(venta => venta.tipoPagoId === 4)
        .reduce((sum, venta) => sum + venta.montoVenta, 0))}
    </Typography>
  </Stack>

  <Divider />

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ color: "#1c54b2", fontWeight: "bold" }}>
        Efectivo en Caja:
    </Typography>
    <Typography variant="h6">
        {new Intl.NumberFormat("es-NI", {
            style: "currency",
            currency: "NIO",
        }).format(calcularEfectivoCaja().efectivoReal)} 
    </Typography>
      </Stack>
  </Stack>
 </Stack>
          )}
        </Container>
      </Dialog>

      <div
        style={{
          display: "none",
        }}
      >
        <PrintReport
          ref={compRef}
          fecha={`Desde: ${moment(desde).format(
            "YYYY-MM-DD hh:mm A"
          )} - Hasta: ${moment(hasta).format("YYYY-MM-DD hh:mm A")}`}
          titulo={"Cierre Diario"}
        >
          <hr />
          <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
            {isEmpty(data) ? (
              <NoData />
            ) : (
              <Stack spacing={2}>
                <Typography variant="h5">Ventas de Contado</Typography>
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
                        variant="h6"
                        style={{ color: "#00a152", fontWeight: "bold" }}
                      >
                        Total Ventas de Contado:
                      </Typography>
                      <Typography variant="h6" style={{ color: "#00a152" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(sumContadoSales)}
                      </Typography>
                    </Stack>
                  </caption>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Fecha</th>
                      <th style={{ textAlign: "center" }}>#.Factura</th>
                      <th style={{ textAlign: "center" }}>Almacen</th>
                      <th style={{ textAlign: "left" }}>Cliente</th>
                      <th style={{ textAlign: "center" }}>Neto</th>
                      <th style={{ textAlign: "center" }}>Descuento</th>
                      <th style={{ textAlign: "center" }}>Venta Neta</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                    {dataVentasContado.map((item) => {
                      {/* console.log("item", item); */}
                      return (
                        <tr
                          key={item.id}
                          style={{ color: item.isAnulado ? "red" : "" }}
                        >
                          <td style={{ textAlign: "center" }}>
                            {moment(item.fechaVenta).format("L")}
                          </td>
                          <td style={{ textAlign: "center" }}>{item.id}</td>
                          <td style={{ textAlign: "center" }}>
                            {item.store.name}
                          </td>
                          <td style={{ textAlign: "left" }}>
                            {item.client
                              ? item.client.nombreCliente
                              : item.nombreCliente === ""
                              ? "CLIENTE EVENTUAL"
                              : item.nombreCliente}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(item.montoVentaAntesDescuento)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(item.descuentoXMonto)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(item.montoVenta)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Divider />

                <Typography variant="h5">Recuperacion Sobre Ventas</Typography>
                <Table
                  id="table-to-xls1"
                  hover={!isDarkMode}
                  size="sm"
                  responsive
                  className="text-primary"
                >
                  <caption style={{ color: "#357a38" }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="h6"
                        style={{ color: "#357a38", fontWeight: "bold" }}
                      >
                        Total de Recuperacion:
                      </Typography>
                      <Typography variant="h6" style={{ color: "#357a38" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(sumRecuperacion)}
                      </Typography>
                    </Stack>
                  </caption>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Fecha</th>
                      <th style={{ textAlign: "center" }}>#.Abono</th>
                      <th style={{ textAlign: "center" }}>Almacen</th>
                      <th style={{ textAlign: "center" }}>#.Factura</th>
                      <th style={{ textAlign: "left" }}>Cliente</th>
                      <th style={{ textAlign: "center" }}>Monto Abonado</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                    {dataAbonos.map((item) => {
                      const { id, monto, sale, store, fechaAbono } = item;

                      return (
                        <tr key={id}>
                          <td style={{ textAlign: "center" }}>
                            {moment(fechaAbono).format("L")}
                          </td>
                          <td style={{ textAlign: "center" }}>{id}</td>
                          <td style={{ textAlign: "center" }}>{sale.id}</td>
                          <td style={{ textAlign: "center" }}>{store?.name}</td>
                          <td style={{ textAlign: "left" }}>
                            {sale.client
                              ? sale.client.nombreCliente
                              : sale.nombreCliente === ""
                              ? "CLIENTE EVENTUAL"
                              : sale.nombreCliente}
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
                <Divider />

                <Typography variant="h5">Ventas de Credito</Typography>
                <Table
                  id="table-to-xls2"
                  hover={!isDarkMode}
                  size="sm"
                  responsive
                  className="text-primary"
                >
                  <caption style={{ color: "#ffc107" }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="h6"
                        style={{ color: "#ffc107", fontWeight: "bold" }}
                      >
                        Total de Ventas de Credito:
                      </Typography>
                      <Typography variant="h6" style={{ color: "#ffc107" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(sumCreditoSales)}
                      </Typography>
                    </Stack>
                  </caption>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                      <th style={{ textAlign: "center" }}>#.Factura</th>
                      <th style={{ textAlign: "center" }}>Almacen</th>
                      <th style={{ textAlign: "left" }}>Cliente</th>
                      <th style={{ textAlign: "center" }}>Neto</th>
                      <th style={{ textAlign: "center" }}>Descuento</th>
                      <th style={{ textAlign: "center" }}>Venta Neta</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                    {dataVentasCredito.map((item) => {
                      const {
                        id,
                        client,
                        montoVentaAntesDescuento,
                        descuentoXMonto,
                        montoVenta,
                        nombreCliente,
                        fechaVenta,
                        store,
                      } = item;

                      return (
                        <tr key={id}>
                          <td style={{ textAlign: "center" }}>
                            {moment(fechaVenta).format("D/M/yyyy hh:mm A")}
                          </td>
                          <td style={{ textAlign: "center" }}>{id}</td>
                          <td style={{ textAlign: "center" }}>{store?.name}</td>
                          <td style={{ textAlign: "left" }}>
                            {client
                              ? client.nombreCliente
                              : nombreCliente === ""
                              ? "CLIENTE EVENTUAL"
                              : nombreCliente}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(montoVentaAntesDescuento)}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(descuentoXMonto)}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(montoVenta)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Divider />

                <Typography variant="h5">Devoluciones</Typography>
                <Table
                  id="table-to-xls3"
                  hover={!isDarkMode}
                  size="sm"
                  responsive
                  className="text-primary"
                >
                  <caption style={{ color: "#ab003c" }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="h6"
                        style={{ color: "#ab003c", fontWeight: "bold" }}
                      >
                        Total de Devoluciones:
                      </Typography>
                      <Typography variant="h6" style={{ color: "#ab003c" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(sumAnulatedSales)}
                      </Typography>
                    </Stack>
                  </caption>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                      <th style={{ textAlign: "center" }}>#.Factura</th>
                      <th style={{ textAlign: "center" }}>Almacen</th>
                      <th style={{ textAlign: "left" }}>Cliente</th>
                      <th style={{ textAlign: "center" }}>Neto Anulado</th>
                      <th style={{ textAlign: "center" }}>Anulado Por</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                    {dataDevoluciones.map((item) => {
                      const {
                        id,
                        ventaAfectada,
                        fechaAnulacion,
                        montoAnulado,
                        store,
                        anulatedBy,
                      } = item;
                      return (
                        <tr key={id}>
                          <td style={{ textAlign: "center" }}>
                            {moment(fechaAnulacion).format("D/M/yyyy hh:mm A")}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {ventaAfectada.id}
                          </td>
                          <td style={{ textAlign: "center" }}>{store.name}</td>
                          <td style={{ textAlign: "left" }}>
                            {ventaAfectada.client
                              ? ventaAfectada.client.nombreCliente
                              : ventaAfectada.nombreCliente === ""
                              ? "CLIENTE EVENTUAL"
                              : ventaAfectada.nombreCliente}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(montoAnulado)}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            {anulatedBy.fullName}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Divider />

                <Typography variant="h5">Anulaciones</Typography>
              <Table
                id="table-to-xls3"
                hover={!isDarkMode}
                size="sm"
                responsive
                className="text-primary"
              >
                <caption style={{ color: " #ef5350" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      variant="h6"
                    >
                      Total de Anulaciones
                    </Typography>
                    <Typography variant="h6" style={{ color: " #ef5350" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumAnulatedforidSales)}
                    </Typography>
                  </Stack>
                </caption>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                    <th style={{ textAlign: "center" }}>#.Factura</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "left" }}>Cliente</th>
                    <th style={{ textAlign: "center" }}>Neto Anulado</th>
                    <th style={{ textAlign: "center" }}>Anulado Por</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {dataAnulaciones.map((item) => {
                    const {
                      id = '',
                      fechaAnulacion = new Date(),
                      store = {},
                      nombreCliente = '',
                      client = {},
                      montoVenta = 0,
                      anulatedBy = {},
                    } = item || {};
                    return (
                      <tr key={id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(fechaAnulacion).format("D/M/yyyy hh:mm A")}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {id}
                        </td>
                        <td style={{ textAlign: "center" }}>{store.name}</td>
                        <td style={{ textAlign: "left" }}>
                          {item.client
                            ? item.client.nombreCliente
                            : item.nombreCliente === ""
                            ? "CLIENTE EVENTUAL"
                            : item.nombreCliente}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(montoVenta)}
                        </td>

                        <td style={{ textAlign: "center" }}>
                            {anulatedBy?.fullName || '-'}
                        </td>
                                              </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Divider />


              <Typography variant="h5">Resumen por Tipo de Pago</Typography>
                        <Table hover={!isDarkMode} size="sm" responsive className="text-primary">
                          <thead>
                            <tr>
                              <th style={{ textAlign: "center" }}>N°</th>
                              <th style={{ textAlign: "center" }}>Tipo de Pago</th>
                              <th style={{ textAlign: "center" }}>Ventas</th>
                              <th style={{ textAlign: "center" }}># Ventas</th>
                              <th style={{ textAlign: "center" }}>Recuperaciones</th>
                              <th style={{ textAlign: "center" }}># Recuperaciones</th>
                              <th style={{ textAlign: "center" }}>Total</th>
                              <th style={{ textAlign: "center" }}>Total Transacciones</th>
                            </tr>
                          </thead>
                          <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                            {Object.entries(TIPO_PAGO).map(([id, descripcion], index) => {
                              // Ventas por tipo de pago
                              const ventasTipo = dataVentasContado
                                .filter(venta => venta.tipoPagoId === parseInt(id))
                                .reduce((sum, venta) => sum + venta.montoVenta, 0);
                              
                              const numVentas = dataVentasContado
                                .filter(venta => venta.tipoPagoId === parseInt(id)).length;

                              // Recuperaciones por tipo de pago (sin filtrar por tipoPagoId)
                              const recuperacionesTipo = dataAbonos
                                .filter(abono => abono.tipoPagoId === parseInt(id))
                                .reduce((sum, abono) => sum + abono.monto, 0);
                              
                              const numRecuperaciones = dataAbonos
                                .filter(abono => abono.tipoPagoId === parseInt(id)).length;

                              const totalTipo = ventasTipo + recuperacionesTipo;

                              // Mostrar la fila si hay ventas O recuperaciones
                              if (ventasTipo > 0 || recuperacionesTipo > 0 || numRecuperaciones > 0) {
                                return (
                                  <tr key={id}>
                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                    <td style={{ textAlign: "center" }}>{descripcion}</td>
                                    <td style={{ textAlign: "center" }}>
                                      {new Intl.NumberFormat("es-NI", {
                                        style: "currency",
                                        currency: "NIO",
                                      }).format(ventasTipo)}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{numVentas}</td>
                                    <td style={{ textAlign: "center" }}>
                                      {new Intl.NumberFormat("es-NI", {
                                        style: "currency",
                                        currency: "NIO",
                                      }).format(recuperacionesTipo)}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{numRecuperaciones}</td>
                                    <td style={{ textAlign: "center" }}>
                                      {new Intl.NumberFormat("es-NI", {
                                        style: "currency",
                                        currency: "NIO",
                                      }).format(totalTipo)}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{numVentas + numRecuperaciones}</td>
                                  </tr>
                                );
                              }
                              return null;
                            })}
                           </tbody>
                        </Table>
                          <Divider />


                                                                <Stack spacing={1}>
  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ color: "#ffc107", fontWeight: "bold" }}>
      Ventas de Credito:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(sumCreditoSales)}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ color: "#1c54b2", fontWeight: "bold" }}>
      Ventas de Contado:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(sumContadoSales)}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ color: "#1c54b2", fontWeight: "bold" }}>
      Recuperacion Sobre Ventas:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(sumRecuperacion)}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ color: "#ab003c", fontWeight: "bold" }}>
      Devoluciones:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(sumAnulatedSales)}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ fontWeight: "bold" }}>
      Pago con tarjeta:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(dataVentasContado
        .filter(venta => venta.tipoPagoId === 3)
        .reduce((sum, venta) => sum + venta.montoVenta, 0))}
    </Typography>
  </Stack>

  <Stack direction={"row"} justifyContent="space-between">
    <Typography variant="h6" style={{ fontWeight: "bold" }}>
      Pago con transferencia:
    </Typography>
    <Typography variant="h6">
      {new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(dataVentasContado
        .filter(venta => venta.tipoPagoId === 2)
        .reduce((sum, venta) => sum + venta.montoVenta, 0))}
    </Typography>
  </Stack>
</Stack>
              </Stack>
            )}
          </Container>
        </PrintReport>
      </div>
    </div>
  );
};

export default CierreDiario;
