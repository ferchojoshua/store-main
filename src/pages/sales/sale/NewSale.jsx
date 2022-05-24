import React, { useState, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../helpers/Helpers";

import { Container, Paper, Grid } from "@mui/material";

import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { isEmpty } from "lodash";
import SelectClient from "./SelectClient";
import SelectProduct from "./SelectProduct";
import SelectTipoVenta from "./SelectTipoVenta";
import ProductDescription from "./ProductDescription";
import SaleDetail from "./SaleDetail";
import { addSaleAsync } from "../../../services/SalesApi";

const NewSale = () => {
  const { setIsLoading, setIsLogged, setIsDefaultPass, reload, setReload } =
    useContext(DataContext);
  let navigate = useNavigate();
  const token = getToken();

  const [typeClient, setTypeClient] = useState(true);

  const [selectedClient, setSelectedClient] = useState("");
  const [eventualClient, setEventualClient] = useState("");

  const [selectedStore, setSelectedStore] = useState("");

  const [typeVenta, setTypeVenta] = useState("contado");

  const [selectedProduct, setSelectedProduct] = useState("");

  const [cantidad, setCantidad] = useState("");
  const [descuento, setDescuento] = useState("");
  const [selectedPrecio, setSelectedPrecio] = useState("PVD");
  const [costoXProducto, setcostoXProducto] = useState("");

  const [selectedProductList, setSelectedProductList] = useState([]);

  const [montoVenta, setMontoVenta] = useState(0);

  const addToProductList = () => {
    const { precioVentaDetalle, precioVentaMayor, producto, almacen } =
      selectedProduct;
    if (!cantidad) {
      toastError("Ingrese cantidad a comprar");
      return;
    }
    const data = {
      product: producto,
      cantidad,
      descuento: descuento ? descuento : 0,
      costoUnitario: costoXProducto / cantidad,
      PVM: precioVentaMayor,
      PVD: precioVentaDetalle,
      costoTotal: costoXProducto,
      store: almacen,
    };

    setMontoVenta(montoVenta + costoXProducto);
    setSelectedProduct("");
    setCantidad("");
    setDescuento("");
    setSelectedProductList([...selectedProductList, data]);
  };

  const addNewVenta = async () => {
    if (isEmpty(selectedProductList) || montoVenta === 0) {
      toastError("Seleccione al menos un producto para vender");
      return;
    }

    const data = {
      isEventual: typeClient,
      nombreCliente: eventualClient,
      idClient: selectedClient.id,
      montoVenta,
      saleDetails: selectedProductList,
      isContado: typeVenta === "contado" ? true : false,
      storeid: selectedStore,
    };

    setIsLoading(true);
    const result = await addSaleAsync(token, data);
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
    setTypeClient(true);
    setSelectedClient("");
    setEventualClient("");
    setMontoVenta(0);
    setSelectedProductList([]);
    setIsLoading(false);
    toastSuccess("Venta Realizada");
    setReload(!reload);
  };

  return (
    <div>
      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h1>Agregar Venta de Productos</h1>
        </div>

        <hr />

        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
              }}
            >
              <SelectClient
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                eventualClient={eventualClient}
                setEventualClient={setEventualClient}
                typeClient={typeClient}
                setTypeClient={setTypeClient}
              />

              <SelectProduct
                selectedProductList={selectedProductList}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
              />

              <SelectTipoVenta
                typeVenta={typeVenta}
                setTypeVenta={setTypeVenta}
                typeClient={typeClient}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            {selectedProduct ? (
              <ProductDescription
                selectedProduct={selectedProduct}
                cantidad={cantidad}
                setCantidad={setCantidad}
                descuento={descuento}
                setDescuento={setDescuento}
                selectedPrecio={selectedPrecio}
                setSelectedPrecio={setSelectedPrecio}
                costoXProducto={costoXProducto}
                setcostoXProducto={setcostoXProducto}
                addToProductList={addToProductList}
              />
            ) : (
              <></>
            )}
            <SaleDetail
              selectedProductList={selectedProductList}
              setSelectedProductList={setSelectedProductList}
              montoVenta={montoVenta}
              setMontoVenta={setMontoVenta}
              addNewVenta={addNewVenta}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default NewSale;
