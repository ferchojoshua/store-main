import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import ProductDetailInComponent from "./entradaProductoDetailsComponents/ProductDetailInComponent";
import {
  Button,
  Container,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";

import {
  faCancel,
  faCircleArrowLeft,
  faPenToSquare,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getEntradaByIdAsync,
  putProductInAsync,
} from "../../../services/ProductIsApi";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";

import MediumModal from "../../../components/modals/MediumModal";
import DetalleProductoComponent from "./entradaProductoDetailsComponents/DetalleProductoComponent";

const EntradaProductoDetails = () => {
  const { setIsLoading, setIsLogged, setReload, reload } =
    useContext(DataContext);
  let navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);

  const [noFactura, setNoFactura] = useState("");
  const [tipoEntrada, setTipoEntrada] = useState("");
  const [tipoCompra, setTipoCompra] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  const [montoFactura, setMontoFactura] = useState("");
  const [productList, setProductList] = useState([]);

  const [selectedStore, setSelectedStore] = useState("");

  const [fechaIngreso, setFechaIngreso] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState([]);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getEntradaByIdAsync(token, id);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError(result.error.message);
        return;
      }
      setIsLoading(false);
      setNoFactura(result.data.noFactura);
      setTipoEntrada(result.data.tipoEntrada);
      setTipoCompra(result.data.tipoPago);
      setSelectedProvider(result.data.provider.id);
      setSelectedStore(result.data.almacen.id);
      setMontoFactura(result.data.montoFactura);
      setProductList(result.data.productInDetails);
      setFechaIngreso(result.data.fechaIngreso);
    })();
  }, []);

  const saveChanges = async () => {
    if (!noFactura) {
      toastError("Ingrese numero de factura");
      return;
    }

    if (!tipoEntrada) {
      toastError("Ingrese tipo de entrada");
      return;
    }

    if (!tipoCompra) {
      toastError("Ingrese tipo de pago");
      return;
    }

    if (!selectedProvider) {
      toastError("Seleccione un proveedor");
      return;
    }

    if (!montoFactura) {
      toastError("Ingrese al menos un producto para guardar");
      return;
    }

    const data = {
      id,
      noFactura,
      tipoEntrada,
      tipoPago: tipoCompra,
      providerId: selectedProvider,
      montoFactura,
      productInDetails: productList,
      fechaIngreso,
    };

    setIsLoading(true);
    const result = await putProductInAsync(token, data);
    if (!result.statusResponse) {
      console.log(result);
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
    setReload(!reload);
    setIsLoading(false);
    setIsEdit(false);
    toastSuccess("Cambios Relizados...!");
  };

  const editDetail = (data) => {
    const {
      id,
      cantidad,
      costoCompra,
      costoUnitario,
      descuento,
      impuesto,
      precioVentaDetalle,
      precioVentaMayor,
      product,
    } = data;
    const editedList = productList.map((item) =>
      item.id === id
        ? {
            id,
            cantidad,
            costoCompra,
            costoUnitario,
            descuento,
            impuesto,
            precioVentaMayor,
            precioVentaDetalle,
            product,
          }
        : item
    );
    setProductList(editedList);
    let result = 0;
    productList.map((item) => {
      result += item.costoCompra;
    });
    setMontoFactura(result);
    setShowModal(false);
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
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => {
                navigate("/inventory/");
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

            <IconButton
              onClick={() => {
                setIsEdit(!isEdit);
              }}
            >
              <FontAwesomeIcon
                style={{ fontSize: 30, color: isEdit ? "#4caf50" : "#ff5722" }}
                icon={isEdit ? faCancel : faPenToSquare}
              />
            </IconButton>
          </div>

          <hr />

          <ProductDetailInComponent
            setNoFactura={setNoFactura}
            noFactura={noFactura}
            tipoEntrada={tipoEntrada}
            setTipoEntrada={setTipoEntrada}
            tipoCompra={tipoCompra}
            setTipoCompra={setTipoCompra}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
            fechaIngreso={fechaIngreso}
            setFechaIngreso={setFechaIngreso}
            isEdit={isEdit}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
          />

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
                <th>Acciones</th>
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

                    <td>
                      <IconButton
                        style={{ color: "#2196f3" }}
                        onClick={() => {
                          setSelectedDetail(item);
                          setShowModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
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
            <div className="col-sm-4 ">
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
                {productList.length}
              </Typography>
            </div>

            <div className="col-sm-4 ">
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

            <div className="col-sm-4 ">
              <Button
                variant="outlined"
                style={{ borderRadius: 20 }}
                onClick={() => saveChanges()}
              >
                <FontAwesomeIcon
                  style={{ marginRight: 10, fontSize: 20 }}
                  icon={faSave}
                />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </Paper>
      </Container>

      <MediumModal
        titulo={`Editar Detalle Producto #:${selectedDetail.id}`}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <DetalleProductoComponent
          selectedDetail={selectedDetail}
          editDetail={editDetail}
        />
      </MediumModal>
    </div>
  );
};

export default EntradaProductoDetails;
