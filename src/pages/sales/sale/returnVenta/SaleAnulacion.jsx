// SaleAnulacion.jsx
import React, { useContext } from "react";
import { DataContext } from "../../../../context/DataContext";
import {
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { anularSaleAsync } from "../../../../services/SalesApi";
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
            text: `¿Está seguro de anular esta venta?`,
            showDenyButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`,
            iconColor: "#f50057",
        }).then((result) => {
            if (result.isConfirmed) {
                (async () => {
                    setIsLoading(true);
                    const result = await anularSaleAsync(token, id);
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
        <Container>
            <Typography variant="h6" gutterBottom>
                Confirmar Anulación de Venta
            </Typography>
            <Divider />
            
            <Stack spacing={2} sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>ID Venta:</Typography>
                    <Typography color="primary" fontWeight="bold">
                        {id}
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography>Fecha:</Typography>
                    <Typography color="primary" fontWeight="bold">
                        {moment(fechaVenta).format("L")}
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography>Cliente:</Typography>
                    <Typography color="primary" fontWeight="bold">
                        {client ? client.nombreCliente : nombreCliente || "SIN NOMBRE"}
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography>Monto:</Typography>
                    <Typography color="primary" fontWeight="bold">
                        {new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                        }).format(montoVenta)}
                    </Typography>
                </Stack>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setVisible(false)}
                >
                    Cancelar
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={handleAnular}
                >
                    Anular Venta
                </Button>
            </Stack>
        </Container>
    );
};

export default SaleAnulacion;