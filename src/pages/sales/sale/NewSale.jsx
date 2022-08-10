import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";

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
import SmallModal from "../../../components/modals/SmallModal";
import { BillComponent } from "./printBill/BillComponent";
import ProformaComponent from "./printBill/ProformaComponent";

const NewSale = () => {
  let ruta = getRuta();

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
  const [selectedPrecio, setSelectedPrecio] = useState("PVM");
  const [costoXProducto, setcostoXProducto] = useState("");

  const [selectedProductList, setSelectedProductList] = useState([]);

  const [montoVenta, setMontoVenta] = useState(0);

  const [barCodeSearch, setBarCodeSearch] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [dataBill, setDataBill] = useState([]);

  const [showProformaModal, setShowProformaModal] = useState(false);
  const [dataProforma, setDataProforma] = useState([]);

  useEffect(() => {
    setTypeClient(true);
    setTypeVenta("contado");
  }, []);

  const onTypeClientChange = (value) => {
    setTypeClient(value);
    if (value) {
      setTypeVenta("contado");
    }
  };

  const addToProductList = () => {
    const { precioVentaDetalle, precioVentaMayor, producto, almacen } =
      selectedProduct;
    if (!cantidad) {
      toastError("Ingrese cantidad a comprar");
      return;
    }

    const filtered = selectedProductList.filter(
      (item) => item.product.id === producto.id
    );

    if (filtered.length > 0) {
      let cantActual = parseInt(filtered[0].cantidad);
      let cantNueva = parseInt(cantidad);
      if (cantActual + cantNueva > selectedProduct.existencia) {
        toastError("No vender mas de lo que hay en existencia");
        setCantidad("");
        return;
      }
      filtered[0].cantidad = cantActual + cantNueva;
      filtered[0].costoTotal =
        (cantActual + cantNueva) * filtered[0].costoUnitario;

      setMontoVenta(montoVenta + costoXProducto);
      setSelectedProduct("");
      setCantidad("");
      setDescuento("");
      setcostoXProducto("");
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
    setcostoXProducto("");
    setSelectedProductList([...selectedProductList, data]);
  };

  const addNewVenta = async () => {
    if (isEmpty(selectedProductList) || montoVenta === 0) {
      toastError("Seleccione al menos un producto para vender");
      return;
    }

    if (!typeClient && isEmpty(selectedClient)) {
      toastError("Seleccione un cliente");
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
    setTypeClient(true);
    setSelectedClient("");
    setEventualClient("");
    setMontoVenta(0);
    setSelectedProductList([]);
    setIsLoading(false);
    toastSuccess("Venta Realizada");
    setReload(!reload);
    setDataBill(result.data);
    printBill();
  };

  const addProformma = async () => {
    if (isEmpty(selectedProductList) || montoVenta === 0) {
      toastError("Seleccione al menos un producto para vender");
      return;
    }

    if (!typeClient && isEmpty(selectedClient)) {
      toastError("Seleccione un cliente");
      return;
    }

    const data = {
      nombreCliente: eventualClient,
      idClient: selectedClient.id,
      montoVenta,
      saleDetails: selectedProductList,
      storeid: selectedStore,
    };

    setDataProforma(data);
    setShowProformaModal(true);
  };

  const printBill = () => {
    setShowModal(true);
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
          <Grid item xs={12} md={3}>
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
                onTypeClientChange={onTypeClientChange}
              />

              <SelectProduct
                selectedProductList={selectedProductList}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                barCodeSearch={barCodeSearch}
                setBarCodeSearch={setBarCodeSearch}
              />

              <SelectTipoVenta
                typeVenta={typeVenta}
                setTypeVenta={setTypeVenta}
                typeClient={typeClient}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
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
                barCodeSearch={barCodeSearch}
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
              addProformma={addProformma}
            />
          </Grid>
        </Grid>
      </Container>

      <SmallModal
        titulo={"Imprimir Recibo"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <BillComponent data={dataBill} setShowModal={setShowModal} />
      </SmallModal>

      <SmallModal
        titulo={"Imprimir Proforma"}
        isVisible={showProformaModal}
        setVisible={setShowProformaModal}
      >
        <ProformaComponent
          data={dataProforma}
          setShowModal={setShowProformaModal}
        />
      </SmallModal>
    </div>
  );
};

export default NewSale;
