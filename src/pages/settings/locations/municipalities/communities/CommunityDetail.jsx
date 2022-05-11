import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Divider,
  Container,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../../../helpers/Helpers";
import {
  faPenToSquare,
  faSave,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataContext } from "../../../../../context/DataContext";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../../../services/Account";
import { updateCommunityAsync } from "../../../../../services/CommunitiesApi";

const CommunityDetail = ({ selectedCommunity, setShowModal }) => {
  const { id, name } = selectedCommunity;
  let navigate = useNavigate();
  const { setIsLoading, reload, setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);

  const [isEdit, setIsEdit] = useState(false);
  const [newName, setNewName] = useState(name);

  const token = getToken();

  const saveChangesAsync = async () => {
    const data = {
      id,
      name: newName,
    };
    if (name === newName) {
      toastError("Ingrese un nombre diferente...");
      return;
    }
    const result = await updateCommunityAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error.request.status === 401) {
        navigate("/unauthorized");
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
      toastError("Comunidad no encontrada");
      return;
    }

    setReload(!reload);
    setIsLoading(false);
    toastSuccess("Cambio realizado...!");
    setIsEdit(false);
    setShowModal(false);
  };

  return (
    <div>
      <Container style={{ width: 450 }}>
        <Divider />

        <TextField
          fullWidth
          style={{ marginTop: 20 }}
          variant="standard"
          onChange={(e) => setNewName(e.target.value.toUpperCase())}
          value={newName}
          label={"Nombre Comunidad"}
          disabled={!isEdit}
          placeholder={"Ingrese Nuevo Nombre"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={"editar"}>
                  <IconButton
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      setNewName(isEdit ? name : "");
                      setIsEdit(!isEdit);
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ color: "#ff5722" }}
                      icon={isEdit ? faXmarkCircle : faPenToSquare}
                    />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 10 }}
          startIcon={<FontAwesomeIcon icon={faSave} />}
          onClick={() => saveChangesAsync()}
          disabled={!isEdit}
        >
          Guardar cambios
        </Button>
      </Container>
    </div>
  );
};

export default CommunityDetail;
