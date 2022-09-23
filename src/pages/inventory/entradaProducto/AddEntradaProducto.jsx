import React, { useState, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getRuta, simpleMessage, toastError } from "../../../helpers/Helpers";

import {
  Button,
  Divider,
  Container,
  Paper,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faSave,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { addEntradaProductoAsync } from "../../../services/ProductIsApi";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";

import DetallesDeEntrada from "./entradaProductosComponents/DetallesDeEntrada";
import ProductDescription from "./entradaProductosComponents/ProductDescription";
import { parseInt } from "lodash";

const AddEntradaProducto = () => {
  let ruta = getRuta();

  const {
    isDarkMode,
    setIsLoading,
    setIsLogged,
    reload,
    setReload,
    setIsDefaultPass,
  } = useContext(DataContext);
  let navigate = useNavigate();
  const [tipoCompra, setTipoCompra] = useState("");
  const [noFactura, setNoFactura] = useState("");

  const [selectedProvider, setSelectedProvider] = useState("");

  const [montoFactura, setMontoFactura] = useState(0);
  const [montoFacturaADesc, setMontoFacturaADesc] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState("");

  const [cantidad, setCantidad] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [descuento, setDescuento] = useState("");
  const [impuesto, setImpuesto] = useState("");

  const [costoAntesDesc, setCostoAntesDesc] = useState(0);
  const [costo, setCosto] = useState(0);

  const [baseGanancia, setBaseGanancia] = useState("");
  const [ganancia, setGanancia] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");

  const [baseGananciaDetalle, setBaseGananciaDetalle] = useState("");
  const [gananciaDetalle, setGananciaDetalle] = useState("");
  const [precioVentaDetalle, setPrecioVentaDetalle] = useState("");

  const [productDetailList, setProductDetailList] = useState([]);

  const token = getToken();

  const addToProductList = () => {
    if (!selectedProduct) {
      simpleMessage("Seleccione un producto", "error");
      return;
    }

    if (!cantidad) {
      simpleMessage("Ingrese cantidad de productos", "error");
      return;
    }

    if (cantidad <= 0) {
      simpleMessage("La cantidad debe ser mayor que cero", "error");
      return;
    }

    if (!precioCompra) {
      simpleMessage("Ingrese monto de compra", "error");
      return;
    }

    if (precioCompra <= 0) {
      simpleMessage("El monto de compra debe ser mayor que cero", "error");
      return;
    }

    if (!precioVenta) {
      simpleMessage("Ingrese un precio de venta por mayor", "error");
      return;
    }

    if (precioVenta <= costo) {
      simpleMessage(
        "El precio de venta por mayor debe ser mayor que el costo del producto",
        "error"
      );
      return;
    }

    if (!precioVentaDetalle) {
      simpleMessage("Ingrese un precio de venta al detalle", "error");
      return;
    }

    if (precioVentaDetalle <= costo) {
      simpleMessage(
        "El precio de venta al detalle debe ser mayor que el costo del producto",
        "error"
      );
      return;
    }

    const data = {
      product: selectedProduct.producto,
      cantidad,
      costoUnitario: costoAntesDesc,
      descuento: descuento ? descuento : 0,
      impuesto: impuesto ? impuesto : 0,
      costUnitDespDesc: costo,
      costoCompra: cantidad * costo,
      precioVentaMayor: parseFloat(precioVenta),
      precioVentaDetalle: parseFloat(precioVentaDetalle),
    };

    setMontoFactura(montoFactura + cantidad * costo);
    setMontoFacturaADesc(montoFacturaADesc + cantidad * costoAntesDesc);
    setSelectedProduct("");
    setCantidad("");
    setPrecioCompra("");
    setDescuento("");
    setImpuesto("");
    setCosto(0);
    setBaseGanancia("");
    setGanancia("");
    setPrecioVenta("");
    setBaseGananciaDetalle("");
    setGananciaDetalle("");
    setPrecioVentaDetalle("");
    setCostoAntesDesc("");
    setProductDetailList([...productDetailList, data]);
  };

  const deleteFromProductDetailList = (item) => {
    const filtered = productDetailList.filter(
      (p) => p.product.id !== item.product.id
    );

    setMontoFactura(montoFactura - item.costoCompra);
    setMontoFacturaADesc(
      montoFacturaADesc - item.costAntDesc * parseInt(item.cantidad)
    );
    setProductDetailList(filtered);
  };

  const addProdutInn = async () => {
    if (!noFactura) {
      simpleMessage("Ingrese numero de factura", "error");
      return;
    }

    if (!tipoCompra) {
      simpleMessage("Ingrese tipo de pago", "error");
      return;
    }

    if (!selectedProvider) {
      simpleMessage("Seleccione un proveedor", "error");
      return;
    }

    if (!montoFactura) {
      simpleMessage("Ingrese al menos un producto para guardar", "error");
      return;
    }

    const data = {
      noFactura,
      tipoPago: tipoCompra,
      providerId: selectedProvider.id,
      montFactAntDesc: montoFacturaADesc,
      montoFactura,
      productInDetails: productDetailList,
    };

    setIsLoading(true);
    const result = await addEntradaProductoAsync(token, data);
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

    setReload(!reload);
    setNoFactura("");
    setTipoCompra("");
    setSelectedProvider("");
    setMontoFactura(0);
    setMontoFacturaADesc(0);
    setProductDetailList([]);
    setIsLoading(false);
    simpleMessage("Exito...!", "success");
  };

  return (
    <div>
      <Container maxWidth="xl">
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Button
              onClick={() => {
                navigate(`${ruta}/inventory/`);
              }}
              style={{ marginRight: 20, borderRadius: 20 }}
              variant="outlined"
            >
              <FontAwesomeIcon
                style={{ marginRight: 10, fontSize: 20 }}
                icon={faCircleChevronLeft}
              />
              Regresar
            </Button>

            <h1>Agregar Entrada de Producto</h1>
          </div>

          <hr />
          <Stack spacing={2}>
            <DetallesDeEntrada
              setNoFactura={setNoFactura}
              noFactura={noFactura}
              tipoCompra={tipoCompra}
              setTipoCompra={setTipoCompra}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
            />

            <ProductDescription
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              cantidad={cantidad}
              setCantidad={setCantidad}
              precioCompra={precioCompra}
              setPrecioCompra={setPrecioCompra}
              descuento={descuento}
              setDescuento={setDescuento}
              impuesto={impuesto}
              setImpuesto={setImpuesto}
              costo={costo}
              setCosto={setCosto}
              baseGanancia={baseGanancia}
              setBaseGanancia={setBaseGanancia}
              ganancia={ganancia}
              setGanancia={setGanancia}
              precioVenta={precioVenta}
              setPrecioVenta={setPrecioVenta}
              baseGananciaDetalle={baseGananciaDetalle}
              setBaseGananciaDetalle={setBaseGananciaDetalle}
              gananciaDetalle={gananciaDetalle}
              setGananciaDetalle={setGananciaDetalle}
              precioVentaDetalle={precioVentaDetalle}
              setPrecioVentaDetalle={setPrecioVentaDetalle}
              addToProductList={addToProductList}
              costoAntesDesc={costoAntesDesc}
              setCostoAntesDesc={setCostoAntesDesc}
            />
          </Stack>

          <Stack direction={"row"} marginTop={2}>
            <h5>Detalle de Entrada</h5>
          </Stack>

          <Divider style={{ marginBottom: 10 }} />

          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "left" }}>Nombre</th>
                <th>Cantidad</th>
                <th>C.Unit</th>
                <th>Desc</th>
                <th>Imp</th>
                <th>C.Unit Desc</th>
                <th>C.Compra</th>
                <th>P.V. Mayor</th>
                <th>P.V. Detalle</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {productDetailList ? (
                productDetailList.map((item) => {
                  return (
                    <tr key={productDetailList.indexOf(item) + 1}>
                      <td>{productDetailList.indexOf(item) + 1}</td>
                      <td style={{ textAlign: "left" }}>
                        {item.product.description}
                      </td>
                      <td>{item.cantidad}</td>
                      <td>
                        {item.costoUnitario.toLocaleString("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        })}
                      </td>
                      <td>{`${item.descuento}%`}</td>
                      <td>{`${item.impuesto}%`}</td>
                      <td>
                        {item.costUnitDespDesc.toLocaleString("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        })}
                      </td>
                      <td>
                        {item.costoCompra.toLocaleString("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        })}
                      </td>
                      <td>
                        {item.precioVentaMayor.toLocaleString("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        })}
                      </td>
                      <td>
                        {item.precioVentaDetalle.toLocaleString("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        })}
                      </td>
                      <td>
                        <IconButton
                          style={{ color: "#f50057" }}
                          onClick={() => deleteFromProductDetailList(item)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
            </tbody>
          </Table>
        </Paper>
      </Container>

      <Container style={{ marginTop: 20 }} maxWidth="xl">
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
          }}
        >
          <div className="row justify-content-around align-items-center">
            <div className="col-sm-3 ">
              <Typography
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Total de Productos
              </Typography>
              <Typography
                style={{
                  fontSize: 14,
                  color: "#2196f3",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {productDetailList.length}
              </Typography>
            </div>

            <div className="col-sm-3 ">
              <Typography
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                M. Antes Descuento
              </Typography>
              <Typography
                style={{
                  fontSize: 14,
                  color: "#f50057",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(montoFacturaADesc)}
              </Typography>
            </div>

            <div className="col-sm-3 ">
              <Typography
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Monto de Compra
              </Typography>
              <Typography
                style={{
                  fontSize: 14,
                  color: "#f50057",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(montoFactura)}
              </Typography>
            </div>

            <div className="col-sm-3 ">
              <Button
                variant="outlined"
                style={{ borderRadius: 20 }}
                onClick={() => addProdutInn()}
              >
                <FontAwesomeIcon
                  style={{ marginRight: 10, fontSize: 20 }}
                  icon={faSave}
                />
                Guardar Entrada de Producto
              </Button>
            </div>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default AddEntradaProducto;
