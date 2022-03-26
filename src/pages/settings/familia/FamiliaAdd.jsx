import React, { useState, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import { TextField, Button, Divider, Container } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../../services/Account";
import { addFamiliaToTipoNegocioAsync } from "../../../services/TipoNegocioApi";

const FamiliaAdd = ({ setShowModal, idTN }) => {
  const { reload, setReload, setIsLoading } = useContext(DataContext);
  let navigate = useNavigate();
  const [description, setDescription] = useState("");
  const token = getToken();

  const saveChangesAsync = async () => {
    const data = {
      idTipoNegocio: idTN,
      description: description,
    };
   
    if (description === "") {
      toastError("Ingrese una descripcion...");
      return;
    }
    setIsLoading(true);
    const result = await addFamiliaToTipoNegocioAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error.request.status === 401) {
        navigate("/unauthorized");
        return;
      }
      toastError("No se pudo agregar familia, intente de nuevo");
      return;
    }
    setIsLoading(false);
    toastSuccess("Familia Agregada...!");
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
          onChange={(e) => setDescription(e.target.value.toUpperCase())}
          label={"Descripcion"}
          value={description}
        />

        <Button
          fullWidth
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 25 }}
          onClick={() => saveChangesAsync()}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          Agregar Familia
        </Button>
      </Container>
    </div>
  );
};

export default FamiliaAdd;
