import React, { useState, useEffect, useContext } from "react";
import { TextField, Button, Divider, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import {
  getProviderByIdAsync,
  updateProviderAsync,
} from "../../../services/ProviderApi";
import {
  faCircleXmark,
  faPenToSquare,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProviderDetails = ({ selectedProvider, setShowModal }) => {
  let ruta = getRuta();

  const { setIsLoading, reload, setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const token = getToken();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getProviderByIdAsync(token, selectedProvider.id);
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
      setName(result.data.nombre);
      setAddress(result.data.address);
      setPhone(result.data.phone);
      setEmail(result.data.email);
    })();
  }, []);

  const saveChangesAsync = async () => {
    const data = {
      id: selectedProvider.id,
      nombre: name,
      address: address,
      phone: phone,
      email: email,
    };
    if (name === "") {
      toastError("Ingrese un nombre...");
      return;
    }

    if (address === "") {
      toastError("Ingrese una direccion...");
      return;
    }

    if (phone === "") {
      toastError("Ingrese un telefono...");
      return;
    }
    setIsLoading(true);
    const result = await updateProviderAsync(token, data);
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
    toastSuccess("cambios realizados");
    setIsEdit(false);
    setShowModal(false);
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
        <Container style={{ width: 550 }}>
          <TextField
            fullWidth
            required
            style={{ marginBottom: 10, marginTop: 20 }}
            variant="standard"
            onChange={(e) => setName(e.target.value.toUpperCase())}
            label={"Nombre Proveedor"}
            value={name}
            disabled={!isEdit}
          />

          <TextField
            fullWidth
            required
            style={{ marginBottom: 10, marginTop: 20 }}
            variant="standard"
            type="tel"
            onChange={(e) => setPhone(e.target.value)}
            label={"Telefono Proveedor"}
            value={phone}
            disabled={!isEdit}
          />

          <TextField
            fullWidth
            required
            style={{ marginBottom: 10, marginTop: 20 }}
            variant="standard"
            type="email"
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            label={"Correo Proveedor"}
            value={email}
            disabled={!isEdit}
          />

          <TextField
            fullWidth
            required
            style={{ marginBottom: 10, marginTop: 20 }}
            variant="standard"
            onChange={(e) => setAddress(e.target.value.toUpperCase())}
            label={"Direccion Proveedor"}
            value={address}
            disabled={!isEdit}
          />

          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              style={{
                borderRadius: 20,
                borderColor: isEdit ? "#9c27b0" : "#ff9800",
                color: isEdit ? "#9c27b0" : "#ff9800",
                marginRight: 10,
              }}
              startIcon={
                <FontAwesomeIcon
                  icon={isEdit ? faCircleXmark : faPenToSquare}
                />
              }
              onClick={() => setIsEdit(!isEdit)}
            >
              {isEdit ? "Cancelar" : " Editar Proveedor"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              style={{ borderRadius: 20, marginLeft: 10 }}
              startIcon={<FontAwesomeIcon icon={faSave} />}
              onClick={() => saveChangesAsync()}
              disabled={!isEdit}
            >
              Actualizar Proveedor
            </Button>
          </div>
        </Container>
      </Paper>
    </div>
  );
};

export default ProviderDetails;
