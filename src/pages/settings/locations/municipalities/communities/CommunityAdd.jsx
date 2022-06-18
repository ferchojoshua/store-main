import React, { useState, useContext } from "react";
import { DataContext } from "../../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../../../helpers/Helpers";
import { TextField, Button, Divider, Container } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../../../services/Account";
import { addCommunityAsync } from "../../../../../services/CommunitiesApi";

const CommunityAdd = ({ setShowModal, idMunicipality }) => {
  let ruta = getRuta();

  const { reload, setReload, setIsLoading, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const token = getToken();

  const saveChangesAsync = async () => {
    const data = {
      idMunicipality,
      name,
    };

    if (name === "") {
      toastError("Ingrese un nombre...");
      return;
    }
    setIsLoading(true);
    const result = await addCommunityAsync(token, data);
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
    toastSuccess("Comunidad Agregada...!");
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <div>
      <Container style={{ width: 450 }}>
        <Divider />

        <TextField
          fullWidth
          required
          style={{ marginBottom: 10, marginTop: 20 }}
          variant="standard"
          onChange={(e) => setName(e.target.value.toUpperCase())}
          label={"Nombre Comunidad"}
          value={name}
        />

        <Button
          fullWidth
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 25 }}
          onClick={() => saveChangesAsync()}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          Agregar Comunidad
        </Button>
      </Container>
    </div>
  );
};

export default CommunityAdd;
