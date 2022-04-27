import React, { useContext, useState, useEffect } from "react";
import {
  TextField,
  Tooltip,
  Paper,
  IconButton,
  Button,
  Autocomplete,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faClipboard } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../../../context/DataContext";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../../../helpers/Helpers";
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
}) => {
  const { setIsLoading, reload, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  const token = getToken();
  let navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultProducts = await getProductsAsync(token);
      if (!resultProducts.statusResponse) {
        setIsLoading(false);
        if (resultProducts.error.request.status === 401) {
          navigate("/unauthorized");
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

  const getExistencias = async (newValue) => {
    if (!newValue) {
      setSelectedProduct("");
      return;
    }
    const data = {
      IdProduct: newValue.id,
      IdAlmacen: 4,
    };
    setIsLoading(true);
    const result = await getProducExistanceAsync(token, data);
    if (!result.statusResponse) {
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h4>Datos del Producto</h4>
        </div>

        <hr />

        <div className="row justify-content-around align-items-center">
          <div className="col-sm-6">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <Autocomplete
                id="combo-box-demo"
                fullWidth
                options={productList}
                getOptionLabel={(op) => (op ? `${op.description}` || "" : "")}
                value={selectedProduct}
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

              <Tooltip title="Agregar Producto" style={{ marginTop: 5 }}>
                <IconButton onClick={() => setShowProductModal(true)}>
                  <FontAwesomeIcon
                    style={{
                      fontSize: 25,
                      color: "#ff5722",
                    }}
                    icon={faCirclePlus}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className="col-sm-6">
            {selectedProduct ? (
              <div className="row justify-content-around align-items-center">
                <div className="col-sm-2">
                  <p
                    style={{
                      textAlign: "center",
                      color: "#2979ff",
                      fontWeight: "bold",
                    }}
                  >{`Codigo: ${selectedProduct.id}`}</p>
                </div>
                <div className="col-sm-2">
                  <p
                    style={{
                      textAlign: "center",
                      color: "#2979ff",
                      fontWeight: "bold",
                    }}
                  >{`Existencia: ${selectedProduct.existencia}`}</p>
                </div>
                <div className="col-sm-2">
                  <p
                    style={{
                      textAlign: "center",
                      color: "#4caf50",
                      fontWeight: "bold",
                    }}
                  >{`PVM: ${selectedProduct.precioVentaMayor.toLocaleString(
                    "es-NI",
                    {
                      textAlign: "center",
                      style: "currency",
                      currency: "NIO",
                    }
                  )}`}</p>
                </div>
                <div className="col-sm-2">
                  <p
                    style={{
                      color: "#4caf50",
                      fontWeight: "bold",
                    }}
                  >{`PVD: ${selectedProduct.precioVentaDetalle.toLocaleString(
                    "es-NI",
                    {
                      style: "currency",
                      currency: "NIO",
                    }
                  )}`}</p>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="row justify-content-around align-items-center">
          <div className="col-sm-2">
            <TextField
              fullWidth
              required
              style={{ marginTop: 20 }}
              variant="standard"
              label={"Cantidad"}
              value={cantidad}
              onChange={(e) => funcCantidad(e.target.value)}
            />
          </div>

          <div className="col-sm-2">
            <TextField
              fullWidth
              required
              style={{ marginTop: 20 }}
              variant="standard"
              label={"Monto C$"}
              value={precioCompra}
              onChange={(e) => funcPrecioCompra(e.target.value)}
            />
          </div>

          <div className="col-sm-2">
            <TextField
              fullWidth
              style={{ marginTop: 20 }}
              variant="standard"
              label={"Descuento %"}
              value={descuento}
              onChange={(e) => funcDescuento(e.target.value)}
            />
          </div>

          <div className="col-sm-2">
            <TextField
              fullWidth
              style={{ marginTop: 20 }}
              variant="standard"
              label={"Impuesto %"}
              value={impuesto}
              onChange={(e) => funcImpuesto(e.target.value)}
            />
          </div>

          <div className="col-sm-3">
            <h6
              style={{ marginTop: 20, color: "#e91e63", fontWeight: "bold" }}
            >{`Costo = ${costo.toLocaleString("es-NI", {
              style: "currency",
              currency: "NIO",
            })}`}</h6>
          </div>
        </div>
      </Paper>

      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          marginTop: 10,
          padding: 15,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h5>Precio de venta C$</h5>
        </div>

        <div className="row justify-content-around align-items-center">
          <div className="col-sm-2">
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
              label={"Ganancia en %"}
              value={baseGananciaDetalle}
              style={{
                marginTop: 20,
              }}
              onChange={(e) => funcPorcentGananciaDetalle(e.target.value)}
            />
          </div>

          <div className="col-sm-2">
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
              label={"Ganancia en C$"}
              value={gananciaDetalle}
              style={{
                marginTop: 20,
              }}
              onChange={(e) => funcGananciaDetalle(e.target.value)}
            />
          </div>

          <div className="col-sm-2">
            <TextField
              fullWidth
              variant="standard"
              label={"Precio de venta C$"}
              value={precioVenta}
              onChange={(e) => funcPrecioVenta(e.target.value)}
            />

            <TextField
              fullWidth
              variant="standard"
              label={"Precio de venta C$"}
              value={precioVentaDetalle}
              style={{
                marginTop: 20,
              }}
              onChange={(e) => funcPrecioVentaDetalle(e.target.value)}
            />
          </div>

          <div className="col-sm-2">
            <h5 style={{ marginTop: 20 }}>Mayor</h5>
            <h5 style={{ marginTop: 30 }}>Detalle</h5>
          </div>

          <div className="col-sm-3">
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
          </div>
        </div>
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
