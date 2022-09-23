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

export const SelectorMasterVentas = () => {
  const { setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  var date = new Date();
  const [fechaDesde, setDesdeFecha] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [horaDesde, setHoraDesde] = useState(new Date(date.setHours(6, 0)));

  const [fechaHassta, setHasstaFecha] = useState(new Date());
  const [horaHasta, setHoraHasta] = useState(new Date(date.setHours(18, 0)));

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("t");

  const [selectAll, setSelectAll] = useState(true);
  const [selectCreditSales, setSelectCreditSales] = useState(true);
  const [selectContadoSales, setSelectContadoSales] = useState(true);

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

      if (resultStore.data.length < 4) {
        setSelectedStore(resultStore.data[0].id);
      }

      setIsLoading(false);
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
    if (!selectCreditSales && !selectContadoSales) {
      toastError("Seleccione al menos un tipo de venta");
      return;
    }

    let fechaD = moment(fechaDesde).format("YYYY-MM-DD");
    let horaD = moment(horaDesde).format("HH:mm");
    let fhDesde = new Date(`${fechaD}T${horaD}:00.00Z`);
    fhDesde.setSeconds(0);

    let fechaH = moment(fechaHassta).format("YYYY-MM-DD");
    let horaH = moment(horaHasta).format("HH:mm");
    let fhHasta = new Date(`${fechaH}T${horaH}:00.00Z`);
    fhHasta.setSeconds(0);

    var params = {
      selectedStore,
      desde: fhDesde.toISOString(),
      hasta: fhHasta.toISOString(),
      creditSales: selectCreditSales,
      contadoSales: selectContadoSales,
      horaDesde,
      horaHasta,
    };

    params = JSON.stringify(params);
    window.open(`${ruta}/r-master-vetas/${params}`);
  };

  const seleccionarTodos = () => {
    setSelectAll(!selectAll);
    setSelectContadoSales(!selectAll);
    setSelectCreditSales(!selectAll);
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
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  );
                })}
                {
                  <MenuItem
                    key={"t"}
                    value={"t"}
                    disabled={storeList.length === 4 ? false : true}
                  >
                    Todos...
                  </MenuItem>
                }
              </Select>
            </FormControl>
          </Stack>

          <Stack style={{ marginTop: 20 }}>
            <span style={{ fontWeight: "bold", color: "#2196f3" }}>
              Tipo de Venta
            </span>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={() => seleccionarTodos()}
                  />
                }
                label="Seleccionar Todos"
              />
            </FormGroup>
          </Stack>

          <hr />

          <Stack direction="row" display="flex" justifyContent="space-around">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectContadoSales}
                    onChange={() => {
                      setSelectAll(false);
                      setSelectContadoSales(!selectContadoSales);
                    }}
                  />
                }
                label="Ventas de Contado"
              />
            </FormGroup>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectCreditSales}
                    onChange={() => {
                      setSelectAll(false);
                      setSelectCreditSales(!selectCreditSales);
                    }}
                  />
                }
                label="Ventas de Credito"
              />
            </FormGroup>
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
      </Container>
    </div>
  );
};
