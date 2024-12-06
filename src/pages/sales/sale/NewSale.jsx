import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";

import { Container, Paper, Grid } from "@mui/material";

import {
  deleteToken,
  deleteUserData,
  getToken,
  getUser
} from "../../../services/Account";
import { isEmpty } from "lodash";
import SelectClient from "./SelectClient";
import SelectProduct from "./SelectProduct";
import SelectTipoVenta from "./SelectTipoVenta";
import ProductDescription from "./ProductDescription";
import SaleDetail from "./SaleDetail";
import { addSaleAsync,  GetContadoSalesByProfAsync, ProformAddAsync, finishSaleStatusAsync} from "../../../services/SalesApi";
import SmallModal from "../../../components/modals/SmallModal";
import { BillComponent } from "./printBill/BillComponent";
import ProformaComponent from "./printBill/ProformaComponent";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import PreFacturar from "./PreFacturar";

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

  const [showModal, setShowModal] = useState(false);
  const [dataBill, setDataBill] = useState([]);

  const [showProformaModal, setShowProformaModal] = useState(false);
  const [dataProforma, setDataProforma] = useState([]);

  const [showFacturarModal, setShowFacturarModal] = useState(false);

  const [montoVentaDespuesDescuento, setMontoVentaDespuesDescuento] =
    useState(0);
  const [montoVentaAntesDescuento, setMontoVentaAntesDescuento] = useState(0);

  const [creditoDisponible, setCreditoDisponible] = useState("");
  const [saldoVencido, setSaldoVencido] = useState("");
  const [factVencidas, setFactVencidas] = useState("");
  const [selectedFACT, setselectedFACT] = useState([]);

  const [selectedTipopago, setSelectedTipoPago] = useState(1);
  const [reference, setReference] = useState("");
  const user = getUser();

  useEffect(() => {
    setTypeClient(true);
    setTypeVenta("contado");
    if(selectedStore) {
      setSelectedProduct("");
    }
    
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
    const { precioVentaDetalle, precioVentaMayor, producto, almacen } = selectedProduct;
    
    if (descuentoCod !== "VC.2022*" && !isEmpty(descuento)) {
      toastError("Codigo incorrecto");
      return;
    }
    if (!cantidad) {
      toastError("Ingrese cantidad a comprar");
      return;
    }
  
    // Verificar si el producto ya existe (incluyendo productos de proforma)
    const existingProductIndex = selectedProductList.findIndex(
      (item) => {
        // Comparar tanto el ID del producto como el código
        return (
          item.product.id === producto.id || 
          item.product.barCode === producto.barCode ||
          item.product.description === producto.description
        );
      }
    );
  
    if (existingProductIndex !== -1) {
      // Obtener el producto existente
      const currentProduct = selectedProductList[existingProductIndex];
      const cantActual = parseInt(currentProduct.cantidad);
      const cantNueva = parseInt(cantidad);
      const costoUnitario = currentProduct.costoUnitario;
      
      if (cantActual + cantNueva > selectedProduct.existencia) {
        toastError("No vender mas de lo que hay en existencia");
        setCantidad("");
        return;
      }
  
      // Actualizar el producto existente
      const newList = [...selectedProductList];
      newList[existingProductIndex] = {
        ...currentProduct,
        cantidad: cantActual + cantNueva,
        costoTotal: costoUnitario * (cantActual + cantNueva),
        costoTotalAntesDescuento: costoUnitario * (cantActual + cantNueva),
        costoTotalDespuesDescuento: descuentoXMonto === "" 
          ? costoUnitario * (cantActual + cantNueva)
          : (costoUnitario * (cantActual + cantNueva)) - parseFloat(descuentoXMonto)
      };
  
      setSelectedProductList(newList);
  
   
      const montoSumar = cantNueva * costoUnitario;
      setMontoVentaAntesDescuento(prev => prev + montoSumar);
      setMontoVentaDespuesDescuento(prev => prev + montoSumar);
    } else {
      // Si es un producto nuevo, mantener la lógica existente
      const data = {
        product: producto,
        cantidad: parseInt(cantidad),
        descuento: descuentoXMonto === "" ? 0 : parseFloat(descuentoXMonto),
        costoUnitario: costoAntesDescuento / cantidad,
        PVM: precioVentaMayor,
        PVD: precioVentaDetalle,
        costoTotalAntesDescuento: costoAntesDescuento,
        costoTotalDespuesDescuento: descuentoXMonto === "" 
          ? costoAntesDescuento 
          : costoAntesDescuento - parseFloat(descuentoXMonto),
        costoTotal: parseFloat(costoXProducto),
        store: almacen,
        isDescuento: descuento ? true : false,
        descuentoXPercent: descuentoXPercent,
        codigoDescuento: descuentoCod,
        costoCompra: selectedProduct.precioCompra * parseInt(cantidad),
      };
  
      setSelectedProductList([...selectedProductList, data]);
      setMontoVentaAntesDescuento(prev => prev + parseFloat(costoXProducto));
      setMontoVentaDespuesDescuento(prev => prev + parseFloat(costoXProducto));
    }
  
    // Limpiar campos
    setSelectedProduct("");
    setCantidad("");
    setDescuento("");
    setcostoXProducto("");
    setDescuentoCod("");
    setDescuentoXMonto("");
    setDescuentoXPercent("");
  };

  // const addNewVenta = async () => {
  //   if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
  //     toastError("Seleccione al menos un producto");
  //     return;
  //   }

  //   if (descuentoCod !== "VC.2022*" && !isEmpty(descuentoGlobal)) {
  //     toastError("Codigo incorrecto");
  //     return;
  //   }

  //   if (!typeClient && isEmpty(selectedClient)) {
  //     toastError("Seleccione un cliente");
  //     return;
  //   }

  //   if (!typeClient && selectedClient.facturasVencidas > 0) {
  //     toastError("El cliente tiene saldo vencido");
  //     return;
  //   }

  //   const data = {
  //     isEventual: typeClient,
  //     nombreCliente: eventualClient,
  //     idClient: selectedClient.id,
  //     montoVenta: montoVentaDespuesDescuento,
  //     saleDetails: selectedProductList,
  //     isContado: typeVenta === "contado" ? true : false,
  //     storeid: selectedStore,
  //     isDescuento: descuentoGlobal ? true : false,
  //     descuentoXPercent: descuentoGlobalPercent ? descuentoGlobalPercent : 0,
  //     descuentoXMonto: descuentoGlobalMonto ? descuentoGlobalMonto : 0,
  //     codigoDescuento: descuentoCod,
  //     montoVentaAntesDescuento,
  //     tipoPagoId: selectedTipopago,
  //     reference,
  //   };

  //   setIsLoading(true);
  //   const result = await addSaleAsync(token, data);
  //   if (!result.statusResponse) {
  //     setIsLoading(false);
  //     if (result.error.request.status === 401) {
  //       navigate(`${ruta}/unauthorized`);
  //       return;
  //     }
  //     toastError(result.error.message);
  //     return;
  //   }
  //   if (result.data === "eX01") {
  //     setIsLoading(false);
  //     deleteUserData();
  //     deleteToken();
  //     setIsLogged(false);
  //     return;
  //   }
  //   if (result.data.isDefaultPass) {
  //     setIsLoading(false);
  //     setIsDefaultPass(true);
  //     return;
  //   }
  //   setTypeClient(true);
  //   setSelectedClient("");
  //   setEventualClient("");
  //   setMontoVenta(0);
  //   setDescuento("");
  //   setDescuentoCod("");
  //   setDescuentoGlobal("");
  //   setDescuentoGlobalMonto("");
  //   setDescuentoGlobalPercent("");
  //   setMontoVentaAntesDescuento(0);
  //   setMontoVentaDespuesDescuento(0);
  //   setSelectedTipoPago(1);
  //   setReference("");
  //   setSelectedStore("");
  //   setSelectedProductList([]);
  //   setIsLoading(false);
  //   toastSuccess("Venta Realizada");
  //   setReload(!reload);
  //   setDataBill(result.data);
  //   setShowFacturarModal(false);
  //   printBill();
  // };
   const addNewVenta = async () => {
    //  Validaciones iniciales
    if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
        toastError("Seleccione al menos un producto");
        return;
    }

    if (descuentoCod !== "VC.2022*" && !isEmpty(descuentoGlobal)) {
        toastError("Codigo incorrecto");
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

    if (!selectedStore) {
      toastError("Seleccione un almacén");
      return; 
  }

    try {
      setIsLoading(true);
      // const validProducts = selectedProductList.filter(item => item.product?.id);
      // const isExistingProforma = validProducts.some(item => item.product.id >= 1);

      const isExistingProforma = selectedProductList.some(item =>   item.hasOwnProperty('proformaId') && item.proformaId != null   );


      let result;   
      
      if (isExistingProforma) {
          // Primero creamos la venta con los productos seleccionados
          const data = {
              isEventual: typeClient,
              nombreCliente: eventualClient,
              idClient: selectedClient?.id || 0,
              montoVenta: montoVentaDespuesDescuento,
              saleDetails: selectedProductList,
              isContado: typeVenta === "contado" ? true : false,
              Storeid: selectedStore,
              isDescuento: descuentoGlobal ? true : false,
              descuentoXPercent: descuentoGlobalPercent || 0,
              descuentoXMonto: descuentoGlobalMonto || 0,
              codigoDescuento: descuentoCod,
              montoVentaAntesDescuento,
              tipoPagoId: selectedTipopago,
              reference
          };
          
          result = await addSaleAsync(token, data);
          
          if (!result.statusResponse) {
              throw new Error(result.error?.message || "Error al crear la venta");
          }

          // console.log("Is Existing validProducts[0].id sz:", validProducts[0].id);
          // Luego finalizamos la proforma
          const finishData = {
              Id: selectedProductList[0].proformaId,
              tipoPagoId: selectedTipopago,
              reference: reference || ""
          };
          // console.log("Is Existing ANTES:", finishData);
          const proformaResult = await finishSaleStatusAsync(token, finishData);
          // console.log("Is Existing LUEGO:", proformaResult);
          
          if (!proformaResult.statusResponse) {
              throw new Error(proformaResult.error?.message || "Error al finalizar la proforma");
          }
          
      } else {
          // Venta directa normal
          const data = {
              isEventual: typeClient,
              nombreCliente: eventualClient,
              idClient: selectedClient.id,
              montoVenta: montoVentaDespuesDescuento,
              saleDetails: selectedProductList,
              isContado: typeVenta === "contado" ? true : false,
              storeid: selectedStore,
              isDescuento: descuentoGlobal ? true : false,
              descuentoXPercent: descuentoGlobalPercent ? descuentoGlobalPercent : 0,
              descuentoXMonto: descuentoGlobalMonto ? descuentoGlobalMonto : 0,
              codigoDescuento: descuentoCod,
              montoVentaAntesDescuento,
              tipoPagoId: selectedTipopago,
              reference
          };
          
          result = await addSaleAsync(token, data);
      }

      if (!result.statusResponse) {
          if (result.error?.request?.status === 401) {
              navigate(`${ruta}/unauthorized`);
              return;
          }
          throw new Error(result.error?.message || "Error al procesar la venta");
      }

      // Limpiar formulario y mostrar mensaje de éxito
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
      setSelectedTipoPago(1);
      setReference("");
      setSelectedStore("");
      setSelectedProductList([]);      
      toastSuccess(isExistingProforma ? "Venta realizada y proforma finalizada exitosamente" : "Venta realizada exitosamente");
      setReload(!reload);
      setDataBill(result.data);
      setShowFacturarModal(false);
      printBill();

  } catch (error) {
      console.error("Error:", error);
      toastError(error.message || "Error al procesar la venta");
  } finally {
      setIsLoading(false);
  }
};


// Función auxiliar para limpiar el formulario
const clearForm = () => {
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
    setSelectedTipoPago(1);
    setReference("");
    setSelectedStore("");
    setSelectedProductList([]);
};
  //   if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
  //     toastError("Seleccione al menos un producto");
  //     return;
  //   }

  //   if (descuentoCod !== "VC.2022*" && !isEmpty(descuentoGlobal)) {
  //     toastError("Codigo incorrecto");
  //     return;
  //   }

  //   if (!typeClient && isEmpty(selectedClient)) {
  //     toastError("Seleccione un cliente");
  //     return;
  //   }

  //   if (!typeClient && selectedClient.facturasVencidas > 0) {
  //     toastError("El cliente tiene saldo vencido");
  //     return;
  //   }

  //   const data = {
  //     isEventual: typeClient,
  //     nombreCliente: eventualClient,
  //     idClient: selectedClient.id,
  //     montoVenta: montoVentaDespuesDescuento,
  //     saleDetails: selectedProductList,
  //     isContado: typeVenta === "contado" ? true : false,
  //     storeid: selectedStore,
  //     isDescuento: descuentoGlobal ? true : false,
  //     descuentoXPercent: descuentoGlobalPercent ? descuentoGlobalPercent : 0,
  //     descuentoXMonto: descuentoGlobalMonto ? descuentoGlobalMonto : 0,
  //     codigoDescuento: descuentoCod,
  //     montoVentaAntesDescuento,
  //     tipoPagoId: selectedTipopago,
  //     reference,
  //   };

  //   setIsLoading(true);
  //   const result = await addSaleAsync(token, data);
  //   if (!result.statusResponse) {
  //     setIsLoading(false);
  //     if (result.error.request.status === 401) {
  //       navigate(`${ruta}/unauthorized`);
  //       return;
  //     }
  //     toastError(result.error.message);
  //     return;
  //   }
  //   if (result.data === "eX01") {
  //     setIsLoading(false);
  //     deleteUserData();
  //     deleteToken();
  //     setIsLogged(false);
  //     return;
  //   }
  //   if (result.data.isDefaultPass) {
  //     setIsLoading(false);
  //     setIsDefaultPass(true);
  //     return;
  //   }
  //   setTypeClient(true);
  //   setSelectedClient("");
  //   setEventualClient("");
  //   setMontoVenta(0);
  //   setDescuento("");
  //   setDescuentoCod("");
  //   setDescuentoGlobal("");
  //   setDescuentoGlobalMonto("");
  //   setDescuentoGlobalPercent("");
  //   setMontoVentaAntesDescuento(0);
  //   setMontoVentaDespuesDescuento(0);
  //   setSelectedTipoPago(1);
  //   setReference("");
  //   setSelectedStore("");
  //   setSelectedProductList([]);
  //   setIsLoading(false);
  //    toastSuccess("Venta Realizada"); 
  //   setReload(!reload);
  //   setDataBill(result.data);
  //   setShowFacturarModal(false);
  //   printBill();
  // };

  const addProformma = async () => {
    if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
      toastError("Seleccione al menos un producto");
      return;
    }

    if (descuentoCod !== "VC.2022*" && !isEmpty(descuentoGlobal)) {
      toastError("Codigo incorrecto");
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
      idClient: selectedClient.id,
      montoVenta: montoVentaDespuesDescuento,
      ProformasDetails: selectedProductList,
      isContado: false,
      storeid: selectedStore,
      isDescuento: descuentoGlobal ? true : false,
      descuentoXPercent: descuentoGlobalPercent ? descuentoGlobalPercent : 0,
      descuentoXMonto: descuentoGlobalMonto ? descuentoGlobalMonto : 0,
      codigoDescuento: descuentoCod,
      montoVentaAntesDescuento,
      tipoPagoId: selectedTipopago,
      reference
  };
    try {
    setIsLoading(true);
    const result = await ProformAddAsync(token, data);
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
    setSelectedTipoPago(1);
    setReference("");
    setSelectedStore("");
    setSelectedProductList([]);
    setIsLoading(false);
    toastSuccess("Proforma Guardada");
    setDataProforma(data);
    setShowProformaModal(true);
    const proformas = await GetContadoSalesByProfAsync(token);
    if (proformas) {
        setReload(!reload);
    }
    
} catch (error) {
    toastError("Error al guardar la proforma");
} finally {
    setIsLoading(false);
}
};
/*  const addProformma = async () => {
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
  };*/

  const printBill = () => {
    setShowModal(true);
  };
  useEffect(() => {
    if(selectedStore) {
      const LoadProductForStore = async () => {
        setIsLoading(true);
        try {
          const data = {idAlmacen : selectedStore};
          const result = await getStoresByUserAsync(token, data);

          if(result.statusResponse){
            setReload(!reload);
          }

    } catch (error) {
          console.error("Error loading products:", error);
          toastError("Error al cargar los productos del almacén");
        } finally {
          setIsLoading(false);
        }
      };

      LoadProductForStore();
    }
  }, [selectedStore]);

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
          <h1>Agregar Venta</h1>
        </div>
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
                typeVenta={typeVenta}
              />
              <SelectProduct
                selectedProductList={selectedProductList}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                barCodeSearch={barCodeSearch}
                setBarCodeSearch={setBarCodeSearch}
                key={selectedStore} 
              />

              <SelectTipoVenta
                typeVenta={typeVenta}
                setTypeVenta={setTypeVenta}
                typeClient={typeClient}
                selectedClient={selectedClient}
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
          addToProductList={addToProductList}
          showFacturarModal={showFacturarModal}
          setShowFacturarModal={setShowFacturarModal}
          montoVentaAntesDescuento={montoVentaAntesDescuento}
          setMontoVentaAntesDescuento={setMontoVentaAntesDescuento}
          montoVentaDespuesDescuento={montoVentaDespuesDescuento}
          setMontoVentaDespuesDescuento={setMontoVentaDespuesDescuento}
          descuentoGlobal={descuentoGlobal}
          storeid={selectedStore}
          setSelectedStore={setSelectedStore} // Este es el prop donde recibo el almacen here
          almacen={selectedProduct?.almacen} // Este es el prop donde recibo el almacen here
          idClient = {selectedClient?.id ? selectedClient?.id : eventualClient}
          userId = {user}
          isFacturar={false}
        />
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

      <SmallModal
        titulo={"Facturar"}
        isVisible={showFacturarModal}
        setVisible={setShowFacturarModal}
      >
        <PreFacturar
          isDescPercent={isDescPercent}
          setIsDescPercent={setIsDescPercent}
          descuentoCod={descuentoCod}
          setDescuentoCod={setDescuentoCod}
          descuentoGlobalMonto={descuentoGlobalMonto}
          setDescuentoGlobalMonto={setDescuentoGlobalMonto}
          descuentoGlobalPercent={descuentoGlobalPercent}
          setDescuentoGlobalPercent={setDescuentoGlobalPercent}
          descuentoGlobal={descuentoGlobal}
          setDescuentoGlobal={setDescuentoGlobal}
          montoVentaDespuesDescuento={montoVentaDespuesDescuento}
          setMontoVentaDespuesDescuento={setMontoVentaDespuesDescuento}
          addNewVenta={addNewVenta}
          montoVentaAntesDescuento={montoVentaAntesDescuento}
          setMontoVentaAntesDescuento={setMontoVentaAntesDescuento}
          selectedProductList={selectedProductList}
          setSelectedProductList={setSelectedProductList}
          typeVenta={typeVenta}
          setSelectedTipoPago={setSelectedTipoPago}
          selectedTipopago={selectedTipopago}
          reference={reference}
          setReference={setReference}
        />
      </SmallModal>
    </div>
  );
};

export default NewSale;
