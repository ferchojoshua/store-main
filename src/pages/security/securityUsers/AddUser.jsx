import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import {
  TextField,
  Button,
  Divider,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Container,
  Autocomplete,
  Paper,
} from "@mui/material";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import { getRolesAsync } from "../../../services/RolApi";
import { isEmpty } from "lodash";
import { createUserAsync } from "../../../services/UsersApi";
import { useNavigate } from "react-router-dom";
import { getStoresAsync } from "../../../services/AlmacenApi";

const AddUser = ({ setShowModal }) => {
  const { setIsLoading, reload, setReload, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  const token = getToken();
  let navigate = useNavigate();
  const [rolesList, setRolesList] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [userName, setUserName] = useState("");
  const [selectedRol, setSelectedRol] = useState("");

  const [storeList, setStoreList] = useState([]);

  const fixedOptions = [storeList];
  const [value, setValue] = useState([...fixedOptions, storeList]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const rolesResult = await getRolesAsync(token);
      if (!rolesResult.statusResponse) {
        setIsLoading(false);
        if (rolesResult.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
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
      setIsLoading(false);
      setRolesList(rolesResult.data);

      const result = await getStoresAsync(token);
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
      setStoreList(
        result.data.map((item) => {
          return item.almacen;
        })
      );
    })();
  }, []);

  const addNewUser = async () => {
    const filtered = value.filter((s) => s.id !== undefined);

    if (validate()) {
      const data = {
        firstName,
        secondName,
        lastName,
        secondLastName,
        phoneNumber,
        address,
        userName,
        rolId: selectedRol,
        Stores: filtered,
      };

      setIsLoading(true);
      const result = await createUserAsync(token, data);
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
      toastSuccess("Usuario creado");
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
        <Container style={{ width: 800 }}>
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
              />

              <TextField
                fullWidth
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) => setSecondName(e.target.value.toUpperCase())}
                label={"Segundo Nombre"}
                value={secondName}
              />

              <TextField
                fullWidth
                required
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) => setLastName(e.target.value.toUpperCase())}
                label={"Apellido"}
                value={lastName}
              />

              <TextField
                fullWidth
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) =>
                  setSecondLastName(e.target.value.toUpperCase())
                }
                label={"Segundo Apellido"}
                value={secondLastName}
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
              />

              <TextField
                fullWidth
                required
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) => setAddress(e.target.value.toUpperCase())}
                label={"Direccion"}
                value={address}
              />

              <TextField
                fullWidth
                required
                style={{ marginBottom: 10, marginTop: 10 }}
                variant="standard"
                onChange={(e) => setUserName(e.target.value)}
                label={"Usuario"}
                value={userName}
              />

              <FormControl
                variant="standard"
                fullWidth
                style={{ marginTop: 10 }}
                required
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
            style={{ marginTop: 20, marginBottom: 20 }}
            fullWidth
            id="fixed-tags-demo"
            value={value.name}
            onChange={(event, newValue) => {
              setValue([
                ...fixedOptions,
                ...newValue.filter(
                  (option) => fixedOptions.indexOf(option) === -1
                ),
              ]);
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

          <Button
            fullWidth
            variant="outlined"
            style={{ borderRadius: 20, marginTop: 10 }}
            startIcon={<FontAwesomeIcon icon={faSave} />}
            onClick={() => addNewUser()}
          >
            Agregar Usuario
          </Button>
        </Container>
      </Paper>
    </div>
  );
};

export default AddUser;
