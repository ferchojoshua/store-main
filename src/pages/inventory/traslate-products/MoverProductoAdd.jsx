import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
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
  Divider,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Grid,
  Button,
  Paper,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import { getStoresAsync } from "../../../services/AlmacenApi";
import {
  addProductMoverAsync,
  getProducExistanceAsync,
} from "../../../services/ExistanceApi";

const MoverProductoAdd = ({ setShowModal }) => {
  const { reload, setReload, setIsLoading, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  let navigate = useNavigate();

  const [storeList, setStoreList] = useState([]);
  const [selectedProcedencia, setSelectedProcedencia] = useState("");
  const [selectedDestino, setSelectedDestino] = useState("");

  const [productList, setProductList] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [concepto, setConcepto] = useState("");

  const [existenceProcedencia, setExistenceProcedencia] = useState("");

  const [existenceDestino, setExistenceDestino] = useState([]);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStores = await getStoresAsync(token);
      if (!resultStores.statusResponse) {
        setIsLoading(false);
        if (resultStores.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError(resultStores.error.message);
        return;
      }

      if (resultStores.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultStores.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setStoreList(resultStores.data);

      const resultProducts = await getProductsAsync(token);
      if (!resultProducts.statusResponse) {
        setIsLoading(false);
        if (resultProducts.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError(resultProducts.error);
        return;
      }

      if (resultProducts.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultProducts.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setProductList(resultProducts.data);
      setIsLoading(false);
    })();
  }, [reload]);

  const handleChangeProduct = async (newValue) => {
    if (existenceProcedencia === "") {
      setSelectedProduct(newValue);
      return;
    } else {
      setSelectedProduct(newValue);
      const data = {
        idProduct: newValue.id,
        idAlmacen: selectedProcedencia,
      };
      setIsLoading(true);
      const result = await getProducExistanceAsync(token, data);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error === 204) {
          toastError(
            "Almacen procedencia no tiene existencias de este producto"
          );
          setExistenceProcedencia(0);
          return;
        } else if (result.error.request.status === 401) {
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

      if (result.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setIsLoading(false);
      if (result.data.existencia === 0) {
        toastError("Almacen procedencia no este producto, seleccione otro");
        setExistenceProcedencia(0);
        return;
      }
      setExistenceProcedencia(result.data.existencia);
    }
  };

  const handleChangeProcedencia = async (event) => {
    setSelectedProcedencia(event.target.value);
    const data = {
      idProduct: selectedProduct.id,
      idAlmacen: event.target.value,
    };
    setIsLoading(true);
    const result = await getProducExistanceAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error === 204) {
        toastError("Almacen procedencia no tiene existencias de este producto");
        setExistenceProcedencia(0);
        return;
      } else if (result.error.request.status === 401) {
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

    if (result.data.isDefaultPass) {
      setIsLoading(false);
      setIsDefaultPass(true);
      return;
    }

    setIsLoading(false);
    if (result.data.existencia === 0) {
      toastError(
        "Este almacen no tiene existencias de este producto, seleccione otro"
      );
      setExistenceProcedencia(0);
      return;
    }

    setExistenceProcedencia(result.data.existencia);
  };

  const handleChangeDestino = async (event) => {
    if (selectedProcedencia === event.target.value) {
      toastError("Almacen destino debe ser diferente del almacen origen");
      setSelectedDestino("");
      return;
    }
    setSelectedDestino(event.target.value);

    const data = {
      idProduct: selectedProduct.id,
      idAlmacen: event.target.value,
    };

    setIsLoading(true);
    const result = await getProducExistanceAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error === 204) {
        setExistenceDestino(0);
        return;
      } else if (result.error.request.status === 401) {
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

    if (result.data.isDefaultPass) {
      setIsLoading(false);
      setIsDefaultPass(true);
      return;
    }

    setIsLoading(false);
    setExistenceDestino(result.data.existencia);
  };

  //Devuelve un entero positivo
  const funcCantidad = (e) => {
    if (/^[0-9]+$/.test(e.target.value.toString()) || e.target.value === "") {
      if (e.target.value > existenceProcedencia) {
        toastError(
          "No puede mover mas de lo que hay en almacen de procedencia"
        );
        return;
      }
      setCantidad(e.target.value);
      return;
    }
  };

  //Validando campos ingresados
  const validate = () => {
    let isValid = true;
    if (selectedProduct === null || selectedProduct === "") {
      toastError("Debe seleccionar un producto");
      return (isValid = false);
    }

    if (existenceProcedencia === "") {
      toastError("Debe seleccionar almacen de procedencia");
      return (isValid = false);
    }

    if (existenceProcedencia === 0) {
      toastError("No hay existencias de este producto en este almacen");
      return (isValid = false);
    }

    if (concepto === "") {
      toastError("Debe ingresar un concepto de traslado");
      return (isValid = false);
    }
    return isValid;
  };

  //procedemos guradar en la base de datos
  const addMoverProdut = async () => {
    if (validate()) {
      const data = {
        IdProducto: selectedProduct.id,
        AlmacenProcedenciaId: selectedProcedencia,
        AlmacenDestinoId: selectedDestino,
        cantidad,
        concepto,
      };

      if (cantidad > existenceProcedencia) {
        toastError("No puede mover mas de lo que hay en almacen procedencia");
        return;
      }

      setIsLoading(true);
      const result = await addProductMoverAsync(token, data);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error === 204) {
          toastError("No se pudo realizar el traslado");
          return;
        } else if (result.error.request.status === 401) {
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

      if (result.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setIsLoading(false);
      toastSuccess("Traslado realizado...!");
      setReload(!reload);
      setShowModal(false);
    }
  };

  return (
    <div>
      <Container >
        <Divider />

        <Grid container spacing={2} style={{ marginTop: 1 }}>
          <Grid item sm={6}>
            <Autocomplete
              fullWidth
              options={productList}
              getOptionLabel={(op) => (op ? `${op.description}` || "" : "")}
              value={selectedProduct === "" ? null : selectedProduct}
              onChange={(event, newValue) => {
                handleChangeProduct(newValue);
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
            padding: 20,
          }}
        >
          <div className="row justify-content-around align-items-center">
            <div className="col-sm-4 ">
              <TextField
                variant="standard"
                fullWidth
                disabled
                value={existenceProcedencia}
                label="Exist. Almacen Procedencia"
              />
            </div>

            <div className="col-sm-4 ">
              <TextField
                variant="standard"
                fullWidth
                disabled
                value={existenceDestino}
                label="Existencias Almacen Destino"
              />
            </div>

            <div className="col-sm-4 ">
              <TextField
                variant="standard"
                fullWidth
                value={cantidad}
                onChange={(e) => funcCantidad(e)}
                label="Cantidad a Trasladar"
              />
            </div>

            <div className="col-sm-12">
              <TextField
                variant="standard"
                fullWidth
                multiline
                value={concepto}
                label="Concepto"
                style={{ marginTop: 20, marginBottom: 20 }}
                onChange={(e) => setConcepto(e.target.value.toUpperCase())}
              />
            </div>
          </div>
        </Paper>

        <Button
          variant="outlined"
          style={{ borderRadius: 20, marginTop: 30 }}
          fullWidth
          onClick={() => addMoverProdut()}
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
