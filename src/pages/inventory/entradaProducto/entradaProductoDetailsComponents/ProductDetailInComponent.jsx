import React, { useContext, useState, useEffect } from "react";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Paper,
  Grid,
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
import DatePicker from "@mui/lab/DatePicker";
import { getStoresAsync } from "../../../../services/AlmacenApi";

const ProductDetailInComponent = ({
  setNoFactura,
  noFactura,
  tipoEntrada,
  setTipoEntrada,
  tipoCompra,
  setTipoCompra,
  selectedProvider,
  setSelectedProvider,
  fechaIngreso,
  setFechaIngreso,
  selectedStore,
  setSelectedStore,
  isEdit,
}) => {
  const { setIsLoading, reload, setIsLogged } = useContext(DataContext);
  const token = getToken();
  const [providerList, setProviderList] = useState([]);
  const [storesList, setStoresList] = useState([]);
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
        toastError(resultProviders.error);
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

      const resultStore = await getStoresAsync(token);
      if (!resultStore.statusResponse) {
        setIsLoading(false);
        if (resultStore.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError(resultStore.error);
        return;
      }
      if (resultStore.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }
      setStoresList(resultStore.data);
      setIsLoading(false);
    })();
  }, [reload]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <h5>Datos de Entrada</h5>
      </div>

      <hr />

      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 20,
            }}
          >
            <TextField
              fullWidth
              required
              variant="standard"
              onChange={(e) => setNoFactura(e.target.value.toUpperCase())}
              label={"N° Factura"}
              value={noFactura}
              disabled={true}
            />

            <DatePicker
              disabled={!isEdit}
              label="Fecha de Ingreso"
              value={new Date(fechaIngreso)}
              onChange={(newValue) => {
                setFechaIngreso(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  variant="standard"
                  style={{ marginTop: 20 }}
                  {...params}
                />
              )}
            />

            <FormControl
              variant="standard"
              fullWidth
              style={{ marginRight: 20, marginTop: 20 }}
              required
              disabled={true}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione un Almacen
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                label="Proveedor"
                style={{ textAlign: "left" }}
              >
                <MenuItem key={0} value="">
                  <em> Seleccione un Almacen</em>
                </MenuItem>
                {storesList.map((item) => {
                  return (
                    <MenuItem key={item.almacen.id} value={item.almacen.id}>
                      {item.almacen.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 20,
            }}
          >
            <FormControl
              variant="standard"
              fullWidth
              required
              disabled={!isEdit}
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
              disabled={!isEdit}
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
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <FormControl
                variant="standard"
                fullWidth
                style={{ marginTop: 20 }}
                required
                disabled={!isEdit}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione un Proveedor
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedProvider}
                  onChange={(e) => {
                    setSelectedProvider(e.target.value);
                  }}
                  label="Proveedor"
                  style={{ textAlign: "left" }}
                >
                  <MenuItem key={0} value="">
                    <em> Seleccione una Proveedor</em>
                  </MenuItem>
                  {providerList.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {isEdit ? (
                <Tooltip
                  title="Agregar Proveedor"
                  style={{ marginLeft: 20, marginTop: 25 }}
                >
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
              ) : (
                <></>
              )}
            </div>
          </Paper>
        </Grid>
      </Grid>

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

export default ProductDetailInComponent;
