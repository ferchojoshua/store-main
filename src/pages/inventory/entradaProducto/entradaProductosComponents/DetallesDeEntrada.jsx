import React, { useContext, useState, useEffect } from "react";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Paper,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataContext } from "../../../../context/DataContext";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import SmallModal from "../../../../components/modals/SmallModal";
import ProviderAdd from "../../../settings/provider/ProviderAdd";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { getprovidersAsync } from "../../../../services/ProviderApi";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../../../helpers/Helpers";

const DetallesDeEntrada = ({
  setNoFactura,
  noFactura,
  tipoEntrada,
  setTipoEntrada,
  tipoCompra,
  setTipoCompra,
  selectedProvider,
  setSelectedProvider,
}) => {
  const { setIsLoading, reload, setIsLogged } = useContext(DataContext);
  const token = getToken();
  const [providerList, setProviderList] = useState([]);
  const [showProviderModal, setShowProvidermodal] = useState(false);
  let navigate = useNavigate();
  
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultProviders = await getprovidersAsync(token);
      if (!resultProviders.statusResponse) {
        setIsLoading(false);
        if (resultProviders.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError("No se pudo cargar lista de proveedores");
        return;
      }
      if (resultProviders.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }
      setProviderList(resultProviders.data);
      setIsLoading(false);
    })();
  }, [reload]);

  return (
    <div>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h4>Datos de Entrada</h4>
        </div>

        <hr />

        <TextField
          fullWidth
          required
          variant="standard"
          onChange={(e) => setNoFactura(e.target.value.toUpperCase())}
          label={"N° Factura"}
          value={noFactura}
        />

        <FormControl
          variant="standard"
          fullWidth
          style={{ marginTop: 20 }}
          required
        >
          <InputLabel id="demo-simple-select-standard-label">
            Seleccione un tipo de entrada...
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={tipoEntrada}
            onChange={(e) => setTipoEntrada(e.target.value)}
            label="Unidad de Medida"
            style={{ textAlign: "left" }}
          >
            <MenuItem key={0} value="">
              <em>Seleccione un tipo de entrada...</em>
            </MenuItem>

            <MenuItem key={1} value={"Compra"}>
              Compra
            </MenuItem>
            <MenuItem key={2} value={"Devolucion"}>
              Devolucion
            </MenuItem>
            <MenuItem key={3} value={"Remision"}>
              Remision
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl
          variant="standard"
          fullWidth
          style={{ marginTop: 20 }}
        >
          <InputLabel id="demo-simple-select-standard-label">
            Seleccione un tipo de pago...
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={tipoCompra}
            onChange={(e) => setTipoCompra(e.target.value)}
            label="Unidad de Medida"
            style={{ textAlign: "left" }}
          >
            <MenuItem key={0} value="">
              <em>Seleccione un tipo de pago...</em>
            </MenuItem>

            <MenuItem key={1} value={"Pago de Contado"}>
              Pago de Contado
            </MenuItem>
            <MenuItem key={2} value={"Pago de Credito"}>
              Pago de Credito
            </MenuItem>
          </Select>
        </FormControl>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <Autocomplete
            id="combo-box-demo"
            fullWidth
            options={providerList}
            getOptionLabel={(op) => (op ? `${op.nombre}` || "" : "")}
            value={selectedProvider}
            onChange={(event, newValue) => {
              setSelectedProvider(newValue);
            }}
            noOptionsText="Proveedor no encontrado..."
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                label="Seleccione un proveedor..."
              />
            )}
          />

          <Tooltip title="Agregar Proveedor" style={{ marginTop: 5 }}>
            <IconButton onClick={() => setShowProvidermodal(true)}>
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
      </Paper>

      <SmallModal
        titulo={"Agregar Proveedor"}
        isVisible={showProviderModal}
        setVisible={setShowProvidermodal}
      >
        <ProviderAdd setShowModal={setShowProvidermodal} />
      </SmallModal>
    </div>
  );
};

export default DetallesDeEntrada;
