import React, { useState, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import { addTipoNegocioAsync } from "../../../services/TipoNegocioApi";
import { TextField, Button, Divider, Container } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../../services/Account";

const TipoNegocioAdd = ({ setShowModal }) => {
  const { reload, setReload, setIsLoading, setIsDefaultPass } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [description, setDescription] = useState("");
  const token = getToken();

  const saveChangesAsync = async () => {
    const data = {
      description: description,
    };
    if (description === "") {
      toastError("Ingrese una descripcion...");
      return;
    }
    setIsLoading(true);
    const result = await addTipoNegocioAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error.request.status === 401) {
        navigate("/unauthorized");
        return;
      }
      toastError("Ocurrio un error..., Intente de nuevo");
      return;
    }
    if (result.data.isDefaultPass) {
      setIsDefaultPass(true);
      return;
    }
    setIsLoading(false);
    setReload(!reload);
    toastSuccess("Tipo de Negocio Creado");
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
          onChange={(e) => setDescription(e.target.value.toUpperCase())}
          label={"Description"}
          value={description}
        />

        <Button
          fullWidth
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 10 }}
          startIcon={<FontAwesomeIcon icon={faSave} />}
          onClick={() => saveChangesAsync()}
        >
          Agregar Tipo de Negocio
        </Button>
      </Container>
    </div>
  );
};

export default TipoNegocioAdd;
