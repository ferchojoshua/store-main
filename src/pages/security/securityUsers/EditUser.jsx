import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import {
  TextField,
  Button,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  Paper,
} from "@mui/material";
import { Container } from "react-bootstrap";
import {
  faCircleXmark,
  faPenToSquare,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../helpers/Helpers";
import { getRolesAsync } from "../../../services/RolApi";
import { isEmpty, uniqBy } from "lodash";
import { updateUserAsync } from "../../../services/UsersApi";

import { useNavigate } from "react-router-dom";
import { getStoresAsync } from "../../../services/AlmacenApi";

const EditUser = ({ selectedUser, setShowModal }) => {
  let ruta = getRuta();

  const {
    setIsLoading,
    reload,
    setReload,
    setIsLogged,
    setIsDefaultPass,
    access,
  } = useContext(DataContext);
  let navigate = useNavigate();
  const token = getToken();


  const [rolesList, setRolesList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [firstName, setFirstName] = useState(selectedUser.firstName);
  const [secondName, setSecondName] = useState(selectedUser.secondName);
  const [lastName, setLastName] = useState(selectedUser.lastName);
  const [secondLastName, setSecondLastName] = useState(
    selectedUser.secondLastName
  );

  const [phoneNumber, setPhoneNumber] = useState(selectedUser.phoneNumber);
  const [address, setAddress] = useState(selectedUser.address);

  const [userName, setUserName] = useState(selectedUser.userName);

  const [selectedRol, setSelectedRol] = useState(
    selectedUser.rol ? selectedUser.rol.id : ""
  );

  const [storeList, setStoreList] = useState([]);

  const [value, setValue] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const rolesResult = await getRolesAsync(token);
      if (!rolesResult.statusResponse) {
        setIsLoading(false);
        toastError(rolesResult.error.message);
        return;
      }

      if (rolesResult.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (rolesResult.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setRolesList(rolesResult.data);

      const result = await getStoresAsync(token);
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
      setStoreList(
        result.data.map((item) => {
          return item.almacen;
        })
      );
    })();
    setValue(selectedUser.storeAccess);
  }, []);

  const updateUser = async () => {
    const filtered = value.filter((s) => s.id !== null);

    if (validate()) {
      const data = {
        userName,
        firstName,
        secondName,
        lastName,
        secondLastName,
        phoneNumber,
        address,
        rolId: selectedRol,
        Stores: filtered,
      };
      setIsLoading(true);
      const result = await updateUserAsync(token, data);
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
      toastSuccess("Usuario actualizado!");
      setReload(!reload);
      setShowModal(false);
    }
  };

  const validate = () => {
    let isValid = true;
    if (isEmpty(firstName)) {
      toastError("Debe ingresar un nombre");
      return (isValid = false);
    }

    if (isEmpty(lastName)) {
      toastError("Debe ingresar un apellido");
      return (isValid = false);
    }

    if (isEmpty(address)) {
      toastError("Debe ingresar una direccion");
      return (isValid = false);
    }

    if (isEmpty(userName)) {
      toastError("Debe ingresar un usuario");
      return (isValid = false);
    }

    if (selectedRol === "") {
      toastError("Debe seleccionar un rol");
      return (isValid = false);
    }

    if (value.filter((s) => s.id !== undefined).length === 0) {
      toastError("Debe seleccionar al menos un almacen");
      return (isValid = false);
    }

    return isValid;
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
          <Grid container spacing={3} style={{ marginTop: 5 }}>
            <Grid item sm={6}>
              <TextField
                fullWidth
                required
                style={{ marginBottom: 10 }}
                variant="standard"
                onChange={(e) => setFirstName(e.target.value.toUpperCase())}
                label={"Nombre"}
                value={firstName}
                disabled={isEdit ? false : true}
              />

              <TextField
                fullWidth
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) => setSecondName(e.target.value.toUpperCase())}
                label={"Segundo Nombre"}
                value={secondName}
                disabled={isEdit ? false : true}
              />

              <TextField
                fullWidth
                required
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) => setLastName(e.target.value.toUpperCase())}
                label={"Apellido"}
                value={lastName}
                disabled={isEdit ? false : true}
              />

              <TextField
                fullWidth
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) => setSecondLastName(e.target.value.toUpperCase())                }
                label={"Segundo Apellido"}
                value={secondLastName}
                disabled={isEdit ? false : true}
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                fullWidth
                style={{ marginBottom: 10 }}
                variant="standard"
                onChange={(e) => setPhoneNumber(e.target.value)}
                label={"Telefono"}
                value={phoneNumber}
                disabled={isEdit ? false : true}
              />

              <TextField
                fullWidth
                required
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) => setAddress(e.target.value.toUpperCase())}
                label={"Direccion"}
                value={address}
                disabled={isEdit ? false : true}
              />

              <TextField
                fullWidth
                required
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) => setUserName(e.target.value)}
                label={"Usuario"}
                value={userName}
                disabled
              />

              <FormControl
                variant="standard"
                fullWidth
                style={{ marginTop: 10 }}
                required
                disabled={isEdit ? false : true}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione un rol de usuario
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedRol}
                  onChange={(e) => setSelectedRol(e.target.value)}
                  label="Rol de usuario"
                  style={{ textAlign: "left" }}
                >
                  <MenuItem key={0} value="">
                    <em>Seleccione un rol de usuario</em>
                  </MenuItem>
                  {rolesList.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.roleName}
                      </MenuItem>
                    );
                  })}
                  
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Autocomplete
            multiple
            disabled={isEdit ? false : true}
            style={{ marginTop: 20, marginBottom: 20 }}
            fullWidth
            id="fixed-tags-demo"
             value={value ||[]} // Se agrego el array porque no comprendia los datos Vacios GCHAVEZ 13062023          
            onChange={(event, newValue) => {
              let result = uniqBy(newValue, "id");
              setValue(result);
              // JSON.stringify(result); Asi imprimi en Pantalla
            }}
            
            options={storeList}
            getOptionLabel={(op) => (op ? `${op.name}` || "" : "")}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                label="Seleccione uno o mas almacenes..."
              />
            )}
          />
          {isAccess(access, "USER UPDATE") ? (
            <Grid container spacing={3} style={{ marginTop: 5 }}>
              <Grid item sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  style={{
                    borderRadius: 20,
                    borderColor: isEdit ? "#9c27b0" : "#ff9800",
                    color: isEdit ? "#9c27b0" : "#ff9800",
                  }}
                  startIcon={
                    <FontAwesomeIcon
                      icon={isEdit ? faCircleXmark : faPenToSquare}
                    />
                  }
                  onClick={() => setIsEdit(!isEdit)}
                >
                  {isEdit ? "Cancelar" : " Editar Usuario"}
                </Button>
              </Grid>

              <Grid item sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  style={{ borderRadius: 20 }}
                  startIcon={<FontAwesomeIcon icon={faSave} />}
                  onClick={() => updateUser()}
                  disabled={!isEdit}
                >
                  Actualizar datos de Usuario
                </Button>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
        </Container>
      </Paper>
    </div>
  );
};

export default EditUser;
