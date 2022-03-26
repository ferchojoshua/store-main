import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import {
  TextField,
  Button,
  Divider,
  Grid,
  // InputAdornment,
  // IconButton,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "../../../services/Account";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import { getRolesAsync } from "../../../services/RolApi";
import { isEmpty } from "lodash";
import { createUserAsync } from "../../../services/UsersApi";
import { useNavigate } from "react-router-dom";

const AddUser = ({ setShowModal }) => {
  const { setIsLoading, reload, setReload } = useContext(DataContext);
  const token = getToken();
  let navigate = useNavigate();
  // const [showPassword, setShowPassword] = useState(false);
  const [rolesList, setRolesList] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [userName, setUserName] = useState("");
  const [selectedRol, setSelectedRol] = useState("");

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
        toastError("No se pudo cargar los roles");
        return;
      }
      setIsLoading(false);
      setRolesList(rolesResult.data);
    })();
  }, []);

  const addNewUser = async () => {
    if (validate()) {
      const data = {
        firstName,
        secondName,
        lastName,
        secondLastName,
        phoneNumber,
        address,
        userName,
        // password,
        rolId: selectedRol,
      };

      setIsLoading(true);
      const result = await createUserAsync(token, data);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError("Ocurrio un error..., intente de nuevo");
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

    // if (isEmpty(password)) {
    //   toastError("Debe ingresar una contraseña");
    //   return (isValid = false);
    // }

    // if (isEmpty(passwordConfirm)) {
    //   toastError("Debe confirmar la contraseña");
    //   return (isValid = false);
    // }

    // if (password !== passwordConfirm) {
    //   toastError("Las contraseñas no son iguales");
    //   return (isValid = false);
    // }

    if (selectedRol === "") {
      toastError("Debe seleccionar un rol");
      return (isValid = false);
    }

    return isValid;
  };

  return (
    <div>
      <Container style={{ width: 800 }}>
        <Divider />
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
              onChange={(e) => setSecondLastName(e.target.value.toUpperCase())}
              label={"Segundo Apellido"}
              value={secondLastName}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              fullWidth
              style={{ marginBottom: 10, marginTop: 10 }}
              variant="standard"
              onChange={(e) => setPhoneNumber(e.target.value)}
              label={"Telefono"}
              value={phoneNumber}
            />

            <TextField
              fullWidth
              required
              style={{ marginBottom: 10 }}
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

            {/* <TextField
              fullWidth
              required
              style={{ marginBottom: 10, marginTop: 10 }}
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
              label={"Contraseña"}
              value={password}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="toggle password visivility"
                    >
                      {showPassword ? (
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{ color: "#3f51b5" }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          style={{ color: "#3f51b5" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> */}
            {/* 
            <TextField
              fullWidth
              required
              style={{ marginBottom: 10, marginTop: 10 }}
              variant="standard"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              label={"Confirmar Contraseña"}
              value={passwordConfirm}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="toggle password visivility"
                    >
                      {showPassword ? (
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{ color: "#3f51b5" }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          style={{ color: "#3f51b5" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> */}

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
    </div>
  );
};

export default AddUser;
