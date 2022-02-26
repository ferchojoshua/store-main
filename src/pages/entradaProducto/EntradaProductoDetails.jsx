import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { InputGroup, FormControl, Row, Table, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../helpers/Helpers";

import { Container } from "@mui/material";

import { Button } from "@mui/material";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getEntradaByIdAsync } from "../../services/ProductIsApi";
import Loading from "../../components/Loading";
import moment from "moment";

const EntradaProductoDetails = () => {
  const { setIsLoading } = useContext(DataContext);
  let navigate = useNavigate();
  const { id } = useParams();
  const [ordenCompra, setOrdenCompra] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [almacenName, setAlmacenName] = useState("");
  const [montoFactura, setMontoFactura] = useState("");
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getEntradaByIdAsync(id);
      if (!result.statusResponse) {
        setIsLoading(false);
        simpleMessage(result.error, "error");
        return;
      }
      setIsLoading(false);
      setOrdenCompra(result.data);
      setSelectedProvider(result.data.provider.nombre);
      setAlmacenName(result.data.almacen.name);
      setMontoFactura(result.data.montoFactura);
      setProductList(result.data.productInDetails);
    })();
  }, []);

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
            variant="outlined"
          >
            <FontAwesomeIcon
              style={{ marginRight: 10, fontSize: 20 }}
              icon={faCircleArrowLeft}
            />
            Regresar
          </Button>

          <h1>Detalle Orden # {id}</h1>
        </div>

        <hr />

        <Row>
          <Col xs={12} md={6}>
            <InputGroup className="mb-3">
              <InputGroup.Text>N° Factura</InputGroup.Text>
              <FormControl
                type="text"
                aria-label="Description"
                defaultValue={ordenCompra.noFactura}
                disabled
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Tipo de Compra</InputGroup.Text>
              <FormControl
                type="text"
                aria-label="Description"
                defaultValue={ordenCompra.tipoEntrada}
                disabled
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Tipo de Pago</InputGroup.Text>
              <FormControl
                type="text"
                disabled
                aria-label="Description"
                defaultValue={ordenCompra.tipoPago}
              />
            </InputGroup>

            {ordenCompra.fechaVencimiento ? (
              <InputGroup className="mb-3">
                <InputGroup.Text>Fecha de Venc.</InputGroup.Text>
                <FormControl
                  type="text"
                  aria-label="Description"
                  defaultValue={moment(ordenCompra.fechaVencimiento).format(
                    "L"
                  )}
                  disabled
                />
              </InputGroup>
            ) : (
              <></>
            )}
          </Col>

          <Col xs={12} md={6}>
            <InputGroup className="mb-3">
              <InputGroup.Text>Fecha Ingreso</InputGroup.Text>
              <FormControl
                type="text"
                disabled
                defaultValue={moment(ordenCompra.fechaIngreso).format("L")}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Proveedor</InputGroup.Text>
              <FormControl
                disabled
                type="text"
                defaultValue={selectedProvider}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Almacen</InputGroup.Text>
              <FormControl disabled type="text" defaultValue={almacenName} />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Monto factura</InputGroup.Text>
              <FormControl
                type="text"
                disabled
                defaultValue={montoFactura.toLocaleString("es-NI", {
                  style: "currency",
                  currency: "NIO",
                })}
              />
            </InputGroup>
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
          <h5>Detalle de Compra</h5>
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
            </tr>
          </thead>
          <tbody>
            {productList.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
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
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
      <Loading />
    </div>
  );
};

export default EntradaProductoDetails;
