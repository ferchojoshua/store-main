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
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import {
  faPenToSquare,
  faSave,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataContext } from "../../../context/DataContext";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";
import {
  getFamiliaByIdAsync,
  updateFamiliaAsync,
} from "../../../services/TipoNegocioApi";

const FamiliaDetails = ({ selectedFamilia, setShowModal }) => {
  let navigate = useNavigate();
  const { setIsLoading, reload, setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  const [familia, setFamilia] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState("");

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getFamiliaByIdAsync(token, selectedFamilia.id);
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

      setIsLoading(false);
      setDescription(result.data.description);
      setFamilia(result.data);
    })();
  }, []);

  const saveChangesAsync = async () => {
    const data = {
      id: selectedFamilia.id,
      description: description,
    };
    if (description === familia.description) {
      toastError("Ingrese una descripcion diferente...");
      return;
    }
    const result = await updateFamiliaAsync(token, data);
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
          onChange={(e) => setDescription(e.target.value.toUpperCase())}
          value={description}
          label={"Descripcion"}
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

export default FamiliaDetails;
