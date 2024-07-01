import React from 'react';
import { Typography } from '@mui/material';

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '3px 0',
        background: '#0d47a1',
        borderRadius: '0 0 10px 10px',
        width: '100%', // Ocupa el ancho completo del contenedor
        position: 'fixed', // Posición fija para mantenerlo en la parte inferior
        bottom: 0, // Lo fija en la parte inferior de la ventana
        zIndex: 100, // Asegura que el footer esté sobre otros elementos
      }}
    >
      <Typography
        variant="body2"
        style={{ color: 'white' }}
        align="center"
      >
        {`Este producto es de uso exclusivo de Auto&Moto ${new Date().getFullYear()}.`}
      </Typography>
    </footer>
  );
};

export default Footer;
