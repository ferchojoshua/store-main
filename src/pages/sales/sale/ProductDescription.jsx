import React from "react";
import { Divider, Paper, TextField, Typography } from "@mui/material";

const ProductDescription = ({
  selectedProduct,
  cantidad,
  setCantidad,
  descuento,
  setDescuento,
  costoXProducto,
  setcostoXProducto,
}) => {
  const funcCantidad = (value) => {
    if (/^[0-9]+$/.test(value.toString()) || value === "") {
      setCantidad(value);
      return;
    }
  };

  //Devuelve un entero positivo
  const funcDescuento = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      //   let pC = 0;
      //   let cant = 0;
      //   let imp = 0;
      //   let desc = 0;
      //   precioCompra ? (pC = precioCompra) : (pC = 0);
      //   cantidad ? (cant = cantidad) : (cant = 0);
      //   let subPrecio = pC / cant;
      //   desc = subPrecio * (value / 100);
      //   impuesto ? (imp = subPrecio * (impuesto / 100)) : (imp = 0);
      //   setCosto(subPrecio - desc + imp);
      setDescuento(value);
      return;
    }
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
        {selectedProduct ? (
          <div className="row justify-content-around align-items-center">
            <div className="col-sm-3 ">
              <p
                style={{
                  textAlign: "center",
                  color: "#2979ff",
                  fontWeight: "bold",
                }}
              >{`Codigo: ${selectedProduct.id}`}</p>
            </div>
            <div className="col-sm-3 ">
              <p
                style={{
                  textAlign: "center",
                  color: "#2979ff",
                  fontWeight: "bold",
                }}
              >{`Existencia: ${selectedProduct.existencia}`}</p>
            </div>
            <div className="col-sm-3 ">
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
            <div className="col-sm-3 ">
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
        <Divider />

        <div
          className="row justify-content-around align-items-center"
          style={{ marginTop: 20 }}
        >
          <div className="col-sm-4">
            <TextField
              fullWidth
              required
              variant="standard"
              label={"Cantidad"}
              value={cantidad}
              onChange={(e) => funcCantidad(e.target.value)}
            />
          </div>

          <div className="col-sm-4">
            <TextField
              fullWidth
              variant="standard"
              label={"Descuento %"}
              value={descuento}
              onChange={(e) => funcDescuento(e.target.value)}
            />
          </div>

          <div className="col-sm-4">
            <Typography
              variant="subtitle1"
              style={{
                fontWeight: "bold",
              }}
            >
              Cantidad a pagar
            </Typography>
            <Typography
              variant="subtitle1"
              style={{
                color: "#4caf50",
                fontWeight: "bold",
              }}
            >
              {selectedProduct
                ? costoXProducto("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  })
                : (0).toLocaleString("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  })}
            </Typography>
            {/* <p
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
            )}`}</p> */}
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default ProductDescription;
