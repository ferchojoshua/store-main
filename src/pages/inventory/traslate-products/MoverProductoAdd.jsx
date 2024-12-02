import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../helpers/Helpers";
import { getProductsAsync } from "../../../services/ProductsApi";
import { Table } from "react-bootstrap";

import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";

import {
  Autocomplete,
  TextField,
  Divider,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Grid,
  Button,
  Paper,
  Tooltip,
  IconButton,
  Stack,
  Typography,
  Container,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faSpellCheck,
  faBarcode,
  faCirclePlus,
  faTrashAlt,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import { getStoresAsync } from "../../../services/AlmacenApi";
import {
  addProductMoverAsync,
  getProducExistanceAsync,
} from "../../../services/ExistanceApi";
import { isEmpty } from "lodash";
import SmallModal from "../../../components/modals/SmallModal";
import TraslateComponent from "./printTraslate/TraslateComponent";

const MoverProductoAdd = () => {
  let ruta = getRuta();

  const {
    isDarkMode,
    reload,
    setReload,
    setIsLoading,
    setIsLogged,
    setIsDefaultPass,
    access,
  } = useContext(DataContext);
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
  const [barCodeSearch, setBarCodeSearch] = useState(false);

  const [productDetails, setProductDetails] = useState([]);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [dataToPrint, setDataToPrint] = useState([]);

  const token = getToken();

  useEffect(() => {
    if (isAccess(access, "PRODUCT TRANSLATE CREATE")) {
      (async () => {
        setIsLoading(true);
        const resultStores = await getStoresAsync(token);
        if (!resultStores.statusResponse) {
          setIsLoading(false);
          if (resultStores.error.request.status === 401) {
            navigate(`${ruta}/unauthorized`);
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
            navigate(`${ruta}/unauthorized`);
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
    } else {
      navigate(`${ruta}/unauthorized`);
    }
  }, [reload]);

  const handleChangeProduct = async (newValue) => {
    setSelectedProduct("");
    setExistenceProcedencia("");
    //Si el producto seleccionado es null or empty
    //Asignamos el valor al producto seleccionado
    //y lo sacamos del proceso
    if (newValue === "" || newValue === null) {
      setSelectedProduct(newValue);
      return;
    }

    if (selectedProcedencia === "") {
      setSelectedProduct(newValue);
      return;
    }

    setSelectedProduct(newValue);
    const data = {
      idProduct: newValue ? newValue.id : "",
      idAlmacen: selectedProcedencia,
    };
    setIsLoading(true);
    //Traemos la existencia del producto
    const result = await getProducExistanceAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error === 204) {
        toastError("Almacen procedencia no tiene existencias de este producto");
        setExistenceProcedencia(0);
        return;
      } else if (result.error.request.status === 401) {
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

    setIsLoading(false);
    if (result.data.existencia === 0) {
      toastError("Almacen procedencia no este producto, seleccione otro");
      setExistenceProcedencia(0);
      return;
    }
    setExistenceProcedencia(result.data.existencia);
  };

  const handleChangeProcedencia = async (event) => {
    if (selectedDestino === event.target.value) {
      setSelectedDestino("");
    }

    setSelectedProcedencia(event.target.value);
    if (isEmpty(selectedProduct)) {
      return;
    }

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

    setIsLoading(false);
    if (result.data.existencia === 0) {
      toastError("No hay existencias de este producto, seleccione otro");
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
    if (concepto === "") {
      toastError("Debe ingresar un concepto de traslado");
      return (isValid = false);
    }

    if (productDetails.length === 0) {
      toastError("Debe agregar al menos un producto para trasladar");
      return (isValid = false);
    }
    return isValid;
  };

  //procedemos guradar en la base de datos
  const addMoverProdut = async () => {
    if (validate()) {
      const data = {
        concepto,
        movmentDetails: productDetails,
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
      setDataToPrint(result.data);
      setIsLoading(false);
      toastSuccess("Traslado realizado...!");
      setReload(!reload);
      setShowPrintModal(true);
      setConcepto("");
      setProductDetails([]);
    }
  };

  const addToDetail = () => {
    if (isEmpty(selectedProduct)) {
      toastError("Seleccione un producto");
      return;
    }
    if (selectedProcedencia === "") {
      toastError("Seleccione el almacen de procedencia");
      return;
    }
    if (selectedDestino === "") {
      toastError("Seleccione el almacen de destino");
      return;
    }
    if (cantidad === "" || cantidad === "0") {
      toastError("Debe ingresar cantidad a trasladar");
      return;
    }

    const { id, description } = selectedProduct;

    const data = {
      idProducto: id,
      description,
      cantidad,
      almacenProcedenciaId: selectedProcedencia,
      almacenDestinoId: selectedDestino,
    };

    setSelectedProduct("");
    setSelectedProcedencia("");
    setSelectedDestino("");
    setCantidad("");

    setProductDetails([...productDetails, data]);
  };

  const getStoreName = (id) => {
    const result = storeList.filter((i) => i.almacen.id === id);
    return result[0].almacen.name;
  };

  const deleteFromProductDetailList = (item) => {
    const filtered = productDetails.filter(
      (p) => p.idProducto !== item.idProducto
    );

    setProductDetails(filtered);
  };

  return (
    <div>
      <Container maxWidth="lg">
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
          }}
        >
          <Stack direction={"row"}>
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
            <h1>Agregar Traslado de Productos</h1>
          </Stack>

          <hr />

          <Stack direction="row" spacing={2}>
            {barCodeSearch ? (
              <Autocomplete
                fullWidth
                options={productList}
                getOptionLabel={(op) => (op ? `${op.barCode}` || "" : "")}
                value={selectedProduct === "" ? null : selectedProduct}
                onChange={(event, newValue) => {
                  handleChangeProduct(newValue);
                }}
                noOptionsText="Producto no encontrado..."
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.barCode}
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
            ) : (
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
            )}

            <Tooltip
              title={
                barCodeSearch
                  ? "Buscar por Codigo de Barras"
                  : "Buscar por Nombre"
              }
              style={{ marginTop: 5 }}
            >
              <IconButton
                onClick={() => {
                  setBarCodeSearch(!barCodeSearch);
                }}
              >
                <FontAwesomeIcon
                  style={{
                    fontSize: 25,
                    color: "#2196f3",
                  }}
                  icon={barCodeSearch ? faBarcode : faSpellCheck}
                />
              </IconButton>
            </Tooltip>
          </Stack>

          <Grid container spacing={2} style={{ marginTop: 10 }}>
            {/* <Grid
              item
              sm={barCodeSearch ? (isEmpty(selectedProduct) ? 12 : 6) : 12}
            ></Grid> */}

            {!isEmpty(selectedProduct) ? (
              barCodeSearch ? (
                <Grid item sm={6}>
                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#2196f3", marginRight: 10 }}>
                      Producto:
                    </span>
                    <span>
                      {selectedProduct ? selectedProduct.description : ""}
                    </span>
                  </div>
                </Grid>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </Grid>

          <Paper
            elevation={10}
            style={{
              marginTop: 20,
              borderRadius: 30,
              padding: 20,
            }}
          >
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
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
                style={{ textAlign: "left" }}
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
                     <MenuItem
                  key={"t"}
                  value={"t"}
                  disabled={
                    storeList.length <=  6 || storeList.length <=  5 || storeList.length <=  4 || storeList.length <=  3 || storeList.length <=  2 || storeList.length <= 1
                          ? false
                          : true
                      }
                >
                </MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Grid container spacing={2}>
              <Grid item sm={12}>
                {selectedProcedencia !== "" || selectedDestino !== "" ? (
                  <Paper
                    elevation={10}
                    style={{
                      borderRadius: 30,
                      padding: 20,
                    }}
                  >
                    <Grid
                      container
                      spacing={2}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Grid item sm={4}>
                        {selectedProcedencia !== "" ? (
                          <Stack>
                            <Typography
                              style={{
                                color: "#2196f3",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              Existencia Procedencia:
                            </Typography>
                            <Typography
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {existenceProcedencia}
                            </Typography>
                          </Stack>
                        ) : (
                          <></>
                        )}
                      </Grid>
                      <Grid item sm={4}>
                        {selectedDestino !== "" ? (
                          <Stack>
                            <Typography
                              style={{
                                color: "#2196f3",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              Existencia Destino:
                            </Typography>
                            <Typography
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {existenceDestino}
                            </Typography>
                          </Stack>
                        ) : (
                          <></>
                        )}
                      </Grid>

                      {selectedProcedencia !== "" && selectedDestino !== "" ? (
                        <Grid item sm={4}>
                          <TextField
                            variant="standard"
                            fullWidth
                            value={cantidad}
                            onChange={(e) => funcCantidad(e)}
                            label="Cantidad a Trasladar"
                          />
                        </Grid>
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </Paper>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>

            <Button
              variant="outlined"
              style={{
                borderRadius: 20,
                marginTop: 10,
                borderColor: "#ffc107",
                color: "#ffc107",
              }}
              fullWidth
              onClick={() => addToDetail()}
            >
              <FontAwesomeIcon
                style={{ marginRight: 10, fontSize: 20 }}
                icon={faCirclePlus}
              />
              Agregar al detalle
            </Button>
          </Paper>

          <Typography variant="h6" marginTop={1}>
            Detalle de Traslado
          </Typography>

          <Divider style={{ marginBottom: 20 }} />

          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>#</th>
                <th style={{ textAlign: "left" }}>Producto</th>
                <th style={{ textAlign: "center" }}>Procedencia</th>
                <th style={{ textAlign: "center" }}>Cantidad</th>
                <th style={{ textAlign: "center" }}>Destino</th>
                <th style={{ textAlign: "center" }}>Eliminar</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {productDetails ? (
                productDetails.map((item) => {
                  return (
                    <tr key={productDetails.indexOf(item) + 1}>
                      <td style={{ textAlign: "center" }}>
                        {productDetails.indexOf(item) + 1}
                      </td>
                      <td>{item.description}</td>
                      <td style={{ textAlign: "center" }}>
                        {getStoreName(item.almacenProcedenciaId)}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.cantidad}</td>
                      <td style={{ textAlign: "center" }}>
                        {getStoreName(item.almacenDestinoId)}
                      </td>
                      <td style={{ textAlign: "center" }}>
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

          <TextField
            variant="standard"
            fullWidth
            multiline
            value={concepto}
            label="Concepto"
            style={{ marginBottom: 20 }}
            onChange={(e) => setConcepto(e.target.value.toUpperCase())}
          />

          <Button
            variant="outlined"
            style={{
              borderRadius: 20,
              marginTop: 30,
              color: "#2979ff",
              borderColor: "#1c54b2",
            }}
            fullWidth
            onClick={() => addMoverProdut()}
          >
            <FontAwesomeIcon
              style={{ marginRight: 10, fontSize: 20 }}
              icon={faSave}
            />
            Mover Producto
          </Button>
        </Paper>
      </Container>

      <SmallModal
        titulo={"Imprimir Traslado"}
        isVisible={showPrintModal}
        setVisible={setShowPrintModal}
      >
        <TraslateComponent
          data={dataToPrint}
          setShowModal={setShowPrintModal}
        />
      </SmallModal>
    </div>
  );
};

export default MoverProductoAdd;
