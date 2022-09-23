import React, { useContext, useState, useEffect } from "react";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Paper,
  Autocomplete,
  IconButton,
  Stack,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataContext } from "../../../../context/DataContext";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import SmallModal from "../../../../components/modals/SmallModal";
import ProviderAdd from "../../../settings/provider/ProviderAdd";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { getprovidersAsync } from "../../../../services/ProviderApi";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError } from "../../../../helpers/Helpers";

const DetallesDeEntrada = ({
  setNoFactura,
  noFactura,
  tipoCompra,
  setTipoCompra,
  selectedProvider,
  setSelectedProvider,
}) => {
  let ruta = getRuta();

  const { setIsLoading, reload, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  const token = getToken();
  const [providerList, setProviderList] = useState([]);
  const [showProviderModal, setShowProvidermodal] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultProviders = await getprovidersAsync(token);
      if (!resultProviders.statusResponse) {
        setIsLoading(false);
        if (resultProviders.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultProviders.error.message);
        return;
      }
      if (resultProviders.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultProviders.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }
      setProviderList(resultProviders.data);
      setIsLoading(false);
    })();
  }, [reload]);

  return (
    <div>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" textAlign={"left"}>
            Datos de Entrada
          </Typography>
        </Stack>

        <Divider style={{ marginTop: 10, marginBottom: 10 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              variant="standard"
              onChange={(e) => setNoFactura(e.target.value.toUpperCase())}
              label={"N° Factura"}
              value={noFactura}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="demo-simple-select-standard-label">
                Tipo de pago...
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={tipoCompra}
                onChange={(e) => setTipoCompra(e.target.value)}
                label="Unidad de Medida"
                style={{ textAlign: "left" }}
              >
                <MenuItem key={0} value="">
                  <em>Tipo de pago...</em>
                </MenuItem>

                <MenuItem key={1} value={"Pago de Contado"}>
                  Pago de Contado
                </MenuItem>
                <MenuItem key={2} value={"Pago de Credito"}>
                  Pago de Credito
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack direction={"row"} spacing={2}>
              <Autocomplete
                id="combo-box-demo"
                fullWidth
                options={providerList}
                getOptionLabel={(op) => (op ? `${op.nombre}` : "")}
                value={selectedProvider === "" ? null : selectedProvider}
                onChange={(event, newValue) => {
                  setSelectedProvider(newValue);
                }}
                noOptionsText="Proveedor no encontrado..."
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    label="Proveedor..."
                  />
                )}
              />

              <Tooltip title="Agregar Proveedor" style={{ marginTop: 5 }}>
                <IconButton onClick={() => setShowProvidermodal(true)}>
                  <FontAwesomeIcon
                    style={{
                      fontSize: 25,
                      color: "#ff5722",
                    }}
                    icon={faCirclePlus}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <SmallModal
        titulo={"Agregar Proveedor"}
        isVisible={showProviderModal}
        setVisible={setShowProvidermodal}
      >
        <ProviderAdd setShowModal={setShowProvidermodal} />
      </SmallModal>
    </div>
  );
};

export default DetallesDeEntrada;
