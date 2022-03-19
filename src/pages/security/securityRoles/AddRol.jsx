import React, { useContext, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import {
  TextField,
  Button,
  Divider,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Container } from "react-bootstrap";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "../../../services/Account";
import { createRolAsync } from "../../../services/RolApi";
import { toastError, toastSuccess } from "../../../helpers/Helpers";

const AddRol = ({ setShowModal }) => {
  const { setIsLoading, reload, setReload } = useContext(DataContext);
  const [rolName, setRolName] = useState("");
  const token = getToken();

  const [isFullAccess, setIsFullAccess] = useState(false);

  const [userVer, setUserVer] = useState(false);
  const [userCreate, setUserCreate] = useState(false);
  const [userUpdate, setUserUpdate] = useState(false);
  const [userDelete, setUserDelete] = useState(false);

  const [miscelaneosVer, setMiscelaneosVer] = useState(false);
  const [miscelaneosCreate, setMiscelaneosCreate] = useState(false);
  const [miscelaneosUpdate, setMiscelaneosUpdate] = useState(false);
  const [miscelaneosDelete, setMiscelaneosDelete] = useState(false);

  const [inProductsVer, setInProductsVer] = useState(false);
  const [inProductsCreate, setInProductsCreate] = useState(false);
  const [inProductsUpdate, setInProductsUpdate] = useState(false);
  const [inProductsDelete, setInProductsDelete] = useState(false);

  const handleChangeFullAccess = () => {
    setIsFullAccess(!isFullAccess);
    setUserVer(!isFullAccess);
    setUserCreate(!isFullAccess);
    setUserUpdate(!isFullAccess);
    setUserDelete(!isFullAccess);

    setMiscelaneosVer(!isFullAccess);
    setMiscelaneosCreate(!isFullAccess);
    setMiscelaneosUpdate(!isFullAccess);
    setMiscelaneosDelete(!isFullAccess);

    setInProductsVer(!isFullAccess);
    setInProductsCreate(!isFullAccess);
    setInProductsUpdate(!isFullAccess);
    setInProductsDelete(!isFullAccess);
  };

  const saveRol = async () => {
    if (rolName === "") {
      toastError("Ingrese una nombre al nuevo rol");
      return;
    }
    const data = {
      permissions: [
        {
          description: "USER VER",
          IsEnable: userVer,
        },
        {
          description: "USER CREATE",
          IsEnable: userCreate,
        },
        {
          description: "USER UPDATE",
          IsEnable: userUpdate,
        },
        {
          description: "USER DELETE",
          IsEnable: userDelete,
        },

        {
          description: "MISCELANEOS VER",
          IsEnable: miscelaneosVer,
        },
        {
          description: "MISCELANEOS CREATE",
          IsEnable: miscelaneosCreate,
        },
        {
          description: "MISCELANEOS UPDATE",
          IsEnable: miscelaneosUpdate,
        },
        {
          description: "MISCELANEOS DELETE",
          IsEnable: miscelaneosDelete,
        },

        {
          description: "ENTRADAPRODUCTOS VER",
          IsEnable: inProductsVer,
        },
        {
          description: "ENTRADAPRODUCTOS CREATE",
          IsEnable: inProductsCreate,
        },
        {
          description: "ENTRADAPRODUCTOS UPDATE",
          IsEnable: inProductsUpdate,
        },
        {
          description: "ENTRADAPRODUCTOS DELETE",
          IsEnable: inProductsDelete,
        },
      ],
      roleName: rolName,
    };

    setIsLoading(true);
    const result = await createRolAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      toastError("No se creo el rol, intente de nuevo");
      return;
    }
    setIsLoading(false);
    toastSuccess("Rol creado");
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <div>
      <Container style={{ width: 800 }}>
        <Divider />
        <TextField
          fullWidth
          style={{ marginBottom: 10, marginTop: 20 }}
          variant="standard"
          onChange={(e) => setRolName(e.target.value.toUpperCase())}
          label={"Nombre rol"}
          value={rolName}
        />
        <Typography
          style={{
            marginTop: 20,
            fontSize: 25,
            color: "#4caf50",
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          Accesos de modulo
        </Typography>
        <Grid container style={{ marginTop: 10 }}>
          <Grid item sm={6}>
            <Typography
              style={{
                fontSize: 17,
                marginTop: 10,
                color: "#2196f3",
                fontWeight: 800,
              }}
            >
              Acceso total al sistema
            </Typography>

            <Typography
              style={{
                fontSize: 17,
                marginTop: 40,
                color: "#2196f3",
                fontWeight: 800,
              }}
            >
              Modulo Miscelaneos
            </Typography>

            <Typography
              style={{
                fontSize: 17,
                marginTop: 35,
                color: "#2196f3",
                fontWeight: 800,
              }}
            >
              Modulo Seguridad de Usuarios
            </Typography>

            <Typography
              style={{
                fontSize: 17,
                marginTop: 40,
                color: "#2196f3",
                fontWeight: 800,
              }}
            >
              Modulo Entrada de Productos
            </Typography>
          </Grid>
          <Grid item sm={6} style={{ paddingLeft: 20, paddingRight: 20 }}>
            <div
              style={{
                paddingLeft: 10,
              }}
            >
              <Switch
                style={{
                  color: isFullAccess ? "#4caf50" : "#f50057",
                }}
                checked={isFullAccess}
                onChange={handleChangeFullAccess}
              />
            </div>

            <div className="row justify-content-around align-items-center">
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={miscelaneosVer}
                      onChange={() => setMiscelaneosVer(!miscelaneosVer)}
                    />
                  }
                  label="Ver"
                />
              </div>
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={miscelaneosCreate}
                      onChange={() => setMiscelaneosCreate(!miscelaneosCreate)}
                    />
                  }
                  label="Crear"
                />
              </div>
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={miscelaneosUpdate}
                      onChange={() => setMiscelaneosUpdate(!miscelaneosUpdate)}
                    />
                  }
                  label="Editar"
                />
              </div>
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={miscelaneosDelete}
                      onChange={() => setMiscelaneosDelete(!miscelaneosDelete)}
                    />
                  }
                  label="Eliminar"
                />
              </div>
            </div>

            <div className="row justify-content-around align-items-center">
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={userVer}
                      onChange={() => setUserVer(!userVer)}
                    />
                  }
                  label="Ver"
                />
              </div>
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={userCreate}
                      onChange={() => setUserCreate(!userCreate)}
                    />
                  }
                  label="Crear"
                />
              </div>
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={userUpdate}
                      onChange={() => setUserUpdate(!userUpdate)}
                    />
                  }
                  label="Editar"
                />
              </div>
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={userDelete}
                      onChange={() => setUserDelete(!userDelete)}
                    />
                  }
                  label="Eliminar"
                />
              </div>
            </div>

            <div className="row justify-content-around align-items-center">
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={inProductsVer}
                      onChange={() => setInProductsVer(!inProductsCreate)}
                    />
                  }
                  label="Ver"
                />
              </div>
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={inProductsCreate}
                      onChange={() => setInProductsCreate(!inProductsCreate)}
                    />
                  }
                  label="Crear"
                />
              </div>
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={inProductsUpdate}
                      onChange={() => setInProductsUpdate(!inProductsUpdate)}
                    />
                  }
                  label="Editar"
                />
              </div>
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      checked={inProductsDelete}
                      onChange={() => setInProductsDelete(!inProductsDelete)}
                    />
                  }
                  label="Eliminar"
                />
              </div>
            </div>
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 20 }}
          startIcon={<FontAwesomeIcon icon={faSave} />}
          onClick={() => saveRol()}
        >
          Agregar Rol
        </Button>
      </Container>
    </div>
  );
};

export default AddRol;
