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

export const NewAbonoEspecifico = ({ selectedVenta, setVisible, client }) => {
  let ruta = getRuta();

  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);

  const { id, facturedBy, saldo } = selectedVenta;

  let navigate = useNavigate();

  const token = getToken();
  const [newAbono, setNewAbono] = useState("");
  const [newSaldo, setNewSaldo] = useState(saldo);

  const [showprintModal, setShowprintModal] = useState(false);
  const [dataBill, setDataBill] = useState([]);

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
    setReload(!reload);
    setDataBill(result.data);
    setVisible(false);
    setNewAbono("");
    toastSuccess("Abono Agregado...");
    setShowprintModal(true);
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
        isVisible={showprintModal}
        setVisible={setShowprintModal}
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
