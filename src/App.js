import React, { useEffect, useContext } from "react";
import { DataContext } from "./context/DataContext";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterMoment";
import "react-toastify/dist/ReactToastify.min.css";
import EntradaProductoDetails from "./pages/inventory/entradaProducto/EntradaProductoDetails";
import Stores from "./pages/settings/stores/Stores";
import StoreDetails from "./pages/settings/stores/StoreDetails";
import Providers from "./pages/settings/provider/Providers";
import TipoNegocioDetails from "./pages/settings/tipoNegocio/TipoNegocioDetails";
import Loading from "./components/Loading";
import Login from "./pages/Login";
import {
  deleteToken,
  deleteUserData,
  getToken,
  getUser,
  getUserAsync,
  onCloseNavigatorAsync,
} from "./services/Account";
import { getController, getRuta, simpleMessage } from "./helpers/Helpers";
import MyAccount from "./pages/account/MyAccount";
import SecurityContiner from "./pages/security/SecurityContiner";
import EmpresaContainer from "./pages/administration/EmpresaContainer";
import Home from "./pages/home/Home";
import Page401 from "./components/errorPages/Page401.jsx";
import NotFound from "./components/errorPages/NotFound.jsx";
import TipoNegocio from "./pages/settings/tipoNegocio/TipoNegocio";
import SetNewPasswordComponent from "./components/SetNewPasswordComponent";
import InventoryContainer from "./pages/inventory/InventoryContainer";
import AdmonContainer from "./pages/admon/AdmonContainer";  
import AddEntradaProducto from "./pages/inventory/entradaProducto/AddEntradaProducto";
import SalesContainer from "./pages/sales/SalesContainer";
import Departments from "./pages/settings/locations/Departments";
import CreateLogo from "./pages/administration/Logo/CreateLogo";
import Municipalities from "./pages/settings/locations/municipalities/Municipalities";
import MunicipalityDetails from "./pages/settings/locations/municipalities/MunicipalityDetails";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { NoConectionServer } from "./components/errorPages/NoConectionServer";
import { serverMessages } from "./services/SignalRService";
import { ReportsContainer } from "./pages/reports/ReportsContainer";
import { MasterVentas } from "./pages/reports/reporteVentas/Reportes/MasterVentas";
import { DocumentosXCobrar } from "./pages/reports/reporteVentas/Reportes/DocumentosXCobrar";
import { ArticulosVendidos } from "./pages/reports/reporteVentas/Reportes/ArticulosVendidos";
import CierreDiario from "./pages/reports/reporteVentas/Reportes/CierreDiario";
import CajaChica from "./pages/reports/reporteVentas/Reportes/CajaChica";
import { ProdNoVendidos } from "./pages/reports/reporteVentas/Reportes/ProdNoVendidos";
import Ingresos from "./pages/reports/reporteVentas/Reportes/Ingresos";
import MoverProductoAdd from "./pages/inventory/traslate-products/MoverProductoAdd";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { getRolAsync } from "./services/RolApi";
import FullScreenModal from "./components/modals/FullScreenModal";
import ConfigurationModal from "./components/modals/ConfigurationModal";
import Compras from "./pages/reports/reporteVentas/Reportes/Compras";
import TrasladoInventario from "./pages/reports/reporteVentas/Reportes/TrasladoInventario";
import { InventarioProductos } from "./pages/reports/reporteVentas/Reportes/InventarioProductos";
import Ajustes from "./pages/administration/Ajuste/Ajustes";
import Footer from "./components/Footer";

let controller = getController();

