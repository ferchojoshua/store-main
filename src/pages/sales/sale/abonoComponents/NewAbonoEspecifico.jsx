import React, { useState, useContext } from "react";
import { DataContext } from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../../helpers/Helpers";
import {
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../../services/Account";

import { addAbonoEspecificoAsync } from "../../../../services/SalesApi";
import SmallModal from "../../../../components/modals/SmallModal";
import { AbonoBillComponent } from "./AbonoBillComponent";
import { Stack } from "react-bootstrap";

export const NewAbonoEspecifico = ({ selectedVenta, client, tipopagoList }) => {
  let ruta = getRuta();

  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);

  const { id, facturedBy, saldo } = selectedVenta;

  let navigate = useNavigate();

  const token = getToken();
  const [newAbono, setNewAbono] = useState("");
  const [newSaldo, setNewSaldo] = useState(saldo);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [dataBill, setDataBill] = useState([]);

  const [selectedTipopago, setSelectedTipoPago] = useState(1);

  const [reference, setReference] = useState("");

  const funcCantidad = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString()) || value === "") {
      if (value > saldo) {
        toastError("No puede abonar mas de lo que debe...");
        return;
      }
      setNewSaldo(saldo - value);
      setNewAbono(value);
      return;
    }
  };

  const addAbono = async () => {
    if (newAbono === "" || newAbono === 0) {
      toastError("Debe ingresar un abono mayor que cero...");
      return;
    }
    const data = {
      IdSale: id,
      monto: newAbono,
      idTipoPago: selectedTipopago,
      reference,
    };

    setIsLoading(true);
    const result = await addAbonoEspecificoAsync(token, data);
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
    setDataBill(result.data);

    setShowPrintModal(true);
    setReload(!reload);
    setNewAbono("");
    toastSuccess("Abono Agregado...");
  };

  const handleChangeTipoPago = (event) => {
    setSelectedTipoPago(event.target.value);
  };

  return (
    <div>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography variant="body1">Id Venta:</Typography>
            <Typography
              variant="body1"
              style={{ color: "#2196f3", fontWeight: "bold", marginLeft: 10 }}
            >
              {id}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography variant="body1">Saldo:</Typography>
            <Typography
              variant="body1"
              style={{ color: "#f50057", fontWeight: "bold", marginLeft: 10 }}
            >
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(saldo)}
            </Typography>
          </div>
        </div>

        <hr />
        <Stack spacing={2}>
          <FormControl
            variant="standard"
            fullWidth
            style={{
              textAlign: "left",
            }}
          >
            <Select
              labelId="selProc"
              id="demo-simple-select-standard"
              value={selectedTipopago}
              onChange={handleChangeTipoPago}
            >
              {tipopagoList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.description}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {selectedTipopago != 1 ? (
            <TextField
              fullWidth
              style={{ marginTop: 20 }}
              variant="standard"
              label={"Documento de Referencia"}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          ) : (
            <></>
          )}

          <TextField
            fullWidth
            required
            variant="standard"
            onChange={(e) => funcCantidad(e.target.value)}
            label={"Ingrese Abono"}
            value={newAbono}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">C$</InputAdornment>
              ),
            }}
            style={{ marginTop: 20 }}
          />
        </Stack>

        <Button
          onClick={() => {
            addAbono();
          }}
          style={{ marginTop: 20, borderRadius: 20 }}
          variant="outlined"
          fullWidth
        >
          <FontAwesomeIcon
            style={{ marginRight: 10, fontSize: 20 }}
            icon={faSave}
          />
          Agregar Abono
        </Button>
      </Paper>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 5,
          }}
        >
          <Typography variant="body1">Facturado por:</Typography>
          <Typography
            variant="body1"
            style={{ color: "#2196f3", fontWeight: "bold", marginLeft: 10 }}
          >
            {facturedBy.fullName}
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 5,
          }}
        >
          <Typography variant="body1">Nuevo Saldo:</Typography>
          <Typography
            variant="body1"
            style={{
              color: newSaldo === 0 ? "#4caf50" : "#f50057",
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            {new Intl.NumberFormat("es-NI", {
              style: "currency",
              currency: "NIO",
            }).format(newSaldo)}
          </Typography>
        </div>
      </div>

      <SmallModal
        titulo={"Imprimir Recibo"}
        isVisible={showPrintModal}
        setVisible={setShowPrintModal}
      >
        <AbonoBillComponent
          data={dataBill}
          client={client}
          multipleBill={false}
        />
      </SmallModal>
    </div>
  );
};
