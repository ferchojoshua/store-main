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
  Stack,
  Grid,
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
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import "./style.css";

const EditRol = ({ setShowModal, selectedRol }) => {
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

  const [isEdit, setIsEdit] = useState(false);

  const editedRol = selectedRol;

  const [rolName, setRolName] = useState(selectedRol.roleName);

  const [ventasVer, setVentasVer] = useState(false);
  const [ventasCreate, setVentasCreate] = useState(false);
  const [ventasDelete, setVentasDelete] = useState(false);
  const [ventasFacturacion, setVentasFacturacion] = useState(false);
  const [ventasCaja, setVentasCaja] = useState(false);

  const [pagoCreate, setPagoCreate] = useState(false);
  const [pagoEspecificoCreate, setPagoEspecificoCreate] = useState(false);

  const [cajaVer, setCajaVer] = useState(false);
  const [cajaCreate, setCajaCreate] = useState(false);

  const [clientsVer, setClientsVer] = useState(false);
  const [clientsCreate, setClientsCreate] = useState(false);
  const [clientsUpdate, setClientsUpdate] = useState(false);
  const [clientsDelete, setClientsDelete] = useState(false);

  const [inProductsVer, setInProductsVer] = useState(false);
  const [inProductsCreate, setInProductsCreate] = useState(false);
  const [inProductsUpdate, setInProductsUpdate] = useState(false);

  const [ProductExistenceVer, setExistenceProductsVer] = useState(false);
  const [kardexVer, setKardexVer] = useState(false);
  const [ProductExistenceUpdate, setExistenceProductsUpdate] = useState(false);

  const [productTraslateVer, setProductTraslateVer] = useState(false);
  const [productTraslateCreate, setProductTraslateCreate] = useState(false);

  const [productsVer, setProductsVer] = useState(false);
  const [productsCreate, setProductsCreate] = useState(false);
  const [productsUpdate, setProductsUpdate] = useState(false);
  const [productsDelete, setProductsDelete] = useState(false);

  //Reportes
  const [masterVentasVer, setMasterVentasVer] = useState(false);
  const [cXCobrarVer, setCXCobrarVer] = useState(false);
  const [prodVendidos, setProdVendidos] = useState(false);
  const [prodVendidosUtils, setProdVendidosUtils] = useState(false);
  const [cierreDiario, setCierreDiario] = useState(false);
  const [cajaChica, setCajaChica] = useState(false);

  const [contVer, setContVer] = useState(false);
  const [contCreate, setContCreate] = useState(false);
  const [contUpdate, setContUpdate] = useState(false);
  const [contDelete, setContDelete] = useState(false);

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
        // Ventas Producto
        case "SALES VER":
          setVentasVer(item.isEnable);
          break;
        case "SALES CREATE":
          setVentasCreate(item.isEnable);
          break;
        case "SALES DELETE":
          setVentasDelete(item.isEnable);
          break;
        case "SALES FACTURACION":
          setVentasFacturacion(item.isEnable);
          break;
        case "SALES CAJA":
          setVentasCaja(item.isEnable);
          break;

        //Ventas Producto
        case "PAGO CREATE":
          setPagoCreate(item.isEnable);
          break;

        case "PAGO ESPECIFICO CREATE":
          setPagoEspecificoCreate(item.isEnable);
          break;

        //Modulo Caja
        case "CAJA VER":
          setCajaVer(item.isEnable);
          break;

        case "CAJA CREATE":
          setCajaCreate(item.isEnable);
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
        case "KARDEX VER":
          setKardexVer(item.isEnable);
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

        //Reportes
        case "MASTER VENTAS VER":
          setMasterVentasVer(item.isEnable);
          break;
        case "CUENTASXCOBRAR VER":
          setCXCobrarVer(item.isEnable);
          break;
        case "PRODVENDIDOS VER":
          setProdVendidos(item.isEnable);
          break;
        case "PRODVENDIDOSUTIL VER":
          setProdVendidosUtils(item.isEnable);
          break;
        case "CIERREDIARIO VER":
          setCierreDiario(item.isEnable);
          break;
        case "CAJACHICA VER":
          setCajaChica(item.isEnable);
          break;

        //Contabilidad
        case "CONT VER":
          setContVer(item.isEnable);
          break;
        case "CONT CREATE":
          setContCreate(item.isEnable);
          break;
        case "CONT UPDATE":
          setContUpdate(item.isEnable);
          break;
        case "CONT DELETE":
          setContDelete(item.isEnable);
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
  }, [reload]);

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
        case "SALES FACTURACION":
          item.isEnable = ventasFacturacion;
          break;
        case "SALES CAJA":
          item.isEnable = ventasCaja;
          break;

        //Ventas Producto
        case "PAGO CREATE":
          item.isEnable = pagoCreate;
          break;

        case "PAGO ESPECIFICO CREATE":
          item.isEnable = pagoEspecificoCreate;
          break;

        //Caja ver
        case "CAJA VER":
          item.isEnable = cajaVer;
          break;

        case "CAJA CREATE":
          item.isEnable = cajaCreate;
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

        case "KARDEX VER":
          item.isEnable = kardexVer;
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

        //Reportes
        case "MASTER VENTAS VER":
          item.isEnable = masterVentasVer;
          break;
        case "CUENTASXCOBRAR VER":
          item.isEnable = cXCobrarVer;
          break;
        case "PRODVENDIDOS VER":
          item.isEnable = prodVendidos;
          break;
        case "PRODVENDIDOSUTIL VER":
          item.isEnable = prodVendidosUtils;
          break;
        case "CIERREDIARIO VER":
          item.isEnable = cierreDiario;
          break;
        case "CAJACHICA VER":
          item.isEnable = cajaChica;
          break;

        //Contabilidad
        case "CONT VER":
          item.isEnable = contVer;
          break;
        case "CONT CREATE":
          item.isEnable = contCreate;
          break;
        case "CONT UPDATE":
          item.isEnable = contUpdate;
          break;
        case "CONT DELETE":
          item.isEnable = contDelete;
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
    toastSuccess("Rol actualizado!");
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <div>
      <Divider />

      {isAccess(access, "ROLES UPDATE") ? (
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
            marginTop: 20,
          }}
        >
          <Stack
            spacing={3}
            direction="row"
            display="flex"
            justifyContent="space-around"
          >
            <TextField
              fullWidth
              variant="standard"
              onChange={(e) => setRolName(e.target.value.toUpperCase())}
              label={"Nombre rol"}
              value={rolName}
              disabled={isEdit ? false : true}
            />
            {isAccess(access, "ROLES UPDATE") ? (
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
            ) : (
              <></>
            )}
          </Stack>
        </Paper>
      ) : (
        <></>
      )}

      <Typography
        style={{
          marginTop: 20,
          fontSize: 25,
          color: "#2196f3",
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        Accesos de modulo
      </Typography>
      <Divider />

      {/* Modulo Ventas */}
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 10,
        }}
      >
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
        <Stack direction="row" display="flex" justifyContent="space-around">
          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                disabled={!isEdit}
                checked={ventasVer}
                onChange={() => setVentasVer(!ventasVer)}
              />
            }
            label="Estado de Cuenta"
          />

          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                disabled={!isEdit}
                checked={ventasCreate}
                onChange={() => setVentasCreate(!ventasCreate)}
              />
            }
            label="Venta Directa"
          />

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

          <FormControlLabel
            labelPlacement="top"
            style={{
              textAlign: "center",
            }}
            control={
              <Checkbox
                disabled={!isEdit}
                checked={ventasFacturacion}
                onChange={() => setVentasFacturacion(!ventasFacturacion)}
              />
            }
            label="Facturacion"
          />

          <FormControlLabel
            labelPlacement="top"
            style={{
              textAlign: "center",
            }}
            control={
              <Checkbox
                disabled={!isEdit}
                checked={ventasCaja}
                onChange={() => setVentasCaja(!ventasCaja)}
              />
            }
            label="Caja"
          />
        </Stack>
      </Paper>

      <Grid spacing={2} container>
        <Grid item sm={12} md={6}>
          {/* Modulo Caja */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
            <Typography
              style={{
                fontSize: 17,
                color: "#2196f3",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Modulo Caja Chica
            </Typography>
            <Divider />
            <Stack direction="row" display="flex" justifyContent="space-around">
              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={cajaVer}
                    onChange={() => setCajaVer(!cajaVer)}
                  />
                }
                label="Ver"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={cajaCreate}
                    onChange={() => setCajaCreate(!cajaCreate)}
                  />
                }
                label="Crear"
              />
            </Stack>
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
            <Stack direction="row" display="flex" justifyContent="space-around">
              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={inProductsVer}
                    onChange={() => setInProductsVer(!inProductsVer)}
                  />
                }
                label="Ver"
              />

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
            </Stack>
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
            <Stack direction="row" display="flex" justifyContent="space-around">
              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={productTraslateVer}
                    onChange={() => setProductTraslateVer(!productTraslateVer)}
                  />
                }
                label="Ver"
              />

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
            </Stack>
          </Paper>
        </Grid>
        <Grid item sm={12} md={6}>
          {/* Modulo Abonos */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
            <Typography
              style={{
                fontSize: 17,
                color: "#2196f3",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Modulo Abonos
            </Typography>
            <Divider />
            <Stack direction="row" display="flex" justifyContent="space-around">
              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={pagoCreate}
                    onChange={() => setPagoCreate(!pagoCreate)}
                  />
                }
                label="Crear"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={pagoEspecificoCreate}
                    onChange={() =>
                      setPagoEspecificoCreate(!pagoEspecificoCreate)
                    }
                  />
                }
                label="Especifico"
              />
            </Stack>
          </Paper>

          {/* Modulo Clientes */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
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
            <Stack direction="row" display="flex" justifyContent="space-around">
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
            </Stack>
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
            <Stack direction="row" display="flex" justifyContent="space-around">
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

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={kardexVer}
                    onChange={() => setKardexVer(!kardexVer)}
                  />
                }
                label="Kardex"
              />

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
            </Stack>
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
            <Stack direction="row" display="flex" justifyContent="space-around">
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
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Modulo Reportes */}
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 10,
          marginTop: 20,
        }}
      >
        <Typography
          style={{
            fontSize: 17,
            color: "#2196f3",
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          Modulo Reportes
        </Typography>
        <Divider />
        <Stack direction="row" display="flex" justifyContent="space-around">
          <FormControlLabel
            style={{ textAlign: "center" }}
            labelPlacement="top"
            control={
              <Checkbox
                disabled={!isEdit}
                checked={masterVentasVer}
                onChange={() => setMasterVentasVer(!masterVentasVer)}
              />
            }
            label="Master Ventas"
          />

          <FormControlLabel
            style={{ textAlign: "center" }}
            labelPlacement="top"
            control={
              <Checkbox
                disabled={!isEdit}
                checked={cXCobrarVer}
                onChange={() => setCXCobrarVer(!cXCobrarVer)}
              />
            }
            label="C. por Cobrar"
          />

          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
            <Stack direction="row" justifyContent="space-around">
              <FormControlLabel
                style={{ textAlign: "center" }}
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={prodVendidos}
                    onChange={() => setProdVendidos(!prodVendidos)}
                  />
                }
                label="Productos Vendidos"
              />
              <FormControlLabel
                style={{ textAlign: "center" }}
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={prodVendidosUtils}
                    onChange={() => setProdVendidosUtils(!prodVendidosUtils)}
                  />
                }
                label="Ver Utilidad"
              />
            </Stack>
          </Paper>

          <FormControlLabel
            style={{ textAlign: "center" }}
            labelPlacement="top"
            control={
              <Checkbox
                disabled={!isEdit}
                checked={cierreDiario}
                onChange={() => setCierreDiario(!cierreDiario)}
              />
            }
            label="Cierre Diario"
          />

          <FormControlLabel
            style={{ textAlign: "center" }}
            labelPlacement="top"
            control={
              <Checkbox
                disabled={!isEdit}
                checked={cajaChica}
                onChange={() => setCajaChica(!cajaChica)}
              />
            }
            label="Caja Chica"
          />
        </Stack>
      </Paper>

      {/* Modulo Contabilidad */}
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 10,
          marginTop: 20,
        }}
      >
        <Typography
          style={{
            fontSize: 17,
            color: "#2196f3",
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          Modulo Contabilidad
        </Typography>
        <Divider />
        <Stack direction="row" display="flex" justifyContent="space-around">
          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                checked={contVer}
                disabled={!isEdit}
                onChange={() => setContVer(!contVer)}
              />
            }
            label="Ver"
          />

          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                disabled={!isEdit}
                checked={contCreate}
                onChange={() => setContCreate(!contCreate)}
              />
            }
            label="Crear"
          />

          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                disabled={!isEdit}
                checked={contUpdate}
                onChange={() => setContUpdate(!contUpdate)}
              />
            }
            label="Editar"
          />

          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                disabled={!isEdit}
                checked={contDelete}
                onChange={() => setContDelete(!contDelete)}
              />
            }
            label="Eliminar"
          />
        </Stack>
      </Paper>

      <Grid spacing={2} container>
        <Grid item sm={12} md={6}>
          {/* Modulo Seguridad de Usuarios */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
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
            <Stack direction="row" display="flex" justifyContent="space-around">
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
            </Stack>
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
            <Stack direction="row" display="flex" justifyContent="space-around">
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
            </Stack>
          </Paper>
        </Grid>
        <Grid item sm={12} md={6}>
          {/* Modulo Seguridad de Roles */}
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 10,
              marginTop: 20,
            }}
          >
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
            <Stack direction="row" display="flex" justifyContent="space-around">
              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={rolesVer}
                    onChange={() => setRolesVer(!rolesVer)}
                  />
                }
                label="Ver"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={rolesCreate}
                    onChange={() => setRolesCreate(!rolesCreate)}
                  />
                }
                label="Crear"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={rolesUpdate}
                    onChange={() => setRolesUpdate(!rolesUpdate)}
                  />
                }
                label="Editar"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={rolesDelete}
                    onChange={() => setRolesDelete(!rolesDelete)}
                  />
                }
                label="Eliminar"
              />
            </Stack>
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
            <Stack direction="row" display="flex" justifyContent="space-around">
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

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={communitiesCreate}
                    onChange={() => setCommunitiesCreate(!communitiesCreate)}
                  />
                }
                label="Crear"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={communitiesUpdate}
                    onChange={() => setCommunitiesUpdate(!communitiesUpdate)}
                  />
                }
                label="Editar"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    disabled={!isEdit}
                    checked={communitiesDelete}
                    onChange={() => setCommunitiesDelete(!communitiesDelete)}
                  />
                }
                label="Eliminar"
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {isAccess(access, "ROLES UPDATE") ? (
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default EditRol;
