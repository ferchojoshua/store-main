import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { Button, InputGroup, Form, Row, Table, Col } from "react-bootstrap";
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
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";

import SmallModal from "../../components/modals/SmallModal";

import MediumModal from "../../components/modals/MediumModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faClipboard,
  faL,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { addEntradaProductoAsync } from "../../services/ProductIsApi";
import { getStoresAsync } from "../../services/AlmacenApi";

const MoverProductoAdd = () => {
  const { reload, setIsLoading } = useContext(DataContext);
  let navigate = useNavigate();

  const [storeList, setStoreList] = useState([]);
  const [selectedProcedencia, setSelectedProcedencia] = useState("");
  const [selectedDestino, setSelectedDestino] = useState("");

  const [productList, setProductList] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [descuento, setDescuento] = useState("");
  const [impuesto, setImpuesto] = useState("");

  const [productDetailList, setProductDetailList] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStores = await getStoresAsync();
      if (!resultStores.statusResponse) {
        setIsLoading(false);
        simpleMessage(resultStores.error, "error");
        return;
      }
      setStoreList(resultStores.data);

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

  const handleChangeProcedencia = (event) => {
    setSelectedProcedencia(event.target.value);
  };

  const handleChangeDestino = (event) => {
    setSelectedDestino(event.target.value);
  };

  console.log(selectedProduct);

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
              navigate("/traslate-products/");
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

          <h1>Agregar Traslado de Producto</h1>
        </div>

        <hr />

        <Row>
          <Col xs={12} md={4}>
            <FormControl
              variant="standard"
              fullWidth
              style={{ textAlign: "left" }}
            >
              <InputLabel id="selProc">Procedencia</InputLabel>
              <Select
                labelId="selProc"
                id="demo-simple-select-standard"
                value={selectedProcedencia}
                onChange={handleChangeProcedencia}
              >
                <MenuItem value="">
                  <em>Seleccione procedencia...</em>
                </MenuItem>
                {storeList.map((item) => {
                  return (
                    <MenuItem key={item.almacen.id} value={item.almacen.id}>
                      {item.almacen.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              fullWidth
              style={{ textAlign: "left", marginTop: 20 }}
            >
              <InputLabel id="selDestino">Destino</InputLabel>
              <Select
                labelId="selDestino"
                id="demo-simple-select-standard"
                value={selectedDestino}
                onChange={handleChangeDestino}
              >
                <MenuItem value="">
                  <em>Seleccione procedencia...</em>
                </MenuItem>
                {storeList.map((item) => {
                  return (
                    <MenuItem key={item.almacen.id} value={item.almacen.id}>
                      {item.almacen.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Col>
          <Col xs={12} md={8}>
            <div className="row justify-content-around align-items-center">
              <div className="col-sm-9 ">
                <Autocomplete
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
              </div>

              <div className="col-sm-3 ">
                <TextField
                  variant="standard"
                  fullWidth
                  disabled
                  defaultValue={selectedProduct ? selectedProduct.id : ""}
                  value={selectedProduct ? selectedProduct.id : ""}
                  type="text"
                  label="Existencia"
                  InputLabelProps={{
                    shrink: selectedProduct ? true : false,
                  }}
                />
              </div>
            </div>

            <div className="row justify-content-around align-items-center">
              <div className="col-sm-2 ">
                <TextField
                  variant="standard"
                  fullWidth
                  disabled
                  style={{ marginTop: 20 }}
                  defaultValue={selectedProduct ? selectedProduct.id : ""}
                  value={selectedProduct ? selectedProduct.id : ""}
                  type="text"
                  label="Codigo"
                  InputLabelProps={{
                    shrink: selectedProduct ? true : false,
                  }}
                />
              </div>

              <div className="col-sm-2 ">
                <TextField
                  variant="standard"
                  fullWidth
                  disabled
                  style={{ marginTop: 20 }}
                  defaultValue={selectedProduct ? selectedProduct.id : ""}
                  value={selectedProduct ? selectedProduct.barCode : ""}
                  type="text"
                  label="Codigo de barras"
                  InputLabelProps={{
                    shrink: selectedProduct ? true : false,
                  }}
                />
              </div>

              <div className="col-sm-3 ">
                <TextField
                  variant="standard"
                  fullWidth
                  disabled
                  style={{ marginTop: 20 }}
                  defaultValue={selectedProduct ? selectedProduct.id : ""}
                  value={selectedProduct ? selectedProduct.description : ""}
                  type="text"
                  label="Descripcion"
                  InputLabelProps={{
                    shrink: selectedProduct ? true : false,
                  }}
                />
              </div>

              <div className="col-sm-2 ">
                <TextField
                  variant="standard"
                  fullWidth
                  disabled
                  style={{ marginTop: 20 }}
                  defaultValue={selectedProduct ? selectedProduct.id : ""}
                  value={selectedProduct ? selectedProduct.marca : ""}
                  type="text"
                  label="Marca"
                  InputLabelProps={{
                    shrink: selectedProduct ? true : false,
                  }}
                />
              </div>

              <div className="col-sm-2 ">
                <TextField
                  variant="standard"
                  fullWidth
                  disabled
                  style={{ marginTop: 20 }}
                  defaultValue={selectedProduct ? selectedProduct.id : ""}
                  value={selectedProduct ? selectedProduct.modelo : ""}
                  type="text"
                  label="Modelo"
                  InputLabelProps={{
                    shrink: selectedProduct ? true : false,
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Loading />
    </div>
  );
};

export default MoverProductoAdd;