function App() {
  let ruta = getRuta();

  const {
    setIsLoading,
    isLogged,
    setIsLogged,
    setUser,
    isDefaultPass,
    setIsDefaultPass,
    access,
    setAccess,
    isDarkMode,
    setIsDarkMode,
    setServerAccess,
  } = useContext(DataContext);

  let navigate = useNavigate();

  const user = getUser();
  const token = getToken();

  useEffect(() => {
    setIsLoading(true);
    if (!user || !token) {
      setIsLoading(false);
      setIsLogged(false);
      setIsDefaultPass(false);
      return;
    }

    (async () => {
      const result = await getUserAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }

        simpleMessage("No se pudo conectar con el servidor", "error");
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
      setIsDarkMode(result.data.isDarkMode);
      setAccess(result.data.rol.permissions);
      setIsDefaultPass(false);
      setIsLogged(true);
      setIsLoading(false);

      const notifications = serverMessages();

      const resultRol = await getRolAsync(token);

      setServerAccess(!resultRol.data.isServerAccess);
    })();
    setUser(user);
    setIsLogged(true);

    setIsLoading(false);
  }, [isLogged]);

  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  window.addEventListener("beforeunload", function (event) {
    (async () => {
      const result = await onCloseNavigatorAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }

        simpleMessage("No se pudo conectar con el servidor", "error");
        return;
      }
      if (result.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }
    })();
  });

   useEffect(() => {
  const connection = new HubConnectionBuilder()
    .withUrl(`${controller}serverHub`)
    // .configureLogging(LogLevel.Information)
    .build();

  async function start() {
    try {
      await connection.start();
      connection.on("serverAccess", () => {
        serverAccess();
      });
    } catch (err) {
      // setTimeout(start, 5000);
      console.error(start, err);
    }
  }

  connection.onclose(async () => {
    await start();
  });

  start();


    return () => {
      connection.stop()
        .then(() => {
          console.log('SignalR connection stopped.');
        })
        .catch(error => {
          console.error('Error stopping SignalR connection:', error);
        });
    };
  }, []);
  const serverAccess = async () => {
    const result = await getRolAsync(token);
    setServerAccess(!result.data.isServerAccess);
  };

  if (isLogged === null || isDefaultPass === null || access === []) {
    return <Loading />;
  }

  return isLogged ? (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "background.default",
        }}
      >
        {isDefaultPass ? (
          <SetNewPasswordComponent />
        ) : (
          <LocalizationProvider dateAdapter={DateAdapter}>
            <div className={isDarkMode ? "App text-white" : "App"}>
              <NavbarComponent />
              <Box sx={{ flex: 1, overflow: "auto" }}>
                <Routes>
                  <Route path={`${ruta}/`} element={<Home />} />
                  {/* Rutas Account */}
                  <Route path={`${ruta}/account`} element={<MyAccount />} />

                  {/* Ruta Inventario */}
                  <Route path={`${ruta}/sales`} element={<SalesContainer />} />

                  {/* Ruta Inventario */}
                  <Route
                    path={`${ruta}/inventory`}
                    element={<InventoryContainer />}
                  />
                  <Route
                    path={`${ruta}/traslado/add`}
                    element={<MoverProductoAdd />}
                  /> 

                  <Route
                    path={`${ruta}/entrada/add`}
                    element={<AddEntradaProducto />}
                  />            
                  <Route
                    path={`${ruta}/entrada/:id`}
                    element={<EntradaProductoDetails />}
                  />

                   {/* Rutas Reportes */}
                   <Route
                    path={`${ruta}/reports`}
                    element={<ReportsContainer />}
                  />
                  <Route
                    path={`${ruta}/r-master-vetas/:params`}
                    element={<MasterVentas />}
                  />
                  <Route
                    path={`${ruta}/r-docs-cobrar/:params`}
                    element={<DocumentosXCobrar />}
                  />
                  <Route
                    path={`${ruta}/r-sales-prods/:params`}
                    element={<ArticulosVendidos />}
                  />
                  <Route
                    path={`${ruta}/r-daily-close/:params`}
                    element={<CierreDiario />}
                  />
                  <Route
                    path={`${ruta}/r-caja-chica/:params`}
                    element={<CajaChica />}
                  />
                  <Route
                    path={`${ruta}/r-no-sales-prods/:params`}
                    element={<ProdNoVendidos />}
                  />
                  <Route
                    path={`${ruta}/r-ingresos/:params`}
                    element={<Ingresos />}
                  />
                  <Route
                    path={`${ruta}/r-compras/:params`}
                    element={<Compras />}
                  />
                  <Route
                    path={`${ruta}/r-traslado-inventario/:params`}
                    element={<TrasladoInventario />}
                  />
                  <Route
                    path={`${ruta}/r-inventario-prods/:params`}
                    element={<InventarioProductos />}
                  />


                  
                {/* Rutas Administration */}
                <Route path={`${ruta}/admon`} element={<AdmonContainer />} />


                  {/* Rutas Seguridad */}
                  <Route
                    path={`${ruta}/security`}
                    element={<SecurityContiner />}
                  />

                  {/* Rutas miscelaneos */}
                  <Route path={`${ruta}/stores`} element={<Stores />} />
                  <Route path={`${ruta}/store/:id`} element={<StoreDetails />} />
                  <Route path={`${ruta}/providers`} element={<Providers />} />
                  <Route
                    path={`${ruta}/tipo-negocio`}
                    element={<TipoNegocio />}
                  />
                  <Route
                    path={`${ruta}/tipo-negocio/:id`}
                    element={<TipoNegocioDetails />}
                  />
                  <Route path={`${ruta}/departments`} element={<Departments />} />
                  <Route
                    path={`${ruta}/departments/:id`}
                    element={<Municipalities />}
                  />
                  <Route
                    path={`${ruta}/departments/municipalities/:id`}
                    element={<MunicipalityDetails />}
                  />
                  
                  {/* Rutas Administration */}
                  <Route
                    path={`${ruta}/administration`}
                    element={<EmpresaContainer/>}
                  />  
                   <Route
                    path={`${ruta}/administration/logo`}
                    element={<CreateLogo />}
                  />        
                  <Route
                    path={`${ruta}/administration/Ajuste`}
                    element={<Ajustes />}
                  />  
                  <Route path={`${ruta}/unauthorized`} element={<Page401 />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
              {/* <Footer /> */}
            </div>
          </LocalizationProvider>
        )}
      </Box>
      <ToastContainer />
    </ThemeProvider>
  ) : (
    <Login />
  );
}

export default App;