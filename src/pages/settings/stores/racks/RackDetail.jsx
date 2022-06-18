import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Divider,
  Container,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { getRuta, toastError, toastSuccess } from "../../../../helpers/Helpers";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../../services/Account";
import {
  getRackByIdAsync,
  updateRackAsync,
} from "../../../../services/AlmacenApi";
import { DataContext } from "../../../../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSave,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const RackDetail = ({ selectedRack, setShowModal }) => {
  let ruta = getRuta();

  const { setIsLoading, reload, setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  const token = getToken();
  let navigate = useNavigate();

  const [rack, setRack] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getRackByIdAsync(token, selectedRack.id);
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
      setDescription(result.data.description);
      setRack(result.data);
    })();
  }, []);

  const saveChangesAsync = async () => {
    setIsLoading(true);
    const data = {
      id: selectedRack.id,
      description: description,
    };
    if (description === rack.description) {
      setIsLoading(false);
      toastError("Ingrese una descripcion diferente");
      return;
    }
    const result = await updateRackAsync(token, data);
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
    setIsLoading(false);
    toastSuccess("Cambio realizado...!");
    setIsEdit(false);
    setShowModal(false);
  };

  return (
    <div>
      <Container style={{ width: 500 }}>
        <Divider />

        <TextField
          fullWidth
          style={{ marginTop: 20 }}
          variant="standard"
          onChange={(e) => setDescription(e.target.value.toUpperCase())}
          value={description}
          label={"Descripcion rack"}
          disabled={!isEdit}
          placeholder={"Ingrese descripcion"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={"editar"}>
                  <IconButton
                    style={{ marginRight: 10 }}
                    onClick={() => setIsEdit(!isEdit)}
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

export default RackDetail;
