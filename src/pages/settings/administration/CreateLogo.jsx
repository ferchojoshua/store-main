import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faEdit,faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { getToken, deleteUserData, deleteToken } from "../../../services/Account";
import { Button, Container, FormControl, Grid, InputLabel, Paper, Select, TextField, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { isEmpty } from "lodash";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import { CreateLogoAsync, getLogoByStoreIdAsync } from "../../../services/CreateLogoApi";

const LogoCreate = ({ setShowModal }) => {
  const { setIsLoading, setIsLogged, setIsDefaultPass, reload, setReload } = useContext(DataContext);
  const [showModalSave, setShowModalSave] = useState(false);
  const [selectedStore, setSelectedStore] = useState(""); // Inicializado como cadena vacía
  const [direccion, setDireccion] = useState("");
  const [ruc, setRuc] = useState("");
  const [telefono, setTelefono] = useState("+505");
  const [telefonow, setTelefonow] = useState("+505");
  const [logo, setLogo] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  let navigate = useNavigate();
  const token = getToken();
  let ruta = getRuta();

  

  // Función para obtener los datos del logo por ID de almacén
  const getLogo = async (storeId) => {
    setIsLoading(true);
    const result = await getLogoByStoreIdAsync(token, storeId); 
    setIsLoading(false);
  
    if (!result.statusResponse) { 
      if (result.error?.request?.status === 401) {
        navigate(`${ruta}/No autorizado`);
        return null;
      }
      // No mostrar mensaje de error si no se encuentra el registro
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
      clearFields();  // Limpia los campos de texto y resetea la imagen seleccionada
      return null;    // Retorna null para indicar que no se encontraron datos
    }
  
    setDireccion(result.data.direccion || "");
    setRuc(result.data.ruc || "");
    setTelefono(result.data.telefono || "+505");
    setTelefonow(result.data.telefonoWhatsApp || "+505");
    setLogo(result.data.imagenUrl ? result.data.imagenUrl : null);
  
    return result.data; 
  };

  // Función para formatear número de teléfono
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const prefix = '+505';
    const phoneNumber = cleaned.substring(3);
    const part1 = phoneNumber.substring(0, 4);
    const part2 = phoneNumber.substring(4, 8);
    let formattedNumber = `${prefix}`;
    if (part1) formattedNumber += ` ${part1}`;
    if (part2) formattedNumber += ` ${part2}`;
    return formattedNumber;
  };

  // Manejador para el campo de teléfono
  const handleTelef = (event) => {
    const value = event.target.value;
    if (/^\+?(\d{1,3})?[\s\d]*$/.test(value)) {
      setTelefono(formatPhoneNumber(value));
    }
  };

  // Manejador para el campo de WhatsApp
  const handleTelefw = (event) => {
    const value = event.target.value;
    if (/^\+?(\d{1,3})?[\s\d]*$/.test(value)) {
      setTelefonow(formatPhoneNumber(value));
    }
  };

  // Función para formatear RUC
  const FormatRuc = (value) => {
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 14);
  };

  // Manejador para el campo de RUC
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
  };

  // Manejador para el cambio de archivo seleccionado
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setLogo(URL.createObjectURL(file));
    setIsFileSelected(true);
  };

  // Abrir modal para seleccionar archivo
  const openFileModal = () => {
    setSelectedFile(null);
    setLogo(null);
    setIsFileSelected(false);
    setShowFileModal(true);
  };

const handleStoreChange = async (event) => {
  const storeId = event.target.value;
  setSelectedStore(storeId);

  if (storeId) {
    const logoData = await getLogo(storeId);
    if (logoData) {
      setDireccion(logoData.direccion || "");
      setRuc(logoData.ruc || "");
      setTelefono(logoData.telefono || "+505");
      setTelefonow(logoData.telefonoWhatsApp || "+505");
      setLogo(logoData.imagenUrl ? logoData.imagenUrl : null);
    } else {
      
    }
  } else {
    clearFields();
  }
};

  // Obtener lista de almacenes al cargar el componente
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
        toastError(resultStore.error?.message || "An unexpected error occurred");
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
    if (!selectedStore){
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
  
      setIsLoading(true);
      const result = await CreateLogoAsync(token, data);
      setIsLoading(false);
      if (!result.statusResponse) {
        if (result.error?.request?.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error?.message || "An unexpected error occurred");
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
  
      toastSuccess("Logo creado con éxito");
      clearFields();
      setSelectedStore("");
      setReload(!reload);
      setShowModal(false);
    }
  };

  // Validar los campos del formulario antes de crear el logo
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

    if (isEmpty(telefono) || telefono.length < 9) {
      toastError("Debe ingresar un número de teléfono válido");
      isValid = false;
    }

    if (isEmpty(telefonow) || telefonow.length < 9) {
      toastError("Debe ingresar un número de WhatsApp válido");
      isValid = false;
    }

    if  (!selectedStore) {
      toastError("Debe seleccionar un almacén");
      isValid = false;
    }

    return isValid;
  };

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: 20, marginBottom: 20 }}>
      <Paper elevation={3} style={{ padding: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Almacén</InputLabel>
              <Select
                value={selectedStore}
                onChange={handleStoreChange}
              >
                <MenuItem value="">Seleccionar...</MenuItem>
                {storeList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            {selectedFile && (
              <div>
                <p>{selectedFile.name}</p>
              </div>
            )}
            <IconButton variant="contained" onClick={openFileModal}>
              <FontAwesomeIcon icon={faFileUpload} />
            </IconButton>
            <IconButton variant="contained" color="primary" onClick={() => setShowModalSave(true)}>
              <FontAwesomeIcon icon={faSave} />
            </IconButton>
            <IconButton color="secondary" onClick={clearFields}>
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              placeholder="Ingrese su Dirección"
              fullWidth
              multiline
              rows={4}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              disabled={!!logo} 
              style={{ marginBottom: 20 }}
            />
            <TextField
              label="Teléfono"
              placeholder="Ingrese el Número de Teléfono"
              fullWidth
              value={telefono}
              onChange={handleTelef}
              disabled={!!logo} 
              style={{ marginBottom: 20 }}
            />
            <TextField
              label="Whatsapp"
              placeholder="Ingrese el Número registrado en Whatsapp"
              fullWidth
              value={telefonow}
              onChange={handleTelefw}
              disabled={!!logo} 
              style={{ marginBottom: 20 }}
            />
            <TextField
              label="RUC"
              placeholder="Ingrese su Número RUC"
              fullWidth
              value={ruc}
              onChange={handleRuc}
              disabled={!!logo}
              style={{ marginBottom: 20 }}
            />
          </Grid>
        </Grid>
      </Paper>
      <Dialog open={showModalSave}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de guardar los cambios?</p>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => { CreateLogoAdd(); setShowModalSave(false); }}>
            Confirmar
          </Button>
          <Button variant="contained" onClick={() => setShowModalSave(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showFileModal} onClose={() => setShowFileModal(false)}>
        <DialogTitle>Seleccionar Archivo</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <div>
              <p>Nombre del archivo: {selectedFile.name}</p>
              <img src={logo} alt="Vista previa" style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 10 }} />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setShowFileModal(false)}>
            Guardar
          </Button>
          <Button variant="contained" onClick={() => setShowFileModal(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LogoCreate;
