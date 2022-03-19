import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import {
  TextField,
  Button,
  Divider,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Container } from "react-bootstrap";
import {
  faCircleXmark,
  faPenToSquare,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "../../../services/Account";
import { updateRolAsync } from "../../../services/RolApi";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import Loading from "../../../components/Loading";

const EditRol = ({ setShowModal, selectedRol }) => {
  const { setIsLoading, reload, setReload } = useContext(DataContext);
  const token = getToken();

  const [isEdit, setIsEdit] = useState(false);

  const editedRol = selectedRol;

  const [rolName, setRolName] = useState(selectedRol.roleName);

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

  useEffect(() => {
    selectedRol.permissions.map((item) => {
      switch (item.description) {
        case "USER VER":
          setUserVer(item.isEnable);
          break;
        case "USER CREATE":
          setUserCreate(item.isEnable);
          break;
        case "USER UPDATE":
          setUserUpdate(item.isEnable);
          break;
        case "USER DELETE":
          setUserDelete(item.isEnable);
          break;

        case "MISCELANEOS VER":
          setMiscelaneosVer(item.isEnable);
          break;
        case "MISCELANEOS CREATE":
          setMiscelaneosCreate(item.isEnable);
          break;
        case "MISCELANEOS UPDATE":
          setMiscelaneosUpdate(item.isEnable);
          break;
        case "MISCELANEOS DELETE":
          setMiscelaneosDelete(item.isEnable);
          break;

        case "ENTRADAPRODUCTOS VER":
          setInProductsVer(item.isEnable);
          break;
        case "ENTRADAPRODUCTOS CREATE":
          setInProductsCreate(item.isEnable);
          break;
        case "ENTRADAPRODUCTOS UPDATE":
          setInProductsUpdate(item.isEnable);
          break;
        case "ENTRADAPRODUCTOS DELETE":
          setInProductsDelete(item.isEnable);
          break;

        default:
          break;
      }
    });
  }, []);

  const saveRol = async () => {
    if (rolName === "") {
      toastError("No puede dejar el campo nombre vacio!");
      return;
    }
    editedRol.roleName = rolName;
    editedRol.permissions.map((item) => {
      switch (item.description) {
        case "USER VER":
          item.isEnable = userVer;
          break;
        case "USER CREATE":
          item.isEnable = userCreate;
          break;
        case "USER UPDATE":
          item.isEnable = userUpdate;
          break;
        case "USER DELETE":
          item.isEnable = userDelete;
          break;

        case "MISCELANEOS VER":
          item.isEnable = miscelaneosVer;
          break;
        case "MISCELANEOS CREATE":
          item.isEnable = miscelaneosCreate;
          break;
        case "MISCELANEOS UPDATE":
          item.isEnable = miscelaneosUpdate;
          break;
        case "MISCELANEOS DELETE":
          item.isEnable = miscelaneosDelete;
          break;

        case "ENTRADAPRODUCTOS VER":
          item.isEnable = inProductsVer;
          break;
        case "ENTRADAPRODUCTOS CREATE":
          item.isEnable = inProductsCreate;
          break;
        case "ENTRADAPRODUCTOS UPDATE":
          item.isEnable = inProductsUpdate;
          break;
        case "ENTRADAPRODUCTOS DELETE":
          item.isEnable = inProductsDelete;
          break;

        default:
          break;
      }
    });

    setIsLoading(true);
    const result = await updateRolAsync(token, editedRol);
    if (!result.statusResponse) {
      setIsLoading(false);
      toastError("Eror al actualizar, intente de nuevo");
      return;
    }
    setIsLoading(false);
    toastSuccess("Rol actualizado!");
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <div>
      <Container style={{ width: 800 }}>
        <Divider />
        <div className="row justify-content-around align-items-center">
          <div className="col-sm-9 ">
            <TextField
              fullWidth
              style={{ marginBottom: 10, marginTop: 20 }}
              variant="standard"
              onChange={(e) => setRolName(e.target.value.toUpperCase())}
              label={"Nombre rol"}
              value={rolName}
              disabled={isEdit ? false : true}
            />
          </div>
          <div className="col-sm-3 ">
            <Button
              fullWidth
              variant="outlined"
              style={{
                borderRadius: 20,
                marginTop: 20,
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
              {isEdit ? "Cancelar" : " Editar Rol"}
            </Button>
          </div>
        </div>
        <Grid container style={{ marginTop: 10 }}>
          <Grid item sm={6}>
            <Typography
              style={{
                fontSize: 17,
                marginTop: 40,
                color: "#2196f3",
                fontWeight: 800,
                // textAlign: "left",
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
                // textAlign: "left",
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
                // textAlign: "left",
              }}
            >
              Modulo Entrada de Productos
            </Typography>
          </Grid>
          <Grid item sm={6} style={{ paddingLeft: 20, paddingRight: 20 }}>
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-3 ">
                <FormControlLabel
                  labelPlacement="top"
                  control={
                    <Checkbox
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
          disabled={!isEdit}
        >
          Guardar Cambios
        </Button>
      </Container>
      <Loading/>
    </div>
  );
};

export default EditRol;
