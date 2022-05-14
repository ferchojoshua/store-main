import React, { useState, useEffect, useContext } from "react";
import { Divider, Grid, Typography } from "@mui/material";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const MetaMensual = () => {
  const meta = 360000;
  const [totalVendido, setTotalVendido] = useState(90000);
  const [falta, setFalta] = useState(meta - totalVendido);
  let percent = (totalVendido / meta) * 100;
  return (
    <div>
      <Typography variant="h6">Meta Mensual</Typography>
      <Typography variant="h5" style={{ color: "#2196f3", fontWeight: "bold" }}>
        {new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(meta)}
      </Typography>
      <CircularProgressbar value={percent} text={`${Math.round(percent)}%`} />

      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      {/* <Grid container spacing={5}>
        <Grid item xs={12} sm={6}></Grid>
        <Grid item xs={12} sm={6}></Grid>
      </Grid> */}
      <Typography variant="h6">Venta Mensual</Typography>
      <Typography variant="h5" style={{ color: "#4caf50", fontWeight: "bold" }}>
        {new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(totalVendido)}
      </Typography>

      <Typography variant="h6">Falta</Typography>
      <Typography variant="h5" style={{ color: "#f50057", fontWeight: "bold" }}>
        {new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(falta < 0 ? 0 : falta)}
      </Typography>
    </div>
  );
};
