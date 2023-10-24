import React, { useState, useEffect, useContext } from "react";
import { DatePicker } from "@mui/lab";
import {
  Container,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { getStoresByUserAsync } from "../../../../services/AlmacenApi";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { DataContext } from "../../../../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { getClientsAsync } from "../../../../services/ClientsApi";

export const SelectorDocXCobrar = () => {
  const { setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);

  var date = new Date();
  const [fechaDesde, setDesdeFecha] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [fechaHassta, setHasstaFecha] = useState(new Date());
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("t");
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  const [includeCanceled, setIncludeCanceled] = useState(false);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStore = await getStoresByUserAsync(token);
      if (!resultStore.statusResponse) {
        setIsLoading(false);
        if (resultStore.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultStore.error.message);
        return;
      }

      if (resultStore.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultStore.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setStoreList(resultStore.data);

      const resultClients = await getClientsAsync(token);
      if (!resultClients.statusResponse) {
        setIsLoading(false);
        if (resultClients.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultClients.error.message);
        return;
      }

      if (resultClients.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultClients.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setClientList(resultClients.data);
      setIsLoading(false);
      if (resultStore.data.length < 4) {
        setSelectedStore(resultStore.data[0].id);
      }
    })();
  }, []);

  const verReport = () => {
    if (!moment(fechaDesde).isValid()) {
      toastError("Ingrese una fecha de inicio valida");
      return;
    }
    if (!moment(fechaHassta).isValid()) {
      toastError("Ingrese una fecha de final valida");
      return;
    }
    if (selectedStore === "") {
      toastError("Seleccione un almacen");
      return;
    }

    var params = {
      selectedStore: selectedStore,
      desde: fechaDesde,
      hasta: fechaHassta,
      selectedClient,
      includeCanceled,
    };
    params = JSON.stringify(params);

    window.open(`${ruta}/r-docs-cobrar/${params}`);
  };

  return (
    <div>
      <Container style={{ width: 550 }}>
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
            marginBottom: 10,
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={2} direction="row">
              <DatePicker
                label="Desde"
                value={fechaDesde}
                onChange={(newValue) => {
                  setDesdeFecha(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    required
                    fullWidth
                    variant="standard"
                    {...params}
                  />
                )}
              />

              <DatePicker
                label="Hasta"
                value={fechaHassta}
                onChange={(newValue) => {
                  setHasstaFecha(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    required
                    fullWidth
                    variant="standard"
                    {...params}
                  />
                )}
              />
            </Stack>

            <FormControl
              variant="standard"
              fullWidth
              style={{ marginRight: 20 }}
              required
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione un Almacen
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                label="Almacen"
                style={{ textAlign: "left" }}
              >
                <MenuItem key={-1} value="">
                  <em> Seleccione un Almacen</em>
                </MenuItem>
                {storeList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  );
                })}
                <MenuItem
                  key={"t"}
                  value={"t"}
                  disabled={
                        storeList.length > 6 || storeList.length > 5 || storeList.length > 4 || storeList.length > 3 || storeList.length > 2
                          ? false
                          : true
                      }
                >
                  Todos...
                </MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              id="combo-box-demo"
              fullWidth
              options={clientList}
              getOptionLabel={(op) => (op ? `${op.nombreCliente}` || "" : "")}
              value={selectedClient === "" ? null : selectedClient}
              onChange={(event, newValue) => {
                setSelectedClient(newValue);
              }}
              noOptionsText="Cliente no encontrado..."
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.nombreCliente}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label={
                    selectedClient === "" || selectedClient === null
                      ? "Todos los clientes"
                      : "Cliente"
                  }
                />
              )}
            />

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeCanceled}
                    onChange={() => setIncludeCanceled(!includeCanceled)}
                  />
                }
                label="Incluir Facturas Canceladas"
              />
            </FormGroup>

            <Button
              variant="outlined"
              fullWidth
              style={{ borderRadius: 20, marginTop: 30 }}
              startIcon={<FontAwesomeIcon icon={faPrint} />}
              onClick={() => {
                verReport();
              }}
            >
              Generar Reporte
            </Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
};
