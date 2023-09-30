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
import { getRuta, isAccess, toastError } from "../../../../helpers/Helpers";
import Consulting from "../../../../components/Consulting";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import PaginationComponent from "../../../../components/PaginationComponent";
import { Table } from "react-bootstrap";
import { getProductosInventrioAsync } from "../../../../services/ReportApi";
import moment from "moment";
import { PrintReport } from "../../../../components/modals/PrintReport";

import "../../../../components/styles/estilo.css";

export const InventarioProductos = () => {
    const [data, setData] = useState([]);
    
    const compRef = useRef();
    const { params } = useParams();
    const dataJson = JSON.parse(params);
    const {
        selectedStore,
        selectedProduct,
        selectedTNegocio,
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
            storeId: selectedStore === "t" ? 0 : selectedStore,
            tipoNegocioId: selectedTNegocio === "t" ? 0 : selectedTNegocio,
            productId: selectedProduct === "t" ? 0:  selectedProduct,
            };

            setIsLoading(true);

            const result = await getProductosInventrioAsync(token, datos);
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


    const sumPU= () => {
        let sum = 0;
        data.map((item) => (sum += item.precio_detalle));
        return sum;
      };

    const sumMayor= () => {
        let sum = 0;
        data.map((item) => (sum += item.precio_xmayor));
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
                        Inventario de Productos
                    </Typography>

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
                            { isEmpty(data) ? (isEmpty(data) ? (<Consulting/>) :(<NoData/>)) : (
                                <div>
                        <Table
                            hover={!isDarkMode}
                            size="sm"
                            responsive
                            className="text-primary"
                        >
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "center" }}>Codigo.B</th> 
                                    <th style={{ textAlign: "center" }}>Producto</th>   
                                    <th style={{ textAlign: "center" }}>Almacen</th>                                 
                                    <th style={{ textAlign: "center" }}>Existencia</th>
                                    <th style={{ textAlign: "center" }}>Precio Unitario</th>
                                    <th style={{ textAlign: "center" }}>Total/Unit</th> 
                                    <th style={{ textAlign: "center" }}>Precio Mayor</th>
                                    <th style={{ textAlign: "center" }}>Total/Mayor</th>                                   
                                    <th style={{ textAlign: "center" }}>Costo/Unit</th>
                                    <th style={{ textAlign: "center" }}>Costo/Total</th>
                                </tr>
                            </thead>

                            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                                {currentItem.map((item) => {
                                    const {
                                            id,
                                            nombre_producto, 
                                            nombre_almacen,                                                                                     
                                            existencia,             
                                            precio_detalle,
                                            total_detalle, 
                                            precio_xmayor,
                                            total_mayor,
                                            costo_unitario,
                                            costo_total,
                                        } = item;

                                    return (
                                        <tr key={id}>    
                                        <td style={{ textAlign: "center"}}>{id}</td>                               
                                        <td style={{ textAlign: "center"}}>{nombre_producto}</td> 
                                        <td style={{ textAlign: "center"}}>{nombre_almacen}</td>                                      
                                        <td style={{ textAlign: "center" , width: "1%",whiteSpace: "nowrap", }}>{existencia}</td>    
                                         <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(precio_detalle)}</td>                                                                      
                                        <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(total_detalle)}</td> 
                                        <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(precio_xmayor)}</td> 
                                        <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(total_mayor)}</td> 
                                        <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(costo_unitario)}</td> 
                                        <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(costo_total)}</td>  
                                        </tr>
                                    );

                                })};
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
                Total Productos
              </span>
              <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
            </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Global Unitario
                </span>
                 <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumPU())}
                </span> 
              </Stack>
              {
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Global Mayor
                  </span>
                   <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumMayor())}
                  </span> 
                </Stack>}
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
        //   fecha={`Desde: ${moment(desde).format("L")} - Hasta: ${moment(
        //     hasta
        //   ).format("L")}`}
          titulo={"Inventario de Productos"}
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
                className="text-primary tableFixHead"
              >
                <thead>
                  <tr>
                  <th style={{ textAlign: "center" }}>Producto</th>   
                    <th style={{ textAlign: "center" }}>Almacen</th>                                 
                    <th style={{ textAlign: "center" }}>Existencia</th>
                    <th style={{ textAlign: "center" }}>Precio Unitario</th>
                    <th style={{ textAlign: "center" }}>Total/Unit</th> 
                    <th style={{ textAlign: "center" }}>Precio Mayor</th>
                    <th style={{ textAlign: "center" }}>Total/Mayor</th>                                   
                    <th style={{ textAlign: "center" }}>Costo/Unit</th>
                    <th style={{ textAlign: "center" }}>Costo/Total</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {currentItem.map((item) => {
                    const {
                        id,
                        nombre_producto, 
                        nombre_almacen,                                                                                     
                        existencia,             
                        precio_detalle,
                        total_detalle, 
                        precio_xmayor,
                        total_mayor,
                        costo_unitario,
                        costo_total,
                    } = item;
                    return (
                      <tr key={id}>                                       
                    <td style={{ textAlign: "center"}}>{nombre_producto}</td> 
                    <td style={{ textAlign: "center" ,width: "1%",whiteSpace: "nowrap",}}>{nombre_almacen}</td>                                      
                    <td style={{ textAlign: "center" }}>{existencia}</td>    
                    <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(precio_detalle)}</td>                                                                      
                    <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(total_detalle)}</td> 
                    <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(precio_xmayor)}</td> 
                    <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(total_mayor)}</td> 
                    <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(costo_unitario)}</td> 
                    <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(costo_total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
            <hr />
           </Container>
        </PrintReport>
      </div>
    </div>
  );
};
