import React, { useEffect, useContext } from "react";
import { DataContext } from "./context/DataContext";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import { Route, Routes } from "react-router-dom";
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
} from "./services/Account";
import { getRuta, simpleMessage } from "./helpers/Helpers";
import MyAccount from "./pages/account/MyAccount";
import SecurityContiner from "./pages/security/SecurityContiner";
import { useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Page401 from "./components/errorPages/Page401.jsx";
import NotFound from "./components/errorPages/NotFound.jsx";
import TipoNegocio from "./pages/settings/tipoNegocio/TipoNegocio";
import SetNewPasswordComponent from "./components/SetNewPasswordComponent";
import InventoryContainer from "./pages/inventory/InventoryContainer";
import AddEntradaProducto from "./pages/inventory/entradaProducto/AddEntradaProducto";
import SalesContainer from "./pages/sales/SalesContainer";
import Departments from "./pages/settings/locations/Departments";
import Municipalities from "./pages/settings/locations/municipalities/Municipalities";
import MunicipalityDetails from "./pages/settings/locations/municipalities/MunicipalityDetails";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import AdmonContainer from "./pages/admon/AdmonContainer";
import { NoConectionServer } from "./components/errorPages/NoConectionServer";
import { serverMessages } from "./services/SignalRService";
import { ReportsContainer } from "./pages/reports/ReportsContainer";

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
    })();
    setUser(user);
    setIsLogged(true);

    setIsLoading(false);
  }, [isLogged]); // eslint-disable-line react-hooks/exhaustive-deps

  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  window.addEventListener("beforeunload", function (event) {
    event.returnValue = "o/";
  });

  if (isLogged === null || isDefaultPass === null || access === []) {
    return <Loading />;
  }

  return isLogged ? (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          height: "100vh",
          overflow: "auto",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        {isDefaultPass ? (
          <SetNewPasswordComponent />
        ) : (
          <LocalizationProvider dateAdapter={DateAdapter}>
            <div className={isDarkMode ? "App text-white" : "App"}>
              <NavbarComponent />
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

                {/* <Route path="/product/:id" element={<ProductsDetails />} /> */}
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

                {/* Rutas Error */}
                <Route path={`${ruta}/unauthorized`} element={<Page401 />} />
                <Route
                  path={`${ruta}/noServerConecction`}
                  element={<NoConectionServer />}
                />
                <Route path={`${ruta}/*`} element={<NotFound />} />
              </Routes>

              <Loading />
              <ToastContainer />
            </div>
          </LocalizationProvider>
        )}
      </Box>
    </ThemeProvider>
  ) : (
    <Login />
  );
}

export default App;
