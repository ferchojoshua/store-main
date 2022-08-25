import React, { useState, useEffect, useContext } from "react";
import { DatePicker, TimePicker } from "@mui/lab";
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
import CierreDiario from "../Reportes/CierreDiario";

const SelectorCierreDiario = () => {
  var date = new Date();
  const [fechaDesde, setDesdeFecha] = useState(date);
  const [fechaHasta, setHastaFecha] = useState(date);
  const [horaDesde, setHoraDesde] = useState(new Date(date.setHours(6, 0)));
  const [horaHasta, setHoraHasta] = useState(date.setHours(18, 0));

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("t");

  const [showFullScreenModal, setShowFullScreenModal] = useState(false);

  const { setIsLoading, setIsDefaultPass, setIsLogged } =
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
      setIsLoading(false);
    })();
  }, []);

  const verReport = () => {
    if (!moment(fechaDesde).isValid()) {
      toastError("Ingrese una fecha de inicio valida");
      return;
    }
    if (!moment(fechaHasta).isValid()) {
      toastError("Ingrese una fecha de final valida");
      return;
    }
    if (selectedStore === "") {
      toastError("Seleccione un almacen");
      return;
    }

    setShowFullScreenModal(true);
  };

  const handleClose = () => {
    setDesdeFecha(date);
    setHastaFecha(date);
    setSelectedStore("t");

    setShowFullScreenModal(false);
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
                label="Fecha Desde"
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
                label="FechaHasta"
                value={fechaHasta}
                onChange={(newValue) => {
                  setHastaFecha(newValue);
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

            <Stack spacing={2} direction="row">
              <TimePicker
                label="Hora Desde"
                value={horaDesde}
                ampm
                onChange={(newValue) => {
                  setHoraDesde(newValue);
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

              <TimePicker
                label="Hora Hasta"
                value={horaHasta}
                ampm
                onChange={(newValue) => {
                  setHoraHasta(newValue);
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
          </Stack>

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
        </Paper>

        <FullScreenModal
          titulo={"Cierre Diario"}
          fecha={`Desde: ${moment(fechaDesde).format("L")} - Hasta: ${moment(
            fechaHasta
          ).format("L")}`}
          open={showFullScreenModal}
          handleClose={handleClose}
        >
          <CierreDiario
            selectedStore={selectedStore}
            fechaDesde={fechaDesde}
            fechaHasta={fechaHasta}
            horaDesde={horaDesde}
            horaHasta={horaHasta}
          />
        </FullScreenModal>
      </Container>
    </div>
  );
};

export default SelectorCierreDiario;
