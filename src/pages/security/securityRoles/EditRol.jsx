import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import {
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
} from "@mui/material";
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
import { updateRolAsync } from "../../../services/RolApi";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import "./style.css";

const EditRol = ({ setShowModal, selectedRol }) => {
  const { setIsLoading, reload, setReload, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  let navigate = useNavigate();
  const token = getToken();

  const [isEdit, setIsEdit] = useState(false);

  const editedRol = selectedRol;

  const [rolName, setRolName] = useState(selectedRol.roleName);

  const [ventasVer, setVentasVer] = useState(false);
  const [ventasCreate, setVentasCreate] = useState(false);
  const [ventasDelete, setVentasDelete] = useState(false);

  const [clientsVer, setClientsVer] = useState(false);
  const [clientsCreate, setClientsCreate] = useState(false);
  const [clientsUpdate, setClientsUpdate] = useState(false);
  const [clientsDelete, setClientsDelete] = useState(false);

  const [inProductsVer, setInProductsVer] = useState(false);
  const [inProductsCreate, setInProductsCreate] = useState(false);
  const [inProductsUpdate, setInProductsUpdate] = useState(false);

  const [ProductExistenceVer, setExistenceProductsVer] = useState(false);
  const [ProductExistenceUpdate, setExistenceProductsUpdate] = useState(false);

  const [productTraslateVer, setProductTraslateVer] = useState(false);
  const [productTraslateCreate, setProductTraslateCreate] = useState(false);

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

  const [communitiesVer, setCommunitiesVer] = useState(false);
  const [communitiesCreate, setCommunitiesCreate] = useState(false);
  const [communitiesUpdate, setCommunitiesUpdate] = useState(false);
  const [communitiesDelete, setCommunitiesDelete] = useState(false);

  useEffect(() => {
    selectedRol.permissions.map((item) => {
      switch (item.description) {
        //Ventas Producto
        case "SALES VER":
          setVentasVer(item.isEnable);
          break;
        case "SALES CREATE":
          setVentasCreate(item.isEnable);
          break;
        case "SALES DELETE":
          setVentasDelete(item.isEnable);
          break;

        //Clientes
        case "CLIENTS VER":
          setClientsVer(item.isEnable);
          break;
        case "CLIENTS CREATE":
          setClientsCreate(item.isEnable);
          break;
        case "CLIENTS UPDATE":
          setClientsUpdate(item.isEnable);
          break;
        case "CLIENTS DELETE":
          setClientsDelete(item.isEnable);
          break;

        //Entrada Producto
        case "ENTRADAPRODUCTOS VER":
          setInProductsVer(item.isEnable);
          break;
        case "ENTRADAPRODUCTOS CREATE":
          setInProductsCreate(item.isEnable);
          break;
        case "ENTRADAPRODUCTOS UPDATE":
          setInProductsUpdate(item.isEnable);
          break;

        //Existencias de Producto
        case "EXISTANCE VER":
          setExistenceProductsVer(item.isEnable);
          break;
        case "EXISTANCE UPDATE":
          setExistenceProductsUpdate(item.isEnable);
          break;

        //Traslado de Producto
        case "PRODUCT TRANSLATE VER":
          setProductTraslateVer(item.isEnable);
          break;
        case "PRODUCT TRANSLATE CREATE":
          setProductTraslateCreate(item.isEnable);
          break;

        //Products
        case "PRODUCTS VER":
          setProductsVer(item.isEnable);
          break;
        case "PRODUCTS CREATE":
          setProductsCreate(item.isEnable);
          break;
        case "PRODUCTS UPDATE":
          setProductsUpdate(item.isEnable);
          break;
        case "PRODUCTS DELETE":
          setProductsDelete(item.isEnable);
          break;

        //Usuario
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

        //Roles
        case "ROLES VER":
          setRolesVer(item.isEnable);
          break;
        case "ROLES CREATE":
          setRolesCreate(item.isEnable);
          break;
        case "ROLES UPDATE":
          setRolesUpdate(item.isEnable);
          break;
        case "ROLES DELETE":
          setRolesDelete(item.isEnable);
          break;

        //Miscelaneos
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

        //Communities
        case "COMMUNITIES VER":
          setCommunitiesVer(item.isEnable);
          break;
        case "COMMUNITIES CREATE":
          setCommunitiesCreate(item.isEnable);
          break;
        case "COMMUNITIES UPDATE":
          setCommunitiesUpdate(item.isEnable);
          break;
        case "COMMUNITIES DELETE":
          setCommunitiesDelete(item.isEnable);
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
        //Ventas Producto
        case "SALES VER":
          item.isEnable = ventasVer;
          break;
        case "SALES CREATE":
          item.isEnable = ventasCreate;
          break;
        case "SALES DELETE":
          item.isEnable = ventasDelete;
          break;

        //Clientes
        case "CLIENTS VER":
          item.isEnable = clientsVer;
          break;
        case "CLIENTS CREATE":
          item.isEnable = clientsCreate;
          break;
        case "CLIENTS UPDATE":
          item.isEnable = clientsUpdate;
          break;
        case "CLIENTS DELETE":
          item.isEnable = clientsDelete;
          break;

        //Entrada Producto
        case "ENTRADAPRODUCTOS VER":
          item.isEnable = inProductsVer;
          break;
        case "ENTRADAPRODUCTOS CREATE":
          item.isEnable = inProductsCreate;
          break;
        case "ENTRADAPRODUCTOS UPDATE":
          item.isEnable = inProductsUpdate;
          break;

        //Existencias de Producto
        case "EXISTANCE VER":
          item.isEnable = ProductExistenceVer;
          break;

        case "EXISTANCE UPDATE":
          item.isEnable = ProductExistenceUpdate;
          break;

        //Traslado de Producto
        case "PRODUCT TRANSLATE VER":
          item.isEnable = productTraslateVer;
          break;
        case "PRODUCT TRANSLATE CREATE":
          item.isEnable = productTraslateCreate;
          break;

        //Products
        case "PRODUCTS VER":
          item.isEnable = productsVer;
          break;
        case "PRODUCTS CREATE":
          item.isEnable = productsCreate;
          break;
        case "PRODUCTS UPDATE":
          item.isEnable = productsUpdate;
          break;
        case "PRODUCTS DELETE":
          item.isEnable = productsDelete;
          break;

        //Usuario
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

        //Roles
        case "ROLES VER":
          item.isEnable = rolesVer;
          break;
        case "ROLES CREATE":
          item.isEnable = rolesCreate;
          break;
        case "ROLES UPDATE":
          item.isEnable = rolesUpdate;
          break;
        case "ROLES DELETE":
          item.isEnable = rolesDelete;
          break;

        //Miscelaneos
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

        //Comunidades
        case "COMMUNITIES VER":
          item.isEnable = communitiesVer;
          break;
        case "COMMUNITIES CREATE":
          item.isEnable = communitiesCreate;
          break;
        case "COMMUNITIES UPDATE":
          item.isEnable = communitiesUpdate;
          break;
        case "COMMUNITIES DELETE":
          item.isEnable = communitiesDelete;
          break;

        default:
          break;
      }
    });

    setIsLoading(true);
    const result = await updateRolAsync(token, editedRol);
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
    toastSuccess("Rol actualizado!");
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <div className="contenedor">
      <Divider />

      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
          marginTop: 20,
        }}
      >
        <div className="row justify-content-around align-items-center">
          <div className="col-sm-9 ">
            <TextField
              fullWidth
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

      <div className="row justify-content-around align-items-center mt-3">
        <div className="col-sm-6">
          {/* Modulo Ventas */}
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
                  Modulo Venta de Productos
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-4 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          disabled={!isEdit}
                          checked={ventasVer}
                          onChange={() => setVentasVer(!ventasVer)}
                        />
                      }
                      label="Ver"
                    />
                  </div>
                  <div className="col-sm-4 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          disabled={!isEdit}
                          checked={ventasCreate}
                          onChange={() => setVentasCreate(!ventasCreate)}
                        />
                      }
                      label="Crear"
                    />
                  </div>
                  <div className="col-sm-4 ">
                    <FormControlLabel
                      labelPlacement="top"
                      style={{
                        textAlign: "center",
                      }}
                      control={
                        <Checkbox
                          disabled={!isEdit}
                          checked={ventasDelete}
                          onChange={() => setVentasDelete(!ventasDelete)}
                        />
                      }
                      label="Anular"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          {/* Modulo Entrada de Productos */}
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
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Modulo Entrada de Productos
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-4 ">
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
                  <div className="col-sm-4 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          disabled={!isEdit}
                          checked={inProductsCreate}
                          onChange={() =>
                            setInProductsCreate(!inProductsCreate)
                          }
                        />
                      }
                      label="Crear"
                    />
                  </div>
                  <div className="col-sm-4 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          disabled={!isEdit}
                          checked={inProductsUpdate}
                          onChange={() =>
                            setInProductsUpdate(!inProductsUpdate)
                          }
                        />
                      }
                      label="Editar"
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
                          disabled={!isEdit}
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
                          disabled={!isEdit}
                          checked={productTraslateCreate}
                          onChange={() =>
                            setProductTraslateCreate(!productTraslateCreate)
                          }
                        />
                      }
                      label="Crear"
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
                          disabled={!isEdit}
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
                          disabled={!isEdit}
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
          {/* Modulo Clientes */}
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
                  Modulo Clientes
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-3 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          disabled={!isEdit}
                          checked={clientsVer}
                          onChange={() => setClientsVer(!clientsVer)}
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
                          checked={clientsCreate}
                          onChange={() => setClientsCreate(!clientsCreate)}
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
                          checked={clientsUpdate}
                          onChange={() => setClientsUpdate(!clientsUpdate)}
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
                          checked={clientsDelete}
                          onChange={() => setClientsDelete(!clientsDelete)}
                        />
                      }
                      label="Eliminar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          {/* Modulo Existencia de Productos */}
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
                  Modulo Existencia de Productos
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-3 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          disabled={!isEdit}
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
                          disabled={!isEdit}
                          checked={ProductExistenceUpdate}
                          onChange={() =>
                            setExistenceProductsUpdate(!ProductExistenceUpdate)
                          }
                        />
                      }
                      label="Editar"
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
                          disabled={!isEdit}
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
                          disabled={!isEdit}
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
                          disabled={!isEdit}
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
                          disabled={!isEdit}
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
                          disabled={!isEdit}
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
                          disabled={!isEdit}
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
                          disabled={!isEdit}
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
                          disabled={!isEdit}
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

          {/* Modulo Ubicaciones */}
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
                  Modulo Ubicaciones
                </Typography>
                <Divider />
                <div className="row justify-content-around align-items-center">
                  <div className="col-sm-3 ">
                    <FormControlLabel
                      labelPlacement="top"
                      control={
                        <Checkbox
                          disabled={!isEdit}
                          checked={communitiesVer}
                          onChange={() => setCommunitiesVer(!communitiesVer)}
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
                          checked={communitiesCreate}
                          onChange={() =>
                            setCommunitiesCreate(!communitiesCreate)
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
                          disabled={!isEdit}
                          checked={communitiesUpdate}
                          onChange={() =>
                            setCommunitiesUpdate(!communitiesUpdate)
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
                          disabled={!isEdit}
                          checked={communitiesDelete}
                          onChange={() =>
                            setCommunitiesDelete(!communitiesDelete)
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
      </div>

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
    </div>
  );
};

export default EditRol;
