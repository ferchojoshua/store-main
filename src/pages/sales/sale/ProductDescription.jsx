import React from "react";
import {
  Divider,
  Radio,
  TextField,
  Typography,
  Button,
  Stack,
  Grid,
  InputAdornment,
  IconButton,
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
  isDescPercent,
  setIsDescPercent,
  setDescuentoXPercent,
  costoAntesDescuento,
  setCostoAntesDescuento,
  setDescuentoXMonto,
  descuentoCod,
  setDescuentoCod,
}) => {
  const {
    precioVentaDetalle,
    precioVentaMayor,
    existencia,
    producto,
    precioCompra,
  } = selectedProduct;



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
      let price =
        selectedPrecio === "PVD" ? precioVentaDetalle : precioVentaMayor;

      let subPrecio = price * value;

      let descMonto = 0;
      let descPercent = 0;

      if (isDescPercent) {
        descPercent = descuento;
        descMonto = subPrecio * (descuento / 100);
      } else {
        descMonto = descuento;
        descPercent = (descuento / subPrecio) * 100;
      }

      setCostoAntesDescuento(subPrecio);
      setDescuentoXMonto(descMonto);
      setDescuentoXPercent(descPercent);
      setcostoXProducto(subPrecio - descMonto * value);
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
      let price =
        selectedPrecio === "PVD" ? precioVentaDetalle : precioVentaMayor;
      let subPrecio = price * cantidad;
      let subPrecioUnit = subPrecio / cantidad;

      let descPercent = 0;
      let descMonto = 0;

      if (isDescPercent) {
        descPercent = value;
        descMonto = subPrecioUnit * (value / 100);
      } else {
        descMonto = value;
        descPercent = (value / subPrecioUnit) * 100;
      }

      if (subPrecioUnit - descMonto < precioCompra) {
        toastError("No puede aplicar ese descuento");
        descMonto = 0;
        descPercent = 0;
        return;
      }

      setCostoAntesDescuento(subPrecio);
      setcostoXProducto(subPrecio - descMonto * cantidad);
      setDescuentoXMonto(descMonto);
      setDescuentoXPercent(descPercent);
      setDescuento(value);
      return;
    }
  };

  const handleChange = (event) => {
    let price =
      event.target.value === "PVD" ? precioVentaDetalle : precioVentaMayor;

    let subPrecio = price * cantidad;

    let descMonto = 0;
    let descPercent = 0;

    if (isDescPercent) {
      descPercent = descuento;
      descMonto = subPrecio * (descuento / 100);
    } else {
      descMonto = descuento;
      descPercent = (descuento / subPrecio) * 100;
    }

    setCostoAntesDescuento(subPrecio);
    setcostoXProducto(subPrecio - descMonto * cantidad);
    setDescuentoXMonto(descMonto);
    setDescuentoXPercent(descPercent);
    setSelectedPrecio(event.target.value);
  };

  const changeTipoDescuento = () => {
    setDescuento("");
    setDescuentoXPercent("");
    setIsDescPercent(!isDescPercent);
  };

  return (
    <div>
      <div>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Stack direction={"row"} spacing={2} justifyContent="center">
              <Typography
                style={{
                  color: "#2979ff",
                  fontWeight: "bold",
                }}
              >
                {barCodeSearch ? "Nombre:" : "Codigo:"}
              </Typography>
              {barCodeSearch ? (
                <Typography>{producto.description}</Typography>
              ) : (
                <Typography>{producto.barCode}</Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction={"row"} spacing={2} justifyContent="center">
              <Typography
                style={{
                  color: "#2979ff",
                  fontWeight: "bold",
                }}
              >
                Existencia:
              </Typography>

              <Typography>{selectedProduct.existencia}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack alignItems="center">
              <Radio
                checked={selectedPrecio === "PVD"}
                onChange={handleChange}
                value="PVD"
                name="radio-buttons"
                inputProps={{ "aria-label": "PVD" }}
              />
              <Stack direction={"row"} spacing={2} alignItems="center">
                <Typography
                  style={{
                    color: "#4caf50",
                    fontWeight: "bold",
                  }}
                >
                  PVD:
                </Typography>
                <Typography>
                  {selectedProduct.precioVentaDetalle.toLocaleString("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  })}
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack alignItems="center">
              <Radio
                checked={selectedPrecio === "PVM"}
                onChange={handleChange}
                value="PVM"
                name="radio-buttons"
                inputProps={{ "aria-label": "PVM" }}
              />
              <Stack direction={"row"} spacing={2} alignItems="center">
                <Typography
                  style={{
                    color: "#2979ff",
                    fontWeight: "bold",
                  }}
                >
                  PVM:
                </Typography>

                <Typography>
                  {selectedProduct.precioVentaMayor.toLocaleString("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  })}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        <Grid container spacing={1} style={{ marginTop: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              variant="standard"
              label={"Cantidad"}
              value={cantidad}
              onChange={(e) => funcCantidad(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} spacing={2} style={{ marginTop: 20 }}>
              <Typography style={{ fontWeight: "bold" }}>
                Antes Descuento:
              </Typography>
              <Typography style={{ color: "#2979ff" }}>
                {costoAntesDescuento.toLocaleString("es-NI", {
                  style: "currency",
                  currency: "NIO",
                })}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} spacing={2}>
              <TextField
                style={{ marginTop: 5 }}
                fullWidth
                variant="standard"
                label={
                  isDescPercent
                    ? "Descuento por producto en %"
                    : "Descuento por Producto en C$"
                }
                value={descuento}
                onChange={(e) => funcDescuento(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => changeTipoDescuento()}
                        style={{ width: 40, height: 40 }}
                      >
                        {isDescPercent ? "C$" : "%"}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {descuento ? (
                <TextField
                  style={{ marginTop: 5 }}
                  fullWidth
                  variant="standard"
                  type={"password"}
                  label={"Ingrese Codigo de Descuento"}
                  value={descuentoCod}
                  onChange={(e) =>
                    setDescuentoCod(e.target.value.toLocaleUpperCase())
                  }
                />
              ) : (
                <></>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              style={{ borderRadius: 20, marginTop: 10 }}
              fullWidth
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
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ProductDescription;
