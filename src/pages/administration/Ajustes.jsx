import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Container, Paper, Tabs, Tab, Box, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  InputAdornment, IconButton, Grid, Typography, Switch, FormControlLabel
} from '@mui/material';
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import { DataContext } from "../../../context/DataContext";
import { Search as SearchIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AjustesAsync, getListAsync } from '../../../services/CreateLogoApi';
import { getToken, deleteUserData, deleteToken } from "../../../services/Account";
import MediumModal from "../../../components/modals/MediumModal";
import Editajustes from "./Editajustes"; 

const Ajustes = () => {
  const [tabValue, setTabValue] = useState(0);
  const [valor, setValor] = useState('');
  const [catalogo, setCatalogo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [toggleState, setToggleState] = useState('');
  const [showModalSave, setShowModalSave] = useState(false);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { setIsLoading, setIsLogged, setIsDefaultPass, reload, setReload } = useContext(DataContext);
  let navigate = useNavigate();
  const token = getToken();
  let ruta = getRuta();
  const isMountedRef = useRef(true);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedporcentaje, setSelectedporcentaje] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchData = async () => {
    try {
      const data = {
        operacion: 2,
      };
      const result = await getListAsync(token, data);
      if (result.statusResponse) {
        setRecords(Array.isArray(result.data) ? result.data : []);
      } else {
        if (result.error?.request?.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        if (result.error.message === "Network Error") {
          toastError('Error de red. Por favor, verifica tu conexión.');
        } else {
          toastError(result.error?.message || 'Error al cargar los registros');
        }
      }
    } catch (error) {
      toastError('Error al cargar los registros: ' + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      clearForm();
      setToggleState('');
    }
  };

  const handleCancelar = () => {
    setShowModalSave(false);
    clearForm();
  };

  const handleGuardar = async () => {
    try {
      if (validate()) {
        const data = {
          valor: valor,
          catalogo: catalogo,
          descripcion: descripcion,
          operacion: 1,
        };

        setIsLoading(true);

        const result = await AjustesAsync(token, data);
        if (!result.statusResponse) {
          setIsLoading(false);
          if (result.error?.request?.status === 401) {
            navigate(`${ruta}/unauthorized`);
            return;
          }
          toastError(result.error?.message || "Ocurrió un error inesperado");
          return;
        }

        if (result.data === "eX01") {
          deleteUserData();
          deleteToken();
          setIsLogged(false);
          return;
        }

        if (result.data.isDefaultPass) {
          setIsDefaultPass(true);
          return;
        }

        if (isMountedRef.current) {
          setRecords([...records, result.data]);
        }

        toastSuccess("Configuración guardada exitosamente");
        clearForm();
        setShowModalSave(false);
      }
    } catch (error) {
      setIsLoading(false);
      toastError('Error al guardar la configuración: ' + error.message);
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


  const editPorcentaje = (value) => {
    setSelectedporcentaje({
      id: value.id,
      valor: String(value.valor),
      catalogo: value.catalogo,
      descripcion: value.descripcion,    
      operacion: 3,
      estado: value.estado});
    // 'setToggleState(value.estado); 
    setShowEditModal(true);
  };
  

  const clearForm = () => {
    setValor('');
    setCatalogo('');
    setDescripcion('');
    setToggleState(true);
  };

  const filteredRecords = Array.isArray(records)
    ? records.filter(record =>
      ((typeof record.id === 'string' && record.id.includes(searchTerm)) ||
      (typeof record.valor === 'string' && record.valor.includes(searchTerm)) ||
      (typeof record.catalogo === 'string' && record.catalogo.includes(searchTerm)) ||
      (typeof record.descripcion === 'string' && record.descripcion.includes(searchTerm)))
    )
    : [];

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Configuración de valores y catálogos">
          <Tab label="Lista de registros" />
          <Tab label="Crear/Editar registro" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              style: { borderRadius: '10px' },
            }}
            style={{ marginBottom: '20px' }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Id</strong></TableCell>
                  <TableCell><strong>Valor</strong></TableCell>
                  <TableCell><strong>Catálogo</strong></TableCell>
                  <TableCell><strong>Descripción</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.valor}</TableCell>
                    <TableCell>{record.catalogo}</TableCell>
                    <TableCell>{record.descripcion}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                          checked={record.estado}
                          onChange={(e) => setToggleState(e.target.checked)}
                          color="primary"
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          disabled 
                        /> }
                        label={record.estado ? 'Activado' : 'Desactivado'}
                        style={{ marginTop: '20px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        style={{ marginRight: 5, color: "#00a152" }}
                        onClick={() => {
                          editPorcentaje(record);
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {/* Botones de edición y eliminación comentados */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
            <TextField
            fullWidth
            label="Valor *"
            variant="outlined"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            InputProps={{
            style: { borderRadius: '10px' },
            inputProps: {
            inputMode: 'numeric',
            pattern: '[0-9]*', // Esto asegura que solo se puedan ingresar números
            },
            }}
            type="number"
            />
          </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Catálogo *"
                variant="outlined"
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
                variant="outlined"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                InputProps={{
                  style: { borderRadius: '10px' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={toggleState}
                    onChange={(e) => setToggleState(e.target.checked)}
                    color="primary"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    disabled={tabValue === 1 && editIndex === null}
                  />
                }
                label={toggleState ? 'Activado' : 'Desactivado'}
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
                variant="contained"
                color="secondary"
                onClick={handleCancelar}
                style={{ borderRadius: '10px' }}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      <MediumModal
        titulo={`Editar Catalogo`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}>
        <Editajustes selectedporcentaje={selectedporcentaje} setShowModal={setShowEditModal} reload={reload} setReload={setReload} />
      </MediumModal>
    </Container>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default Ajustes;
