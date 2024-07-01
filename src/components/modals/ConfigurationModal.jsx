import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, DialogActions, Button ,children} from "@mui/material";
import Slide from "@mui/material/Slide";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ConfigurationModal = ({ open, handleClose, handleConfirm, title, children }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
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
