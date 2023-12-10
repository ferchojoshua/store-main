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
import PaginationComponent from "../../../../components/PaginationComponent";
import { DataContext } from "../../../../context/DataContext";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { getCuentasXCobrarAsync } from "../../../../services/ReportApi";
import moment from "moment";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, } from "@fortawesome/free-solid-svg-icons";
///import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import "../../../../components/styles/estilo.css";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { PrintReport } from "../../../../components/modals/PrintReport";
import XLSX from 'xlsx';

export const DocumentosXCobrar = () => {
  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const { selectedStore, desde, hasta, selectedClient, includeCanceled } =
    dataJson;

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


   // Pagination
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsperPage] = useState(20);
   const indexLast = currentPage * itemsperPage;
   const indexFirst = indexLast - itemsperPage;
   const currentItem = data.slice(indexFirst, indexLast);
   const paginate = (pageNumber) => setCurrentPage(pageNumber);
 

   

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  useEffect(() => {
    (async () => {
      const datos = {
        desde,
        hasta,
        storeId: selectedStore === "t" ? 0 : selectedStore,
        clientId:
          selectedClient === "" || selectedClient === null
            ? 0
            : selectedClient.id,
      };

      setIsLoading(true);

      const result = await getCuentasXCobrarAsync(token, datos);
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
      if (includeCanceled) {
        setData(result.data);
      } else {
        let filtered = result.data.filter((item) => item.isCanceled === false);
        setData(filtered);
      }
      setIsLoading(false);
      setIsDarkMode(false);
    })();
  }, []);



  const sumSales = () => {
    let sum = 0;
    data.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumCreditoSales = () => {
    const credSales = data.filter((item) => item.isContado === false);
    let sum = 0;
    credSales.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumAbonado = () => {
    const credSales = data.filter((item) => item.isContado === false);
    let sum = 0;
    credSales.map((item) => (sum += item.montoVenta - item.saldo));
    return sum;
  };

  const sumSaldo = () => {
    const credSales = data.filter((item) => item.isContado === false);
    let sum = 0;
    credSales.map((item) => (sum += item.saldo));
    return sum;
  };

  const getDays = (fVencimiento) => {
    var result = moment(fVencimiento).diff(moment(new Date()), "days");
    return result;
  };


  

  const downloadExcel = () => {
    exportExcel("table-to-xls", "Documentos por Cobrar", data.length, sumSales(), sumCreditoSales(), sumAbonado(), sumSaldo());
  };


  const exportExcel = (tableId, filename, DocpoCobrar, sumSales, sumCreditoSales,sumAbonado,sumSaldo) => {
    const table = document.getElementById(tableId);
    const ws_data = XLSX.utils.table_to_sheet(table);
    const dynamicCurrencyFormat = new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format;
    

    

        // Add a row for total values
        const totalRow = [
          { t: "s", v: "Total de Ventas", s: { font: { bold: true } } },
          { t: "n", v: DocpoCobrar },
          { t: "s", v: "Total de Ventas", s: { font: { bold: true } } },
          { t: "n", v: sumSales },
          { t: "s", v: "Ventas de Credito", s: { font: { bold: true } } },
          { t: "n", v: sumCreditoSales }, 
          { t: "s", v: "Total de Abonado", s: { font: { bold: true } } },
          { t: "n", v: sumAbonado },  
          { t: "s", v: "Total de Saldo", s: { font: { bold: true } } },
          ///{ t: "s", v: sumSaldo },
          { t: "n", v: sumSaldo, s: { numFmt: dynamicCurrencyFormat } },
        ];
        XLSX.utils.sheet_add_aoa(ws_data, [totalRow], { origin: -1 });
      
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws_data, "Documentos por Cobrar");
      
        XLSX.writeFile(wb, `${filename}.xlsx`);      };

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
            Reporte de Documentos por Cobrar
          </Typography>
          <span style={{ textAlign: "center" }}>{`Desde: ${moment(desde).format(
            "L"
          )} - Hasta: ${moment(hasta).format("L")}`}</span>

          <Stack
              spacing={3}
              direction="row"              
              display="flex"
              justifyContent="right"> 
                           <IconButton  
                            spacing={3}
                            direction="row"              
                            display="flex"
                            justifyContent="right"
                            style={{fontSize: 40, position: "fixed",color: "#4caf50" , right: 50, top: 75, width: 50 }}
                            >
                            <FontAwesomeIcon icon={faDownload} onClick={downloadExcel}  />
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
          {isEmpty(data) ? (
            <NoData />
          ) : (
            <Table
             id="table-to-xls"
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Fecha</th>
                  <th style={{ textAlign: "center" }}>Vence</th>
                  <th style={{ textAlign: "center" }}>Atraso</th>
                  <th style={{ textAlign: "center" }}>Factura</th>
                  <th style={{ textAlign: "left" }}>Almacen</th>
                  <th style={{ textAlign: "left" }}>Cliente</th>
                  <th style={{ textAlign: "center" }}>M. Venta</th>
                  <th style={{ textAlign: "center" }}>T. Abonado</th>
                  <th style={{ textAlign: "center" }}>Saldo</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {data.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: "center" }}>
                        {moment(item.fechaVenta).format("L")}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {moment(item.fechaVencimiento).format("L")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color:
                            getDays(item.fechaVencimiento) < 0
                              ? "#f50057"
                              : "#2196f3",
                        }}
                      >
                        {`${getDays(item.fechaVencimiento)} Días`}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.id}</td>
                      <td style={{ textAlign: "left" }}>{item.store.name}</td>
                      <td style={{ textAlign: "left" }}>
                        {item.client.nombreCliente}
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
                        }).format(item.montoVenta - item.saldo)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.saldo)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          <PaginationComponent
            data={data}
            paginate={paginate}
            itemsperPage={itemsperPage}
          />
          <hr />
          <Stack direction="row" flex="row" justifyContent="space-around">
            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Ventas
              </span>
              <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Ventas
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumSales())}
              </span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Ventas de Credito
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumCreditoSales())}
              </span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Abonado
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumAbonado())}
              </span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Saldo
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumSaldo())}
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
          fecha={`Desde: ${moment(desde).format("L")} - Hasta: ${moment(
            hasta
          ).format("L")}`}
          titulo={"Documentos por Cobrar"}
        >
          <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
            <hr />
            {isEmpty(data) ? (
              <NoData />
            ) : (
              <Table
               id="table-to-xls"
                hover={!isDarkMode}
                size="sm"
                responsive
                className="text-primary"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Fecha</th>
                    <th style={{ textAlign: "center" }}>Vence</th>
                    <th style={{ textAlign: "center" }}>Atraso</th>
                    <th style={{ textAlign: "center" }}>Factura</th>
                    <th style={{ textAlign: "left" }}>Almacen</th>
                    <th style={{ textAlign: "left" }}>Cliente</th>
                    <th style={{ textAlign: "center" }}>M. Venta</th>
                    <th style={{ textAlign: "center" }}>T. Abonado</th>
                    <th style={{ textAlign: "center" }}>Saldo</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {data.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(item.fechaVenta).format("L")}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {moment(item.fechaVencimiento).format("L")}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            color:
                              getDays(item.fechaVencimiento) < 0
                                ? "#f50057"
                                : "#2196f3",
                          }}
                        >
                          {`${getDays(item.fechaVencimiento)} Días`}
                        </td>
                        <td style={{ textAlign: "center" }}>{item.id}</td>
                        <td style={{ textAlign: "left" }}>{item.store.name}</td>
                        <td style={{ textAlign: "left" }}>
                          {item.client.nombreCliente}
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
                          }).format(item.montoVenta - item.saldo)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(item.saldo)}
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
                  Total de Ventas
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI").format(data.length)}
                </span>
              </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total de Ventas
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumSales())}
                </span>
              </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Ventas de Credito
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumCreditoSales())}
                </span>
              </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total de Abonado
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumAbonado())}
                </span>
              </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total de Saldo
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumSaldo())}
                </span>
              </Stack>
            </Stack>
            <hr />
          </Container>
        </PrintReport>
        
 {/* <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-success"
                    table="table-to-xls"
                    filename="Documentos por Cobrar"
                    sheet="Pagina 1"
                                           
                    /> */}
      </div>
    </div>
  );
};