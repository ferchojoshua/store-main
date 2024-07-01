// ConfiguracionIVA.js

import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Tabs, Tab, Box, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  InputAdornment, IconButton, Grid, Typography
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toastSuccess } from '../../../helpers/Helpers';
import ConfigurationModal from '../../../components/ConfigurationModal';

const ConfiguracionIVA = () => {
  const [tabValue, setTabValue] = useState(0);
  const [valor, setValor] = useState('');
  const [catalogo, setCatalogo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [showModalSave, setShowModalSave] = useState(false);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Lógica para cargar datos, si es necesario
    };
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGuardar = () => {
    const newRecord = { valor, catalogo, descripcion };

    if (editIndex !== null) {
      // Editar el registro existente
      const updatedRecords = [...records];
      updatedRecords[editIndex] = newRecord;
      setRecords(updatedRecords);
      setEditIndex(null);
    } else {
      // Crear un nuevo registro
      setRecords([...records, newRecord]);
    }

    toastSuccess('Configuración guardada exitosamente');
    setShowModalSave(false);
    clearForm();
  };

  const handleCancelar = () => {
    setShowModalSave(false);
    clearForm();
  };

  const handleEditar = (index) => {
    const record = records[index];
    setValor(record.valor);
    setCatalogo(record.catalogo);
    setDescripcion(record.descripcion);
    setEditIndex(index);
    setTabValue(1);
    setShowModalSave(true); // Abrir modal al editar
  };

  const handleEliminar = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
    toastSuccess('Registro eliminado exitosamente');
  };

  const clearForm = () => {
    setValor('');
    setCatalogo('');
    setDescripcion('');
  };

  const filteredRecords = records.filter(record =>
    record.valor.includes(searchTerm) ||
    record.catalogo.includes(searchTerm) ||
    record.descripcion.includes(searchTerm)
  );

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Configuración de Valores y Catálogos">
          <Tab label="Lista de Registros" />
          <Tab label="Crear/Editar Registro" />
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
                  <TableCell><strong>Valor</strong></TableCell>
                  <TableCell><strong>Catálogo</strong></TableCell>
                  <TableCell><strong>Descripción</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.valor}</TableCell>
                    <TableCell>{record.catalogo}</TableCell>
                    <TableCell>{record.descripcion}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditar(index)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEliminar(index)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginBottom: '10px' }}>Crear/Editar Registro</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor *"
                variant="outlined"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                InputProps={{
                  style: { borderRadius: '10px' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
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
          </Grid>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: '10px', backgroundColor: '#4caf50' }}
              onClick={() => setShowModalSave(true)}
            >
              Guardar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ backgroundColor: '#f44336' }}
              onClick={() => handleCancelar()}
            >
              Cancelar
            </Button>
          </div>
        </TabPanel>

        <ConfigurationModal
          open={showModalSave}
          handleClose={() => setShowModalSave(false)}
          handleGuardar={handleGuardar}
        />
      </Paper>
    </Container>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default ConfiguracionIVA;
