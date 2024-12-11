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
import { ProformAddAsync, GetContadoSalesByProfAsync , finishSaleStatusAsync } from "../../../../services/SalesApi";
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
import { getStoresByUserAsync } from "../../../../services/AlmacenApi";
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
  const [selectedTipopago, setSelectedTipoPago] = useState(1);

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

  // const [showFacturarModal, setShowFacturarModal] = useState(false);

  const [montoVentaDespuesDescuento, setMontoVentaDespuesDescuento] =
    useState(0);
  const [montoVentaAntesDescuento, setMontoVentaAntesDescuento] = useState(0);

  const [dataProforma, setDataProforma] = useState([]);
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [reference, setReference] = useState("");
  const [cambio, setCambio] = useState("");
  const [proforList, setProforList] = useState([]);

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

//   const handleFinalizarVenta = async () => {
//     if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
//         toastError("Seleccione al menos un producto para facturar");
//         return;
//     }

//     if (!typeClient && isEmpty(selectedClient)) {
//         toastError("Seleccione un cliente");
//         return;
//     }

//     if (!typeClient && selectedClient.facturasVencidas > 0) {
//         toastError("El cliente tiene saldo vencido");
//         return;
//     }

//     const data = {
//         isEventual: typeClient,
//         nombreCliente: eventualClient,
//         clientId: selectedClient?.id,
//         montoVenta: montoVentaDespuesDescuento,
//         facturacionDetails: selectedProductList,
//         isContado: typeVenta === "contado",
//         storeid: selectedStore,
//         isDescuento: descuentoGlobal ? true : false,
//         descuentoXPercent: descuentoGlobalPercent || 0,
//         descuentoXMonto: descuentoGlobalMonto || 0,
//         codigoDescuento: descuentoCod,
//         montoVentaAntesDescuento,
//         reference: reference || ""
//     };

//     setIsLoading(true);
//     const result = await addFacturaAsync(token, data);
    
//     if (!result.statusResponse) {
//         setIsLoading(false);
//         if (result.error.request.status === 401) {
//             navigate(`${ruta}/unauthorized`);
//             return;
//         }
//         toastError(result.error.message);
//         return;
//     }
    
//     if (result.data === "eX01") {
//         setIsLoading(false);
//         deleteUserData();
//         deleteToken();
//         setIsLogged(false);
//         return;
//     }
    
//     if (result.data.isDefaultPass) {
//         setIsLoading(false);
//         setIsDefaultPass(true);
//         return;
//     }

//     // Limpiar formulario después de facturación exitosa
//     setTypeClient(true);
//     setSelectedClient("");
//     setEventualClient("");
//     setMontoVenta(0);
//     setDescuento("");
//     setDescuentoCod("");
//     setDescuentoGlobal("");
//     setDescuentoGlobalMonto("");
//     setDescuentoGlobalPercent("");
//     setMontoVentaAntesDescuento(0);
//     setMontoVentaDespuesDescuento(0);
//     setSelectedStore("");
//     setSelectedProductList([]);
//     setIsLoading(false);
//     toastSuccess("Productos Facturados");
//     setReload(!reload);
// };

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
    setSelectedStore("");
    setSelectedProductList([]);
};

const handleError = (result) => {
    if (result.error.request.status === 401) {
        navigate(`${ruta}/unauthorized`);
        return;
    }
    if (result.data === "eX01") {
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
    }
    toastError(result.error.message);
};

