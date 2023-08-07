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
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Table } from "react-bootstrap";
import { getProductosVendidosAsync } from "../../../../services/ReportApi";
import moment from "moment";
import { PrintReport } from "../../../../components/modals/PrintReport";

import "../../../../components/styles/estilo.css";

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
        clientId:
          selectedClient === "" || selectedClient === null
            ? 0
            : selectedClient.id,
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

  const sumUtilidad = () => {
    let sum = 0;
    data.map((item) => (sum += item.utilidad));
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
            Productos Vendidos
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
                  style={{fontSize: 40, position: "fixed",color: "#4caf50" , right: 50, top: 75, width: 50 }}>
                  <FontAwesomeIcon icon={faDownload}
                onClick={() => { document.getElementById('test-table-xls-button').click(); }}
     
                  />
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
                  <th style={{ textAlign: "right" }}>C. Barras</th>
                  <th style={{ textAlign: "left" }}>Producto</th>
                  <th style={{ textAlign: "center" }}>Cant. Vendida</th>
                  <th style={{ textAlign: "center" }}>Costo</th>
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
                className="text-primary"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "right" }}>C. Barras</th>
                    <th style={{ textAlign: "left" }}>Producto</th>
                    <th style={{ textAlign: "center" }}>Cant. Vendida</th>
                    <th style={{ textAlign: "center" }}>Costo</th>
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
        
 <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-success"
                    table="table-to-xls"
                    filename="Productos Vendidos"
                    sheet="Pagina 1"
                                           
                    />
      </div>
    </div>
  );
};
