import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import {
  Button,
  InputGroup,
  FormControl,
  Form,
  Row,
  Table,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../helpers/Helpers";
import { getProductsAsync } from "../../services/ProductsApi";
import { getprovidersAsync } from "../../services/ProviderApi";

import Loading from "../../components/Loading";

import {
  Autocomplete,
  TextField,
  Container,
  Typography,
  Divider,
} from "@mui/material";

import SmallModal from "../../components/modals/SmallModal";
import AddProviderComponent from "./AddProviderComponent";
import AddProductComponent from "./AddProductComponent";
import MediumModal from "../../components/modals/MediumModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faClipboard,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import { addEntradaProductoAsync } from "../../services/ProductIsApi";

const AddEntradaProducto = () => {
  const { reload, setIsLoading } = useContext(DataContext);
  let navigate = useNavigate();

  const [tipoEntrada, setTipoEntrada] = useState("");
  const [tipoCompra, setTipoCompra] = useState("");
  const [noFactura, setNoFactura] = useState("");
  const [providerList, setProviderList] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");

  const [montoFactura, setMontoFactura] = useState(0);

  const [productList, setProductList] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");

  const [cantidad, setCantidad] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [descuento, setDescuento] = useState("");
  const [impuesto, setImpuesto] = useState("");

  const [costo, setCosto] = useState(0);

  const [baseGanancia, setBaseGanancia] = useState("");
  const [ganancia, setGanancia] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");

  const [baseGananciaDetalle, setBaseGananciaDetalle] = useState("");
  const [gananciaDetalle, setGananciaDetalle] = useState("");
  const [precioVentaDetalle, setPrecioVentaDetalle] = useState("");

  const [productDetailList, setProductDetailList] = useState([]);

  const [showProviderModal, setShowProvidermodal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultProviders = await getprovidersAsync();
      if (!resultProviders.statusResponse) {
        setIsLoading(false);
        simpleMessage(resultProviders.error, "error");
        return;
      }
      setProviderList(resultProviders.data);

      const resultProducts = await getProductsAsync();
      if (!resultProducts.statusResponse) {
        setIsLoading(false);
        simpleMessage(resultProducts.error, "error");
        return;
      }
      setProductList(resultProducts.data);
      setIsLoading(false);
    })();
  }, [reload]);

  //Devuelve un entero positivo
  const funcCantidad = (value) => {
    if (/^[0-9]+$/.test(value.toString()) || value === "") {
      let pC = 0;
      let imp = 0;
      let desc = 0;
      precioCompra ? (pC = precioCompra) : (pC = 0);
      let subPrecio = pC / value;
      descuento ? (desc = subPrecio * (descuento / 100)) : (desc = 0);
      impuesto ? (imp = subPrecio * (impuesto / 100)) : (imp = 0);
      setCosto(subPrecio - desc + imp);
      setCantidad(value);
      return;
    }
  };

  //Devuelve un entero positivo
  const funcPrecioCompra = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      let cant = 0;
      let imp = 0;
      let desc = 0;
      cantidad ? (cant = cantidad) : (cant = 0);
      let subPrecio = value / cant;
      descuento ? (desc = subPrecio * (descuento / 100)) : (desc = 0);
      impuesto ? (imp = subPrecio * (impuesto / 100)) : (imp = 0);
      setCosto(subPrecio - desc + imp);
      setPrecioCompra(value);
      return;
    }
  };

  //Devuelve un entero positivo
  const funcDescuento = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      let pC = 0;
      let cant = 0;
      let imp = 0;
      let desc = 0;
      precioCompra ? (pC = precioCompra) : (pC = 0);
      cantidad ? (cant = cantidad) : (cant = 0);
      let subPrecio = pC / cant;
      desc = subPrecio * (value / 100);
      impuesto ? (imp = subPrecio * (impuesto / 100)) : (imp = 0);
      setCosto(subPrecio - desc + imp);
      setDescuento(value);
      return;
    }
  };

  //Devuelve un entero positivo
  const funcImpuesto = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      let pC = 0;
      let cant = 0;
      let imp = 0;
      let desc = 0;
      precioCompra ? (pC = precioCompra) : (pC = 0);
      cantidad ? (cant = cantidad) : (cant = 0);
      let subPrecio = pC / cant;
      descuento ? (desc = subPrecio * (descuento / 100)) : (desc = 0);
      imp = (subPrecio - desc) * (value / 100);
      setCosto(subPrecio - desc + imp);
      setImpuesto(value);
      return;
    }
  };

  //Devuelve un entero positivo
  const funcPorcentGananciaMayor = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      let factor = value / 100 + 1;
      let factorGanancia = costo * factor;
      setGanancia((factorGanancia - costo).toFixed(2));
      setPrecioVenta(factorGanancia.toFixed(2));
      setBaseGanancia(value);
      return;
    }
  };

  const funcGananciaMayor = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      let factorGanancia = parseFloat(value) + costo;
      let factor = (value / costo) * 100;
      setBaseGanancia(factor.toFixed(2));
      setPrecioVenta(factorGanancia.toFixed(2));
      setGanancia(value);
      return;
    }
  };

  const funcPrecioVenta = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      if (costo > value) {
        setBaseGanancia(0);
        setGanancia(0);
        setPrecioVenta(value);
        return;
      }
      let factorGanancia = parseFloat(value) - costo;
      let factor = (factorGanancia / costo) * 100;
      setGanancia(factorGanancia.toFixed(2));
      setBaseGanancia(factor.toFixed(2));
      setPrecioVenta(value);
      return;
    }
  };

  //Devuelve un entero positivo
  const funcPorcentGananciaDetalle = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      let factor = value / 100 + 1;
      let factorGanancia = costo * factor;
      setGananciaDetalle((factorGanancia - costo).toFixed(2));
      setPrecioVentaDetalle(factorGanancia.toFixed(2));
      setBaseGananciaDetalle(value);
      return;
    }
  };

  const funcGananciaDetalle = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      let factorGanancia = parseFloat(value) + costo;
      let factor = (value / costo) * 100;
      setBaseGananciaDetalle(factor.toFixed(2));
      setPrecioVentaDetalle(factorGanancia.toFixed(2));
      setGananciaDetalle(value);
      return;
    }
  };

  const funcPrecioVentaDetalle = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      if (costo > value) {
        setBaseGananciaDetalle(0);
        setGananciaDetalle(0);
        setPrecioVentaDetalle(value);
        return;
      }
      let factorGanancia = parseFloat(value) - costo;
      let factor = (factorGanancia / costo) * 100;
      setGananciaDetalle(factorGanancia.toFixed(2));
      setBaseGananciaDetalle(factor.toFixed(2));
      setPrecioVentaDetalle(value);
      return;
    }
  };

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
      product: selectedProduct,
      cantidad,
      costoUnitario: costo,
      descuento: descuento ? descuento : 0,
      impuesto: impuesto ? impuesto : 0,
      costoCompra: cantidad * costo,
      precioVentaMayor: parseFloat(precioVenta),
      precioVentaDetalle: parseFloat(precioVentaDetalle),
    };
    setMontoFactura(montoFactura + cantidad * costo);
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
    setProductDetailList([...productDetailList, data]);
  };

  const deleteFromProductDetailList = (item) => {
    const filtered = productDetailList.filter(
      (p) => p.product.barCode !== item.product.barCode
    );
    setMontoFactura(montoFactura - item.costoCompra);
    setProductDetailList(filtered);
  };

  const addProdutInn = async () => {
    if (!noFactura) {
      simpleMessage("Ingrese numero de factura", "error");
      return;
    }

    if (!tipoEntrada) {
      simpleMessage("Ingrese tipo de entrada", "error");
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
      tipoEntrada,
      tipoPago: tipoCompra,
      provider: selectedProvider,
      montoFactura,
      productInDetails: productDetailList,
    };
    setIsLoading(true);

    const result = await addEntradaProductoAsync(data);
    if (!result.statusResponse) {
      setIsLoading(false);
      simpleMessage(result.error, "error");
      return;
    }
    setNoFactura("");
    setTipoEntrada("");
    setTipoCompra("");
    setSelectedProvider("");
    setMontoFactura(0);
    setProductDetailList([]);
    setIsLoading(false);
    simpleMessage("Exito...!", "success");
  };

  return (
    <div>
      <Container maxWidth="xl">
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <Button
            onClick={() => {
              navigate("/products-in/");
            }}
            style={{ marginRight: 20, borderRadius: 20 }}
            variant="outline-primary"
          >
            <FontAwesomeIcon
              style={{ marginRight: 10, fontSize: 20 }}
              icon={faCircleArrowLeft}
            />
            Regresar
          </Button>

          <h1>Agregar Entrada de Producto</h1>
        </div>

        <hr />

        <Row>
          <Col xs={12} md={4}>
            <InputGroup className="mb-3">
              <InputGroup.Text>N° Factura</InputGroup.Text>
              <FormControl
                type="text"
                aria-label="Description"
                value={noFactura}
                onChange={(e) => setNoFactura(e.target.value)}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Tipo de Entrada</InputGroup.Text>
              <Form.Select onChange={(e) => setTipoEntrada(e.target.value)}>
                <option>Seleccione un tipo de entrada...</option>
                <option>Compra</option>
                <option>Devolucion</option>
                <option>Remision</option>;<option>Anulacion</option>;
              </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Tipo de Pago</InputGroup.Text>
              <Form.Select onChange={(e) => setTipoCompra(e.target.value)}>
                <option>Seleccione un tipo de pago...</option>
                <option>Pago de Contado</option>
                <option>Pago de Credito</option>
              </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
              <Autocomplete
                id="combo-box-demo"
                className="form-control"
                options={providerList}
                getOptionLabel={(op) => (op ? `${op.nombre}` || "" : "")}
                value={selectedProvider}
                onChange={(event, newValue) => {
                  setSelectedProvider(newValue);
                }}
                noOptionsText="Proveedor no encontrado..."
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    label="Seleccione un proveedor..."
                  />
                )}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowProvidermodal(!showProviderModal)}
              >
                Agregar Proveedor
              </Button>
            </InputGroup>
          </Col>

          <Col xs={12} md={8}>
            <InputGroup className="mb-3">
              <Autocomplete
                id="combo-box-demo"
                className="form-control"
                options={productList}
                getOptionLabel={(op) =>
                  op ? `${op.barCode} - ${op.description}` || "" : ""
                }
                value={selectedProduct}
                onChange={(event, newValue) => {
                  setSelectedProduct(newValue);
                }}
                noOptionsText="Producto no encontrado..."
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    label="Seleccione un producto..."
                  />
                )}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowProductModal(true)}
              >
                Agregar Producto
              </Button>
            </InputGroup>

            <Row>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>Codigo</InputGroup.Text>
                    <FormControl
                      type="text"
                      disabled={true}
                      value={selectedProduct ? selectedProduct.id : ""}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>Descripcion</InputGroup.Text>
                    <FormControl
                      type="text"
                      disabled={true}
                      value={selectedProduct ? selectedProduct.description : ""}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>Cantidad</InputGroup.Text>
                    <FormControl
                      value={cantidad}
                      onChange={(e) => funcCantidad(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col xs={12} md={2}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>C$</InputGroup.Text>
                    <FormControl
                      type="text"
                      value={precioCompra}
                      placeholder="Monto de compra..."
                      onChange={(e) => funcPrecioCompra(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col xs={12} md={2}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <FormControl
                      type="text"
                      placeholder="Descuento..."
                      value={descuento}
                      onChange={(e) => funcDescuento(e.target.value)}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col xs={12} md={2}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <FormControl
                      type="text"
                      placeholder="Impuesto..."
                      value={impuesto}
                      onChange={(e) => funcImpuesto(e.target.value)}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <h6 style={{ marginTop: 10 }}>{`Costo = ${costo.toLocaleString(
                  "es-NI",
                  {
                    style: "currency",
                    currency: "NIO",
                  }
                )}`}</h6>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <h5 style={{ marginTop: 10 }}>Precio de venta C$</h5>
                <hr />
                <Row>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <FormControl
                          type="text"
                          placeholder="Ganancia..."
                          value={baseGanancia}
                          onChange={(e) =>
                            funcPorcentGananciaMayor(e.target.value)
                          }
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <FormControl
                          type="text"
                          placeholder="Ganancia..."
                          value={ganancia}
                          onChange={(e) => funcGananciaMayor(e.target.value)}
                        />
                        <InputGroup.Text>C$</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <FormControl
                          type="text"
                          placeholder="Precio de venta..."
                          value={precioVenta}
                          onChange={(e) => funcPrecioVenta(e.target.value)}
                        />
                        <InputGroup.Text>C$</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={3}>
                    <h5 className="align-middle">Mayor</h5>
                  </Col>

                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <FormControl
                          type="text"
                          placeholder="Ganancia..."
                          value={baseGananciaDetalle}
                          onChange={(e) =>
                            funcPorcentGananciaDetalle(e.target.value)
                          }
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <FormControl
                          type="text"
                          placeholder="Ganancia..."
                          value={gananciaDetalle}
                          onChange={(e) => funcGananciaDetalle(e.target.value)}
                        />
                        <InputGroup.Text>C$</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <FormControl
                          type="text"
                          placeholder="Precio de venta..."
                          value={precioVentaDetalle}
                          onChange={(e) =>
                            funcPrecioVentaDetalle(e.target.value)
                          }
                        />
                        <InputGroup.Text>C$</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={3}>
                    <h5 className="align-middle">Detalle</h5>
                  </Col>
                </Row>
                <Button
                  variant="outline-primary"
                  style={{ borderRadius: 20 }}
                  onClick={() => addToProductList()}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: 10, fontSize: 20 }}
                    icon={faClipboard}
                  />
                  Agregar al Detalle
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h5>Detalle de Entrada</h5>
        </div>

        <hr />

        <Table hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left", minWidth: 250 }}>Nombre</th>
              <th>Cantidad</th>
              <th>Costo Unitario</th>
              <th>Descuento</th>
              <th>Impuesto</th>
              <th>Costo de Compra</th>
              <th>P.V. Mayor</th>
              <th>P.V. Detalle</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productDetailList ? (
              productDetailList.map((item) => {
                return (
                  <tr>
                    <td>{productDetailList.indexOf(item) + 1}</td>
                    <td style={{ textAlign: "left", minWidth: 250 }}>
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
                      <Button
                        variant="danger"
                        onClick={() => deleteFromProductDetailList(item)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </Table>
      </Container>

      <Container maxWidth="xl">
        <Divider style={{ marginTop: 20, marginBottom: 5 }} />
        <div className="row justify-content-around align-items-center">
          <div className="col-sm-2 ">
            <Typography
              style={{
                marginBottom: 10,
                fontSize: 13,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Total de Productos
            </Typography>
            <Typography
              style={{
                fontSize: 12,
                color: "#2196f3",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {productDetailList.length}
            </Typography>
          </div>

          <div className="col-sm-2 ">
            <Typography
              style={{
                marginBottom: 10,
                fontSize: 13,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Total a Pagar
            </Typography>
            <Typography
              style={{
                fontSize: 12,
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

          <div className="col-sm-2 ">
            <Button
              variant="outline-primary"
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
      </Container>

      <Loading />

      <SmallModal
        titulo={"Agregar Proveedor"}
        isVisible={showProviderModal}
        setVisible={setShowProvidermodal}
      >
        <AddProviderComponent setShowModal={setShowProvidermodal} />
      </SmallModal>

      <MediumModal
        titulo={"Agregar Producto"}
        isVisible={showProductModal}
        setVisible={setShowProductModal}
      >
        <AddProductComponent setShowModal={setShowProductModal} />
      </MediumModal>
    </div>
  );
};

export default AddEntradaProducto;
