import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  IconButton,
  TextField,
  Grid,
  Paper,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import { DataContext } from "../../../context/DataContext";
import { getCuentasAsync } from "../../../services/ContabilidadApi";
import { getRuta, toastError } from "../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { Navigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpellCheck,
  faCirclePlus,
  faBarsStaggered,
} from "@fortawesome/free-solid-svg-icons";

export const AddCountDetail = ({
  selectedCount,
  setSelectedCount,
  addToDetail,
  debito,
  setDebito,
  credito,
  setCredito,
}) => {
  const { setIsLoading, setIsDefaultPass, setIsLogged, access } =
    useContext(DataContext);

  const [countList, setCountList] = useState([]);

  const [countCodeSearch, setCountCodeSearch] = useState(false);

  const token = getToken();
  let ruta = getRuta();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getCuentasAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          Navigate(`${ruta}/unauthorized`);
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
      setCountList(result.data);
    })();
  }, []);

  const funcMontoDebito = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString()) || value === "") {
      setCredito("");
      setDebito(value);
      return;
    }
  };
  const funcMontoCredito = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString()) || value === "") {
      setDebito("");
      setCredito(value);
      return;
    }
  };

  return (
    <div>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
          marginBottom: 10,
          minWidth: 550,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              {countCodeSearch ? (
                <Autocomplete
                  id="combo-box-demo"
                  fullWidth
                  options={countList}
                  getOptionLabel={(op) => (op ? `${op.countNumber}` || "" : "")}
                  value={selectedCount === "" ? null : selectedCount}
                  onChange={(event, newValue) => {
                    setSelectedCount(newValue);
                  }}
                  noOptionsText="Cuenta no encontrada..."
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.countNumber}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
                      label="Seleccione una cuenta..."
                    />
                  )}
                />
              ) : (
                <Autocomplete
                  id="combo-box-demo"
                  fullWidth
                  options={countList}
                  getOptionLabel={(op) => (op ? `${op.descripcion}` || "" : "")}
                  value={selectedCount === "" ? null : selectedCount}
                  onChange={(event, newValue) => {
                    setSelectedCount(newValue);
                  }}
                  noOptionsText="Cuenta no encontrada..."
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.descripcion}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
                      label="Seleccione una cuenta..."
                    />
                  )}
                />
              )}

              <Tooltip
                title={
                  countCodeSearch
                    ? "Buscar por Codigo de Cuenta"
                    : "Buscar por Nombre de Cuenta"
                }
                style={{ marginTop: 5 }}
              >
                <IconButton
                  onClick={() => {
                    setCountCodeSearch(!countCodeSearch);
                  }}
                >
                  <FontAwesomeIcon
                    style={{
                      fontSize: 25,
                      color: "#2196f3",
                    }}
                    icon={countCodeSearch ? faBarsStaggered : faSpellCheck}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              variant="standard"
              onChange={(e) => funcMontoDebito(e.target.value)}
              label={"Debito"}
              value={debito}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              variant="standard"
              onChange={(e) => funcMontoCredito(e.target.value)}
              label={"Credito"}
              value={credito}
            />
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          fullWidth
          style={{ borderRadius: 20, marginTop: 20 }}
          startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
          onClick={() => {
            addToDetail();
          }}
        >
          Agregar al detalle
        </Button>
      </Paper>
    </div>
  );
};
