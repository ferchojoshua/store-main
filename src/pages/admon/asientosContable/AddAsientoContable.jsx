import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import DatePicker from "@mui/lab/DatePicker";
import { getRuta, isAccess, toastError } from "../../../helpers/Helpers";
import {
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Stack,
  setRef,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

import { isEmpty } from "lodash";

import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";

import moment from "moment";
import {
  getCountFuentesContablesAsync,
  getCountLibrosAsync,
} from "../../../services/ContabilidadApi";

export const AddAsientoContable = ({ setShowModal }) => {
  const [fecha, setFecha] = useState(new Date());
  const [referencia, setReferencia] = useState("");

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const [libroList, setLibroList] = useState([]);
  const [selectedLibro, setSelectedLibro] = useState("");

  const [fuenteList, setFuenteList] = useState([]);
  const [selectedFuente, setSelectedFuente] = useState("");

  const {
    isDarkMode,
    reload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);

  let navigate = useNavigate();
  let ruta = getRuta();

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getCountFuentesContablesAsync(token);
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
      setFuenteList(result.data);

      const resultLibro = await getCountLibrosAsync(token);
      if (!resultLibro.statusResponse) {
        setIsLoading(false);
        if (resultLibro.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultLibro.error.message);
        return;
      }

      if (resultLibro.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultLibro.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setLibroList(resultLibro.data);
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
          marginBottom: 10,
        }}
      >
        <Stack spacing={5} direction="row">
          <DatePicker
            label="Fecha"
            value={fecha}
            onChange={(newValue) => {
              setFecha(newValue);
            }}
            renderInput={(params) => (
              <TextField required fullWidth variant="standard" {...params} />
            )}
          />

          <TextField
            fullWidth
            required
            variant="standard"
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            label={"Referencia"}
            value={referencia}
          />
        </Stack>

        <Stack spacing={5} direction="row">
          <FormControl
            variant="standard"
            fullWidth
            style={{ marginRight: 20, marginTop: 20 }}
            required
          >
            <InputLabel id="demo-simple-select-standard-label">
              Seleccione una fuente
            </InputLabel>
            <Select
              defaultValue=""
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedFuente}
              onChange={(e) => setSelectedFuente(e.target.value)}
              label="Fuente Contable"
              style={{ textAlign: "left" }}
            >
              <MenuItem key={-1} value="">
                <em> Seleccione una Fuente</em>
              </MenuItem>
              {fuenteList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.description}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl
            variant="standard"
            fullWidth
            style={{ marginRight: 20, marginTop: 20 }}
            required
          >
            <InputLabel id="demo-simple-select-standard-label">
              Seleccione un Libro
            </InputLabel>
            <Select
              defaultValue=""
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedLibro}
              onChange={(e) => setSelectedLibro(e.target.value)}
              label="Libro Contable"
              style={{ textAlign: "left" }}
            >
              <MenuItem key={-1} value="">
                <em> Seleccione una Libro</em>
              </MenuItem>
              {libroList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.description}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
      </Paper>
    </div>
  );
};
