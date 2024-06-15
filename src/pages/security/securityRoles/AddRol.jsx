import React, { useContext, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import { TimePicker } from "@mui/lab";

import {
  TextField,
  Button,
  Divider,
  Typography,
  Switch,
  FormControlLabel,
  Checkbox,
  Paper,
  Grid,
  Stack,
} from "@mui/material";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import { createRolAsync } from "../../../services/RolApi";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import "./style.css";
import moment from "moment";

const AddRol = ({ setShowModal }) => {
  let ruta = getRuta();

  const { setIsLoading, reload, setReload, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [rolName, setRolName] = useState("");
  const token = getToken();

  var date = new Date();
  const [horaDesde, setHoraDesde] = useState(new Date(date.setHours(6, 0)));
  const [horaHasta, setHoraHasta] = useState(new Date(date.setHours(18, 0)));

  const [isFullAccess, setIsFullAccess] = useState(false);

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

    //BUSSINES
    const [providerVer, setProviderVer] = useState(false);
    const [providerCreate, setProviderCreate] = useState(false);
    const [providerUpdate, setProviderUpdate] = useState(false);
    const [providerDelete, setProviderDelete] = useState(false);
  
    //TYPEBUSINESS
    const [typeBusinessVer, setTypeBusinessVer] = useState(false);
    const [typeBusinessCreate, setTypeBusinessCreate] = useState(false);
    const [typeBusinessUpdate, setTypeBusinessUpdate] = useState(false);
    const [typeBusinessDelete, setTypeBusinessDelete] = useState(false);
      

      
    //WAREHOUSES
    const [warehousesVer, setWarehousesVer] = useState(false);
    const [warehousesCreate, setWarehousesCreate] = useState(false);
    const [warehousesUpdate, setWarehousesUpdate] = useState(false);
    const [warehousesDelete, setWarehousesDelete] = useState(false);   
    
     //PRODUCTS RECAL
    const [productsrecalVer, setProductsRecalVer] = useState(false);
    const [productsrecalCreate, setProductsRecalCreate] = useState(false);
    const [productsrecalUpdate, setProductsRecalUpdate] = useState(false);
    const [productsrecalDelete, setProductsRecalDelete] = useState(false);
      

  //Reportes
  const [masterVentasVer, setMasterVentasVer] = useState(false);
  const [masterVentasUtility, setMasterVentasUtility] = useState(false);
  const [cXCobrarVer, setCXCobrarVer] = useState(false);
  const [prodVendidos, setProdVendidos] = useState(false);
  const [prodNoVendidos, setProdNoVendidos] = useState(false);
  const [prodVendidosUtils, setProdVendidosUtils] = useState(false);
  const [cierreDiario, setCierreDiario] = useState(false);
  const [cajaChica, setCajaChica] = useState(false);
  const [ingresos, setIngresos] = useState(false);
  const [compras, setCompras] = useState(false);
  const [trasladoInventario, setTrasladoInventario] = useState(false);
  const [reporteInventario , setReporteInventario ] = useState(false);
    const [costover, setCostoVer] = useState(false);

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

  const handleChangeFullAccess = () => {
    setIsFullAccess(!isFullAccess);

    setVentasVer(!isFullAccess);
    setVentasCreate(!isFullAccess);
    setVentasDelete(!isFullAccess);
    setVentasFacturacion(!isFullAccess);
    setVentasCaja(!isFullAccess);

    setPagoCreate(!isFullAccess);
    setPagoEspecificoCreate(!isFullAccess);

    setCajaVer(!isFullAccess);
    setCajaCreate(!isFullAccess);

    setClientsVer(!isFullAccess);
    setClientsCreate(!isFullAccess);
    setClientsUpdate(!isFullAccess);
    setClientsDelete(!isFullAccess);

    setInProductsVer(!isFullAccess);
    setInProductsCreate(!isFullAccess);
    setInProductsUpdate(!isFullAccess);

    setExistenceProductsVer(!isFullAccess);
    setKardexVer(!isFullAccess);
    setExistenceProductsUpdate(!isFullAccess);

    setProductTraslateVer(!isFullAccess);
    setProductTraslateCreate(!isFullAccess);

    setProductsVer(!isFullAccess);
    setProductsCreate(!isFullAccess);
    setProductsUpdate(!isFullAccess);
    setProductsDelete(!isFullAccess);

//PROVIDERS
    setProviderVer(!isFullAccess);
    setProviderCreate(!isFullAccess);
    setProviderUpdate(!isFullAccess);
    setProviderDelete(!isFullAccess);

//TYPEBUSINESS
setTypeBusinessVer(!isFullAccess);
setTypeBusinessCreate(!isFullAccess);
setTypeBusinessUpdate(!isFullAccess);
setTypeBusinessDelete(!isFullAccess);

//WAREHOUSES
setWarehousesVer(!isFullAccess);
setWarehousesCreate(!isFullAccess);
setWarehousesUpdate(!isFullAccess);
setWarehousesDelete(!isFullAccess);

//PRODUCTS RECAL
setProductsRecalVer(!isFullAccess);
setProductsRecalCreate(!isFullAccess);
setProductsRecalUpdate(!isFullAccess);
setProductsRecalDelete(!isFullAccess);



    //Reports
    setMasterVentasVer(!isFullAccess);
    setMasterVentasUtility(!isFullAccess);
    setCXCobrarVer(!isFullAccess);
    setProdVendidos(!isFullAccess);
    setProdNoVendidos(!isFullAccess);
    setProdVendidosUtils(!isFullAccess);
    setCierreDiario(!isFullAccess);
    setCajaChica(!isFullAccess);
    setIngresos(!isFullAccess);
    setCompras(!isFullAccess);
    setTrasladoInventario(!isFullAccess);
    setReporteInventario(!isFullAccess);

    setContVer(!isFullAccess);
    setContCreate(!isFullAccess);
    setContUpdate(!isFullAccess);
    setContDelete(!isFullAccess);

    setUserVer(!isFullAccess);
    setUserCreate(!isFullAccess);
    setUserUpdate(!isFullAccess);
    setUserDelete(!isFullAccess);

    setRolesVer(!isFullAccess);
    setRolesCreate(!isFullAccess);
    setRolesUpdate(!isFullAccess);
    setRolesDelete(!isFullAccess);

    setMiscelaneosVer(!isFullAccess);
    setMiscelaneosCreate(!isFullAccess);
    setMiscelaneosUpdate(!isFullAccess);
    setMiscelaneosDelete(!isFullAccess);

    setCommunitiesVer(!isFullAccess);
    setCommunitiesCreate(!isFullAccess);
    setCommunitiesUpdate(!isFullAccess);
    setCommunitiesDelete(!isFullAccess);
  };

  const saveRol = async () => {
    if (rolName === "") {
      toastError("Ingrese una nombre al nuevo rol");
      return;
    }
    if (!moment(horaDesde).isValid()) {
      toastError("Ingrese una fecha de inicio valida");
      return;
    }
    if (!moment(horaHasta).isValid()) {
      toastError("Ingrese una fecha de final valida");
      return;
    }

    let fechaD = moment(horaDesde).format("YYYY-MM-DD");
    let horaD = moment(horaDesde).format("HH:mm");
    let fhDesde = new Date(`${fechaD}T${horaD}:00.00Z`);
    fhDesde.setSeconds(0);
    fhDesde.toISOString();

    let fechaH = moment(horaHasta).format("YYYY-MM-DD");
    let horaH = moment(horaHasta).format("HH:mm");
    let fhHasta = new Date(`${fechaH}T${horaH}:00.00Z`);
    fhHasta.setSeconds(0);
    fhHasta.toISOString();

    const data = {
      permissions: [
        //Venta Producto
        {
          description: "SALES VER",
          IsEnable: ventasVer,
        },
        {
          description: "SALES CREATE",
          IsEnable: ventasCreate,
        },
        {
          description: "SALES DELETE",
          IsEnable: ventasDelete,
        },
        {
          description: "SALES DELETE",
          IsEnable: ventasDelete,
        },
        {
          description: "SALES DELETE",
          IsEnable: ventasDelete,
        },
        {
          description: "SALES FACTURACION",
          IsEnable: ventasDelete,
        },
        {
          description: "SALES CAJA",
          IsEnable: ventasDelete,
        },

        //Modulo Pagos
        {
          description: "PAGO CREATE",
          IsEnable: pagoCreate,
        },

        {
          description: "PAGO ESPECIFICO CREATE",
          IsEnable: pagoEspecificoCreate,
        },

        //Modulo Caja Chica
        {
          description: "CAJA VER",
          IsEnable: cajaVer,
        },
        {
          description: "CAJA  CREATE",
          IsEnable: cajaCreate,
        },

        //Modulo Clientes
        {
          description: "CLIENTS VER",
          IsEnable: clientsVer,
        },
        {
          description: "CLIENTS CREATE",
          IsEnable: clientsCreate,
        },
        {
          description: "CLIENTS UPDATE",
          IsEnable: clientsUpdate,
        },
        {
          description: "CLIENTS DELETE",
          IsEnable: clientsDelete,
        },
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
        //Existencias de Producto
        {
          description: "EXISTANCE VER",
          IsEnable: ProductExistenceVer,
        },
        {
          description: "KARDEX VER",
          IsEnable: kardexVer,
        },
        {
          description: "EXISTANCE UPDATE",
          IsEnable: ProductExistenceUpdate,
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

          //PROVIDERS
          {
            description: "PROVIDERS VER",
            IsEnable: rolesVer,
          },
          {
            description: "PROVIDERS CREATE",
            IsEnable: rolesCreate,
          },
          {
            description: "PROVIDERS UPDATE",
            IsEnable: rolesUpdate,
          },
          {
            description: "PROVIDERS DELETE",
            IsEnable: rolesDelete,
          },

              //TYPEBUSINESS
              {
                description: "TYPEBUSINESS VER",
                IsEnable: rolesVer,
              },
              {
                description: "TYPEBUSINESS CREATE",
                IsEnable: rolesCreate,
              },
              {
                description: "TYPEBUSINESS UPDATE",
                IsEnable: rolesUpdate,
              },
              {
                description: "TYPEBUSINESS DELETE",
                IsEnable: rolesDelete,
              },       
              
              //WAREHOUSES
              {
                description: "WAREHOUSES VER",
                IsEnable: rolesVer,
              },
              {
                description: "WAREHOUSES CREATE",
                IsEnable: rolesCreate,
              },
              {
                description: "WAREHOUSES UPDATE",
                IsEnable: rolesUpdate,
              },
              {
                description: "WAREHOUSES DELETE",
                IsEnable: rolesDelete,
              },

              
                //Products Recall
                {
                  description: "PRODUCTS RECAL VER",
                  IsEnable: rolesVer,
                },
                {
                  description: "PRODUCTS RECAL CREATE",
                  IsEnable: rolesCreate,
                },
                {
                  description: "PRODUCTS RECAL UPDATE",
                  IsEnable: rolesUpdate,
                },
                {
                  description: "PRODUCTS RECAL DELETE",
                  IsEnable: rolesDelete,
                },


        //Reportes
        {
          description: "MASTER VENTAS VER",
          IsEnable: masterVentasVer,
        },
        {
          description: "MASTER VENTAS UTILIDAD",
          IsEnable: masterVentasUtility,
        },
        {
          description: "CUENTASXCOBRAR VER",
          IsEnable: cXCobrarVer,
        },
        {
          description: "PRODVENDIDOS VER",
          IsEnable: prodVendidos,
        },
        {
          description: "PRODNOVENDIDOS VER",
          IsEnable: prodNoVendidos,
        },
        {
          description: "PRODVENDIDOSUTIL VER",
          IsEnable: prodVendidosUtils,
        },
        {
          description: "CIERREDIARIO VER",
          IsEnable: cierreDiario,
        },
        {
          description: "CAJACHICA VER",
          IsEnable: cajaChica,
        },
        {
          description: "INGRESOS VER",
          IsEnable: ingresos,
        },
        {
          description: "REPORTECOMPRAS VER",
          IsEnable: compras,
        },
        {
          description: "REPORTETRASLADOS VER",
          IsEnable: trasladoInventario,
        },
        {
          description: "INVENTARIO VER",
          IsEnable: reporteInventario,
        },
        {
        description: "COSTO VER",
        IsEnable: costover,
        },

        //Contabilidad
        {
          description: "CONT VER",
          IsEnable: contVer,
        },
        {
          description: "CONT CREATE",
          IsEnable: contCreate,
        },
        {
          description: "CONT UPDATE",
          IsEnable: contUpdate,
        },
        {
          description: "CONT DELETE",
          IsEnable: contDelete,
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
        //Comunidades
        {
          description: "COMMUNITIES VER",
          IsEnable: miscelaneosVer,
        },
        {
          description: "COMMUNITIES CREATE",
          IsEnable: miscelaneosCreate,
        },
        {
          description: "COMMUNITIES UPDATE",
          IsEnable: miscelaneosUpdate,
        },
        {
          description: "COMMUNITIES DELETE",
          IsEnable: miscelaneosDelete,
        },
      ],
      roleName: rolName,
      startOperations: new Date(fhDesde),
      endOperations: new Date(fhHasta),
    };

    setIsLoading(true);
    const result = await createRolAsync(token, data);
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
    toastSuccess("Rol creado");
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <div>
      <hr />

      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            variant="standard"
            onChange={(e) => setRolName(e.target.value.toUpperCase())}
            label={"Nombre rol"}
            value={rolName}
          />

          <TimePicker
            label="Inicia Operaciones"
            value={horaDesde}
            ampm
            onChange={(newValue) => {
              setHoraDesde(newValue);
            }}
            renderInput={(params) => (
              <TextField required fullWidth variant="standard" {...params} />
            )}
          />

          <TimePicker
            label="Termina Operaciones"
            value={horaHasta}
            ampm
            onChange={(newValue) => {
              setHoraHasta(newValue);
            }}
            renderInput={(params) => (
              <TextField required fullWidth variant="standard" {...params} />
            )}
          />
        </Stack>
      </Paper>

      <Typography
        style={{
          marginTop: 20,
          fontSize: 25,
          color: "#4caf50",
          fontWeight: "bold",
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
          fontWeight: "bold",
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
                checked={ventasDelete}
                onChange={() => setVentasDelete(!ventasDelete)}
              />
            }
            label="Anular "
          />

          <FormControlLabel
            labelPlacement="top"
            style={{
              textAlign: "center",
            }}
            control={
              <Checkbox
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
                checked={ventasCaja}
                onChange={() => setVentasCaja(!ventasCaja)}
              />
            }
            label="Caja"
          />
        </Stack>
      </Paper>

      <Grid spacing={2} container>
        <Grid item xs={12} md={6}>
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
                 ProveedoresModulo Proveedores   checked={productTraslateCreate}
                    onChange={() =>
                      setProductTraslateCreate(!productTraslateCreate)
                    }
                  />
                }
                label="Crear"
              />
            </Stack>            
          </Paper>
             {/* Modulo Proveedores */}
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
              Modulo Proveedores
            </Typography>
            <Divider />
            <Stack direction="row" display="flex" justifyContent="space-around">
              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={providerVer}
                    onChange={() => setProviderVer(!providerVer)}
                  />
                }
                label="Ver"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={providerCreate}
                    onChange={() => setProviderCreate(!providerCreate)}
                  />
                }
                label="Crear"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={providerUpdate}
                    onChange={() => setProviderUpdate(!providerUpdate)}
                  />
                }
                label="Editar"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={providerDelete}
                    onChange={() => setProviderDelete(!providerDelete)}
                  />
                }
                label="Eliminar"
              />
            </Stack>
          </Paper>
           {/* Modulo Almacen */}
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
              Modulo Almacen
            </Typography>
            <Divider />
            <Stack direction="row" display="flex" justifyContent="space-around">
              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={warehousesVer}
                    onChange={() => setWarehousesVer(!warehousesVer)}
                  />
                }
                label="Ver"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={warehousesCreate}
                    onChange={() => setWarehousesCreate(!warehousesCreate)}
                  />
                }
                label="Crear"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={warehousesUpdate}
                    onChange={() => setWarehousesUpdate(!warehousesUpdate)}
                  />
                }
                label="Editar"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={warehousesDelete}
                    onChange={() => setWarehousesDelete(!warehousesDelete)}
                  />
                }
                label="Eliminar"
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
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
                    checked={clientsCreate}
                    onChange={() =>   (!clientsCreate)}
                  />
                }
                label="Crear"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
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
                    checked={productsDelete}
                    onChange={() => setProductsDelete(!productsDelete)}
                  />
                }
                label="Eliminar"
              />
            </Stack>
          </Paper>        
          {/* Modulo Products Recal */}
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
              Modulo Ajustes de Valor
              </Typography>
            <Divider />
            <Stack direction="row" display="flex" justifyContent="space-around">
              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={productsrecalVer}
                    onChange={() => setProductsRecalVer(!productsrecalVer)}
                  />
                }
                label="Ver"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={productsrecalCreate}
                    onChange={() => setProductsRecalCreate(!productsrecalCreate)}
                  />
                }
                label="Crear"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={productsrecalUpdate}
                    onChange={() => setProductsRecalUpdate(!productsrecalUpdate)}
                  />
                }
                label="Editar"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={productsrecalDelete}
                    onChange={() => setProductsRecalDelete(!productsrecalDelete)}
                  />
                }
                label="Eliminar"
              />
            </Stack>
          </Paper> 
          {/* Modulo Tipo Negocio */}
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
              Modulo Tipo Negocio
            </Typography>
            <Divider />
            <Stack direction="row" display="flex" justifyContent="space-around">
              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={typeBusinessVer}
                    onChange={() => setTypeBusinessVer(!typeBusinessVer)}
                  />
                }
                label="Ver"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={typeBusinessCreate}
                    onChange={() => setTypeBusinessCreate(!typeBusinessCreate)}
                  />
                }
                label="Crear"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={typeBusinessUpdate}
                    onChange={() => setTypeBusinessUpdate(!typeBusinessUpdate)}
                  />
                }
                label="Editar"
              />

              <FormControlLabel
                labelPlacement="top"
                control={
                  <Checkbox
                    checked={typeBusinessDelete}
                    onChange={() => setTypeBusinessDelete(!typeBusinessDelete)}
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
        <Stack>
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            display="flex"
            justifyContent="space-around"
            spacing={2}
          >
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
                Master de Ventas
              </Typography>

              <Divider />

              <Stack direction="row" justifyContent="space-around">
                <FormControlLabel
                  labelPlacement="top"
                  style={{ textAlign: "center" }}
                  control={
                    <Checkbox
                      checked={masterVentasVer}
                      onChange={() => setMasterVentasVer(!masterVentasVer)}
                    />
                  }
                  label="Ver Reporte"
                />

                <FormControlLabel
                  labelPlacement="top"
                  style={{ textAlign: "center" }}
                  control={
                    <Checkbox
                      checked={masterVentasUtility}
                      onChange={() =>
                        setMasterVentasUtility(!masterVentasUtility)
                      }
                    />
                  }
                  label="Ver % Utilidad"
                />
              </Stack>
            </Paper>

            

            <FormControlLabel
              labelPlacement="top"
              style={{ textAlign: "center" }}
              control={
                <Checkbox
                  checked={cXCobrarVer}
                  onChange={() => setCXCobrarVer(!cXCobrarVer)}
                />
              }
              label="C. por Cobrar"
            />

            <FormControlLabel
              labelPlacement="top"
              style={{ textAlign: "center" }}
              control={
                <Checkbox
                  checked={prodNoVendidos}
                  onChange={() => setProdNoVendidos(!prodNoVendidos)}
                />
              }
              label="Productos no Vendidos"
            />

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
                Productos Vendidos
              </Typography>

              <Divider />

              <Stack direction="row" justifyContent="space-around">
                <FormControlLabel
                  labelPlacement="top"
                  style={{ textAlign: "center" }}
                  control={
                    <Checkbox
                      checked={prodVendidos}
                      onChange={() => setProdVendidos(!prodVendidos)}
                    />
                  }
                  label="Ver Reporte"
                />

                <FormControlLabel
                  labelPlacement="top"
                  style={{ textAlign: "center" }}
                  control={
                    <Checkbox
                      checked={prodVendidosUtils}
                      onChange={() => setProdVendidosUtils(!prodVendidosUtils)}
                    />
                  }
                  label="Ver Utilidad"
                />
              </Stack>
            </Paper>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            display="flex"
            justifyContent="space-around"
            spacing={2}
            style={{ marginTop: 10 }}
          >
            <FormControlLabel
              labelPlacement="top"
              style={{ textAlign: "center" }}
              control={
                <Checkbox
                  checked={cierreDiario}
                  onChange={() => setCierreDiario(!cierreDiario)}
                />
              }
              label="Cierre Diario"
            />
            
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
                Reporte Inventario
              </Typography>

              <Divider />

              <Stack direction="row" justifyContent="space-around">
              <FormControlLabel
              labelPlacement="top"
              style={{ textAlign: "center" }}
              control={
                <Checkbox
                  checked={reporteInventario}
                  onChange={() => setReporteInventario(!reporteInventario)}
                />
              }
              label="Reportes Inventario"
            />
                 <FormControlLabel
                  labelPlacement="top"
                  style={{ textAlign: "center" }}
                  control={
                    <Checkbox
                      checked={costover}
                      onChange={() => setCostoVer(!costover)}
                    />
                  }
                  label="Ver Costos"
                />
              </Stack>
            </Paper>
    

            <FormControlLabel
              labelPlacement="top"
              style={{ textAlign: "center" }}
              control={
                <Checkbox
                  checked={cajaChica}
                  onChange={() => setCajaChica(!cajaChica)}
                />
              }
              label="Caja Chica"
            />

            <FormControlLabel
              labelPlacement="top"
              style={{ textAlign: "center" }}
              control={
                <Checkbox
                  checked={ingresos}
                  onChange={() => setIngresos(!ingresos)}
                />
              }
              label="Reporte de Ingresos"
            />

            <FormControlLabel
              labelPlacement="top"
              style={{ textAlign: "center" }}
              control={
                <Checkbox
                  checked={compras}
                  onChange={() => setCompras(!compras)}
                />
              }
              label="Reporte de Compras"
            />

            <FormControlLabel
              labelPlacement="top"
              style={{ textAlign: "center" }}
              control={
                <Checkbox
                  checked={trasladoInventario}
                  onChange={() => setTrasladoInventario(!trasladoInventario)}
                />
              }
              label="Traslado de Inventario"
            />
          </Stack>
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
                onChange={() => setContVer(!contVer)}
              />
            }
            label="Ver"
          />

          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
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
                checked={contDelete}
                onChange={() => setContDelete(!contDelete)}
              />
            }
            label="Eliminar"
          />
        </Stack>
      </Paper>

      <Grid spacing={2} container>
        <Grid item xs={12} md={6}>
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
                    checked={miscelaneosDelete}
                    onChange={() => setMiscelaneosDelete(!miscelaneosDelete)}
                  />
                }
                label="Eliminar"
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
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

       {/* Modulo Administracion */}
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
          Modulo Administracion
        </Typography>
        <Divider />
        <Stack direction="row" display="flex" justifyContent="space-around">
          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                checked={contVer}
                onChange={() => setRolesVer(!rolesVer)}
              />
            }
            label="Ver"
          />

          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                checked={contCreate}
                onChange={() => setRolesCreate(!rolesCreate)}
              />
            }
            label="Crear"
          />

          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                checked={contUpdate}
                onChange={() => setRolesUpdate(!rolesUpdate)}
              />
            }
            label="Editar"
          />

          <FormControlLabel
            labelPlacement="top"
            control={
              <Checkbox
                checked={contDelete}
                onChange={() => setRolesDelete(!rolesDelete)}
              />
            }
            label="Eliminar"
          />
        </Stack>
      </Paper>
      


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