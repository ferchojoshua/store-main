import React, { useState, useEffect, useContext } from "react";
import { DatePicker } from "@mui/lab";
import {
  Container,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { getStoresAsync } from "../../../../services/AlmacenApi";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { DataContext } from "../../../../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import FullScreenModal from "../../../../components/modals/FullScreenModal";
import moment from "moment";
import { ReportExistences } from "./ReportExistences";

export const SelectorHistorialExistencias = () => {
  const [fecha, setFecha] = useState(new Date());
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const [showFullScreenModal, setShowFullScreenModal] = useState(false);

  const { setIsLoading, setIsDefaultPass, setIsLogged, access } =
    useContext(DataContext);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  const verReport = () => {
    if (!moment(fecha).isValid()) {
      toastError("Ingrese una fecha valida");
      return;
    }
    if (selectedStore === "") {
      toastError("Seleccione un almacen");
      return;
    }

    setShowFullScreenModal(true);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStore = await getStoresAsync(token);
      if (!resultStore.statusResponse) {
        setIsLoading(false);
        if (resultStore.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultStore.error.message);
        return;
      }

      if (resultStore.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultStore.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setStoreList(resultStore.data);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div>
      <Container style={{ width: 550 }}>
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
            marginBottom: 10,
          }}
        >
          <DatePicker
            label="Fecha"
            value={fecha}
            onChange={(newValue) => {
              setFecha(newValue);
            }}
            renderInput={(params) => (
              <TextField required fullWidth variant="standard" {...params} />
            )}
          />

          <FormControl
            variant="standard"
            fullWidth
            style={{ marginRight: 20, marginTop: 20 }}
            required
          >
            <InputLabel id="demo-simple-select-standard-label">
              Seleccione un Almacen
            </InputLabel>
            <Select
              defaultValue=""
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              label="Almacen"
              style={{ textAlign: "left" }}
            >
              <MenuItem key={-1} value="">
                <em> Seleccione un Almacen</em>
              </MenuItem>
              {storeList.map((item) => {
                return (
                  <MenuItem key={item.almacen.id} value={item.almacen.id}>
                    {item.almacen.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            fullWidth
            style={{ borderRadius: 20, marginTop: 30 }}
            startIcon={<FontAwesomeIcon icon={faPrint} />}
            onClick={() => {
              verReport();
            }}
          >
            Generar Reporte
          </Button>
        </Paper>
      </Container>

      <FullScreenModal
        titulo={`Existencias a la fecha: ${moment(fecha).format("L")}`}
        setOpen={setShowFullScreenModal}
        open={showFullScreenModal}
      >
        <ReportExistences
          selectedStore={selectedStore}
          fecha={fecha}
          setSelectedStore={setSelectedStore}
          setFecha={setFecha}
        />
      </FullScreenModal>
    </div>
  );
};
