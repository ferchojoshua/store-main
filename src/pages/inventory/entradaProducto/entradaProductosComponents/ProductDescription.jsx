import React, { useContext, useState, useEffect } from "react";
import {
  TextField,
  Tooltip,
  Paper,
  IconButton,
  Button,
  Autocomplete,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faClipboard,
  faBarcode,
  faSpellCheck,
} from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../../../context/DataContext";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import MediumModal from "../../../../components/modals/MediumModal";
import Productsadd from "../../products/Productsadd";
import { getProductsAsync } from "../../../../services/ProductsApi";
import { getProducExistanceAsync } from "../../../../services/ExistanceApi";

const ProductDescription = ({
  selectedProduct,
  setSelectedProduct,
  cantidad,
  setCantidad,
  precioCompra,
  setPrecioCompra,
  descuento,
  setDescuento,
  impuesto,
  setImpuesto,
  costo,
  setCosto,
  baseGanancia,
  setBaseGanancia,
  ganancia,
  setGanancia,
  precioVenta,
  setPrecioVenta,
  baseGananciaDetalle,
  setBaseGananciaDetalle,
  gananciaDetalle,
  setGananciaDetalle,
  precioVentaDetalle,
  setPrecioVentaDetalle,
  addToProductList,
  costoAntesDesc,
  setCostoAntesDesc,
}) => {
  let ruta = getRuta();

  const { setIsLoading, reload, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  const token = getToken();
  let navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);

  const [barCodeSearch, setBarCodeSearch] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultProducts = await getProductsAsync(token);
      if (!resultProducts.statusResponse) {
        setIsLoading(false);
        if (resultProducts.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultProducts.error.message);
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

  //Devuelve un entero positivo
  const funcCantidad = (value) => {
    if (/^[0-9]+$/.test(value.toString()) || value === "") {
      if (value === "") {
        setCantidad(value);
        setCosto(0);
        setCostoAntesDesc(0);
        return;
      }

      let pC = 0;
      let imp = 0;
      let desc = 0;
      precioCompra ? (pC = precioCompra) : (pC = 0);
      let subPrecio = pC / value;
      descuento ? (desc = subPrecio * (descuento / 100)) : (desc = 0);
      impuesto ? (imp = subPrecio * (impuesto / 100)) : (imp = 0);
      setCosto(subPrecio - desc + imp);
      setCantidad(value);
      setCostoAntesDesc(subPrecio);
      return;
    }
  };

  //Devuelve un entero positivo
  const funcPrecioCompra = (value) => {
    if (value === "") {
      setPrecioCompra(value);
      setCosto(0);
      setCostoAntesDesc(0);
      return;
    }
    if (/^\d*\.?\d*$/.test(value.toString())) {
      let cant = 0;
      let imp = 0;
      let desc = 0;
      cantidad.length !== 0 ? (cant = cantidad) : (cant = 0);

      let subPrecio = cant === 0 ? 0 : value / cant;
      descuento ? (desc = subPrecio * (descuento / 100)) : (desc = 0);
      impuesto ? (imp = subPrecio * (impuesto / 100)) : (imp = 0);
      setCosto(subPrecio - desc + imp);
      setPrecioCompra(value);
      setCostoAntesDesc(subPrecio);
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

  const getExistencias = async (newValue) => {
    if (!newValue) {
      setSelectedProduct("");
      return;
    }
    
    const data = {
      IdProduct: newValue.id,
      IdAlmacen: 1,
    };

    setIsLoading(true);
    const result = await getProducExistanceAsync(token, data);
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
    setIsLoading(false);
    let resultado = { ...newValue, ...result.data };

    setSelectedProduct(resultado);
  };

  return (
    <div>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
        }}
      >
        <Typography variant="h5" textAlign={"left"}>
          Datos del Producto
        </Typography>
        <hr />

        <Stack spacing={2}>
          <Stack direction={"row"} spacing={1} alignItems="center">
            {barCodeSearch ? (
              <Autocomplete
                fullWidth
                options={productList}
                getOptionLabel={(op) => (op ? `${op.barCode}` || "" : "")}
                value={selectedProduct === "" ? null : selectedProduct}
                onChange={(event, newValue) => {
                  getExistencias(newValue);
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
                id="combo-box-demo"
                fullWidth
                options={productList}
                getOptionLabel={(op) => (op ? `${op.description}` : "")}
                value={selectedProduct === "" ? null : selectedProduct}
                onChange={(event, newValue) => {
                  getExistencias(newValue);
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
            >
              <IconButton
                onClick={() => setBarCodeSearch(!barCodeSearch)}
                style={{ height: 35, width: 35 }}
              >
                <FontAwesomeIcon
                  style={{
                    fontSize: 20,
                    color: "#2196f3",
                  }}
                  icon={barCodeSearch ? faBarcode : faSpellCheck}
                />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Agregar Producto"
              //  style={{ marginTop: 5 }}
            >
              <IconButton
                onClick={() => setShowProductModal(true)}
                style={{ height: 35, width: 35 }}
              >
                <FontAwesomeIcon
                  style={{
                    fontSize: 20,
                    color: "#ff5722",
                  }}
                  icon={faCirclePlus}
                />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack>
            {selectedProduct ? (
              <Stack
                direction={{ xs: "column", sm: "column", md: "row" }}
                justifyContent="space-between"
              >
                <Stack direction={"row"} spacing={1}>
                  <Typography color={"#2979ff"} fontWeight="bold">
                    Codigo:
                  </Typography>
                  <Typography>{selectedProduct.producto.id}</Typography>
                </Stack>

                <Stack direction={"row"} spacing={1}>
                  <Typography color={"#2979ff"} fontWeight="bold">
                    Existencia:
                  </Typography>
                  <Typography>{selectedProduct.existencia}</Typography>
                </Stack>

                <Stack direction={"row"} spacing={1}>
                  <Tooltip title="Precio de Compra Anterior">
                    <Typography color={"#f50057"} fontWeight="bold">
                      PCA:
                    </Typography>
                  </Tooltip>

                  <Typography>
                    {selectedProduct.precioCompra.toLocaleString("es-NI", {
                      textAlign: "center",
                      style: "currency",
                      currency: "NIO",
                    })}
                  </Typography>
                </Stack>

                <Stack direction={"row"} spacing={1}>
                  <Tooltip title="Precio de Venta al Mayor">
                    <Typography color={"#4caf50"} fontWeight="bold">
                      PVM:
                    </Typography>
                  </Tooltip>
                  <Typography>
                    {selectedProduct.precioVentaMayor.toLocaleString("es-NI", {
                      textAlign: "center",
                      style: "currency",
                      currency: "NIO",
                    })}
                  </Typography>
                </Stack>

                <Stack direction={"row"} spacing={1}>
                  <Tooltip title="Precio de Venta al Detalle">
                    <Typography color={"#4caf50"} fontWeight="bold">
                      PVD:
                    </Typography>
                  </Tooltip>
                  <Typography>
                    {selectedProduct.precioVentaDetalle.toLocaleString(
                      "es-NI",
                      {
                        textAlign: "center",
                        style: "currency",
                        currency: "NIO",
                      }
                    )}
                  </Typography>
                </Stack>
              </Stack>
            ) : (
              <></>
            )}
          </Stack>
        </Stack>

        {/* <Divider style={{ marginTop: 10, marginBottom: 10 }} /> */}

        <Stack spacing={2} marginTop={1}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            // justifyContent="space-between"
            alignItems={"flex-end"}
          >
            <div style={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                required
                variant="standard"
                label={"Cantidad"}
                value={cantidad}
                onChange={(e) => funcCantidad(e.target.value)}
              />

              <TextField
                style={{ marginTop: 10 }}
                fullWidth
                required
                variant="standard"
                label={"Monto C$"}
                value={precioCompra}
                onChange={(e) => funcPrecioCompra(e.target.value)}
              />
            </div>

            <Stack>
              <Typography color="#e91e63" fontWeight="bold">
                Sub - Total
              </Typography>
              <Typography>
                {costoAntesDesc.toLocaleString("es-NI", {
                  style: "currency",
                  currency: "NIO",
                })}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={"flex-end"}
          >
            <div style={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                variant="standard"
                label={"Descuento %"}
                value={descuento}
                onChange={(e) => funcDescuento(e.target.value)}
              />

              <TextField
                style={{ marginTop: 10 }}
                fullWidth
                variant="standard"
                label={"Impuesto %"}
                value={impuesto}
                onChange={(e) => funcImpuesto(e.target.value)}
              />
            </div>

            <Stack>
              <Typography color="#e91e63" fontWeight="bold">
                Total
              </Typography>
              <Typography>
                {costo.toLocaleString("es-NI", {
                  style: "currency",
                  currency: "NIO",
                })}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          marginTop: 10,
          padding: 15,
        }}
      >
        <Typography variant="h5" textAlign={"left"}>
          Precio de venta C$
        </Typography>

        <Divider style={{ marginBottom: 10 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={"center"}
        >
          <Paper
            elevation={10}
            style={{
              flexGrow: 1,
              borderRadius: 30,
              marginTop: 10,
              padding: 15,
            }}
          >
            <Typography variant="h5" textAlign={"left"}>
              Precio de Mayor
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              marginTop={1}
            >
              <TextField
                fullWidth
                variant="standard"
                label={"Ganancia en %"}
                value={baseGanancia}
                onChange={(e) => funcPorcentGananciaMayor(e.target.value)}
              />

              <TextField
                fullWidth
                variant="standard"
                label={"Ganancia en C$"}
                value={ganancia}
                onChange={(e) => funcGananciaMayor(e.target.value)}
              />

              <TextField
                fullWidth
                variant="standard"
                label={"Precio de venta C$"}
                value={precioVenta}
                onChange={(e) => funcPrecioVenta(e.target.value)}
              />
            </Stack>

            <Typography variant="h5" textAlign={"left"} marginTop={1}>
              Precio de Detalle
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              marginTop={1}
            >
              <TextField
                fullWidth
                variant="standard"
                label={"Ganancia en %"}
                value={baseGananciaDetalle}
                onChange={(e) => funcPorcentGananciaDetalle(e.target.value)}
              />
              <TextField
                fullWidth
                variant="standard"
                label={"Ganancia en C$"}
                value={gananciaDetalle}
                onChange={(e) => funcGananciaDetalle(e.target.value)}
              />
              <TextField
                fullWidth
                variant="standard"
                label={"Precio de venta C$"}
                value={precioVentaDetalle}
                onChange={(e) => funcPrecioVentaDetalle(e.target.value)}
              />
              {/* <TextField
                fullWidth
                variant="standard"
                label={"Ganancia en %"}
                value={baseGanancia}
                onChange={(e) => funcPorcentGananciaMayor(e.target.value)}
              />

              <TextField
                fullWidth
                variant="standard"
                label={"Ganancia en C$"}
                value={ganancia}
                onChange={(e) => funcGananciaMayor(e.target.value)}
              />

              <TextField
                fullWidth
                variant="standard"
                label={"Precio de venta C$"}
                value={precioVenta}
                onChange={(e) => funcPrecioVenta(e.target.value)}
              /> */}
            </Stack>
          </Paper>

          <Button
            variant="outlined"
            style={{ borderRadius: 20 }}
            onClick={() => addToProductList()}
          >
            <FontAwesomeIcon
              style={{ marginRight: 10, fontSize: 20 }}
              icon={faClipboard}
            />
            Agregar al Detalle
          </Button>
        </Stack>
      </Paper>

      <MediumModal
        titulo={"Agregar Producto"}
        isVisible={showProductModal}
        setVisible={setShowProductModal}
      >
        <Productsadd setShowModal={setShowProductModal} />
      </MediumModal>
    </div>
  );
};

export default ProductDescription;
