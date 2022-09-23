import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
  FormGroup,
  Stack,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

import { getClientsAsync } from "../../../services/ClientsApi";

import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { getRuta, isAccess, toastError } from "../../../helpers/Helpers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import MediumModal from "../../../components/modals/MediumModal";
import AddClient from "../clients/AddClient";

const SelectClient = ({
  selectedClient,
  setSelectedClient,
  eventualClient,
  setEventualClient,
  typeClient,
  onTypeClientChange,
  creditoDisponible,
  setCreditoDisponible,
  saldoVencido,
  setSaldoVencido,
  setFactVencidas,
}) => {
  let ruta = getRuta();

  const { setIsLoading, setIsLogged, reload, setIsDefaultPass, access } =
    useContext(DataContext);
  let navigate = useNavigate();

  const token = getToken();

  const [clientList, setClientList] = useState([]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultProducts = await getClientsAsync(token);
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

      setClientList(resultProducts.data);
      setIsLoading(false);
    })();
  }, [reload]);

  const onChangeSelectedClient = (client) => {
    if (client === null) {
      setSelectedClient(client);
      return;
    } else {
      const { limiteCredito, creditoConsumido } = client;
      let diferencia = limiteCredito - creditoConsumido;
      setCreditoDisponible(diferencia);
      setSaldoVencido(client.saldoVencido);
      setFactVencidas(client.facturasVencidas);
      if (diferencia < 0) {
        toastError("Limite de credito alcanzado");
        return;
      } else {
        setSelectedClient(client);
        return;
      }
    }
  };

  return (
    <div>
      <div style={{ textAlign: "left" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size="medium"
                checked={typeClient}
                onChange={() => onTypeClientChange(!typeClient)}
              />
            }
            label="Cliente Eventual"
          />
        </FormGroup>
      </div>

      {typeClient ? (
        <TextField
          fullWidth
          required
          variant="standard"
          label={"Nombre Cliente"}
          value={eventualClient}
          onChange={(e) => setEventualClient(e.target.value.toUpperCase())}
        />
      ) : (
        <div>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              id="combo-box-demo"
              fullWidth
              options={clientList}
              getOptionLabel={(op) => (op ? `${op.nombreCliente}` || "" : "")}
              value={selectedClient === "" ? null : selectedClient}
              onChange={(event, newValue) => {
                onChangeSelectedClient(newValue);
              }}
              noOptionsText="Cliente no encontrado..."
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.nombreCliente}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label="Seleccione un cliente..."
                />
              )}
            />
            {isAccess(access, "CLIENTS CREATE") ? (
              <Tooltip title="Agregar Cliente" style={{ marginTop: 5 }}>
                <IconButton onClick={() => setShowModal(true)}>
                  <FontAwesomeIcon
                    style={{
                      fontSize: 25,
                      color: "#ff5722",
                    }}
                    icon={faCirclePlus}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
          </Stack>

          {selectedClient ? (
            <Stack
              direction="row"
              justifyContent={"space-between"}
              style={{ marginTop: 10 }}
            >
              <Stack spacing={1} direction="row">
                <Typography style={{ color: "#2979ff" }}>
                  Credito Disponible:
                </Typography>
                <Typography>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(creditoDisponible)}
                </Typography>
              </Stack>
              <Stack spacing={1} direction="row">
                <Typography style={{ color: "#f50057" }}>
                  Saldo Vencido:
                </Typography>
                <Typography>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(saldoVencido)}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <></>
          )}
        </div>
      )}

      <MediumModal
        titulo={"Agregar Cliente"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <AddClient setShowModal={setShowModal} />
      </MediumModal>
    </div>
  );
};

export default SelectClient;
