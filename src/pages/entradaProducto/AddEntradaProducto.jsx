import React, { useState, useEffect } from "react";
import {
  Container,
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

import { Autocomplete, TextField } from "@mui/material";

const AddEntradaProducto = () => {
  let navigate = useNavigate();

  const [tipoEntrada, setTipoEntrada] = useState("");
  const [tipoCompra, setTipoCompra] = useState("");
  const [noFactura, setNoFactura] = useState("");
  const [providerList, setProviderList] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");

  const [montoFactura, setMontoFactura] = useState("");

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

  const saveChangesAsync = async () => {
    // const data = {
    //   description: description,
    // };
    // if (description === "") {
    //   simpleMessage("Ingrese una descripcion...", "error");
    //   return;
    // }
    // const result = await addFamiliaAsync(data);
    // if (!result.statusResponse) {
    //   simpleMessage(result.error, "error");
    //   return;
    // }
    // simpleMessage("Exito...!", "success");
    // navigate("/familia/");
  };

  useEffect(() => {
    (async () => {
      const resultProviders = await getprovidersAsync();
      if (!resultProviders.statusResponse) {
        simpleMessage(resultProviders.error, "error");
        return;
      }
      setProviderList(resultProviders.data);

      const resultProducts = await getProductsAsync();
      if (!resultProducts.statusResponse) {
        simpleMessage(resultProducts.error, "error");
        return;
      }
      setProductList(resultProducts.data);
    })();
  }, []);

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
      costoCompra: costo,
      descuento: descuento ? descuento : 0,
      impuesto: impuesto ? impuesto : 0,
      precioVentaMayor: precioVenta,
      precioVentaDetalle: precioVentaDetalle,
    };
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

  return (
    <div>
      <Container>
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
            style={{ marginRight: 20 }}
            variant="primary"
          >
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
              <InputGroup.Text>Tipo de Compra</InputGroup.Text>
              <Form.Select onChange={(e) => setTipoCompra(e.target.value)}>
                <option>Seleccione un tipo de compra...</option>
                <option>Compra de Contado</option>
                <option>Compra de Credito</option>
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
              <Button variant="outline-secondary">Agregar Proveedor</Button>
              {/* <input
                className="form-control"
                list="datalistOptions"
                id="exampleDataList"
                placeholder="Seleccione un proveedor..."
              />
              <datalist id="datalistOptions">
                {providerList.map((item) => {
                  return (
                    <option
                      key={item.id}
                      value={item.nombre}
                      onChange={() => setSelectedProvider(item.id)}
                    />
                  );
                })}
              </datalist> */}
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
              <Button variant="outline-secondary">Agregar Producto</Button>
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
                  onClick={() => addToProductList()}
                >
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
              <th style={{ textAlign: "left" }}>Nombre</th>
              <th>Cantidad</th>
              <th>Costo de Compra</th>
              <th>Descuento</th>
              <th>Impuesto</th>
              <th>P.V. Mayor</th>
              <th>P.V. Detalle</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productDetailList.map((item) => {
              return (
                <tr>
                  <td>{productDetailList.indexOf(item) + 1}</td>
                  <td style={{ textAlign: "left" }}>
                    {item.product.description}
                  </td>
                  <td>{item.cantidad}</td>
                  <td>
                    {item.costoCompra.toLocaleString("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    })}
                  </td>
                  <td>{`${item.descuento}%`}</td>
                  <td>{`${item.impuesto}%`}</td>
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
                      // onClick={() => deleteFamilia(item)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default AddEntradaProducto;
