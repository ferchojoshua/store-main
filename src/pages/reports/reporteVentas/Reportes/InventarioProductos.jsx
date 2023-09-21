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
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
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
    
    let navigate = useNavigate();
    let ruta = getRuta();
    const token = getToken();

    useEffect(() => {
        (async () => {
            const datos = {
            storeId: selectedStore === "t" ? null : selectedStore,
            tipoNegocioId: selectedTNegocio === "t" ? null : selectedTNegocio,
            productId:
                selectedProduct === "" || selectedProduct === null
                ? null
                : selectedProduct.id,
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

                <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
                    <hr />
                    {isEmpty(data) ? (
                        <NoData />
                    ) : (
                        <Table
                            hover={!isDarkMode}
                            size="sm"
                            responsive
                            className="text-primary"
                        >
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "right" }}>Nombres</th>
                                    <th style={{ textAlign: "left" }}>Almacen</th>
                                    <th style={{ textAlign: "center" }}>Precio Unitario</th>
                                    <th style={{ textAlign: "center" }}>Total/Unit</th>
                                    <th style={{ textAlign: "center" }}>Existencia</th>
                                    <th style={{ textAlign: "center" }}>Costo/Unit</th>
                                    <th style={{ textAlign: "center" }}>Costo/Total</th>
                                </tr>
                            </thead>

                            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                                {data.map((item) => {

                                    return (
                                        <tr key={item.barCode}>
                                            hola
                                        </tr>
                                    );

                                })};
                            </tbody>

                        </Table>
                    )};
                </Container>

            </Dialog>
        </div>
    );

};