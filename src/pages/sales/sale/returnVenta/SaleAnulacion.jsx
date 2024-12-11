import React, { useContext } from "react";
import { DataContext } from "../../../../context/DataContext";
import {
    Box,
    Button,
    Grid,
    Typography,
    Divider,
    Paper
} from "@mui/material";
import moment from "moment";
import { AnularSaleforIdAsync } from "../../../../services/SalesApi";
import { getToken, deleteUserData, deleteToken } from "../../../../services/Account";
import { getRuta, toastError, toastSuccess } from "../../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SaleAnulacion = ({ selectedVenta, setVisible }) => {
    const {
        reload,
        setReload,
        setIsLoading,
        setIsDefaultPass,
        setIsLogged,
    } = useContext(DataContext);

    const {
        id,
        fechaVenta,
        montoVenta,
        client,
        nombreCliente,
    } = selectedVenta;

    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    const token = getToken();
    let ruta = getRuta();

    const handleAnular = async () => {
        MySwal.fire({
            icon: "warning",
            title: <p>Anular Venta</p>,
            text: "¿Está seguro de anular esta venta?",
            showDenyButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: "Cancelar",
            iconColor: "#f50057",
        }).then((result) => {
            if (result.isConfirmed) {
                (async () => {
                    setIsLoading(true);
                    const result = await AnularSaleforIdAsync(token, id);
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

                    setIsLoading(false);
                    toastSuccess("Venta Anulada");
                    setReload(!reload);
                    setVisible(false);
                })();
            }
        });
    };

    return (
        <Paper elevation={3} sx={{ borderRadius: '15px' }}>
            <Box p={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Confirmar Anulación de Venta
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            ID Venta
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {id}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Fecha
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {moment(fechaVenta).format("L")}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Cliente
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {client ? client.nombreCliente : nombreCliente || "SIN NOMBRE"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Monto
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {new Intl.NumberFormat("es-NI", {
                                style: "currency",
                                currency: "NIO",
                            }).format(montoVenta)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={handleAnular}
                                sx={{ 
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    minWidth: '100px', // Ancho mínimo
                                    px: 2, // Padding horizontal
                                    py: 0.5 // Padding vertical
                                }}
                            >
                                Anular Venta
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => setVisible(false)}
                                sx={{ 
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    minWidth: '100px', // Ancho mínimo
                                    px: 2, // Padding horizontal
                                    py: 0.5 // Padding vertical
                                                    }}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default SaleAnulacion;