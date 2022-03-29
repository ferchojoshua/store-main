import React, { useState, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { TextField, Button, Divider, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import { addProviderAsync } from "../../../services/ProviderApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";

const ProviderAdd = ({ setShowModal }) => {
  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const token = getToken();

  const saveChangesAsync = async () => {
    const data = {
      nombre: name,
      address,
      phone,
      email,
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

    const result = await addProviderAsync(token, data);
    setIsLoading(true);
    if (!result.statusResponse) {
      if (result.error.request.status === 401) {
        setIsLoading(false);
        navigate("/unauthorized");
        return;
      }
      toastError("No se pudo guardar, intentelo de nuevo");
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
      setIsDefaultPass(true);
      return;
    }

    setIsLoading(false);
    toastSuccess("Proveedor agregado");
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <div>
      <Container style={{ width: 550 }}>
        <Divider />

        <TextField
          fullWidth
          required
          style={{ marginBottom: 10, marginTop: 20 }}
          variant="standard"
          onChange={(e) => setName(e.target.value.toUpperCase())}
          label={"Nombre Proveedor"}
          value={name}
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
        />

        <TextField
          fullWidth
          required
          style={{ marginBottom: 10, marginTop: 20 }}
          variant="standard"
          onChange={(e) => setAddress(e.target.value.toUpperCase())}
          label={"Direccion Proveedor"}
          value={address}
        />

        <Button
          fullWidth
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 25 }}
          onClick={() => saveChangesAsync()}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          Agregar Proveedor
        </Button>
      </Container>
    </div>
  );
};

export default ProviderAdd;
