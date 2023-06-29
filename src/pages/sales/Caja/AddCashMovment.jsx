import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Paper,
  InputAdornment,
} from "@mui/material";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { addCashMovmentByStore } from "../../../services/CashMovmentsApi";

export const AddCashMovment = ({
  setShowOutModal,
  selectedStore,
  isEntrada,
}) => {
  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);

  const [monto, setMonto] = useState("");
  const [description, setDescription] = useState("");

  const token = getToken();
  let ruta = getRuta();
  let navigate = useNavigate();

  const montoMov = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString()) || value === "") {
      setMonto(value);
      return;
    }
  };

  const saveChangesAsync = async () => {
    const data = {
      almacenId: selectedStore,
      monto,
      description,
      isEntrada,
    };

    const result = await addCashMovmentByStore(token, data);

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

    setReload(!reload);
    setShowOutModal(false);
    toastSuccess("Exito...!");
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
          onChange={(e) => setDescription(e.target.value.toUpperCase())}
          label={"Concepto"}
          value={description}
        />
        <TextField
          fullWidth
          style={{ marginTop: 20 }}
          required
          variant="standard"
          onChange={(e) => montoMov(e.target.value)}
          label={"Monto"}
          value={monto}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">C$</InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="outlined"
          style={{
            borderRadius: 20,
            marginTop: 30,
            color: isEntrada ? "#4caf50" : "#f50057",
            borderColor: isEntrada ? "#4caf50" : "#f50057",
          }}
          startIcon={<FontAwesomeIcon icon={faSave} />}
          onClick={() => saveChangesAsync()}
        >
          {isEntrada
            ? "Agregar Entrada de efectivo"
            : "Agregar Salida de efectivo"}
        </Button>
      </Paper>
    </div>
  );
};
