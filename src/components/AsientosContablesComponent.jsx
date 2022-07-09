import React from "react";

import {
  Button,
  Divider,
  Container,
  Paper,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";

export const AsientosContablesComponent = ({ data, key }) => {
  const {
    countAsientoContableDetails,
    fecha,
    fuenteContable,
    id,
    libroContable,
    referencia,
    store,
    user,
  } = data;

  return (
    <div key={key}>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
        }}
      ></Paper>
    </div>
  );
};
