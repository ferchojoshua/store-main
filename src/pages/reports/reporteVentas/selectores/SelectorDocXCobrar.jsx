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
import { getStoresAsync } from "../../../../services/AlmacenApi";
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
import FullScreenModal from "../../../../components/modals/FullScreenModal";
import moment from "moment";
import { getClientsAsync } from "../../../../services/ClientsApi";
import { DocumentosXCobrar } from "../Reportes/DocumentosXCobrar";

export const SelectorDocXCobrar = () => {
  var date = new Date();
  const [fechaDesde, setDesdeFecha] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [fechaHassta, setHasstaFecha] = useState(new Date());
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("t");
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  const [showFullScreenModal, setShowFullScreenModal] = useState(false);
  const [includeCanceled, setIncludeCanceled] = useState(false);

  const { setIsLoading, setIsDefaultPass, setIsLogged, access } =
    useContext(DataContext);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStore = await getStoresAsync(token);
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
    })();
  }, []);

  const handleClose = () => {
    setDesdeFecha(new Date(date.getFullYear(), date.getMonth(), 1));
    setHasstaFecha(new Date());
    setSelectedStore("t");

    setShowFullScreenModal(false);
  };

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

    setShowFullScreenModal(true);
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
                    <MenuItem key={item.almacen.id} value={item.almacen.id}>
                      {item.almacen.name}
                    </MenuItem>
                  );
                })}
                <MenuItem key={"t"} value={"t"}>
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

        <FullScreenModal
          titulo={"Documentos por Cobrar"}
          fecha={`Desde: ${moment(fechaDesde).format("L")} - Hasta: ${moment(
            fechaHassta
          ).format("L")}`}
          open={showFullScreenModal}
          handleClose={handleClose}
        >
          <DocumentosXCobrar
            selectedStore={selectedStore}
            desde={fechaDesde}
            hasta={fechaHassta}
            selectedClient={selectedClient}
            includeCanceled={includeCanceled}
          />
        </FullScreenModal>
      </Container>
    </div>
  );
};