const addNewVenta = async () => {
  // Validaciones iniciales
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

  if (!selectedStore) {
    toastError("Seleccione un almacén");
    return;
  }

  try {
    setIsLoading(true);
    const isExistingProforma = selectedProductList.some(item => item.hasOwnProperty('proformaId') && item.proformaId != null);

    // Mapear los detalles de facturación
    const mappedDetails = selectedProductList.map(item => ({
      ProductId: item.product.id,
      cantidad: item.cantidad,
      isDescuento: item.isDescuento || false,
      descuentoXPercent: item.descuentoXPercent || 0,
      descuento: item.descuento || 0,
      codigoDescuento: item.codigoDescuento || "",
      costoUnitario: item.costoUnitario,
      pvd: item.PVD,
      pvm: item.PVM,
      costoTotalAntesDescuento: item.costoTotalAntesDescuento,
      costoTotalDespuesDescuento: item.costoTotalDespuesDescuento,
      costoTotal: item.costoTotal,
      costoCompra: item.costoCompra,
      isAnulado: false
    }));

    let result;

    if (isExistingProforma) {
      // Datos para proforma existente
      const data = {
        isEventual: typeClient,
        nombreCliente: eventualClient,
        clientId: selectedClient?.id || 0,
        montoVenta: montoVentaDespuesDescuento,
        facturacionDetails: mappedDetails,
        isContado: typeVenta === "contado" ? true : false,
        storeId: selectedStore,
        isDescuento: descuentoGlobal ? true : false,
        descuentoXPercent: descuentoGlobalPercent || 0,
        descuentoXMonto: descuentoGlobalMonto || 0,
        codigoDescuento: descuentoCod || "",
        montoVentaAntesDescuento,
        tipoPagoId: selectedTipopago,
        reference: reference || ""
      };

      result = await addFacturaAsync(token, data);
      
      if (!result.statusResponse) {
        throw new Error(result.error?.message || "Error al crear la Factura");
      }

      // Finalizar la proforma
      const finishData = {
        id: selectedProductList[0].proformaId,
        tipoPagoId: selectedTipopago,
        reference: reference || ""
      };

      const proformaResult = await finishSaleStatusAsync(token, finishData);
      
      if (!proformaResult.statusResponse) {
        throw new Error(proformaResult.error?.message || "Error al finalizar la proforma");
      }
    } else {
      // Datos para venta normal
      const data = {
        isEventual: typeClient,
        nombreCliente: eventualClient,
        clientId: selectedClient?.id || 0,
        montoVenta: montoVentaDespuesDescuento,
        facturacionDetails: mappedDetails,
        isContado: typeVenta === "contado" ? true : false,
        storeId: selectedStore,
        isDescuento: descuentoGlobal ? true : false,
        descuentoXPercent: descuentoGlobalPercent || 0,
        descuentoXMonto: descuentoGlobalMonto || 0,
        codigoDescuento: descuentoCod || "",
        montoVentaAntesDescuento,
        tipoPagoId: selectedTipopago,
        reference: reference || ""
      };

      result = await addFacturaAsync(token, data);
    }

    if (!result.statusResponse) {
      if (result.error?.request?.status === 401) {
        navigate(`${ruta}/unauthorized`);
        return;
      }
      throw new Error(result.error?.message || "Error al procesar la factura");
    }

    // Limpiar formulario
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
    toastSuccess("Productos Facturados Exitosamente");
        setReload(!reload);
   
  } catch (error) {
    console.error("Error:", error);
    toastError(error.message || "Error al procesar la factura");
  } finally {
    setIsLoading(false);
  }
};

// const addNewVenta = async () => {
//   if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
//     toastError("Seleccione al menos un producto para facturar");
//     return;
//   }
//   if (descuentoCod !== "VC.2022*" && !isEmpty(descuentoGlobal)) {
//     toastError("Codigo incorrecto!");
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
// try {
//     setIsLoading(true);
//     const isExistingProforma = selectedProductList.some(item =>   item.hasOwnProperty('proformaId') && item.proformaId != null   );
  
//   let result;

// if (isExistingProforma){
//   const data = {
//     isEventual: typeClient,
//     nombreCliente: eventualClient,
//     clientId: selectedClient.id,
//     montoVenta: montoVentaDespuesDescuento,
//     FacturacionDetails: selectedProductList,
//     isContado: typeVenta === "contado" ? true : false,
//     storeid: selectedStore,
//     isDescuento: descuentoGlobal ? true : false,
//     descuentoXPercent: descuentoGlobalPercent ? descuentoGlobalPercent : 0,
//     descuentoXMonto: descuentoGlobalMonto ? descuentoGlobalMonto : 0,
//     codigoDescuento: descuentoCod,
//     montoVentaAntesDescuento,
//   };
// result = await addFacturaAsync(token, data);
        
