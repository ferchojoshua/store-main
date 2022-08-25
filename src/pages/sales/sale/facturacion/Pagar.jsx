import React, { useState, useContext } from "react";

import {
  Divider,
  IconButton,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import { isEmpty } from "lodash";
import { paidFacturaAsync } from "../../../../services/FacturationApi";
import { DataContext } from "../../../../context/DataContext";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";

const Pagar = ({
  facturaSelected,
  setVisible,
  setShowBillModal,
  setDataBill,
}) => {
  const { setIsLoading, setIsLogged, setIsDefaultPass, reload, setReload } =
    useContext(DataContext);
  let ruta = getRuta();
  const { montoVenta, montoVentaAntesDescuento, id, facturaDetails } =
    facturaSelected;
  const [montoRecibido, setMontoRecibido] = useState("");
  const [cambio, setCambio] = useState("");

  const [isDescPercent, setIsDescPercent] = useState(false);
  const [montoVentaDespuesDescuento, setMontoVentaDespuesDescuento] =
    useState(montoVenta);

  const [descuentoGlobal, setDescuentoGlobal] = useState("");
  const [descuentoGlobalMonto, setDescuentoGlobalMonto] = useState("");
  const [descuentoGlobalPercent, setDescuentoGlobalPercent] = useState("");
  const [descuentoCod, setDescuentoCod] = useState("");

  const token = getToken();
  let navigate = useNavigate();

  const costoCompraTotal = () => {
    let suma = 0;
    facturaDetails.map((item) => {
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
    setMontoVentaDespuesDescuento(montoVentaAntesDescuento);
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

  const addNewVenta = async () => {
    if (descuentoCod !== "VC.2022*" && !isEmpty(descuentoGlobal)) {
      toastError("Codigo incorrecto");
      return;
    }

    const data = {
      FacturaId: id,
      montoVenta: montoVentaDespuesDescuento,
      isDescuento: descuentoGlobal ? true : false,
      descuentoXPercent: descuentoGlobalPercent ? descuentoGlobalPercent : 0,
      descuentoXMonto: descuentoGlobalMonto ? descuentoGlobalMonto : 0,
      codigoDescuento: descuentoCod,
      montoVentaAntesDescuento,
    };
    setIsLoading(true);
    const result = await paidFacturaAsync(token, data);
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
    console.log(result.data)
    setDataBill(result.data);
    setReload(!reload);
    setIsLoading(false);
    setShowBillModal(true);
    setVisible(false);
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
            autoComplete="nope"
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
        Pagar
      </Button>
    </div>
  );
};

export default Pagar;
