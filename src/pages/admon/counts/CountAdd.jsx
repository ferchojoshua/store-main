import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import {
  TextField,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";

import {
  addCountAsync,
  getCountGroupAsync,
} from "../../../services/ContabilidadApi";

export const CountAdd = ({ setShowModal }) => {
  let ruta = getRuta();

  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();

  const [countNumber, setCountNumber] = useState("");
  const [description, setDescription] = useState("");
  const [clasificationList, setClasificationList] = useState([]);
  const [clasificationSelected, setClasificationSelected] = useState("");

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(false);
      const result = await getCountGroupAsync(token);
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

      setClasificationList(result.data);
    })();
  }, []);

  const countNumb = (value) => {
    if (/^[0-9,.]+$/.test(value.toString()) || value === "") {
      setCountNumber(value);
      return;
    }
  };

  const saveChangesAsync = async () => {
    const data = {
      countNumber,
      description,
      idCountGroup: clasificationSelected,
    };

    if (countNumber.length === 0) {
      toastError("Ingrese un numero de cuenta...");
      return;
    }

    if (description.length === 0) {
      toastError("Ingrese una descripcion de cuenta...");
      return;
    }
    if (clasificationSelected === "") {
      toastError("Seleccione una clasificacion de cuenta...");
      return;
    }

    setIsLoading(true);
    const result = await addCountAsync(token, data);
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
    toastSuccess("Cuenta Agregada...!");
    setReload(!reload);
    setShowModal(false);
  };

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
        <TextField
          fullWidth
          required
          variant="standard"
          onChange={(e) => countNumb(e.target.value)}
          label={"Numero de Cuenta"}
          value={countNumber}
        />

        <TextField
          fullWidth
          style={{ marginTop: 20 }}
          required
          variant="standard"
          onChange={(e) => setDescription(e.target.value.toUpperCase())}
          label={"Nombre de Cuenta"}
          value={description}
        />

        <FormControl
          variant="standard"
          fullWidth
          style={{ marginRight: 20, marginTop: 20 }}
          required
        >
          <InputLabel id="demo-simple-select-standard-label">
            Seleccione una Clasificacion
          </InputLabel>
          <Select
            defaultValue=""
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={clasificationSelected}
            onChange={(e) => setClasificationSelected(e.target.value)}
            label="Almacen"
            style={{ textAlign: "left" }}
          >
            <MenuItem key={-1} value="">
              <em> Seleccione una Clasificacion</em>
            </MenuItem>
            {clasificationList.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.description}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 30 }}
          onClick={() => saveChangesAsync()}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          Agregar Cuenta
        </Button>
      </Paper>
    </div>
  );
};
