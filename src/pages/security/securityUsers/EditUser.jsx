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
} from "@mui/material";
import { Container } from "react-bootstrap";
import {
  faCircleXmark,
  faPenToSquare,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "../../../services/Account";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import { getRolesAsync } from "../../../services/RolApi";
import { isEmpty } from "lodash";
import { updateUserAsync } from "../../../services/UsersApi";

import Loading from "../../../components/Loading";

const EditUser = ({ selectedUser, setShowModal }) => {
  const { setIsLoading, reload, setReload } = useContext(DataContext);
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

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const rolesResult = await getRolesAsync(token);
      if (!rolesResult.statusResponse) {
        setIsLoading(false);
        toastError("No se pudo cargar los roles");
        return;
      }
      setIsLoading(false);
      setRolesList(rolesResult.data);
    })();
  }, []);

  const updateUser = async () => {
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
      };
      setIsLoading(true);
      const result = await updateUserAsync(token, data);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError("Ocurrio un error..., intente de nuevo");
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
              onChange={(e) => setSecondLastName(e.target.value.toUpperCase())}
              label={"Agundo Apellido"}
              value={secondLastName}
              disabled={isEdit ? false : true}
            />

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

            <Button
              fullWidth
              variant="outlined"
              style={{ borderRadius: 20, marginTop: 10 }}
              startIcon={<FontAwesomeIcon icon={faSave} />}
              onClick={() => updateUser()}
              disabled={!isEdit}
            >
              Actualizar datos de Usuario
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Loading />
    </div>
  );
};

export default EditUser;
