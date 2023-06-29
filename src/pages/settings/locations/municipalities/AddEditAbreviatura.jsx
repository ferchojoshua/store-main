import React, { useState, useContext } from "react";
import {
  Divider,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { DataContext } from "../../../../context/DataContext";
import { updateMunicipalityAsync } from "../../../../services/CommunitiesApi";
import { getRuta, toastError, toastSuccess } from "../../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";

const AddEditAbreviatura = ({ selectedMun, setShowModal }) => {
  const { setIsLoading, reload,setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);

  let ruta = getRuta();
  const token = getToken();
  let navigate = useNavigate();

  const { abreviatura, id, name } = selectedMun;
  const [newAbrev, setNewAbrev] = useState(abreviatura);

  const saveChangesAsync = async () => {
    if (abreviatura === newAbrev) {
      toastError("Ingrese una abreviatura diferente...");
      return;
    }

    const data = {
      id,
      Abreviatura: newAbrev,
    };

    const result = await updateMunicipalityAsync(token, data);
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

    if (result.data === null) {
      setIsLoading(false);
      toastError("Municipio no encontrado");
      return;
    }
    setReload(!reload);
    toastSuccess("Cambio realizado...!");
    setShowModal(false);
  };
  return (
    <div
      style={{
        width: 400,
        textAlign: "center",
      }}
    >
      <Divider />
      <Typography>{`Municipio: ${name}`}</Typography>

      <TextField
        fullWidth
        style={{ marginRight: 20 }}
        variant="standard"
        onChange={(e) => setNewAbrev(e.target.value.toUpperCase())}
        value={newAbrev}
        label={"Abreviatura"}
        placeholder={"Ingrese Abreviatura"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                style={{ marginRight: 10 }}
                onClick={() => saveChangesAsync()}
              >
                <Send style={{ color: "#ff5722" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default AddEditAbreviatura;
