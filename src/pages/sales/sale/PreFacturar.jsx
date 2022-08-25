import React, { useState } from "react";

import {
  Divider,
  IconButton,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { toastError } from "../../../helpers/Helpers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const PreFacturar = ({
  isDescPercent,
  setIsDescPercent,
  descuentoCod,
  setDescuentoCod,
  setDescuentoGlobalMonto,
  setDescuentoGlobalPercent,
  descuentoGlobal,
  setDescuentoGlobal,
  montoVentaDespuesDescuento,
  setMontoVentaDespuesDescuento,
  addNewVenta,
  montoVentaAntesDescuento,
  selectedProductList,
}) => {
  const [montoRecibido, setMontoRecibido] = useState("");
  const [cambio, setCambio] = useState("");

  const costoCompraTotal = () => {
    let suma = 0;
    selectedProductList.map((item) => {
      suma += item.costoCompra;
    });
    return suma;
  };

  const funcDescuento = (value) => {
    if (value === 0 || value === "0") {
      toastError("Ingrese descuento mayor que cero");
      return;
    }

    if (/^\d*\.?\d*$/.test(value.toString())) {
      let descPercent = 0;
      let descMonto = 0;

      if (isDescPercent) {
        descPercent = value;
        descMonto = montoVentaAntesDescuento * (value / 100);
      } else {
        descMonto = value;
        descPercent = (value / montoVentaAntesDescuento) * 100;
      }

      const inversion = costoCompraTotal();

      if (montoVentaAntesDescuento - descMonto < inversion) {
        toastError("No puede aplicar ese descuento");
        descMonto = 0;
        descPercent = 0;
        return;
      }

      setMontoVentaDespuesDescuento(montoVentaAntesDescuento - descMonto);
      setDescuentoGlobal(value);
      setDescuentoGlobalMonto(descMonto);
      setDescuentoGlobalPercent(descPercent);
      return;
    }
  };

  const changeTipoDescuento = () => {
    setDescuentoGlobal("");
    setDescuentoGlobalMonto("");
    setDescuentoGlobalPercent("");
    setMontoVentaDespuesDescuento(montoVentaDespuesDescuento);
    setIsDescPercent(!isDescPercent);
  };

  //Devuelve un entero positivo
  const funcMontoRecibido = (value) => {
    if (value === 0 || value === "0") {
      toastError("Ingrese descuento mayor que cero");
      return;
    }

    if (/^\d*\.?\d*$/.test(value.toString())) {
      setMontoRecibido(value);
      setCambio(0);
      setCambio(value - montoVentaDespuesDescuento);
      return;
    }
  };


  return (
    <div
      style={{
        width: 400,
      }}
    >
      <Divider />
      <Stack direction={"row"} spacing={2} style={{ marginTop: 20 }}>
        <Typography style={{ fontWeight: "bold" }}>
          Monto a Pagar Antes Descuento:
        </Typography>
        <Typography style={{ color: "#2979ff" }}>
          {montoVentaAntesDescuento.toLocaleString("es-NI", {
            style: "currency",
            currency: "NIO",
          })}
        </Typography>
      </Stack>

      <Stack spacing={2} direction="row">
        <TextField
          style={{ marginTop: 5 }}
          fullWidth
          variant="standard"
          label={isDescPercent ? "Descuento en %" : "Descuento en C$"}
          value={descuentoGlobal}
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
        {descuentoGlobal ? (
          <TextField
            style={{ marginTop: 5 }}
            fullWidth
            variant="standard"
            type={"password"}
            label={"Codigo de Descuento"}
            value={descuentoCod}
            onChange={(e) =>
              setDescuentoCod(e.target.value.toLocaleUpperCase())
            }
          />
        ) : (
          <></>
        )}
      </Stack>

      <Stack direction={"row"} spacing={2} style={{ marginTop: 20 }}>
        <Typography style={{ fontWeight: "bold" }}>
          Monto a Pagar Despues Descuento:
        </Typography>
        <Typography style={{ color: "#2979ff" }}>
          {montoVentaDespuesDescuento.toLocaleString("es-NI", {
            style: "currency",
            currency: "NIO",
          })}
        </Typography>
      </Stack>
      <Divider />

      <TextField
        style={{ marginTop: 20, marginBottom: 20 }}
        fullWidth
        variant="standard"
        label={"Monto Recibido"}
        value={montoRecibido}
        onChange={(e) => funcMontoRecibido(e.target.value)}
      />
      <Stack spacing={2} direction="row">
        <Typography style={{ fontWeight: "bold" }}>Cambio:</Typography>
        <Typography style={{ color: cambio < 0 ? "#f50057" : "#2979ff" }}>
          {cambio.toLocaleString("es-NI", {
            style: "currency",
            currency: "NIO",
          })}
        </Typography>
      </Stack>

      <Button
        variant="outlined"
        fullWidth
        style={{
          borderRadius: 20,
          borderColor: "#00a152",
          color: "#00a152",
          marginTop: 20,
        }}
        onClick={() => addNewVenta()}
      >
        <FontAwesomeIcon
          style={{ marginRight: 10, fontSize: 20 }}
          icon={faSave}
        />
        Guardar Venta
      </Button>
    </div>
  );
};

export default PreFacturar;
