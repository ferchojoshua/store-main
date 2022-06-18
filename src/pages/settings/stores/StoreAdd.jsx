import React, { useState, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import { addStoreAsync } from "../../../services/AlmacenApi";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Divider, Container } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";

const StoreAdd = ({ setShowModal }) => {
  let ruta = getRuta();

  const { setIsLoading, reload, setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  const [name, setName] = useState("");
  const token = getToken();
  let navigate = useNavigate();

  const saveChangesAsync = async () => {
    setIsLoading(true);
    const data = {
      name: name,
    };
    if (name === "") {
      setIsLoading(false);
      toastError("Debe ingresar un nombre...");
      return;
    }
    const result = await addStoreAsync(token, data);

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
    toastSuccess("Almacen creado");
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <div>
      <Container style={{ width: 500 }}>
        <Divider />
        <TextField
          fullWidth
          required
          style={{ marginBottom: 10, marginTop: 20 }}
          variant="standard"
          onChange={(e) => setName(e.target.value.toUpperCase())}
          label={"Nombre almacen"}
          value={name}
        />
        <Button
          fullWidth
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 10 }}
          startIcon={<FontAwesomeIcon icon={faSave} />}
          onClick={() => saveChangesAsync()}
        >
          Agregar Almacen
        </Button>
      </Container>
    </div>
  );
};

export default StoreAdd;
