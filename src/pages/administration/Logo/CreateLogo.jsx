import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { getToken, deleteUserData, deleteToken } from "../../../services/Account";
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import { CreateLogoAsync, UpdateLogoAsync, getLogoByStoreIdAsync } from "../../../services/CreateLogoApi";

const LogoCreate = ({ setShowModal }) => {
  const { setIsLoading, setIsLogged, setIsDefaultPass, reload, setReload } = useContext(DataContext);
  const [selectedStore, setSelectedStore] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ruc, setRuc] = useState("");
  const [telefono, setTelefono] = useState("+505");
  const [telefonow, setTelefonow] = useState("+505");
  const [logo, setLogo] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [showModalSave, setShowModalSave] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);

  let navigate = useNavigate();
  const token = getToken();
  let ruta = getRuta();

  const getLogo = async (storeId) => {
    setIsLoading(true);
    // alert(`Store ID Selected1: ${storeId}`); 
    const result = await getLogoByStoreIdAsync(token, storeId);
    setIsLoading(false);

    if (!result.statusResponse) {
      if (result.error?.request?.status === 401) {
        navigate(`${ruta}/No autorizado`);
        return null;
      }
      return null;
    }

    if (result.data === "eX01") {
      deleteUserData();
      deleteToken();
      setIsLogged(false);
      return null;
    }

    if (result.data.isDefaultPass) {
      setIsDefaultPass(true);
      return null;
    }

    if (!result.data) {
      clearFields();
      setHasExistingRecord(false);
      return null;
    }

    setDireccion(result.data.direccion || "");
    setRuc(result.data.ruc || "");
    setTelefono(result.data.telefono || "+505");
    setTelefonow(result.data.telefonoWhatsApp || "+505");
    // setLogo(result.data.imagenUrl ? result.data.imagenUrl : null);
    if (result.data.imagenUrl) {
      setLogo(result.data.imagenUrl);
      setPreviewLogo(result.data.imagenUrl);
      console.log('Setting image URL:', result.data.imagenUrl);
    } else {
      setLogo(null);
      setPreviewLogo(null);
      console.log('No image URL found');
    }
    setIsEditing(false);
    setHasExistingRecord(true);
    // setPreviewLogo(result.data.imagenUrl ? result.data.imagenUrl : null);
    // alert(`Store ID Selected1: ${storeId}`); 

    return result.data;
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const prefix = '+505';
    const phoneNumber = cleaned.substring(3);
    const part1 = phoneNumber.substring(0, 4);
    const part2 = phoneNumber.substring(4, 8);
    let formattedNumber = `${prefix}`;
    if (part1) formattedNumber += `${part1}`;
    if (part2) formattedNumber += `${part2}`;
    return formattedNumber;
  };

  const handleTelef = (event) => {
    const value = event.target.value;
    if (/^\+?(\d{1,3})?[\s\d]*$/.test(value)) {
      setTelefono(formatPhoneNumber(value));
    }
  };

  const handleTelefw = (event) => {
    const value = event.target.value;
    if (/^\+?(\d{1,3})?[\s\d]*$/.test(value)) {
      setTelefonow(formatPhoneNumber(value));
    }
  };

  const FormatRuc = (value) => {
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 14);
  };

  const handleRuc = (event) => {
    const value = event.target.value;
    setRuc(FormatRuc(value));
  };

  const clearFields = () => {
    setDireccion("");
    setRuc("");
    setTelefono("+505");
    setTelefonow("+505");
    setLogo(null);
    setSelectedFile(null);
    setIsFileSelected(false);
    setIsEditing(false);
    setPreviewLogo(null); // Limpiar el preview del logo al limpiar los campos
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setLogo(URL.createObjectURL(file)); // Mostrar el nuevo logo seleccionado
    setPreviewLogo(URL.createObjectURL(file)); // Mostrar preview del nuevo logo seleccionado
    setIsFileSelected(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
};

  const handleStoreChange = async (event) => {
    const storeId = Number(event.target.value);
    // alert(`Store ID Selected 2: ${storeId}`); 
  
    setSelectedStore(storeId);
  
    if (storeId) {
      const logoData = await getLogo(storeId);
      if (logoData) {
        setDireccion(logoData.direccion || "");
        setRuc(logoData.ruc || "");
        setTelefono(logoData.telefono || "+505");
        setTelefonow(logoData.telefonoWhatsApp || "+505");
        setLogo(logoData.imagenUrl ? logoData.imagenUrl : null);
        setIsEditing(false);
        setHasExistingRecord(true);
        setPreviewLogo(logoData.imagenUrl ? logoData.imagenUrl : null);
      } else {
        setHasExistingRecord(false);
        clearFields();
      }
    } else {
      clearFields();
    }
  };
  
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStore = await getStoresByUserAsync(token);
      setIsLoading(false);
      if (!resultStore.statusResponse) {
        if (resultStore.error?.request?.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultStore.error?.message);
        return;
      }

      if (resultStore.data === "eX01") {
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultStore.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }

      setStoreList(resultStore.data);
    })();
  }, [token, navigate, ruta, setIsLoading, setIsLogged, setIsDefaultPass]);

  const CreateLogoAdd = async () => {
    if (!selectedStore) {
      toastError("Debe seleccionar un almacén");
      return;
    }

    if (validate()) {
      const data = new FormData();
      data.append("Imagen", selectedFile);
      data.append("Direccion", direccion);
      data.append("Ruc", ruc);
      data.append("Telefono", telefono);
      data.append("TelefonoWhatsApp", telefonow);
      data.append("StoreId", selectedStore);

      // setIsLoading(true);
      // const result = await CreateLogoAsync(token, data);
      // setIsLoading(false);

      setIsLoading(true);

      let result;
      if (hasExistingRecord) {
        result = await UpdateLogoAsync(token, data);
      } else {
        result = await CreateLogoAsync(token, data);
      }
  
      setIsLoading(false);

      if (!result.statusResponse) {
        if (result.error?.request?.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error?.message);
        return;
      }

      if (result.data === "eX01") {
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (result.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }

      toastSuccess(result.data);
      clearFields();
      setSelectedStore("");
      setReload(!reload);
      setShowModal(false);
      toastSuccess("Exito...!", "success");
    }
  };

  const validate = () => {
    let isValid = true;

    if (!isFileSelected) {
      toastError("Debe seleccionar un archivo");
      isValid = false;
    }

    if (isEmpty(direccion)) {
      toastError("Debe ingresar una dirección");
      isValid = false;
    }

    if (isEmpty(ruc)) {
      toastError("Debe ingresar un número RUC");
      isValid = false;
    }

    if (telefono.length < 9) {
      toastError("Debe ingresar un número de teléfono válido");
      isValid = false;
    }

    if (telefonow.length < 9) {
      toastError("Debe ingresar un número de WhatsApp válido");
      isValid = false;
    }

    if (!selectedStore) {
      toastError("Debe seleccionar un almacén");
      isValid = false;
    }

    return isValid;
  };

  return (
    <Container>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" align="left" gutterBottom>
            Crear Logo
          </Typography>
        </div>

        <hr />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} style={{ display: "flex", alignItems: "center" }}>
            <Paper
              elevation={3}
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("fileInput").click()}
              disabled={hasExistingRecord && !isEditing}
            >
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Logo"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    Click para seleccionar un logo
                  </Typography>
                </div>
              )}
            </Paper>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div style={{ textAlign: "center", marginTop: 10 }}>
              {isFileSelected && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "orange", marginRight: 10 }}
                    onClick={CreateLogoAdd}
                  >
                    Subir
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setSelectedFile(null);
                      setIsFileSelected(false);
                      setLogo(null);
                      setPreviewLogo(null);
                    }}
                  >
                    Remover
                  </Button>
                </>
              )}
              {hasExistingRecord && (
                <IconButton variant="contained" onClick={() => setIsEditing(true)}>
                  <FontAwesomeIcon icon={faEdit} />
                </IconButton>
              )}
              {/* <IconButton
                style={{ alignSelf: "center" }}
                color="primary"
                onClick={() => setShowModalSave(true)}
                aria-label="save"
              >
                <FontAwesomeIcon icon={faSave} />
              </IconButton>
              <IconButton color="secondary" onClick={clearFields}>
                <FontAwesomeIcon icon={faTrash} />
              </IconButton> */}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth style={{ marginBottom: 20 }}>
              <InputLabel>Seleccionar Almacén</InputLabel>
              <Select value={selectedStore} onChange={handleStoreChange}>
                <MenuItem value="">Seleccionar...</MenuItem>
                {storeList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Dirección"
              placeholder="Ingrese su Dirección"
              fullWidth
              multiline
              rows={4}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              disabled={hasExistingRecord && !isEditing}
              style={{ marginBottom: 20 }}
            />
            <TextField
              label="Teléfono"
              placeholder="Ingrese el Número de Teléfono"
              fullWidth
              value={telefono}
              onChange={handleTelef}
              disabled={hasExistingRecord && !isEditing}
              style={{ marginBottom: 20 }}
            />
            <TextField
              label="Whatsapp"
              placeholder="Ingrese el Número registrado en Whatsapp"
              fullWidth
              value={telefonow}
              onChange={handleTelefw}
              disabled={hasExistingRecord && !isEditing}
              style={{ marginBottom: 20 }}
            />
            <TextField
              label="RUC"
              placeholder="Ingrese su Número RUC"
              fullWidth
              value={ruc}
              onChange={handleRuc}
              disabled={hasExistingRecord && !isEditing}
              style={{ marginBottom: 20 }}
            />
            <div style={{ textAlign: "center", marginTop: 20 }}>
            {hasExistingRecord && isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowModalSave(true)}
                  style={{ marginRight: 10 }}
                >
                  Guardar
                </Button>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={clearFields}
                style={{ marginLeft: 10 }}
              >
                Cancelar
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={showModalSave}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de guardar los cambios?</p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              CreateLogoAdd();
              setShowModalSave(false);
            }}
          >
            Confirmar
          </Button>
          <Button variant="contained" onClick={() => setShowModalSave(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LogoCreate;
