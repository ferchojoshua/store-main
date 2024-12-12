import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, Grid, Switch, FormControlLabel, Box
} from '@mui/material';
import { DataContext } from "../../../context/DataContext";
import { toastError, toastSuccess, getRuta } from "../../../helpers/Helpers";
import { AjustesUpdateAsync } from '../../../services/CreateLogoApi';
import { getToken, deleteToken, deleteUserData } from "../../../services/Account";
import { isEmpty } from "lodash";

const Editajustes = ({ selectedporcentaje, setShowModal }) => {
  let ruta = getRuta();

  const {
    setIsLoading,
    reload,
    setReload,
    setIsLogged,
    setIsDefaultPass,
  } = useContext(DataContext);
  let navigate = useNavigate();
  const token = getToken();

  const [id, setId] = useState(selectedporcentaje.id);
  const [valor, setValor] = useState(selectedporcentaje.valor);
  const [catalogo, setCatalogo] = useState(selectedporcentaje.catalogo);
  const [descripcion, setDescripcion] = useState(selectedporcentaje.descripcion);
  const [toggleState, setToggleState] = useState(selectedporcentaje.estado);

  useEffect(() => {
    setId(selectedporcentaje.id);
    setValor(selectedporcentaje.valor);
    setCatalogo(selectedporcentaje.catalogo);
    setDescripcion(selectedporcentaje.descripcion);
    setToggleState(selectedporcentaje.estado);
  }, [selectedporcentaje]);

  const handleGuardar = async () => {
    if (validate()) {
      const data = {
        id,
        operacion: 3,
        valor: String(valor),
        catalogo,
        descripcion,
        estado: toggleState,
      };
      setIsLoading(true);
      const result = await AjustesUpdateAsync(token, data);
      setIsLoading(false);

      if (!result.statusResponse) {
        if (result.error?.request?.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error?.message || "Ocurrió un error inesperado");
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
      toastSuccess("Configuración actualizada exitosamente");
      setReload(!reload);
      setShowModal(false);
    }
  };
  
  const handleValorChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9 ]*$/;
    if (regex.test(value)) {
      setValor(value); 
    }
  };

  const validate = () => {
    let isValid = true;

    if (isEmpty(valor)) {
      toastError("Debe ingresar un valor");
      isValid = false;
    }

    if (isEmpty(catalogo)) {
      toastError("Debe ingresar un nombre de catálogo");
      isValid = false;
    }

    if (isEmpty(descripcion)) {
      toastError("Debe ingresar una descripción");
      isValid = false;
    }

    return isValid;
  };

  return (
    <Box p={3}>
      <Grid container spacing={3}>
      <Grid item xs={12} sm={3}>
            <TextField
            fullWidth
            label="Valor *"
            variant="outlined"
            value={valor}
                onChange={(e) => handleValorChange(e)}
                InputProps={{
                style: { borderRadius: '10px' },
                inputProps: {
                  inputMode: 'text', // Allows for both numbers and text input
                },
                }}
                type="text" // Use text type to allow numbers and letters
                />
          </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Catálogo *"
            variant="standard"
            value={catalogo}
            onChange={(e) => setCatalogo(e.target.value)}
            InputProps={{
              style: { borderRadius: '10px' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Descripción *"
            variant="standard"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            InputProps={{ style: { borderRadius: '10px' }, }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControlLabel
            control={
              <Switch
                className="toggle-switch-button"
                checked={toggleState}
                onChange={(e) => setToggleState(e.target.checked)}
                offColor="#bbb"
                onColor="lightgreen"
                size="2.4em"
              />
            }
            label={toggleState ? 'Activo' : 'Desactivado'}
            style={{ marginTop: '20px' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGuardar}
            style={{ marginRight: '10px', borderRadius: '10px' }}
          >
            Guardar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowModal(false)}
            style={{ borderRadius: '10px' }}
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
// nuevo cambio
export default Editajustes;