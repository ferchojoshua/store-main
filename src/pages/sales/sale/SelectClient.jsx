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
} from "@mui/material";

import { getClientsAsync } from "../../../services/ClientsApi";

import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { toastError } from "../../../helpers/Helpers";

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
  setTypeClient,
}) => {
  const { setIsLoading, setIsLogged, reload, setIsDefaultPass } =
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

      setClientList(resultProducts.data);
      setIsLoading(false);
    })();
  }, [reload]);

  return (
    <div>
      <div style={{ textAlign: "left" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size="medium"
                checked={typeClient}
                onChange={() => setTypeClient(!typeClient)}
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
            options={clientList}
            getOptionLabel={(op) => (op ? `${op.nombreCliente}` || "" : "")}
            value={selectedClient === "" ? null : selectedClient}
            onChange={(event, newValue) => {
              setSelectedClient(newValue);
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