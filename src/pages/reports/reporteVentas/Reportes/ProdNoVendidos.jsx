import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Button,
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
import Consulting from "../../../../components/Consulting";
import PaginationComponent from "../../../../components/PaginationComponent";
import { DataContext } from "../../../../context/DataContext";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import { deleteToken, deleteUserData, getToken,} from "../../../../services/Account";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faDownload, } from "@fortawesome/free-solid-svg-icons";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { Table } from "react-bootstrap";
import moment from "moment";
import { PrintReport } from "../../../../components/modals/PrintReport";
import "../../../../components/styles/estilo.css";
import { getProductosNoVendidosAsync } from "../../../../services/ReportApi";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export const ProdNoVendidos = () => {
  const [data, setData] = useState([]);

  const compRef = useRef();
  const { params } = useParams();
  const dataJson = JSON.parse(params);
  const { selectedStore, desde, hasta, selectedTNegocio, selectedFamilia } =
    dataJson;

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
        tipoNegocioId: selectedTNegocio === "t" ? 0 : selectedTNegocio,
        familiaId: selectedFamilia === "t" ? 0 : selectedFamilia,
      };

      setIsLoading(true);

      const result = await getProductosNoVendidosAsync(token, datos);
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

  const sumPVD = () => {
    let sum = 0;
    data.map((item) => (sum += item.precioVentaDetalle));
    return sum;
  };

  
  const sumPVM = () => {
    let sum = 0;
    data.map((item) => (sum += item.precioVentaMayor));
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
              {/* {`${title} - Chinandega`} */}
              {`${title}`}
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
            Reporte de Productos No Vendidos
          </Typography>
          <span style={{ textAlign: "center"  }}>{`Desde: ${moment(desde).format(
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

  

        <hr />

        <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
          { isEmpty(data) ? (isEmpty(data) ? (<Consulting/>) :(<NoData/>)) : (
      <div>
        <Table
         id="table-to-xls"
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary tableFixHead table table-striped"

            >
              <thead class="table-dark">
                <tr>
                  <th style={{ textAlign: "center" }}>C.Barras</th>
                  <th style={{ textAlign: "center" }}>Producto</th>
                  <th style={{ textAlign: "center" }}>Almacen</th>
                  <th style={{ textAlign: "center" }}>Existencias</th>
                  <th style={{ textAlign: "center" }}>PVM</th>
                  <th style={{ textAlign: "center" }}>PVD</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {currentItem.map((item) => {
                  const {
                    id,
                    almacen,
                    producto,
                    existencia,
                    precioVentaMayor,
                    precioVentaDetalle,
                  } = item;
                  return (
                    <tr key={id}>
                      <td style={{ textAlign: "center" }}>{producto.barCode}</td>
                      <td style={{ textAlign: "center" }}> {producto.description}</td>
                      <td style={{ textAlign: "center", width: "1%",whiteSpace: "nowrap", }}>{almacen.name} </td>
                      <td style={{ textAlign: "center" }}>{existencia}</td>
                      <td style={{ textAlign: "center" }}> {new Intl.NumberFormat("es-NI", { style: "currency",currency: "NIO", }).format(precioVentaMayor)} </td>
                      <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", { style: "currency",  currency: "NIO",}).format(precioVentaDetalle)} </td>
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
                Total Productos
              </span>
              <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
            </Stack>

              <Stack textAlign="center">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total PVM
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumPVM())}
                </span>
              </Stack>
              {
                <Stack textAlign="center">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Total PVD
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumPVD())}
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
          fecha={`Desde: ${moment(desde).format("L")} - Hasta: ${moment(
            hasta
          ).format("L")}`}
          titulo={"Productos No Vendidos"}
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
                className="text-primary tableFixHead"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>C.Barras</th>
                    <th style={{ textAlign: "center" }}>Producto</th>
                    <th style={{ textAlign: "center" }}>Almacen</th>
                    <th style={{ textAlign: "center" }}>Existencias</th>
                    <th style={{ textAlign: "center" }}>PVM</th>
                    <th style={{ textAlign: "center" }}>PVD</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {data.map((item) => {
                    const {
                      id,
                      almacen,
                      producto,
                      existencia,
                      precioVentaMayor,
                      precioVentaDetalle,
                    } = item;
                    return (
                      <tr key={id}>
                        <td style={{ textAlign: "center" }}>{producto.barCode}</td>
                        <td style={{ textAlign: "center" }}>{producto.description}</td>
                        <td style={{ textAlign: "center", width: "1%", whiteSpace: "nowrap", }}>{almacen.name}</td>
                        <td style={{ textAlign: "center" }}>{existencia}</td>
                        <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(precioVentaMayor)}</td>
                        <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("es-NI", {style: "currency", currency: "NIO",}).format(precioVentaDetalle)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>                        
            )}
            <hr />
            <Stack direction="row" flex="row" justifyContent="space-around">
              <Stack textAlign="Left">
                <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                  Total PVM
                </span>
                <span>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(sumPVM())}
                </span>
              </Stack>
              {
                <Stack textAlign="Left">
                  <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                    Total PVD
                  </span>
                  <span>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumPVD())}
                  </span>
                </Stack>}
            </Stack>
            <hr />
          </Container>
        </PrintReport>

 <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-success"
                    table="table-to-xls"
                    filename="Productos NO Vendidos"
                    sheet="Pagina 1"
                                           
                    />
        <Button
              onClick={() => {
                navigate(`${ruta}/reports/`);
              }}
              style={{ marginRight: 20, borderRadius: 20 }}
              variant="outlined"
            >
              <FontAwesomeIcon
                style={{ marginRight: 10, fontSize: 20 }}
                icon={faCircleChevronLeft}
              />
              Regresar
            </Button>
      </div>
    </div>
  );
};
