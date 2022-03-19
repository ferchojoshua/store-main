import React, { useEffect, useContext } from "react";
import { DataContext } from "./context/DataContext";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Home from "./pages/home/Home";

import EntradaProduto from "./pages/entradaProducto/EntradaProduto";
import AddEntradaProducto from "./pages/entradaProducto/AddEntradaProducto";
import EntradaProductoDetails from "./pages/entradaProducto/EntradaProductoDetails";

import MoverProducto from "./pages/traslate-products/MoverProducto";

import Products from "./pages/products/Products";
import Productsadd from "./pages/products/Productsadd";
import ProductsDetails from "./pages/products/ProductsDetails";

import Stores from "./pages/settings/stores/Stores";
import StoreAdd from "./pages/settings/stores/StoreAdd";
import StoreDetails from "./pages/settings/stores/StoreDetails";
import RackAdd from "./pages/settings/stores/racks/RackAdd";
import RackDetail from "./pages/settings/stores/racks/RackDetail";

import Providers from "./pages/provider/Providers";
import ProviderAdd from "./pages/provider/ProviderAdd";
import ProviderDetails from "./pages/provider/ProviderDetails";

import Familia from "./pages/settings/Familia";
import FamiliaAdd from "./pages/settings/familia/FamiliaAdd";
import FamiliaDetails from "./pages/settings/familia/FamiliaDetails";

import TipoNegocio from "./pages/settings/TipoNegocio";
import TipoNegocioAdd from "./pages/settings/tipoNegocio/TipoNegocioAdd";
import TipoNegocioDetails from "./pages/settings/tipoNegocio/TipoNegocioDetails";
import MoverProductoAdd from "./pages/traslate-products/MoverProductoAdd";
import Loading from "./components/Loading";
import Login from "./pages/Login";
import { getToken, getUser, getUserAsync } from "./services/Account";
import { simpleMessage } from "./helpers/Helpers";
import MyAccount from "./pages/account/MyAccount";
import SecurityContiner from "./pages/security/SecurityContiner";

function App() {
  const { setIsLoading, isLogged, setIsLogged, setUser } =
    useContext(DataContext);

  const user = getUser();
  const token = getToken();

  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      setIsLogged(false);
      return;
    }
    if (!token) {
      setIsLoading(false);
      setIsLogged(false);
      return;
    }
    (async () => {
      const result = await getUserAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
        simpleMessage(result.error, "error");
        return;
      }
      setIsLogged(true);
      setIsLoading(false);
    })();
    setUser(user);
    setIsLogged(true);
    setIsLoading(false);
  }, []);

  if (isLogged === null) {
    return <Loading />;
  }

  return isLogged ? (
    <div className="App">
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Rutas Account */}
        <Route path="/account" element={<MyAccount />} />
        {/* <Route path="/entrada/add" element={<AddEntradaProducto />} />
        <Route path="/entrada/:id" element={<EntradaProductoDetails />} /> */}

        {/* Rutas Products-in */}
        <Route path="/products-in" element={<EntradaProduto />} />
        <Route path="/entrada/add" element={<AddEntradaProducto />} />
        <Route path="/entrada/:id" element={<EntradaProductoDetails />} />

        {/* Rutas Products-in */}
        <Route path="/traslate-products" element={<MoverProducto />} />
        <Route path="/traslate-products/add" element={<MoverProductoAdd />} />
        {/*<Route path="/entrada/:id" element={<EntradaProductoDetails />} /> */}

        {/* Rutas Seguridad */}
        <Route path="/security" element={<SecurityContiner />} />
        {/* <Route path="/traslate-products/add" element={<MoverProductoAdd />} /> */}
        {/*<Route path="/entrada/:id" element={<EntradaProductoDetails />} /> */}

        {/* Rutas Productos */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<Productsadd />} />
        <Route path="/product/:id" element={<ProductsDetails />} />

        {/* Rutas Providers */}
        <Route path="/providers" element={<Providers />} />
        <Route path="/provider/add" element={<ProviderAdd />} />
        <Route path="/provider/:id" element={<ProviderDetails />} />

        {/* Rutas miscelaneos */}
        <Route path="/stores" element={<Stores />} />
        <Route path="/store/add" element={<StoreAdd />} />
        <Route path="/store/:id" element={<StoreDetails />} />
        <Route path="/store/rack/add/:id" element={<RackAdd />} />
        <Route path="/store/rack/:data" element={<RackDetail />} />

        <Route path="/familia" element={<Familia />} />
        <Route path="/familia/add" element={<FamiliaAdd />} />
        <Route path="/familia/:id" element={<FamiliaDetails />} />

        <Route path="/tipo-negocio" element={<TipoNegocio />} />
        <Route path="/tipo-negocio/add" element={<TipoNegocioAdd />} />
        <Route path="/tipo-negocio/:id" element={<TipoNegocioDetails />} />
      </Routes>

      <Loading />
      <ToastContainer />
    </div>
  ) : (
    <Login />
  );
}

export default App;