//         if (!result.statusResponse) {
//             throw new Error(result.error?.message || "Error al crear la Factura");
//         }

//         // console.log("Is Existing validProducts[0].id sz:", validProducts[0].id);
//         // Luego finalizamos la proforma
//         const finishData = {
//             Id: selectedProductList[0].proformaId,
//             tipoPagoId: selectedTipopago,
//             reference: reference || ""
//         };
//         // console.log("Is Existing ANTES:", finishData);
//         const proformaResult = await finishSaleStatusAsync(token, finishData);
//         // console.log("Is Existing LUEGO:", proformaResult);
        
//         if (!proformaResult.statusResponse) {
//             throw new Error(proformaResult.error?.message || "Error al finalizar la proforma");
//         }
        
//     } else {
//       const data = {
//         isEventual: typeClient,
//         nombreCliente: eventualClient,
//         clientId: selectedClient.id,
//         montoVenta: montoVentaDespuesDescuento,
//         FacturacionDetails: selectedProductList,
//         isContado: typeVenta === "contado" ? true : false,
//         storeid: selectedStore,
//         isDescuento: descuentoGlobal ? true : false,
//         descuentoXPercent: descuentoGlobalPercent ? descuentoGlobalPercent : 0,
//         descuentoXMonto: descuentoGlobalMonto ? descuentoGlobalMonto : 0,
//         codigoDescuento: descuentoCod,
//         montoVentaAntesDescuento,
//       };
//   result = await addFacturaAsync(token, data);
//   }

//     if (!result.statusResponse) {
//         if (result.error?.request?.status === 401) {
//             navigate(`${ruta}/unauthorized`);
//             return;
//         }
//         throw new Error(result.error?.message || "Error al procesar la venta");
//     }


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
//   setSelectedStore("");
//   setSelectedProductList([]);
//   setIsLoading(false);
//   toastSuccess("Productos Facturados");

//   setReload(!reload);
//  } catch (error) {
//     console.error("Error:", error);
//     toastError(error.message || "Error al procesar la venta");
// } finally {
//     setIsLoading(false);
// }
// };


  //   if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
  //     toastError("Seleccione al menos un producto para facturar");
  //     return;
  //   }
  //   if (descuentoCod !== "VC.2022*" && !isEmpty(descuentoGlobal)) {
  //     toastError("Codigo incorrecto!");
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
  //     clientId: selectedClient.id,
  //     montoVenta: montoVentaDespuesDescuento,
  //     facturacionDetails: selectedProductList,
  //     isContado: typeVenta === "contado" ? true : false,
  //     storeid: selectedStore,
  //     isDescuento: descuentoGlobal ? true : false,
  //     descuentoXPercent: descuentoGlobalPercent ? descuentoGlobalPercent : 0,
  //     descuentoXMonto: descuentoGlobalMonto ? descuentoGlobalMonto : 0,
  //     codigoDescuento: descuentoCod,
  //     montoVentaAntesDescuento,
  //   };

  //   setIsLoading(true);
  //   const result = await addFacturaAsync(token, data);
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
  //   setSelectedStore("");
  //   setSelectedProductList([]);
  //   setIsLoading(false);
  //   toastSuccess("Productos Facturados");
  //   setReload(!reload);
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
      isContado: typeVenta === false,
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
  
//   const addProformma = async () => {
//     if (isEmpty(selectedProductList) || montoVentaDespuesDescuento === 0) {
//       toastError("Seleccione al menos un producto");
//       return;
//     }

//     if (!typeClient && isEmpty(selectedClient)) {
//       toastError("Seleccione un cliente");
//       return;
//     }

