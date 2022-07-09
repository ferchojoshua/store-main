import React, { useState, useEffect } from "react";
import { TextField, Button, Divider, Typography, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const DetalleProductoComponent = ({ selectedDetail, editDetail }) => {
  const [product] = useState(selectedDetail.product);
  const [cantidad, setCantidad] = useState(selectedDetail.cantidad);
  const [precioCompra, setPrecioCompra] = useState(selectedDetail.costoCompra);
  const [costo, setCosto] = useState(selectedDetail.costoUnitario);
  const [descuento, setDescuento] = useState(selectedDetail.descuento);
  const [impuesto, setImpuesto] = useState(selectedDetail.impuesto);

  const [baseGanancia, setBaseGanancia] = useState("");
  const [ganancia, setGanancia] = useState("");
  const [precioVenta, setPrecioVenta] = useState(
    selectedDetail.precioVentaMayor
  );

  const [baseGananciaDetalle, setBaseGananciaDetalle] = useState("");
  const [gananciaDetalle, setGananciaDetalle] = useState("");
  const [precioVentaDetalle, setPrecioVentaDetalle] = useState(
    selectedDetail.precioVentaDetalle
  );

  useEffect(() => {
    funcPrecioVentaDetalle(selectedDetail.precioVentaDetalle);
    funcPrecioVenta(selectedDetail.precioVentaMayor);
  }, []);

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

  const setEditedDetail = () => {
    const data = selectedDetail;
    data.cantidad = parseInt(cantidad);
    data.costoCompra = parseFloat(precioCompra);
    data.costoUnitario = parseFloat(costo);
    data.descuento = parseInt(descuento);
    data.impuesto = parseInt(impuesto);
    data.precioVentaMayor = parseFloat(precioVenta);
    data.precioVentaDetalle = parseFloat(precioVentaDetalle);
    editDetail(data);
  };

  return (
    <div>
      <Divider />
      <Typography
        variant="h5"
        style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}
      >
        {`Descripcion: ${product.description}`}
      </Typography>

      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
        }}
      >
        <div className="row justify-content-around align-items-center">
          <div className="col-sm-2">
            <TextField
              fullWidth
              required
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
              variant="standard"
              label={"Monto C$"}
              value={precioCompra}
              onChange={(e) => funcPrecioCompra(e.target.value)}
            />
          </div>

          <div className="col-sm-2">
            <TextField
              fullWidth
              variant="standard"
              label={"Descuento %"}
              value={descuento}
              onChange={(e) => funcDescuento(e.target.value)}
            />
          </div>

          <div className="col-sm-2">
            <TextField
              fullWidth
              variant="standard"
              label={"Impuesto %"}
              value={impuesto}
              onChange={(e) => funcImpuesto(e.target.value)}
            />
          </div>

          <div className="col-sm-3">
            <h6
              style={{
                // marginTop: 20,
                color: "#e91e63",
                fontWeight: "bold",
              }}
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
          padding: 20,
          // padding: 15,
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

        <Divider />

        <div className="row justify-content-around align-items-center">
          <div className="col-sm-3">
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

          <div className="col-sm-3">
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

          <div className="col-sm-3">
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

          <div className="col-sm-3">
            <h5 style={{ marginTop: 20 }}>Mayor</h5>
            <h5 style={{ marginTop: 35 }}>Detalle</h5>
          </div>
        </div>
      </Paper>

      <Button
        variant="outlined"
        fullWidth
        style={{ borderRadius: 20, marginTop: 20 }}
        onClick={() => setEditedDetail()}
      >
        <FontAwesomeIcon
          style={{ marginRight: 10, fontSize: 20 }}
          icon={faSave}
        />
        Guardar Cambios
      </Button>
    </div>
  );
};

export default DetalleProductoComponent;
