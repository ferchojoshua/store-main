import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  getUserLocation,
  toastError,
  toastSuccess,
  validateCedula,
} from "../../../helpers/Helpers";
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
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faSave } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";
import SmallModal from "../../../components/modals/SmallModal";
import { isEmpty } from "lodash";
import {
  getCommunitiesByMunAsync,
  getDepartmentListAsync,
  getMunicipalitiesByDeptoAsync,
} from "../../../services/CommunitiesApi";
import { addClientAsync } from "../../../services/ClientsApi";
import CommunityAdd from "../../settings/locations/municipalities/communities/CommunityAdd";
import { getStoresAsync } from "../../../services/AlmacenApi";

const AddClient = ({ setShowModal }) => {
  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();

  const [nombreCliente, setNombreCliente] = useState("");
  const [cedula, setCedula] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comercialName, setComercialName] = useState("");

  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [municipalityList, setMunicipalityList] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const [CommunityList, setCommunityList] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(false);
      const result = await getDepartmentListAsync(token);
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

      setDepartmentList(result.data);

      const resultSrores = await getStoresAsync(token);
      if (!resultSrores.statusResponse) {
        setIsLoading(false);
        if (resultSrores.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError(resultSrores.error.message);
        return;
      }

      if (resultSrores.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultSrores.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setStoreList(resultSrores.data);
    })();

    if (navigator.geolocation) {
      getUserLocation().then((coords) => {
        console.log(coords);
      });
    }
  }, []);

  const saveChangesAsync = async () => {
    if (validate()) {
      const data = {
        nombreCliente,
        cedula,
        correo,
        telefono,
        idCommunity: selectedCommunity,
        direccion,
        idStore: selectedStore,
      };
      setIsLoading(true);

      const result = await addClientAsync(token, data);
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
      setReload(!reload);
      toastSuccess("Cliente Guardado...");
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
      setCommunityList(result.data);
    } else {
      setCommunityList([]);
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
              />

              <TextField
                fullWidth
                style={{ marginTop: 20 }}
                required
                variant="standard"
                onChange={(e) => setComercialName(e.target.value.toUpperCase())}
                label={"Nombre Comercial"}
                value={comercialName}
              />

              <TextField
                style={{ marginTop: 20 }}
                fullWidth
                required
                variant="standard"
                onChange={(e) => setCedula(e.target.value.toUpperCase())}
                label={"Cedula Cliente(000-000000-0000X)"}
                value={cedula}
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
              />

              <TextField
                style={{ marginTop: 20 }}
                fullWidth
                required
                variant="standard"
                onChange={(e) => setCorreo(e.target.value.toLowerCase())}
                label={"Correo Cliente"}
                value={correo}
              />

              <FormControl
                variant="standard"
                fullWidth
                style={{ marginRight: 20, marginTop: 20 }}
                required
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione un Almacen
                </InputLabel>
                <Select
                  defaultValue=""
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  label="Almacen"
                  style={{ textAlign: "left" }}
                >
                  <MenuItem key={-1} value="">
                    <em> Seleccione un Almacen</em>
                  </MenuItem>
                  {storeList.map((item) => {
                    return (
                      <MenuItem key={item.almacen.id} value={item.almacen.id}>
                        {item.almacen.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item sm={4}>
              <FormControl
                variant="standard"
                fullWidth
                style={{ marginRight: 20, marginTop: 20 }}
                required
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione un Depto
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
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione un Municip.
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
                  style={{ marginRight: 10 }}
                  required
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Seleccione una Com.
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

                <Tooltip title="Agregar Comunidad" style={{ marginTop: 5 }}>
                  <IconButton
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
              </div>
            </Grid>
          </Grid>

          <TextField
            style={{ marginTop: 20 }}
            fullWidth
            required
            variant="standard"
            onChange={(e) => setDireccion(e.target.value.toUpperCase())}
            label={"Direccion Cliente"}
            value={direccion}
          />

          <Button
            fullWidth
            variant="outlined"
            style={{ borderRadius: 20, marginTop: 31 }}
            startIcon={<FontAwesomeIcon icon={faSave} />}
            onClick={() => saveChangesAsync()}
          >
            Agregar Cliente
          </Button>
        </Container>
      </Paper>

      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
          marginBottom: 10,
        }}
      >
        
      </Paper>

      <SmallModal
        titulo={"Agregar Comunidad"}
        isVisible={showAddModal}
        setVisible={setShowAddModal}
      >
        <CommunityAdd
          setShowModal={setShowAddModal}
          idMunicipality={selectedMunicipality}
        />
      </SmallModal>
    </div>
  );
};

export default AddClient;
