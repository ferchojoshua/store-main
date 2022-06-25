import React from "react";
import {
  Divider,
  Paper,
  Radio,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { toastError } from "../../../helpers/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

const ProductDescription = ({
  selectedProduct,
  cantidad,
  setCantidad,
  descuento,
  setDescuento,
  selectedPrecio,
  setSelectedPrecio,
  costoXProducto,
  setcostoXProducto,
  addToProductList,
  barCodeSearch,
}) => {
  const { precioVentaDetalle, precioVentaMayor, existencia, producto } =
    selectedProduct;

  const funcCantidad = (value) => {
    if (value === 0 || value === "0") {
      toastError("Ingrese un valor mayor a cero");
      setcostoXProducto(0);
      return;
    }
    if (value > existencia) {
      toastError("No puede vender mas de lo que hay en existencia");
      return;
    }
    if (/^[0-9]+$/.test(value.toString()) || value === "") {
      let desc = 0;
      if (selectedPrecio === "PVD") {
        let subPrecio = precioVentaDetalle * value;
        descuento ? (desc = subPrecio * (descuento / 100)) : (desc = 0);
        setcostoXProducto(subPrecio - desc);
      } else {
        let subPrecio = precioVentaMayor * value;
        descuento ? (desc = subPrecio * (descuento / 100)) : (desc = 0);
        setcostoXProducto(subPrecio - desc);
      }
      setCantidad(value);
      return;
    }
  };

  //Devuelve un entero positivo
  const funcDescuento = (value) => {
    if (value === 0 || value === "0") {
      toastError("Ingrese descuento mayor que cero");
      return;
    }
    if (/^\d*\.?\d*$/.test(value.toString())) {
      let desc = 0;
      if (selectedPrecio === "PVD") {
        let subPrecio = precioVentaDetalle * cantidad;
        desc = subPrecio * (value / 100);
        setcostoXProducto(subPrecio - desc);
      } else {
        let subPrecio = precioVentaMayor * cantidad;
        descuento ? (desc = subPrecio * (value / 100)) : (desc = 0);
        setcostoXProducto(subPrecio - desc);
      }
      setDescuento(value);
      return;
    }
  };

  const handleChange = (event) => {
    if (cantidad === "" || cantidad === null) {
      setSelectedPrecio(event.target.value);
      return;
    } else {
      let desc = 0;
      if (event.target.value === "PVD") {
        let subPrecio = precioVentaDetalle * cantidad;
        descuento ? (desc = subPrecio * (descuento / 100)) : (desc = 0);
        setcostoXProducto(subPrecio - desc);
      } else {
        let subPrecio = precioVentaMayor * cantidad;
        descuento ? (desc = subPrecio * (descuento / 100)) : (desc = 0);
        setcostoXProducto(subPrecio - desc);
      }
    }
    setSelectedPrecio(event.target.value);
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
        <div>
          <div className="row justify-content-around align-items-center">
            <div className="col-md-6 col-lg-4 col-xl-3  ">
              <p
                style={{
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    textAlign: "center",
                    color: "#2979ff",
                    fontWeight: "bold",
                    marginRight: 5,
                  }}
                >
                  {barCodeSearch ? "Nombre:" : "Codigo"}
                </span>
                {barCodeSearch ? (
                  <span>{producto.description}</span>
                ) : (
                  <span>{producto.barCode}</span>
                )}
              </p>
            </div>
            <div className="col-md-6 col-lg-2 col-xl-3">
              <p
                style={{
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    textAlign: "center",
                    color: "#2979ff",
                    fontWeight: "bold",
                    marginRight: 5,
                  }}
                >
                  Existencia:
                </span>
                <span>{selectedProduct.existencia}</span>
              </p>
            </div>
            <div className="col-md-6 col-lg-3 col-xl-3">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Radio
                  style={{ marginTop: -10 }}
                  checked={selectedPrecio === "PVD"}
                  onChange={handleChange}
                  value="PVD"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "PVD" }}
                />
                <p>
                  <span
                    style={{
                      textAlign: "center",
                      color: "#4caf50",
                      fontWeight: "bold",
                      marginRight: 5,
                    }}
                  >
                    PVD:
                  </span>
                  <span>
                    {selectedProduct.precioVentaDetalle.toLocaleString(
                      "es-NI",
                      {
                        style: "currency",
                        currency: "NIO",
                      }
                    )}
                  </span>
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 col-xl-3">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Radio
                  style={{ marginTop: -10 }}
                  checked={selectedPrecio === "PVM"}
                  onChange={handleChange}
                  value="PVM"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "PVM" }}
                />
                <p>
                  <span
                    style={{
                      textAlign: "center",
                      color: "#4caf50",
                      fontWeight: "bold",
                      marginRight: 5,
                    }}
                  >
                    PVM:
                  </span>
                  <span>
                    {selectedProduct.precioVentaMayor.toLocaleString("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <Divider />

          <div
            className="row justify-content-around align-items-center"
            style={{ marginTop: 20 }}
          >
            <div className="col-sm-3">
              <TextField
                fullWidth
                required
                variant="standard"
                label={"Cantidad"}
                value={cantidad}
                onChange={(e) => funcCantidad(e.target.value)}
              />
            </div>

            <div className="col-sm-3">
              <TextField
                fullWidth
                variant="standard"
                label={"Descuento %"}
                value={descuento}
                onChange={(e) => funcDescuento(e.target.value)}
              />
            </div>

            <div className="col-sm-6">
              <Button
                variant="outlined"
                style={{ borderRadius: 20 }}
                onClick={() => addToProductList()}
              >
                <Typography
                  variant="subtitle1"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Monto de Venta:
                </Typography>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: "#4caf50",
                    fontWeight: "bold",
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                >
                  {costoXProducto !== ""
                    ? costoXProducto.toLocaleString("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      })
                    : (0).toLocaleString("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      })}
                </Typography>
                <FontAwesomeIcon style={{ fontSize: 20 }} icon={faCartPlus} />
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default ProductDescription;
