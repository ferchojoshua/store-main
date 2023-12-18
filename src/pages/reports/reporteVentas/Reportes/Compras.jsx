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
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { Table } from "react-bootstrap";
import moment from "moment";
import "../../../../components/styles/estilo.css";
import { PrintReport } from "../../../../components/modals/PrintReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
///import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import XLSX from "xlsx";
import "./estilo.css";
import { getComprasAsync } from "../../../../services/ReportApi";
moment.locale("es");

const Compras = () => {
  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const { desde, hasta, contadoCompras, creditCompras } = dataJson;

  const [data, setData] = useState([]);
  const [dataContado, setDataContado] = useState([]);
  const [dataCredito, setDataCredito] = useState([]);

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
        desde: new Date(desde),
        hasta: new Date(hasta),
        contadoCompras,
        creditCompras,
      };

      setIsLoading(true);
      const result = await getComprasAsync(token, datos);
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
      //   setDataContado(result.data.filter((item) => item.sale.isContado));
      //   setDataRecuperacion(
      //     result.data.filter((item) => item.sale.isContado === false)
      //   );
      setIsLoading(false);
      setIsDarkMode(false);
    })();
  }, []);

  const sumComprasADesc = () => {
    let sum = 0;
    data.map((item) => (sum += item.montFactAntDesc));
    return sum;
  };
  const sumComprasDDesc = () => {
    let sum = 0;
    data.map((item) => (sum += item.montoFactura));
    return sum;
  };

  const downloadExcel = () => {
    exportExcel("table-to-xls", "Compras", data.length, sumComprasADesc(), sumComprasDDesc());
  };


  const exportExcel = (
    tableId,
    filename,
    Totalcompras,
    sumComprasADesc,
    sumComprasDDesc
  ) => {
    const table = document.getElementById(tableId);
    const ws_data = XLSX.utils.table_to_sheet(table);

    const totalRow = [
      { t: "s", v: "Total de Ventas", s: { font: { bold: true } } },
      { t: "n", v: Totalcompras },
      {
        t: "s",
        v: "Total de Compra Antes Descuento",
        s: { font: { bold: true } },
      },
      { t: "n", v: sumComprasADesc, z: '"C$"#,##0.00' },
      {
        t: "s",
        v: "Total de Compra Despues Descuento",
        s: { font: { bold: true } },
      },
      { t: "n", v: sumComprasDDesc, z: '"C$"#,##0.00' },
    ];
    XLSX.utils.sheet_add_aoa(ws_data, [totalRow], { origin: -1 });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws_data, "Compras");

    XLSX.writeFile(wb, `${filename}.xlsx`);
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
            Reporte de Compras
          </Typography>

          <span style={{ textAlign: "center" }}>{`Desde: ${moment(desde).format(
            "L"
          )}  - Hasta: ${moment(hasta).format("L")} `}</span>

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
          {isEmpty(data) ? (
            <NoData />
          ) : (
            <Table
              id="table-to-xls"
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary w-100"
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Fecha</th>
                  <th style={{ textAlign: "center" }}>N° Factura</th>
                  <th style={{ textAlign: "left" }}>Proveedor</th>
                  <th style={{ textAlign: "center" }}>Tipo Pago</th>
                  <th style={{ textAlign: "center" }}>Antes Descuento</th>
                  <th style={{ textAlign: "center" }}>Despues Descuento</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {currentItem.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: "center" }}>
                        {moment(item.fechaIngreso).format("L")}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.noFactura}</td>
                      <td style={{ textAlign: "left" }}>
                        {item.provider.nombre}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {item.tipoPago.toUpperCase()}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.montFactAntDesc)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.montoFactura)}
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
                Total de Compra Antes Descuento
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumComprasADesc())}
              </span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Compra Despues Descuento
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumComprasDDesc())}
              </span>
            </Stack>

            {/* 
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
            </Stack> */}

            {/* <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Saldo
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumSaldo())}
              </span>
            </Stack> */}
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
                className="text-primary w-100"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Fecha</th>
                    <th style={{ textAlign: "center" }}>N° Factura</th>
                    <th style={{ textAlign: "left" }}>Proveedor</th>
                    <th style={{ textAlign: "center" }}>Tipo Pago</th>
                    <th style={{ textAlign: "center" }}>Antes Descuento</th>
                    <th style={{ textAlign: "center" }}>Despues Descuento</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {data.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(item.fechaIngreso).format("L")}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.noFactura}
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {item.provider.nombre}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.tipoPago.toUpperCase()}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(item.montFactAntDesc)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(item.montoFactura)}
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
                  Total de Compra Antes Descuento
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumComprasADesc())}
                </span>
              </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total de Compra Despues Descuento
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumComprasDDesc())}
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

export default Compras;
