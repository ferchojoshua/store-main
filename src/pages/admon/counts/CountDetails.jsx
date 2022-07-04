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
import {
  faCircleXmark,
  faPenToSquare,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";

import {
  addCountAsync,
  getCountGroupAsync,
  updateCountAsync,
} from "../../../services/ContabilidadApi";

export const CountDetails = ({ selectedCount, setShowModal }) => {
  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();

  const { countGroup, countNumber, descripcion, id } = selectedCount;
  const [newCountNumber, setNewCountNumber] = useState(countNumber);
  const [description, setDescription] = useState(descripcion);
  const [clasificationList, setClasificationList] = useState([]);
  const [clasificationSelected, setClasificationSelected] = useState("");

  const [isEdit, setIsEdit] = useState(false);

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
      setClasificationSelected(countGroup.id);
    })();
  }, []);

  let ruta = getRuta();

  const countNumb = (value) => {
    if (/^[0-9]+$/.test(value.toString()) || value === "") {
      setNewCountNumber(value);
      return;
    }
  };

  const saveChangesAsync = async () => {
    const data = {
      id,
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
    const result = await updateCountAsync(token, data);
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
    toastSuccess("Cambios Realizados...!");
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
          value={newCountNumber}
          disabled={!isEdit}
        />

        <TextField
          fullWidth
          style={{ marginTop: 20 }}
          required
          variant="standard"
          onChange={(e) => setDescription(e.target.value.toUpperCase())}
          label={"Nombre de Cuenta"}
          value={description}
          disabled={!isEdit}
        />

        <FormControl
          variant="standard"
          fullWidth
          style={{ marginRight: 20, marginTop: 20 }}
          required
          disabled={!isEdit}
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

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            style={{
              borderRadius: 20,
              borderColor: isEdit ? "#9c27b0" : "#ff9800",
              color: isEdit ? "#9c27b0" : "#ff9800",
              marginRight: 10,
            }}
            startIcon={
              <FontAwesomeIcon icon={isEdit ? faCircleXmark : faPenToSquare} />
            }
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? "Cancelar" : " Editar Cuenta"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            style={{ borderRadius: 20, marginLeft: 10 }}
            startIcon={<FontAwesomeIcon icon={faSave} />}
            onClick={() => saveChangesAsync()}
            disabled={!isEdit}
          >
            Editar cuenta
          </Button>
        </div>
      </Paper>
    </div>
  );
};
