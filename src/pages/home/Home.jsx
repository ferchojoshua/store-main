import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";
import {
  Paper,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { MetaMensual } from "./MetaMensual";
import { VentasRecupercionMensual } from "./VentasRecupercionMensual";
import { getStoresByUserAsync } from "../../services/AlmacenApi";
import { deleteToken, deleteUserData, getToken } from "../../services/Account";
import { MetaSemanal } from "./MetaSemanal";
import { MetaClientes } from "./MetaClientes";
import { toastError } from "../../helpers/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartColumn,
  faChartLine,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import { VentaSemanal } from "./VentaSemanal";

const Home = () => {
  const { setIsLoading, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);

  const token = getToken();
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getStoresByUserAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
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
      setStoreList(result.data);
      handleChangeStore(result.data[0].id);
    })();
  }, []);

  const handleChangeStore = (val) => {
    setSelectedStore(val);
  };

  if (selectedStore === "") {
    return <div></div>;
  }

  return (
    <div>
      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h3" className="d-none d-sm-block">
            DASHBOARD
          </Typography>
          <FormControl
            variant="standard"
            style={{ textAlign: "left", marginTop: 20, width: 300 }}
          >
            <InputLabel id="selProc">Almacen</InputLabel>
            <Select
              labelId="selProc"
              id="demo-simple-select-standard"
              value={selectedStore}
              onChange={(e) => handleChangeStore(e.target.value)}
            >
              <MenuItem value="">
                <em>Seleccione un Almacen...</em>
              </MenuItem>
              {storeList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <hr />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 30,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <FontAwesomeIcon
            icon={faChartLine}
            style={{ fontSize: 60, marginRight: 40, color: "#2196f3" }}
            className="fa-beat-fade"
          />
          <Typography variant="h4" className="d-none d-sm-block">
            Ventas y Clientes Nuevos
          </Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
                minWidth: 280,
                maxHeight: 280,
              }}
            >
              <MetaMensual selectedStore={selectedStore} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
                minWidth: 280,
                maxHeight: 280,
              }}
            >
              <VentasRecupercionMensual selectedStore={selectedStore} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
                minWidth: 280,
                maxHeight: 280,
              }}
            >
              <MetaSemanal selectedStore={selectedStore} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
                minWidth: 280,
                maxHeight: 280,
              }}
            >
              <MetaClientes selectedStore={selectedStore} />
            </Paper>
          </Grid>
        </Grid>

        <hr />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 30,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <FontAwesomeIcon
            icon={faChartColumn}
            style={{ fontSize: 60, marginRight: 40, color: "#4caf50" }}
            className="fa-beat-fade"
          />
          <Typography variant="h4" className="d-none d-sm-block">
            Venta Semanal
          </Typography>
        </div>

        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
          }}
        >
          <VentaSemanal selectedStore={selectedStore} />
        </Paper>
      </Container>
    </div>
  );
};

export default Home;
