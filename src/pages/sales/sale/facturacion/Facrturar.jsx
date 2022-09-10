import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Grid, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import {
  getController,
  getRuta,
  toastError,
  toastSuccess,
} from "../../../../helpers/Helpers";
import { DataContext } from "../../../../context/DataContext";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import SelectClient from "../SelectClient";
import SelectProduct from "../SelectProduct";
import SelectTipoVenta from "../SelectTipoVenta";
import ProductDescription from "../ProductDescription";
import SaleDetail from "../SaleDetail";
import { addFacturaAsync } from "../../../../services/FacturationApi";
import SmallModal from "../../../../components/modals/SmallModal";
import ProformaComponent from "../printBill/ProformaComponent";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const Facrturar = () => {
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
  const [descuentoXPercent, setDescuentoXPercent] = useState("");
  const [descuentoXMonto, setDescuentoXMonto] = useState("");
  const [descuentoCod, setDescuentoCod] = useState("");

  const [descuentoGlobal, setDescuentoGlobal] = useState("");
  const [descuentoGlobalMonto, setDescuentoGlobalMonto] = useState("");
  const [descuentoGlobalPercent, setDescuentoGlobalPercent] = useState("");

  const [isDescPercent, setIsDescPercent] = useState(false);

  const [selectedPrecio, setSelectedPrecio] = useState("PVM");
  const [costoAntesDescuento, setCostoAntesDescuento] = useState("");
  const [costoXProducto, setcostoXProducto] = useState("");

  const [selectedProductList, setSelectedProductList] = useState([]);

  const [montoVenta, setMontoVenta] = useState(0);

  const [barCodeSearch, setBarCodeSearch] = useState(false);

  const [showFacturarModal, setShowFacturarModal] = useState(false);

  const [montoVentaDespuesDescuento, setMontoVentaDespuesDescuento] =
    useState(0);
  const [montoVentaAntesDescuento, setMontoVentaAntesDescuento] = useState(0);

  const [dataProforma, setDataProforma] = useState([]);
  const [showProformaModal, setShowProformaModal] = useState(false);

  const [creditoDisponible, setCreditoDisponible] = useState("");
  const [saldoVencido, setSaldoVencido] = useState("");
  const [factVencidas, setFactVencidas] = useState("");

  useEffect(() => {
    setTypeClient(true);
    setTypeVenta("contado");
  }, []);

  const onTypeClientChange = (value) => {
    setTypeClient(value);

    if (value) {
      setTypeVenta("contado");
      setSelectedClient("");
    } else {
      setEventualClient("");
    }
  };

  const addToProductList = () => {
    const { precioVentaDetalle, precioVentaMayor, producto, almacen } =
      selectedProduct;
    if (descuentoCod !== "VC.2022*" && !isEmpty(descuento)) {
      toastError("Codigo incorrecto");
      return;
    }
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

      let montoSumar = cantNueva * filtered[0].costoUnitario;

      setMontoVentaAntesDescuento(
        parseFloat(montoSumar) + parseFloat(montoVentaAntesDescuento)
      );
      setMontoVentaDespuesDescuento(
        parseFloat(montoSumar) + parseFloat(montoVentaAntesDescuento)
      );

      setSelectedProduct("");
      setCantidad("");
      setDescuento("");
      setcostoXProducto("");
      return;
    }

    const data = {
      product: producto,
      productId: producto.id,
      cantidad: parseInt(cantidad),
      descuento: descuentoXMonto === "" ? 0 : parseFloat(descuentoXMonto),
      costoUnitario: costoAntesDescuento / cantidad,
      PVM: precioVentaMayor,
      PVD: precioVentaDetalle,
      costoTotalAntesDescuento: costoAntesDescuento / cantidad,
      costoTotalDespuesDescuento:
        descuentoXMonto === ""
          ? costoAntesDescuento / cantidad
          : costoAntesDescuento / cantidad - parseFloat(descuentoXMonto),
      costoTotal: parseFloat(costoXProducto),
      store: almacen,
      isDescuento: descuento ? true : false,
      descuentoXPercent: descuentoXPercent,
      codigoDescuento: descuentoCod,
      costoCompra: selectedProduct.precioCompra * parseInt(cantidad),
    };

    setMontoVentaAntesDescuento(
      parseFloat(montoVentaAntesDescuento) + parseFloat(costoXProducto)
    );
    setMontoVentaDespuesDescuento(
      parseFloat(montoVentaAntesDescuento) + parseFloat(costoXProducto)
    );

    setSelectedProduct("");
    setCantidad("");
    setDescuento("");
    setcostoXProducto("");
    setDescuentoCod("");
    setSelectedProductList([...selectedProductList, data]);
  };

  const addNewVenta = async () => {
    if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
      toastError("Seleccione al menos un producto para facturar");
      return;
    }
    if (descuentoCod !== "VC.2022*" && !isEmpty(descuentoGlobal)) {
      toastError("Codigo incorrecto!");
      return;
    }
    if (!typeClient && isEmpty(selectedClient)) {
      toastError("Seleccione un cliente");
      return;
    }

    if (!typeClient && selectedClient.facturasVencidas > 0) {
      toastError("El cliente tiene saldo vencido");
      return;
    }

    const data = {
      isEventual: typeClient,
      nombreCliente: eventualClient,
      clientId: selectedClient.id,
      montoVenta: montoVentaDespuesDescuento,
      facturacionDetails: selectedProductList,
      isContado: typeVenta === "contado" ? true : false,
      storeid: selectedStore,
      isDescuento: descuentoGlobal ? true : false,
      descuentoXPercent: descuentoGlobalPercent ? descuentoGlobalPercent : 0,
      descuentoXMonto: descuentoGlobalMonto ? descuentoGlobalMonto : 0,
      codigoDescuento: descuentoCod,
      montoVentaAntesDescuento,
    };

    setIsLoading(true);
    const result = await addFacturaAsync(token, data);
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
    setDescuento("");
    setDescuentoCod("");
    setDescuentoGlobal("");
    setDescuentoGlobalMonto("");
    setDescuentoGlobalPercent("");
    setMontoVentaAntesDescuento(0);
    setMontoVentaDespuesDescuento(0);
    setSelectedStore("");
    setSelectedProductList([]);
    setIsLoading(false);
    toastSuccess("Productos Facturados");
    setReload(!reload);
  };

  const addProformma = async () => {
    if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
      toastError("Seleccione al menos un producto");
      return;
    }
    if (!typeClient && isEmpty(selectedClient)) {
      toastError("Seleccione un cliente");
      return;
    }
    const data = {
      nombreCliente: eventualClient,
      idClient: selectedClient.id,
      montoVenta: montoVentaAntesDescuento,
      saleDetails: selectedProductList,
      storeid: selectedStore,
    };
    setDataProforma(data);
    setShowProformaModal(true);
  };

  let controller = getController();

  const connection = new HubConnectionBuilder()
    .withUrl(`${controller}updateClientHub`)
    .configureLogging(LogLevel.Information)
    .build();

  async function start() {
    try {
      await connection.start();
      connection.on("updateClient", () => {
        setReload(!reload);
      });
    } catch (err) {
      setTimeout(start, 5000);
    }
  }

  connection.onclose(async () => {
    await start();
  });

  start();

  return (
    <div>
      <Container maxWidth="xl">
        <Typography variant="h4" textAlign={"left"}>
          Facturar
        </Typography>
        <hr />
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={selectedProduct ? 6 : 12}>
              <SelectClient
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                eventualClient={eventualClient}
                setEventualClient={setEventualClient}
                typeClient={typeClient}
                onTypeClientChange={onTypeClientChange}
                creditoDisponible={creditoDisponible}
                setCreditoDisponible={setCreditoDisponible}
                saldoVencido={saldoVencido}
                setSaldoVencido={setSaldoVencido}
                setFactVencidas={setFactVencidas}
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
            </Grid>

            {selectedProduct ? (
              <Grid item xs={12} md={6}>
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
                  isDescPercent={isDescPercent}
                  setIsDescPercent={setIsDescPercent}
                  descuentoXPercent={descuentoXPercent}
                  setDescuentoXPercent={setDescuentoXPercent}
                  costoAntesDescuento={costoAntesDescuento}
                  setCostoAntesDescuento={setCostoAntesDescuento}
                  setDescuentoXMonto={setDescuentoXMonto}
                  descuentoCod={descuentoCod}
                  setDescuentoCod={setDescuentoCod}
                />
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Paper>

        <SaleDetail
          selectedProductList={selectedProductList}
          setSelectedProductList={setSelectedProductList}
          addNewVenta={addNewVenta}
          addProformma={addProformma}
          showFacturarModal={showFacturarModal}
          setShowFacturarModal={setShowFacturarModal}
          montoVentaAntesDescuento={montoVentaAntesDescuento}
          setMontoVentaAntesDescuento={setMontoVentaAntesDescuento}
          montoVentaDespuesDescuento={montoVentaDespuesDescuento}
          setMontoVentaDespuesDescuento={setMontoVentaDespuesDescuento}
          descuentoGlobal={descuentoGlobal}
          isFacturar={true}
        />
      </Container>

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

export default Facrturar;
