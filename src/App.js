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
import { simpleMessage } from "./helpers/Helpers";
import MyAccount from "./pages/account/MyAccount";
import SecurityContiner from "./pages/security/SecurityContiner";

import Home from "./pages/home/Home";
import Page401 from "./components/errorPages/Page401.jsx";
import NotFound from "./components/errorPages/NotFound.jsx";
import TipoNegocio from "./pages/settings/tipoNegocio/TipoNegocio";
import SetNewPasswordComponent from "./components/SetNewPasswordComponent";
import InventoryContainer from "./pages/inventory/InventoryContainer";
import AddEntradaProducto from "./pages/inventory/entradaProducto/AddEntradaProducto";
import SalesContainer from "./pages/sales/SalesContainer";

function App() {
  const {
    setIsLoading,
    isLogged,
    setIsLogged,
    setUser,
    isDefaultPass,
    setIsDefaultPass,
  } = useContext(DataContext);

  const user = getUser();
  const token = getToken();

  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      setIsLogged(false);
      setIsDefaultPass(false);
      return;
    }
    if (!token) {
      setIsLoading(false);
      setIsLogged(false);
      setIsDefaultPass(false);
      return;
    }

    (async () => {
      const result = await getUserAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
        simpleMessage(result.error, "error");
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
      setIsDefaultPass(false);
      setIsLogged(true);
      setIsLoading(false);
    })();
    setUser(user);
    setIsLogged(true);
    setIsLoading(false);
  }, [isLogged]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLogged === null || isDefaultPass === null) {
    return <Loading />;
  }

  return isLogged ? (
    isDefaultPass ? (
      <SetNewPasswordComponent />
    ) : (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <div className="App">
          <NavbarComponent />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Rutas Account */}
            <Route path="/account" element={<MyAccount />} />

             {/* Ruta Inventario */}
             <Route path="/sales" element={<SalesContainer />} />

            {/* Ruta Inventario */}
            <Route path="/inventory" element={<InventoryContainer />} />

            <Route path="/entrada/add" element={<AddEntradaProducto />} />
            <Route path="/entrada/:id" element={<EntradaProductoDetails />} />

            {/* Rutas Seguridad */}
            <Route path="/security" element={<SecurityContiner />} />

            {/* Rutas miscelaneos */}
            <Route path="/stores" element={<Stores />} />
            <Route path="/store/:id" element={<StoreDetails />} />
            <Route path="/providers" element={<Providers />} />

            {/* <Route path="/product/:id" element={<ProductsDetails />} /> */}
            <Route path="/tipo-negocio" element={<TipoNegocio />} />
            <Route path="/tipo-negocio/:id" element={<TipoNegocioDetails />} />

            {/* Rutas Error */}
            <Route path="/unauthorized" element={<Page401 />} />
            <Route path="*" element={<NotFound />} />
            {/* <Route path="/entrada/:id" element={<EntradaProductoDetails />} /> */}
          </Routes>

          <Loading />
          <ToastContainer />
        </div>
      </LocalizationProvider>
    )
  ) : (
    <Login />
  );
}

export default App;
