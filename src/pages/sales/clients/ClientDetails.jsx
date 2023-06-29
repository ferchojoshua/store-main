import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Container,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
  validateCedula,
} from "../../../helpers/Helpers";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";

import {
  faCirclePlus,
  faSave,
  faCircleXmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getCommunitiesByMunAsync,
  getDepartmentListAsync,
  getMunicipalitiesByDeptoAsync,
} from "../../../services/CommunitiesApi";
import { isEmpty } from "lodash";
import {
  getClientByIdAsync,
  updateClientAsync,
} from "../../../services/ClientsApi";

const ClientDetails = ({ selectedClient, setShowModal }) => {
  let ruta = getRuta();

  const {
    setIsLoading,
    reload,
    setReload,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
  let navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);

  const token = getToken();

  const [nombreCliente, setNombreCliente] = useState("");
  const [cedula, setCedula] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [creditLimit, setCreditLimit] = useState("");

  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [municipalityList, setMunicipalityList] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const [CommunityList, setCommunityList] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getDepartmentListAsync(token);
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
      setDepartmentList(result.data);

      const resultClient = await getClientByIdAsync(token, selectedClient.id);
      if (!resultClient.statusResponse) {
        setIsLoading(false);
        if (resultClient.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultClient.error.message);
        return;
      }

      if (resultClient.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultClient.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setNombreCliente(resultClient.data.nombreCliente);
      setCedula(resultClient.data.cedula);
      setTelefono(resultClient.data.telefono);
      setCorreo(resultClient.data.correo);
      setSelectedDepartment(
        resultClient.data.community.municipality.department.id
      );

      setCreditLimit(resultClient.data.limiteCredito);

      //Definiendo el municipio seleccionado
      const resultMunicipality = await getMunicipalitiesByDeptoAsync(
        token,
        resultClient.data.community.municipality.department.id
      );
      if (!resultMunicipality.statusResponse) {
        setIsLoading(false);
        if (resultMunicipality.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultMunicipality.error.message);
        return;
      }

      if (resultMunicipality.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultMunicipality.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setMunicipalityList(resultMunicipality.data);
      setSelectedMunicipality(resultClient.data.community.municipality.id);

      //Definiendo la comunidad seleccionada
      const resulCommunity = await getCommunitiesByMunAsync(
        token,
        resultClient.data.community.municipality.id
      );

      if (!resulCommunity.statusResponse) {
        setIsLoading(false);
        if (resulCommunity.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resulCommunity.error.message);
        return;
      }

      if (resulCommunity.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resulCommunity.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setCommunityList(resulCommunity.data);
      setSelectedCommunity(resultClient.data.community.id);
      setIsLoading(false);
      setDireccion(resultClient.data.direccion);
    })();
  }, []);

  const saveChangesAsync = async () => {
    if (validate()) {
      const data = {
        id: selectedClient.id,
        nombreCliente,
        cedula,
        correo,
        telefono,
        idCommunity: selectedCommunity,
        direccion,
        creditLimit: creditLimit === "" ? 0 : creditLimit,
      };

      setIsLoading(true);

      const result = await updateClientAsync(token, data);
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

      if (!result.data) {
        setIsLoading(false);
        toastError("Cliente no encontrado...!");
        return;
      }

      setIsLoading(false);
      setReload(!reload);
      toastSuccess("Datos de Cliente Actualizado...");
      setShowModal(false);
    }
  };

  //Validando campos ingresados
  const validate = () => {
    let isValid = true;
    if (isEmpty(nombreCliente)) {
      toastError("Debe ingresar un nombre");
      return (isValid = false);
    }

    if (isEmpty(cedula)) {
      toastError("Debe ingresar una cedula");
      return (isValid = false);
    }

    if (!validateCedula(cedula)) {
      toastError("Debe ingresar una cedula valida");
      return (isValid = false);
    }

    if (isEmpty(telefono)) {
      toastError("Debe ingresar un numero telefonico");
      return (isValid = false);
    }

    if (selectedCommunity === "" || selectedCommunity === null) {
      toastError("Debe seleccionar una comunidad");
      return (isValid = false);
    }

    if (isEmpty(direccion)) {
      toastError("Debe ingresar direccion del cliente");
      return (isValid = false);
    }

    return isValid;
  };

  const handleChangeDepartment = async (event) => {
    setMunicipalityList([]);
    setCommunityList([]);
    setSelectedDepartment(event.target.value);
    setSelectedMunicipality("");
    setSelectedCommunity("");
    if (event.target.value !== "") {
      setIsLoading(true);
      const result = await getMunicipalitiesByDeptoAsync(
        token,
        event.target.value
      );
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
      setMunicipalityList(result.data);
    } else {
      setMunicipalityList([]);
    }
  };

  const handleChangeMunicipality = async (event) => {
    setCommunityList([]);
    setSelectedMunicipality(event.target.value);

    if (event.target.value !== "") {
      setIsLoading(true);
      const result = await getCommunitiesByMunAsync(token, event.target.value);
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
      setCommunityList(result.data);
    } else {
      setCommunityList([]);
    }
  };

  const montoMaximo = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString()) || value === "") {
      setCreditLimit(value);
      return;
    }
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
        <Container>
          <Grid container spacing={3}>
            <Grid item sm={6}>
              <TextField
                fullWidth
                required
                variant="standard"
                onChange={(e) => setNombreCliente(e.target.value.toUpperCase())}
                label={"Nombre Cliente"}
                value={nombreCliente}
                disabled={!isEdit}
              />

              <TextField
                style={{ marginTop: 20 }}
                fullWidth
                required
                variant="standard"
                onChange={(e) => setCedula(e.target.value.toUpperCase())}
                label={"Cedula Cliente(000-000000-0000X)"}
                value={cedula}
                disabled={!isEdit}
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                fullWidth
                required
                variant="standard"
                onChange={(e) => setTelefono(e.target.value.toUpperCase())}
                label={"Telefono Cliente"}
                value={telefono}
                disabled={!isEdit}
              />

              <TextField
                style={{ marginTop: 20 }}
                fullWidth
                required
                variant="standard"
                onChange={(e) => setCorreo(e.target.value.toLowerCase())}
                label={"Correo Cliente"}
                value={correo}
                disabled={!isEdit}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item sm={4}>
              <FormControl
                variant="standard"
                fullWidth
                style={{ marginRight: 20, marginTop: 20 }}
                required
                disabled={!isEdit}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione una Departamento
                </InputLabel>
                <Select
                  defaultValue=""
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedDepartment}
                  onChange={handleChangeDepartment}
                  label="Departamento"
                  style={{ textAlign: "left" }}
                >
                  <MenuItem key={-1} value="">
                    <em> Seleccione un departamento</em>
                  </MenuItem>
                  {departmentList.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={4}>
              <FormControl
                variant="standard"
                fullWidth
                style={{ marginRight: 20, marginTop: 20 }}
                required
                disabled={!isEdit}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione un Municipio
                </InputLabel>
                <Select
                  defaultValue=""
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedMunicipality}
                  onChange={handleChangeMunicipality}
                  label="Municipio"
                  style={{ textAlign: "left" }}
                >
                  <MenuItem key={-1} value="">
                    <em> Seleccione un municipio</em>
                  </MenuItem>
                  {municipalityList.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={4}>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginRight: 20 }}
                  required
                  disabled={!isEdit}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Seleccione una Comunidad
                  </InputLabel>
                  <Select
                    defaultValue=""
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    label="Municipio"
                    style={{ textAlign: "left" }}
                  >
                    <MenuItem key={-1} value="">
                      <em> Seleccione una Comunidad</em>
                    </MenuItem>
                    {CommunityList.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {isEdit ? (
                  <Tooltip title="Agregar Comunidad" style={{ marginTop: 5 }}>
                    <IconButton
                      disabled={!isEdit}
                      onClick={() => {
                        selectedMunicipality
                          ? setShowAddModal(!showAddModal)
                          : toastError("Seleccione un municipio");
                      }}
                    >
                      <FontAwesomeIcon
                        style={{
                          fontSize: 25,
                          color: "#ff5722",
                        }}
                        icon={faCirclePlus}
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item sm={6}>
              <TextField
                style={{ marginTop: 20 }}
                fullWidth
                required
                variant="standard"
                onChange={(e) => setDireccion(e.target.value.toUpperCase())}
                label={"Direccion Cliente"}
                value={direccion}
                disabled={!isEdit}
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                style={{ marginTop: 20 }}
                fullWidth
                required
                variant="standard"
                onChange={(e) => montoMaximo(e.target.value)}
                label={"Limite de Credito"}
                value={creditLimit}
                disabled={!isEdit}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">C$</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {isAccess(access, "CLIENTS UPDATE") ? (
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
                {isEdit ? "Cancelar" : " Editar Cliente"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                style={{ borderRadius: 20, marginLeft: 10 }}
                startIcon={<FontAwesomeIcon icon={faSave} />}
                onClick={() => saveChangesAsync()}
                disabled={!isEdit}
              >
                Actualizar Cliente
              </Button>
            </div>
          ) : (
            <></>
          )}
        </Container>
      </Paper>
    </div>
  );
};

export default ClientDetails;
