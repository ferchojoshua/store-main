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
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faDownload, } from "@fortawesome/free-solid-svg-icons";
import { deleteToken,  deleteUserData, getToken,} from "../../../../services/Account";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import PaginationComponent from "../../../../components/PaginationComponent";
import { Table } from "react-bootstrap";
import { getProductosInventrioAsync } from "../../../../services/ReportApi";
import moment from "moment";
//import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { PrintReport } from "../../../../components/modals/PrintReport";
import "../../../../components/styles/estilo.css";
import XLSX from 'xlsx';


export const InventarioProductos = () => {
    const [data, setData] = useState([]);
    
    const compRef = useRef();
    const { params } = useParams();
    const dataJson = JSON.parse(params);
    const {
        selectedStore,
        selectedProduct,
        selectedTNegocio,
        selectedFamilia,
        showststore,
        omitirStock,
        showCost,
    } = dataJson;

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
            storeId: selectedStore === "t" ? 0 : selectedStore,
            tipoNegocioId: selectedTNegocio === "t" ? 0 : selectedTNegocio,
            familiaID: selectedFamilia === "t" ? 0 : selectedFamilia,
            productId: selectedProduct === "t" ? 0 : selectedProduct,
            showststore: showststore,
            showCost:  showCost,
            omitirStock: omitirStock,
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




      
    // const sumexistencia= () => { 
    //        let sum = 0;
    //     currentItem.map((item) => (sum += item.existencia));
    //     return sum;
    //   };

       const sumexistencia = () => {
    return data.reduce((total, item) => {
      return total + item.existencia;
    }, 0);
  };

     
  const precioDetalle = () => {
    return data.reduce((total, item) => {
      return total + item.total_detalle;
    }, 0);
  };

       
  const precio_xmayor = () => {
    return data.reduce((total, item) => {
      return total + item.precio_xmayor;
    }, 0);
  };

       
  const totalPrecioMayor = () => {
    return data.reduce((total, item) => {
      return total + item.total_mayor;
    }, 0);
  };       

  const costototal = () => {
    return data.reduce((total, item) => {
      return total + item.costo_total;
    }, 0);
  };
  
  const downloadExcel = () => {
    exportExcel("table-to-xls", "Inventario de Productos", data.length, sumexistencia(), precioDetalle(), totalPrecioMayor(), costototal());
  };

  const exportExcel = (tableId, filename, totalProductos, sumexistencia, precioDetalle, totalPrecioMayor, costototal) => {
    const table = document.getElementById(tableId);
    const ws_data = XLSX.utils.table_to_sheet(table);

    const totalRow = [
      { t: "s", v: "Total Productos", s: { font: { bold: true } } },
      { t: "n", v: totalProductos  },
      { t: "s", v: "Total Existencia", s: { font: { bold: true } } },
      { t: "n", v: sumexistencia , z: '"C$"#,##0.00'},
      { t: "s", v: "Total Precio Detalle", s: { font: { bold: true } } },
      { t: "n", v: precioDetalle , z: '"C$"#,##0.00'},
      { t: "s", v: "Total Precio Mayor", s: { font: { bold: true } } },
      { t: "n", v: totalPrecioMayor , z: '"C$"#,##0.00'},
      // { t: "s", v: "Total Costo Total", s: { font: { bold: true } } },
      // { t: "n", v: costototal , z: '"C$"#,##0.00'},
      showCost ? { t: "s", v: "Total Costo Total", s: { font: { bold: true } } } : { t: "s", v: "", s: { font: { bold: true } } },
      showCost ? { t: "n", v: costototal, z: '"C$"#,##0.00' } : null,
    ];
    XLSX.utils.sheet_add_aoa(ws_data, [totalRow], { origin: -1 });
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws_data, "Inventario de Productos");
  
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
                        Inventario de Productos
                        <span style={{ display : "block", textAlign: "center" ,  color: omitirStock ? "#4caf50" : "#f44336" , }}>
                         {`${omitirStock ? "Existencias con más de 1 Producto" : "Existencias con Producto 0"}`}</span>                        
                    </Typography>

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
                            className="text-primary w-100"
                        >
                                <thead class="table-dark">
                                <tr>
                                    <th style={{ textAlign: "center" }}>Codigo.B</th> 
                                    <th style={{ textAlign: "center" }}>Producto</th>   
                                    <th style={{ textAlign: "center" }}>Almacen</th>                                 
                                    <th style={{ textAlign: "center" }}>Existencia</th>
                                    <th style={{ textAlign: "center" }}>Precio Unitario</th>
                                    <th style={{ textAlign: "center" }}>Total/Unit</th> 
                                    <th style={{ textAlign: "center" }}>Precio Mayor</th>
                                    <th style={{ textAlign: "center" }}>Total/Mayor</th>   
                                    {showCost && <th style={{ textAlign: "center" }}>Costo/Unit</th>}
                                 {showCost && <th style={{ textAlign: "center" }}>Costo/Total</th>}                                                                                    
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
                                        {showCost && <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO", }).format(costo_unitario)}</td>}
                                        {showCost && <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO", }).format(costo_total)}</td>} 
                                        {/* <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(costo_unitario)}</td> 
                                        <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(costo_total)}</td>   */}
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
                Total Existencia
                </span>
                  <span>
                  {new Intl.NumberFormat("es-NI").format(sumexistencia())}
                </span> 
              </Stack>
              {
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Precio Detalle
                  </span>
                     <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(precioDetalle ())}
                  </span>  
                </Stack>} 
                   {
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Precio Mayor
                  </span>
                     <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(totalPrecioMayor())}
                  </span>  
                </Stack>} 
           
                    {showCost && 
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Costo Total
                  </span>
                     <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(costototal())}
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
            titulo={"Inventario de Productos"}
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
                className="text-primary w-100 tableFixHead"
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
                    {showCost && <th style={{ textAlign: "center" }}>Costo/Unit</th>}
                    {showCost && <th style={{ textAlign: "center" }}>Costo/Total</th>}                             
                    {/* <th style={{ textAlign: "center" }}>Costo/Unit</th>
                    <th style={{ textAlign: "center" }}>Costo/Total</th> */}
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {data.map((item) => {
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
                    {showCost && <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO", }).format(costo_unitario)}</td>}
                    {showCost && <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO", }).format(costo_total)}</td>}  
                    {/* <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(costo_unitario)}</td> 
                    <td style={{ textAlign: "right" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(costo_total)}</td> */}
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
                Total Productos
              </span>
              <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
            </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total Existencia
                </span>
                  <span>
                  {new Intl.NumberFormat("es-NI").format(sumexistencia())}
                </span> 
              </Stack>
              {
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Precio Detalle
                  </span>
                     <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(precioDetalle ())}
                  </span>  
                </Stack>} 
                   {
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Precio Mayor
                  </span>
                     <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(totalPrecioMayor())}
                  </span>  
                </Stack>} 
           
                    {showCost && 
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total Costo Total
                  </span>
                     <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(costototal())}
                  </span>  
                </Stack>} 
            </Stack>
            <hr />
           </Container>
        </PrintReport>
      </div>
    </div>
  );
};