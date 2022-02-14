// import logo from "./logo.svg";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home";

import Products from "./pages/products/Products";
import Productsadd from "./pages/products/Productsadd";
import ProductsDetails from "./pages/products/ProductsDetails";

import Stores from "./pages/settings/stores/Stores";
import StoreAdd from "./pages/settings/stores/StoreAdd";
import StoreDetails from "./pages/settings/stores/StoreDetails";
import RackAdd from "./pages/settings/stores/racks/RackAdd";
import RackDetail from "./pages/settings/stores/racks/RackDetail";

import Familia from "./pages/settings/Familia";
import FamiliaAdd from "./pages/settings/familia/FamiliaAdd";
import FamiliaDetails from "./pages/settings/familia/FamiliaDetails";

import TipoNegocio from "./pages/settings/TipoNegocio";
import TipoNegocioAdd from "./pages/settings/tipoNegocio/TipoNegocioAdd";
import TipoNegocioDetails from "./pages/settings/tipoNegocio/TipoNegocioDetails";

function App() {
  return (
    <div className="App">
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Rutas Productos */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<Productsadd />} />
        <Route path="/product/:id" element={<ProductsDetails />} />

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
        {/* <Route path="/miscelaneos" element={<SettingsContainer />} /> */}
        {/* <Route path="*" element={<h1>No encontrado</h1>} /> */}
      </Routes>
    </div>
  );
}

export default App;
