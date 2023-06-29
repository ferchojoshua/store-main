import React, { useState, useContext } from "react";
import { TextField, Button, Divider, Container } from "@mui/material";
import { useParams } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../../helpers/Helpers";
import { addRackToStoreAsync } from "../../../../services/AlmacenApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../../../context/DataContext";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { useNavigate } from "react-router-dom";

const RackAdd = ({ setShowModal }) => {
  let ruta = getRuta();

  const { setIsLoading, reload, setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  const { id } = useParams();
  const [description, setDescription] = useState("");
  const token = getToken();
  let navigate = useNavigate();

  const saveChangesAsync = async () => {
    setIsLoading(true);
    const data = {
      almacenId: id,
      description: description,
    };
    if (description === "") {
      setIsLoading(false);
      toastError("Debe ingresar un nombre...");
      return;
    }
    const result = await addRackToStoreAsync(token, data);
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
    setReload(!reload);
    setShowModal(false);
    toastSuccess("Rack creado");
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
          onChange={(e) => setDescription(e.target.value.toUpperCase())}
          label={"Nombre rack"}
          value={description}
        />

        <Button
          fullWidth
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 10 }}
          startIcon={<FontAwesomeIcon icon={faSave} />}
          onClick={() => saveChangesAsync()}
        >
          Agregar Rack
        </Button>
      </Container>
    </div>
  );
};

export default RackAdd;
