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
import { getTrasladosAsync } from "../../../../services/ReportApi";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, } from "@fortawesome/free-solid-svg-icons";

import moment from "moment";
import "../../../../components/styles/estilo.css";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { PrintReport } from "../../../../components/modals/PrintReport";
import XLSX from 'xlsx';

const TrasladoInventario = () => {
  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const { selectedStore, desde, hasta } = dataJson;

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
      };

      setIsLoading(true);

      const result = await getTrasladosAsync(token, datos);
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

  const sumCostoNeto = () => {
    let sum = 0;
    data.map((item) => (sum += item.sumCostoCompra));
    return sum;
  };
  
  const downloadExcel = () => {
    exportExcel("table-to-xls", "Traslados de Inventario", data.length,  sumCostoNeto());
  };

  const exportExcel = (tableId, filename, TotalTraslados, sumCostoNeto) => {
    const table = document.getElementById(tableId);
    const colWidths = Array.from(table.rows[0].cells).map(cell => ({ wch: cell.clientWidth / 8 }));
    const ws_data = XLSX.utils.table_to_sheet(table, { sheet: "Traslados de Inventario", raw: true, columnDefs: colWidths });
    const totalRow = [
      { t: "s", v: "Total de Traslados", s: { font: { bold: true }, alignment: { horizontal: "center" } } },
      { t: "n", v: TotalTraslados, s: { alignment: { horizontal: "center" } } },
      { t: "s", v: "Total de Costos", s: { font: { bold: true }, alignment: { horizontal: "center" } } },
      { t: "n", v: sumCostoNeto, s: { alignment: { horizontal: "center" } } },
    ];
  
    XLSX.utils.sheet_add_aoa(ws_data, [totalRow], { origin: -1 });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws_data, "Traslados de Inventario");
  
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
            Traslados de Inventario
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
              <thead class="table-dark">
                <tr>
                  <th style={{ textAlign: "center" }}>Fecha</th>
                  <th style={{ textAlign: "left" }}>Concepto</th>
                  <th style={{ textAlign: "center" }}>Productos</th>
                  <th style={{ textAlign: "center" }}>Almacen</th>
                  <th style={{ textAlign: "center" }}>Σ Costo Compra</th>
                  <th style={{ textAlign: "center" }}>Σ PVM</th>
                  <th style={{ textAlign: "center" }}>Σ PVD</th>
                  <th style={{ textAlign: "left" }}>Usuario</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {currentItem.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: "center" }}>{moment(item.fecha).format("L")}</td>
                      <td style={{ textAlign: "left" }}>{item.concepto}</td>
                      <td style={{ textAlign: "center" }}>{item.productCount}</td>
                      <td style={{ textAlign: "center", width: "1%",whiteSpace: "nowrap", }}>{item.almacen} </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.sumCostoCompra)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.sumVentaMayor)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.sumVentaDetalle)}
                      </td>
                      <td style={{ textAlign: "left" }}>{item.usuario}</td>
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
                Total de Traslados
              </span>
              <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
            </Stack>

            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Costos
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumCostoNeto())}
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
            titulo={"Traslados de Inventario"}
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
                      <th style={{ textAlign: "left" }}>Concepto</th>
                      <th style={{ textAlign: "center" }}>Productos</th>
                      <th style={{ textAlign: "center" }}>Almacen</th>
                      <th style={{ textAlign: "center" }}>Σ Costo Compra</th>
                      <th style={{ textAlign: "center" }}>Σ PVM</th>
                      <th style={{ textAlign: "center" }}>Σ PVD</th>
                      <th style={{ textAlign: "left" }}>Usuario</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                    {data.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td style={{ textAlign: "center" }}>
                            {moment(item.fecha).format("L")}
                          </td>
                          <td style={{ textAlign: "left" }}>{item.concepto}</td>
                          <td style={{ textAlign: "center" }}>{item.productCount}</td>
                          <td style={{ textAlign: "center", width: "1%",whiteSpace: "nowrap", }}>{item.almacen} </td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(item.sumCostoCompra)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(item.sumVentaMayor)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Intl.NumberFormat("es-NI", {
                              style: "currency",
                              currency: "NIO",
                            }).format(item.sumVentaDetalle)}
                          </td>
                          <td style={{ textAlign: "left" }}>{item.usuario}</td>
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
                    Total de Traslados
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI").format(data.length)}
                  </span>
                </Stack>

                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Total de Costos
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumCostoNeto())}
                  </span>
                </Stack>
              </Stack>
            </Container>
          </PrintReport>
          
 {/* <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-success"
                    table="table-to-xls"
                    filename="Productos Vendidos"
                    sheet="Pagina 1"
                                           
                    /> */}
        </div>
      </Dialog>
    </div>
  );
};

export default TrasladoInventario;