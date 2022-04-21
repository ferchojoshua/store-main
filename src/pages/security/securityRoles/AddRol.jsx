import React, { useContext, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import {
  TextField,
  Button,
  Divider,
  Typography,
  Switch,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import { createRolAsync } from "../../../services/RolApi";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";

const AddRol = ({ setShowModal }) => {
  const { setIsLoading, reload, setReload, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [rolName, setRolName] = useState("");
  const token = getToken();

  const [isFullAccess, setIsFullAccess] = useState(false);

  const [inProductsVer, setInProductsVer] = useState(false);
  const [inProductsCreate, setInProductsCreate] = useState(false);
  const [inProductsUpdate, setInProductsUpdate] = useState(false);
  const [inProductsDelete, setInProductsDelete] = useState(false);

  const [ProductExistenceVer, setExistenceProductsVer] = useState(false);
  const [ProductExistenceCreate, setExistenceProductsCreate] = useState(false);
  const [ProductExistenceUpdate, setExistenceProductsUpdate] = useState(false);
  const [ProductExistenceDelete, setExistenceProductsDelete] = useState(false);

  const [productTraslateVer, setProductTraslateVer] = useState(false);
  const [productTraslateCreate, setProductTraslateCreate] = useState(false);
  const [productTraslateUpdate, setProductTraslateUpdate] = useState(false);
  const [productTraslateDelete, setProductTraslateDelete] = useState(false);

  const [productsVer, setProductsVer] = useState(false);
  const [productsCreate, setProductsCreate] = useState(false);
  const [productsUpdate, setProductsUpdate] = useState(false);
  const [productsDelete, setProductsDelete] = useState(false);

  const [userVer, setUserVer] = useState(false);
  const [userCreate, setUserCreate] = useState(false);
  const [userUpdate, setUserUpdate] = useState(false);
  const [userDelete, setUserDelete] = useState(false);

  const [rolesVer, setRolesVer] = useState(false);
  const [rolesCreate, setRolesCreate] = useState(false);
  const [rolesUpdate, setRolesUpdate] = useState(false);
  const [rolesDelete, setRolesDelete] = useState(false);

  const [miscelaneosVer, setMiscelaneosVer] = useState(false);
  const [miscelaneosCreate, setMiscelaneosCreate] = useState(false);
  const [miscelaneosUpdate, setMiscelaneosUpdate] = useState(false);
  const [miscelaneosDelete, setMiscelaneosDelete] = useState(false);

  const handleChangeFullAccess = () => {
    setIsFullAccess(!isFullAccess);

    setInProductsVer(!isFullAccess);
    setInProductsCreate(!isFullAccess);
    setInProductsUpdate(!isFullAccess);
    setInProductsDelete(!isFullAccess);

    setExistenceProductsVer(!isFullAccess);
    setExistenceProductsCreate(!isFullAccess);
    setExistenceProductsUpdate(!isFullAccess);
    setExistenceProductsDelete(!isFullAccess);

    setProductTraslateVer(!isFullAccess);
    setProductTraslateCreate(!isFullAccess);
    setProductTraslateUpdate(!isFullAccess);
    setProductTraslateDelete(!isFullAccess);

    setProductsVer(!isFullAccess);
    setProductsCreate(!isFullAccess);
    setProductsUpdate(!isFullAccess);
    setProductsDelete(!isFullAccess);

    setUserVer(!isFullAccess);
    setUserCreate(!isFullAccess);
    setUserUpdate(!isFullAccess);
    setUserDelete(!isFullAccess);

    setMiscelaneosVer(!isFullAccess);
    setMiscelaneosCreate(!isFullAccess);
    setMiscelaneosUpdate(!isFullAccess);
    setMiscelaneosDelete(!isFullAccess);
  };

  const saveRol = async () => {
    if (rolName === "") {
      toastError("Ingrese una nombre al nuevo rol");
      return;
    }
    const data = {
      permissions: [
        //Entrada Producto
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
        //Existencias de Producto
        {
          description: "EXISTANCE VER",
          IsEnable: ProductExistenceVer,
        },
        {
          description: "EXISTANCE CREATE",
          IsEnable: ProductExistenceCreate,
        },
        {
          description: "EXISTANCE UPDATE",
          IsEnable: ProductExistenceUpdate,
        },
        {
          description: "EXISTANCE DELETE",
          IsEnable: ProductExistenceDelete,
        },
        //Traslado de Producto
        {
          description: "PRODUCT TRANSLATE VER",
          IsEnable: productTraslateVer,
        },
        {
          description: "PRODUCT TRANSLATE CREATE",
          IsEnable: productTraslateCreate,
        },
        {
          description: "PRODUCT TRANSLATE UPDATE",
          IsEnable: productTraslateUpdate,
        },
        {
          description: "PRODUCT TRANSLATE DELETE",
          IsEnable: productTraslateDelete,
        },
        //Products
        {
          description: "PRODUCTS VER",
          IsEnable: rolesVer,
        },
        {
          description: "PRODUCTS CREATE",
          IsEnable: rolesCreate,
        },
        {
          description: "PRODUCTS UPDATE",
          IsEnable: rolesUpdate,
        },
        {
          description: "PRODUCTS DELETE",
          IsEnable: rolesDelete,
        },
        //Usuario
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
        //Roles
        {
          description: "ROLES VER",
          IsEnable: rolesVer,
        },
        {
          description: "ROLES CREATE",
          IsEnable: rolesCreate,
        },
        {
          description: "ROLES UPDATE",
          IsEnable: rolesUpdate,
        },
        {
          description: "ROLES DELETE",
          IsEnable: rolesDelete,
        },
        //Miscelaneos
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
      ],
      roleName: rolName,
    };

    setIsLoading(true);
    const result = await createRolAsync(token, data);
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
    toastSuccess("Rol creado");
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <div style={{ width: 800 }}>
      <Divider />

      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
          marginTop: 20,
        }}
      >
        <TextField
          fullWidth
          style={{ marginBottom: 10 }}
          variant="standard"
          onChange={(e) => setRolName(e.target.value.toUpperCase())}
          label={"Nombre rol"}
          value={rolName}
        />
      </Paper>

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
      <Divider />
      <Typography
        style={{
          fontSize: 17,
          color: "#2196f3",
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        Acceso total al sistema
      </Typography>

      <div
        style={{
          textAlign: "center",
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
        <div className="col-sm-6">
          {/* Modulo Entrada de Productos */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
            }}
          >
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-12">
                <Typography
                  style={{
                    fontSize: 17,
                    color: "#2196f3",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Modulo Entrada de Productos
                </Typography>
                <Divider />
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
                          onChange={() =>
                            setInProductsCreate(!inProductsCreate)
                          }
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
                          onChange={() =>
                            setInProductsUpdate(!inProductsUpdate)
                          }
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
                          onChange={() =>
                            setInProductsDelete(!inProductsDelete)
                          }
                        />
                      }
                      label="Eliminar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          {/* Modulo Traslado de Productos */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-12">
                <Typography
                  style={{
                    fontSize: 17,
                    color: "#2196f3",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Modulo Traslado de Productos
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-3 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          checked={productTraslateVer}
                          onChange={() =>
                            setProductTraslateVer(!productTraslateVer)
                          }
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
                          checked={productTraslateCreate}
                          onChange={() =>
                            setProductTraslateCreate(!productTraslateCreate)
                          }
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
                          checked={productTraslateUpdate}
                          onChange={() =>
                            setProductTraslateUpdate(!productTraslateUpdate)
                          }
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
                          checked={productTraslateDelete}
                          onChange={() =>
                            setProductTraslateDelete(!productTraslateDelete)
                          }
                        />
                      }
                      label="Eliminar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          {/* Modulo Seguridad de Usuarios */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-12 ">
                <Typography
                  style={{
                    fontSize: 17,
                    color: "#2196f3",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Modulo Seguridad de Usuarios
                </Typography>
                <Divider />
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
              </div>
            </div>
          </Paper>

          {/* Modulo miscelaneos */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-12 ">
                <Typography
                  style={{
                    fontSize: 17,
                    color: "#2196f3",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Modulo Miscelaneos
                </Typography>
                <Divider />
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
                          onChange={() =>
                            setMiscelaneosCreate(!miscelaneosCreate)
                          }
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
                          onChange={() =>
                            setMiscelaneosUpdate(!miscelaneosUpdate)
                          }
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
                          onChange={() =>
                            setMiscelaneosDelete(!miscelaneosDelete)
                          }
                        />
                      }
                      label="Eliminar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        </div>

        <div className="col-sm-6">
          {/* Modulo Existencia de Productos */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
            }}
          >
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-12">
                <Typography
                  style={{
                    fontSize: 17,
                    color: "#2196f3",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Modulo Existencia de Productos
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-3 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          checked={ProductExistenceVer}
                          onChange={() =>
                            setExistenceProductsVer(!ProductExistenceVer)
                          }
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
                          checked={ProductExistenceCreate}
                          onChange={() =>
                            setExistenceProductsCreate(!ProductExistenceCreate)
                          }
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
                          checked={ProductExistenceUpdate}
                          onChange={() =>
                            setExistenceProductsUpdate(!ProductExistenceUpdate)
                          }
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
                          checked={ProductExistenceDelete}
                          onChange={() =>
                            setExistenceProductsDelete(!ProductExistenceDelete)
                          }
                        />
                      }
                      label="Eliminar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          {/* Modulo Productos */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-12 ">
                <Typography
                  style={{
                    fontSize: 17,
                    color: "#2196f3",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Modulo Productos
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-3 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          checked={productsVer}
                          onChange={() => setProductsVer(!productsVer)}
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
                          checked={productsCreate}
                          onChange={() => setProductsCreate(!productsCreate)}
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
                          checked={productsUpdate}
                          onChange={() => setProductsUpdate(!productsUpdate)}
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
                          checked={productsDelete}
                          onChange={() => setProductsDelete(!productsDelete)}
                        />
                      }
                      label="Eliminar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          {/* Modulo Seguridad de Roles */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-12 ">
                <Typography
                  style={{
                    fontSize: 17,
                    color: "#2196f3",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Modulo Seguridad de Roles
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-3 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          checked={userVer}
                          onChange={() => setRolesVer(!rolesVer)}
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
                          onChange={() => setRolesCreate(!rolesCreate)}
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
                          onChange={() => setRolesUpdate(!rolesUpdate)}
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
                          onChange={() => setRolesDelete(!rolesDelete)}
                        />
                      }
                      label="Eliminar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          {/* Modulo Productos */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-12 ">
                <Typography
                  style={{
                    fontSize: 17,
                    color: "#2196f3",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Modulo Disponible
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-3 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          checked={productsVer}
                          onChange={() => setProductsVer(!productsVer)}
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
                          checked={productsCreate}
                          onChange={() => setProductsCreate(!productsCreate)}
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
                          checked={productsUpdate}
                          onChange={() => setProductsUpdate(!productsUpdate)}
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
                          checked={productsDelete}
                          onChange={() => setProductsDelete(!productsDelete)}
                        />
                      }
                      label="Eliminar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>

      <Button
        fullWidth
        variant="outlined"
        style={{ borderRadius: 20, marginTop: 20 }}
        startIcon={<FontAwesomeIcon icon={faSave} />}
        onClick={() => saveRol()}
      >
        Agregar Rol
      </Button>
    </div>
  );
};

export default AddRol;
