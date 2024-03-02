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
import { getRuta, isAccess, toastError } from "../../../../helpers/Helpers";
import { deleteToken, deleteUserData, getToken,} from "../../../../services/Account";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, } from "@fortawesome/free-solid-svg-icons";
//import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Table } from "react-bootstrap";
import { getProductosVendidosAsync } from "../../../../services/ReportApi";
import moment from "moment";
import { PrintReport } from "../../../../components/modals/PrintReport";
import "../../../../components/styles/estilo.css";
import XLSX from 'xlsx';

export const ArticulosVendidos = () => {
  const [data, setData] = useState([]);

  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const {
    selectedStore,
    desde,
    hasta,
    selectedClient,
    selectedTNegocio,
    selectedFamilia,
    includeUncanceledSales,
  } = dataJson;

  const {
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    isDarkMode,
    setIsDarkMode,
    access,
    title,
  } = useContext(DataContext);
  setIsDarkMode(false);

   
  const downloadExcel = () => {
    exportExcel("table-to-xls", "Articulos Vendidos", data.length, sumCostoCompra(), sumVentaNeta(), sumDesc(), data.length, sumUtilidad());

  };

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
        includeUncanceledSales,
        storeId: selectedStore === "t" ? 0 : selectedStore,
        tipoNegocioId: selectedTNegocio === "t" ? 0 : selectedTNegocio,
        familiaId: selectedFamilia === "t" ? 0 : selectedFamilia,
        clientId: selectedClient === "" || selectedClient === null ? 0 : selectedClient.id,
      };

      setIsLoading(true);

      const result = await getProductosVendidosAsync(token, datos);
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
    })();
  }, []);

  const sumCostoCompra = () => {
    let sum = 0;
    data.map((item) => (sum += item.costoCompra));
    return sum;
  };

  const sumVentaNeta = () => {
    let sum = 0;
    data.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumDesc = () => {
    let sum = 0;
    data.map((item) => (sum += item.descuento));
    return sum;
  }; 
  
  const sumcantidadV = () => {
    let sum = 0;
    data.map((item) => (sum += item.cantidadVendida));
    return sum;
  };

  const sumUtilidad = () => {
    let sum = 0;
    data.map((item) => (sum += item.utilidad));
    return sum;
  };

    
  const exportExcel = (tableId, filename, TotalPVendidos, sumCostoCompra, sumVentaNeta,sumDesc, TotalCVendidos , sumUtilidad) => {
    const table = document.getElementById(tableId);
    const ws_data = XLSX.utils.table_to_sheet(table);
    //////////const colWidths = Array.from(table.rows[0]?.cells).map(cell => ({ wch: cell.clientWidth / 8 }));
    ///const colWidths = Array.from(table.rows[0].cells).map(cell => ({ wch: cell.clientWidth / 8 }));
    ///const ws_data = XLSX.utils.table_to_sheet(table, { sheet: "Productos vendidos", raw: true, columnDefs: colWidths });
    const totalRow = [
      { t: "s", v: "Total Productos Vendidos", s: { font: { bold: true }, alignment: { horizontal: "center" } } },
      { t: "n", v: TotalPVendidos },
      { t: "s", v: "Total Costo de Compra", s: { font: { bold: true }, alignment: { horizontal: "center" } } },
      { t: "n", v: sumCostoCompra, z: '"C$"#,##0.00'  },
      { t: "s", v: "Total Ventas Netas", s: { font: { bold: true }, alignment: { horizontal: "center" } } },
      { t: "n", v: sumVentaNeta, z: '"C$"#,##0.00'  },   
      { t: "s", v: "Total Descuento", s: { font: { bold: true }, alignment: { horizontal: "center" } } },
      { t: "n", v: sumDesc, z: '"C$"#,##0.00'  },  
      { t: "s", v: "Total Cantidad Vendida", s: { font: { bold: true }, alignment: { horizontal: "center" } } },
      { t: "n", v: TotalCVendidos},
      { t: "s", v: "Utilidad Neta", s: { font: { bold: true }, alignment: { horizontal: "center" } } },
      { t: "n", v: sumUtilidad, z: '"C$"#,##0.00' },
    ];
    XLSX.utils.sheet_add_aoa(ws_data, [totalRow], { origin: -1 });
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws_data, "Productos vendidos");  
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
           Reporte de Articulos Vendidos
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
        <hr />
        <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
          {isEmpty(data) ? (
            <NoData />
          ) : (
            <div>
            <Table
             id="table-to-xls"
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary text-primary w-100 tableFixHead table table-striped"
            >
               
               <thead class="table-dark">
                <tr>
                  <th style={{ textAlign: "right" }}>C. Barras</th>
                  <th style={{ textAlign: "left" }}>Producto</th>
                  <th style={{ textAlign: "center" }}>Cant. Vendida</th>
                  <th style={{ textAlign: "center" }}>Costo</th>
                  <th style={{ textAlign: "center" }}>Descuento</th>
                  <th style={{ textAlign: "center" }}>Venta Neta</th>
                  {isAccess(access, "PRODVENDIDOSUTIL VER") ? (
                    <th style={{ textAlign: "center" }}>Utilidad</th>
                  ) : (
                    <></>
                  )}
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {currentItem.map((item) => {
                  return (
                    <tr key={item.barCode}>
                      <td style={{ textAlign: "right" }}>{item.barCode}</td>
                      <td style={{ textAlign: "left" }}>{item.producto}</td>
                      <td style={{ textAlign: "center" }}>{item.cantidadVendida}</td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.costoCompra)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.descuento)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.montoVenta)}
                      </td>
                      {isAccess(access, "PRODVENDIDOSUTIL VER") ? (
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(item.utilidad)}
                        </td>
                      ) : (
                        <></>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            </div>
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
                Total Productos Vendidos
              </span>
              <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
            </Stack>
            <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Cantidad Vendida
                </span>
                {/* <span> */}
                <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
                  {/* {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumcantidadV())}
                </span> */}
              </Stack>

            {isAccess(access, "PRODVENDIDOSUTIL VER") ? (
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Costo de Compra
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumCostoCompra())}
                </span>
              </Stack>
            ) : (
              <></>
            )}
            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total Ventas Netas
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumVentaNeta())}
              </span>
            </Stack>
            <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Descuento
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumDesc())}
                </span>
              </Stack>                  
              
            {isAccess(access, "PRODVENDIDOSUTIL VER") ? (
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Utilidad Neta
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumUtilidad())}
                </span>
              </Stack>) : (
              <></>
            )}
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
          titulo={"Productos Vendidos"}
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
                className="text-primary text-primary w-100 tableFixHead"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "right" }}>C. Barras</th>
                    <th style={{ textAlign: "left" }}>Producto</th>
                    <th style={{ textAlign: "center" }}>Cant. Vendida</th>
                    <th style={{ textAlign: "center" }}>Costo</th>
                    <th style={{ textAlign: "center" }}>Descuento</th>
                    <th style={{ textAlign: "center" }}>Venta Neta</th>
                    {isAccess(access, "PRODVENDIDOSUTIL VER") ? (
                      <th style={{ textAlign: "center" }}>Utilidad</th>
                    ) : (
                      <></>
                    )}
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {data.map((item) => {
                    return (
                      <tr key={item.barCode}>
                        <td style={{ textAlign: "right" }}>{item.barCode}</td>
                        <td style={{ textAlign: "left" }}>{item.producto}</td>
                        <td style={{ textAlign: "center" }}>
                          {item.cantidadVendida}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(item.costoCompra)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.descuento)}
                      </td>
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(item.montoVenta)}
                        </td>
                        {isAccess(access, "PRODVENDIDOSUTIL VER") ? (
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(item.utilidad)}
                          </td>
                        ) : (
                          <></>
                        )}
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
                  Total Productos Vendidos
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI").format(data.length)}
                </span>
              </Stack>
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Cantidad Vendida
                </span>
                {/* <span> */}
                <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
                  {/* {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumcantidadV())}
                </span> */}
              </Stack>

              {isAccess(access, "PRODVENDIDOSUTIL VER") ? (
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Total Costo de Compra
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumCostoCompra())}
                  </span>
                </Stack>
              ) : (
                <></>
              )}
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Ventas Netas
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumVentaNeta())}
                </span>
              </Stack>
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Descuento
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumDesc())}
                </span>
              </Stack>
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Cantidad Vendida
                </span>
                {/* <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumcantidadV())}
                </span> */}
              </Stack> 
              {isAccess(access, "PRODVENDIDOSUTIL VER") ? (
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Utilidad Neta
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumUtilidad())}
                  </span>
                </Stack>
              ) : (
                <></>
              )}
            </Stack>
          </Container>
        </PrintReport>
                   
      </div>
    </div>
  );
};