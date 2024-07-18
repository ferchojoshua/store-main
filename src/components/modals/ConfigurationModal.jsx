import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, FormControlLabel, Switch } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConfigurationModal = ({ open, handleClose, handleConfirm, title, children }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de guardar los cambios?</p>
        </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigurationModal;
