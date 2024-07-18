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
        width: '100%', 
        position: 'fixed', 
        bottom: 0, 
        zIndex: 100, 
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
