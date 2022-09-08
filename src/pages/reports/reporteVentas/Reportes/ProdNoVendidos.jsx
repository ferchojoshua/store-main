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
import { PrintReport } from "../../../../components/modals/PrintReport";

import "../../../../components/styles/estilo.css";
import { getProductosNoVendidosAsync } from "../../../../services/ReportApi";

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
            Productos No Vendidos
          </Typography>
          <span style={{ textAlign: "center" }}>{`Desde: ${moment(desde).format(
            "L"
          )} - Hasta: ${moment(hasta).format("L")}`}</span>

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
                  <th style={{ textAlign: "right" }}>C. Barras</th>
                  <th style={{ textAlign: "left" }}>Producto</th>
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
                      <td style={{ textAlign: "right" }}>{producto.barCode}</td>
                      <td style={{ textAlign: "left" }}>
                        {producto.description}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "1%",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {almacen.name}
                      </td>
                      <td style={{ textAlign: "center" }}>{existencia}</td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(precioVentaMayor)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(precioVentaDetalle)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
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
                hover={!isDarkMode}
                size="sm"
                responsive
                className="text-primary tableFixHead"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "right" }}>C. Barras</th>
                    <th style={{ textAlign: "left" }}>Producto</th>
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
                        <td style={{ textAlign: "right" }}>
                          {producto.barCode}
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {producto.description}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            width: "1%",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {almacen.name}
                        </td>
                        <td style={{ textAlign: "center" }}>{existencia}</td>
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(precioVentaMayor)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(precioVentaDetalle)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Container>
        </PrintReport>
      </div>
    </div>
  );
};
