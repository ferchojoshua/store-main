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
import {
  getFamiliasByTNAsync,
  getTipoNegocioAsync,
} from "../../../../services/TipoNegocioApi";

const SelectorProdNoVendido = () => {
  const { setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);

  var date = new Date();
  const [fechaDesde, setDesdeFecha] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [fechaHassta, setHasstaFecha] = useState(new Date());
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("t");

  const [tNegocioList, setTNegocioList] = useState([]);
  const [selectedTNegocio, setSelectedTNegocio] = useState("t");

  const [familiaList, setFamiliaList] = useState([]);
  const [selectedFamilia, setSelectedFamilia] = useState("t");

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

      const result = await getTipoNegocioAsync(token);
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
      setTNegocioList(result.data);
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

    if (setSelectedTNegocio.length === 0) {
      setSelectedTNegocio("t");
      setSelectedFamilia("t");
      return;
    }

    if (setSelectedFamilia.length === 0) {
      setSelectedFamilia("t");
      return;
    }

    var params = {
      desde: fechaDesde,
      hasta: fechaHassta,
      selectedStore,
      selectedTNegocio,
      selectedFamilia,
    };
    params = JSON.stringify(params);
    window.open(`${ruta}/r-no-sales-prods/${params}`);
  };

  const onChangeTN = async (value) => {
    setSelectedTNegocio(value);
    if (value === "t") {
      setSelectedFamilia("t");
      return;
    } else if (value === "") {
      setSelectedFamilia("");
      return;
    } else {
      setSelectedFamilia("t");
      setIsLoading(true);
      const resultFamilias = await getFamiliasByTNAsync(token, value);
      if (!resultFamilias.statusResponse) {
        setIsLoading(false);
        if (resultFamilias.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultFamilias.error.message);
        return;
      }

      if (resultFamilias.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultFamilias.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setFamiliaList(resultFamilias.data);
    }
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
                value={selectedStore}onChange={(e) => setSelectedStore(e.target.value)}
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
                  disabled={storeList.length === 5 ? false : true}
                >
                  Todos...
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              fullWidth
              style={{ marginRight: 20 }}
              required
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione un Tipo de Negocio
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedTNegocio}
                onChange={(e) => onChangeTN(e.target.value)}
                label="Tipo de Negocio"
                style={{ textAlign: "left" }}
              >
                <MenuItem key={-1} value="">
                  <em> Seleccione un Tipo de Negocio</em>
                </MenuItem>

                {tNegocioList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.description}
                    </MenuItem>
                  );
                })}
                <MenuItem key={"t"} value={"t"}>
                  Todos...
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              fullWidth
              style={{ marginRight: 20 }}
              required
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione una Familia
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedFamilia}
                onChange={(e) => {
                  if (e.target.value.length === 0) {
                    setSelectedFamilia("t");
                    return;
                  }
                  setSelectedFamilia(e.target.value);
                }}
                style={{ textAlign: "left" }}
              >
                <MenuItem key={-1} value="">
                  <em> Seleccione una Familia</em>
                </MenuItem>

                {familiaList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.description}
                    </MenuItem>
                  );
                })}
                <MenuItem key={"t"} value={"t"}>
                  Todos...
                </MenuItem>
              </Select>
            </FormControl>

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

export default SelectorProdNoVendido;