//     setIsLoading(true);

//     const toDecimal = (value) => {
//       if (value === null || value === undefined || value === "") return 0;
//       const parsed = parseFloat(value);
//       return isNaN(parsed) ? 0 : parsed;
//     };

//     const data = {
//       isEventual: typeClient,
//       nombreCliente: eventualClient || "",
//       idClient: selectedClient?.id || 0,
//       montoVenta: toDecimal(montoVentaDespuesDescuento),
//       isDescuento: descuento !== "",
//       descuentoXPercent: toDecimal(descuentoGlobalPercent),
//       descuentoXMonto: toDecimal(descuentoGlobalMonto),
//       saleDetails: selectedProductList.map(item => ({
//         product: { id: parseInt(item.product?.id || item.id) },
//         cantidad: parseInt(item.cantidad || 0),
//         isDescuento: Boolean(item.descuento),
//         descuentoXPercent: toDecimal(item.descuentoPercent),
//         descuento: toDecimal(item.descuento),
//         codigoDescuento: item.codigoDescuento || "",
//         costoTotal: toDecimal(item.costoTotal),
//         costoUnitario: toDecimal(item.costoUnitario),
//         pvm: toDecimal(item.precioVentaMayor || item.pvm),
//         pvd: toDecimal(item.precioVentaDetalle || item.pvd),
//         costoTotalAntesDescuento: toDecimal(item.costoTotalAntesDescuento),
//         costoTotalDespuesDescuento: toDecimal(item.costoTotalDespuesDescuento),
//         store: { id: parseInt(selectedStore) }
//       })),
//       storeid: parseInt(selectedStore),
//       codigoDescuento: descuentoCod || "",
//       montoVentaAntesDescuento: toDecimal(montoVentaAntesDescuento),
//       reference: reference || "",
//     };


//     try {
//       const result = await ProformAddAsync(token, data);
//       if (!result.statusResponse) {
//         setIsLoading(false);
//         if (result.error.request.status === 401) {
//           navigate(`${ruta}/unauthorized`);
//           return;
//         }
//         toastError(result.error.message);
//         return;
//       }

//       // Limpiar formulario
//       setTypeClient(true);
//       setSelectedClient("");
//       setEventualClient("");
//       setMontoVenta(0);
//       setDescuento("");
//       setDescuentoCod("");
//       setDescuentoGlobal("");
//       setDescuentoGlobalMonto("");
//       setDescuentoGlobalPercent("");
//       setMontoVentaAntesDescuento(0);
//       setMontoVentaDespuesDescuento(0);
//       setReference("");
//       setSelectedStore("");
//       setSelectedProductList([]);
//       setIsLoading(false);
      
//       toastSuccess("Proforma Guardada");
//       setReload(!reload);
//         await GetContadoSalesByProfAsync(token);
  
//       setDataProforma(result.data);
//      // printBill();
      
//     } catch (error) {
//       setIsLoading(false);
//       toastError("Error al guardar la proforma");
//     }
// };

  /*const addProformma = async () => {
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
  connection.onclose(async () => {
    await start();
  });

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
          toastError("Error al cargar los productos del almacén......");
        } finally {
          setIsLoading(false);
        }
      };

      LoadProductForStore();
    }
  }, [selectedStore]);

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
          montoVentaAntesDescuento={montoVentaAntesDescuento}
          setMontoVentaAntesDescuento={setMontoVentaAntesDescuento}
          montoVentaDespuesDescuento={montoVentaDespuesDescuento}
          setMontoVentaDespuesDescuento={setMontoVentaDespuesDescuento}
          descuentoGlobal={descuentoGlobal}
          storeid={selectedStore}
          setSelectedStore={setSelectedStore} // Este es el prop donde recibo el almacen here
          almacen={selectedProduct?.almacen} // Este es el prop donde recibo el almacen here
          idClient = {selectedClient?.id ? selectedClient?.id : eventualClient}
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
