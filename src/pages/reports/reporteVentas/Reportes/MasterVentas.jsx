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
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, } from "@fortawesome/free-solid-svg-icons";
//import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { Table } from "react-bootstrap";
import moment from "moment";
import "../../../../components/styles/estilo.css";
import { PrintReport } from "../../../../components/modals/PrintReport";

import { getMasterVentasAsync } from "../../../../services/ReportApi";
import XLSX from "xlsx";

export const MasterVentas = () => {
  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const {
    selectedStore,
    desde,
    hasta,
    creditSales,
    items,
    contadoSales,
    horaDesde,
    horaHasta,
  } = dataJson;

  const [data, setData] = useState([]);

  const {
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    isDarkMode,
    setIsDarkMode,
    title,
    access,
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
        storeId: selectedStore === "t" ? 0 : selectedStore,
        contadoSales,
        creditSales,
      };

      setIsLoading(true);
      const result = await getMasterVentasAsync(token, datos);
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
    data.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumContadoSales = () => {
    const contSales = data.filter((item) => item.isContado);
    let sum = 0;
    contSales.map((item) => (sum += item.montoVenta));
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

  const sumDescuentosTotales = (ventas) => {
    let total = 0;
    if (ventas && Array.isArray(ventas)) {
      ventas.forEach(venta => {
        if (venta && venta.saleDetails && Array.isArray(venta.saleDetails)) {
          venta.saleDetails.forEach(detail => {
            if (typeof detail.descuento === 'number' && detail.descuento > 0) {
              total += detail.descuento;
            }
          });
        }
      });
    }
    return total;
  };
  
    const utilityPercent = (data) => {
    let utilidadTotal = 0;
    data.map((item) => {
      if (
        (item.costoTotal - item.costoCompra).toFixed(2) ===
        item.ganancia.toFixed(2)
      ) {
        let utilidadDetail = 1 - item.costoCompra / item.costoTotal;
        utilidadTotal += utilidadDetail;
      } else {
        let utilidadDetail =
          1 - (item.costoCompra * item.cantidad) / item.costoTotal;
        utilidadTotal += utilidadDetail;
      }
    });

    utilidadTotal = utilidadTotal / data.length;
    return utilidadTotal.toFixed(2);
  };


  

       
  const sumGanancia = (data) => {
    const ganancias = data.filter((item) => typeof item.ganancia === 'number');
    const totalGanancia = ganancias.reduce((accumulator, currentValue) => accumulator + currentValue.ganancia, 0);
    return totalGanancia.toFixed(2);
  };
  
  const sumDescuentos = (saleDetails) => {
    let sum = 0;
    if (saleDetails && Array.isArray(saleDetails)) {
      saleDetails.forEach(detail => {
        if (typeof detail.descuento === 'number') {
          sum += detail.descuento;
        }
      });
    }
    return sum;
  };
  
  
  const utilityPercentGlobal = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('El array de datos está vacío o no es válido.');
      return 0;
    }
  
    let utilidadTotal = 0;
  
    data.forEach((item) => {
      if (
        typeof item.costoTotal === 'number' &&
        typeof item.costoCompra === 'number' &&
        typeof item.ganancia === 'number'
      ) {
        if (
          (item.costoTotal - item.costoCompra).toFixed(2) ===
          item.ganancia.toFixed(2)
        ) {
          let utilidadDetail = 1 - item.costoCompra / item.costoTotal;
          utilidadTotal += utilidadDetail;
        } else {
          let utilidadDetail =
            1 - (item.costoCompra * item.cantidad) / item.costoTotal;
          utilidadTotal += utilidadDetail;
        }
      } else {
        console.warn('Elemento no tiene la estructura esperada:', item);
      }
    });
  
    if (data.length !== 0) {
      utilidadTotal = utilidadTotal / data.length;
    } else {
      console.warn('No hay utilidad para calcular.');
    }
  
    return utilidadTotal.toFixed(2);
  };
  
  
     
  
      
  const downloadExcel = () => {
    exportExcel("table-to-xls", "Master de Ventas", data.length, sumSales(), sumContadoSales(), sumCreditoSales(), sumAbonado(), sumDescuentosTotales(),sumSaldo());
  };

  
  const exportExcel = (tableId, filename, totalMaster, sumSales, sumContadoSales, sumCreditoSales ,sumAbonado,sumDescuentosTotales ,sumSaldo) => {
    const table = document.getElementById(tableId);
    const ws_data = XLSX.utils.table_to_sheet(table);
  
    // Add a row for total values
    const totalRow = [
      { t: "s", v: "Total de Ventas", s: { font: { bold: true } } },
      { t: "n", v: totalMaster  },
      { t: "s", v: "Total de Ventas", s: { font: { bold: true } } },
      { t: "n", v: sumSales , z: '"C$"#,##0.00'},
      { t: "s", v: "Ventas de Contado", s: { font: { bold: true } } },
      { t: "n", v: sumContadoSales , z: '"C$"#,##0.00'}, 
      { t: "s", v: "Ventas de Credito", s: { font: { bold: true } } },
      { t: "n", v: sumCreditoSales , z: '"C$"#,##0.00'}, 
      { t: "s", v: "Total de Abonado", s: { font: { bold: true } } },
      { t: "n", v: sumAbonado , z: '"C$"#,##0.00'},
       { t: "s", v: "Total de Descuento", s: { font: { bold: true } } },
      { t: "n", v: sumDescuentosTotales , z: '"C$"#,##0.00'},
      { t: "s", v: "Total de Saldo", s: { font: { bold: true } } },
      { t: "n", v: sumSaldo , z: '"C$"#,##0.00'},
    ];

    
    XLSX.utils.sheet_add_aoa(ws_data, [totalRow], { origin: -1 });
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws_data, "Master de Ventas");
  
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
            Master de Ventas
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
              justifyContent="right"> 
                  <IconButton  
                            spacing={3}
                            direction="row"              
                            display="flex"
                            justifyContent="right"
                            style={{fontSize: 40, position: "fixed",color: "#4caf50" , right: 50, top: 75, width: 50 }}
                            // onClick={() => SheetJS.downloadExcel()}
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
            <Table
            id="table-to-xls"
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary w-100"
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                  <th style={{ textAlign: "center" }}>Factura</th>
                  <th style={{ textAlign: "left" }}>Cliente</th>
                  <th style={{ textAlign: "center" }}>Almacen</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                  <th style={{ textAlign: "center" }}>M. Venta</th>
                  <th style={{ textAlign: "center" }}>T. Abonado</th>
                  <th style={{ textAlign: "center" }}>Descuento</th>
                  <th style={{ textAlign: "center" }}>Saldo</th>
                  {isAccess(access, "MASTER VENTAS UTILIDAD") ? (<th style={{ textAlign: "center" }}>Utilidad C$</th>) : (<></>)} 
                  {isAccess(access, "MASTER VENTAS UTILIDAD") ? (<th style={{ textAlign: "center" }}>%Utilidad</th>) : (<></> )}
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {currentItem.map((item) => {
                  const { saleDetails } = item;
                   return (
                    <tr key={item.id}>
                      <td style={{ textAlign: "center" }}>
                        {moment(item.fechaVenta).format("D/M/yyyy hh:mm A")} </td>
                      <td style={{ textAlign: "center" }}>{item.id} </td>
                      <td style={{ textAlign: "left" }}>{isEmpty(item.client) ? "CLIENTE EVENTUAL" : item.client.nombreCliente}</td>
                      <td style={{ textAlign: "center" }}>{item.store.name}</td>
                      <td style={{ textAlign: "center" }}>{item.isContado ? "Contado" : "Credito"}</td>
                      <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO", }).format(item.montoVenta)}</td>
                      <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(item.montoVenta - item.saldo)}</td>
                      <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency",currency: "NIO",}).format(sumDescuentos(item.saleDetails))}</td>
                      <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO", }).format(item.saldo)} </td>   
                        {isAccess(access, "MASTER VENTAS UTILIDAD") ? (
                        <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                        }).format(sumGanancia(saleDetails))}
                        </td>
                        ) : (
                        <></>
                        )}
                        {isAccess(access, "MASTER VENTAS UTILIDAD") ? (
                        <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                        style: "percent",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(utilityPercent(saleDetails))}
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

            {contadoSales ? (
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Ventas de Contado
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumContadoSales())}
                </span>
              </Stack>
            ) : (
              <></>
            )}

            {creditSales ? (
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
            ) : (
              <></>
            )}
            {creditSales ? (
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
            ) : (
              <></>
            )}
            
            {creditSales ? (
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total de Descuento
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumDescuentosTotales(data))}
                </span>
              </Stack>
            ) : (
              <></>
            )}

            {creditSales ? (
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
            ) : (
              <></>
            )} 
            
             {creditSales ? (
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Utilidad Global
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                        style: "percent",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                  }).format(utilityPercentGlobal(data))}
                </span>
              </Stack>
            ) : (
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
                    <th style={{ textAlign: "center" }}>Factura</th>
                    <th style={{ textAlign: "left" }}>Cliente</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>M. Venta</th>
                    <th style={{ textAlign: "center" }}>T. Abonado</th>
                    <th style={{ textAlign: "center" }}>Descuento</th>
                    <th style={{ textAlign: "center" }}>Saldo</th>
                    {isAccess(access, "MASTER VENTAS UTILIDAD") ? (
                    <th style={{ textAlign: "center" }}>%Utilidad C$</th>
                  ) : (
                    <></>
                  )} 
                    {isAccess(access, "MASTER VENTAS UTILIDAD") ? (
                    <th style={{ textAlign: "center" }}>%Utilidad</th>
                  ) : (
                    <></>
                  )}
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {data.map((item) => {
                    const { saleDetails } = item;
                    return (
                      <tr key={item.id}>
                        <td style={{ textAlign: "center" }}>
                          {moment(item.fechaVenta).format("D/M/yyyy hh:mm A")}
                        </td>
                        <td style={{ textAlign: "center" }}>{item.id}</td>
                        <td style={{ textAlign: "left" }}>
                          {isEmpty(item.client)? "CLIENTE EVENTUAL" : item.client.nombreCliente}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.store.name}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.isContado ? "Contado" : "Credito"}
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
                          }).format(sumDescuentos(item.saleDetails))}
                          </td>
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(item.saldo)}
                        </td>
                        {isAccess(access, "MASTER VENTAS UTILIDAD") ? (
                        <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                        }).format(sumGanancia(saleDetails))}
                        </td>
                        ) : (
                        <></>
                        )}
                        {isAccess(access, "MASTER VENTAS UTILIDAD") ? (
                        <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                        style: "percent",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(utilityPercent(saleDetails))}
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
                <span style={{ fontWeight: "bold", color: "#03a9f4" }} id="table-to-xls">
                  Total de Ventas
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI").format(data.length)}
                </span>
              </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }} id="table-to-xls">
                  Total de Ventas
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumSales())}
                </span>
              </Stack>

              {contadoSales ? (
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Ventas de Contado
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumContadoSales())}
                  </span>
                </Stack>
              ) : (
                <></>
              )}

              {creditSales ? (
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
              ) : (
                <></>
              )}

              {creditSales ? (
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
              ) : (
                <></>
              )}

              {creditSales ? (
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total de Descuento
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumDescuentosTotales(data))}
                </span>
              </Stack>
            ) : (
              <></>
            )}


              {creditSales ? (
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
              ) : (
                <></>
              )}

              {creditSales ? (
              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Utilidad Global
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                        style: "percent",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                  }).format(utilityPercentGlobal(data))}
                </span>
              </Stack>
            ) : (
              <></>
            )}
            </Stack>
            <hr />
          </Container>
        </PrintReport>
      </div>
    </div>
  );
};