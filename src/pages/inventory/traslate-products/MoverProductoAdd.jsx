import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Row, Table, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../../helpers/Helpers";
import { getProductsAsync } from "../../../services/ProductsApi";

import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";

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
  Grid,
  Button,
  Paper,
} from "@mui/material";

import SmallModal from "../../../components/modals/SmallModal";

import MediumModal from "../../../components/modals/MediumModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faClipboard,
  faL,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { addEntradaProductoAsync } from "../../../services/ProductIsApi";
import { getStoresAsync } from "../../../services/AlmacenApi";

const MoverProductoAdd = () => {
  const { reload, setIsLoading, setInventoryTab } = useContext(DataContext);
  let navigate = useNavigate();

  const [storeList, setStoreList] = useState([]);
  const [selectedProcedencia, setSelectedProcedencia] = useState("");
  const [selectedDestino, setSelectedDestino] = useState("");

  const [productList, setProductList] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [descuento, setDescuento] = useState("");
 

  const [productDetailList, setProductDetailList] = useState([]);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStores = await getStoresAsync(token);
      if (!resultStores.statusResponse) {
        setIsLoading(false);
        toastError(resultStores.error.message);
        return;
      }
      setStoreList(resultStores.data);

      const resultProducts = await getProductsAsync(token);
      if (!resultProducts.statusResponse) {
        setIsLoading(false);
        toastError(resultProducts.error);
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

  return (
    <div>
      <Container style={{ width: 700 }}>
        <Divider />

        <Grid container spacing={2} style={{ marginTop: 1 }}>
          <Grid item sm={6}>
            <Autocomplete
              fullWidth
              options={productList}
              getOptionLabel={(op) => (op ? `${op.description}` || "" : "")}
              value={selectedProduct}
              onChange={(event, newValue) => {
                setSelectedProduct(newValue);
              }}
              noOptionsText="Producto no encontrado..."
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.description}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label="Seleccione un producto..."
                />
              )}
            />

            <TextField
              variant="standard"
              style={{
                marginTop: 20,
              }}
              fullWidth
              value={selectedProduct ? selectedProduct.description : ""}
              label="Descripcion"
              InputLabelProps={{
                shrink: selectedProduct ? true : false,
              }}
              disabled
            />
          </Grid>

          <Grid item sm={6}>
            <FormControl
              variant="standard"
              fullWidth
              style={{ textAlign: "left" }}
            >
              <InputLabel id="selProc">Almacen Procedencia</InputLabel>
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
              <InputLabel id="selDestino">Almacen Destino</InputLabel>
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
          </Grid>
        </Grid>

        <Paper
          elevation={10}
          style={{
            marginTop: 30,
            borderRadius: 30,
            padding: 10,
          }}
        >
          <div className="row justify-content-around align-items-center">
            <div className="col-sm-4 ">
              <TextField
                variant="standard"
                fullWidth
                disabled
              
                value={selectedProduct ? selectedProduct.id : ""}
                label="Exist. Almacen Procedencia"
              />
            </div>

            <div className="col-sm-4 ">
              <TextField
                variant="standard"
                fullWidth
                disabled
                // defaultValue={selectedProduct ? selectedProduct.id : ""}
                value={selectedProduct ? selectedProduct.id : ""}
                label="Existencias Almacen Destino"
              />
            </div>

            <div className="col-sm-4 ">
              <TextField
                variant="standard"
                fullWidth
                // defaultValue={selectedProduct ? selectedProduct.id : ""}
                value={selectedProduct ? selectedProduct.id : ""}
                label="Cantidad a Trasladar"
              />
            </div>

            <div className="col-sm-12">
              <TextField
                variant="standard"
                fullWidth
                multiline
                // defaultValue={selectedProduct ? selectedProduct.id : ""}
                value={selectedProduct ? selectedProduct.id : ""}
                label="Concepto"
                style={{ marginTop: 20, marginBottom: 20 }}
              />
            </div>
          </div>

          {/* <div className="row justify-content-around align-items-center">
            <div className="col-sm-2 ">
              {/* <TextField
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
                /> */}
          {/* </div> */}
          {/* <div className="col-sm-2 "> */}
          {/* <TextField
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
                /> */}
          {/* </div> */}
          {/* <div className="col-sm-3 "> */}
          {/* <TextField
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
                /> */}
          {/* </div> */}
          {/* <div className="col-sm-2 "> */}
          {/* <TextField
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
                /> */}
          {/* </div> */}
          {/* <div className="col-sm-2 "> */}
          {/* <TextField
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
                /> */}
          {/* </div> */}
          {/* </div> */}
        </Paper>

        <Button
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 30 }}
          fullWidth
          // onClick={() => addProdutInn()}
        >
          <FontAwesomeIcon
            style={{ marginRight: 10, fontSize: 20 }}
            icon={faSave}
          />
          Mover Producto
        </Button>
      </Container>
    </div>
  );
};

export default MoverProductoAdd;
