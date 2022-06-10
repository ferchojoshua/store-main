import React, { useState, useEffect, useContext } from "react";
import { Typography, Grid } from "@mui/material";

import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getSalesWeekByStoreAsync } from "../../services/DashboardApi";
import { DataContext } from "../../context/DataContext";
import { getToken } from "../../services/Account";
import { toastError } from "../../helpers/Helpers";

export const MetaSemanal = ({ selectedStore }) => {
  const { setIsLoading } = useContext(DataContext);
  const [meta, setMeta] = useState(0);
  const [falta, setFalta] = useState(0);
  const [percent, setPercent] = useState(0);

  const metas = [
    { id: 1, meta: 65000 },
    { id: 2, meta: 115000 },
    { id: 3, meta: 90000 },
    { id: 4, meta: 140000 },
  ];

  const [totalVendido, setTotalVendido] = useState(0);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getSalesWeekByStoreAsync(token, selectedStore);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError(result.error.message);
        return;
      }
      setIsLoading(false);
      let res = metas.filter((e) => e.id === selectedStore);
      setMeta(res[0].meta);
      setFalta(res[0].meta - result.data);
      setTotalVendido(result.data);
      setPercent((result.data / res[0].meta) * 100);
    })();
  }, [selectedStore]);
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <Typography variant="h6">Meta Semanal</Typography>

      <Typography variant="h5" style={{ color: "#4caf50", fontWeight: "bold" }}>
        {new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(meta)}
      </Typography>

      <hr />

      <Grid container spacing={5}>
        <Grid item xs={6}>
          <div style={{ width: 150, height: 150 }}>
            <CircularProgressbar
              value={percent}
              text={`${Math.round(percent)}%`}
              styles={buildStyles({
                pathColor: "#4caf50",
                textColor: "#4caf50",
              })}
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{ marginTop: 20 }}>
            <Typography variant="body1">Venta Semanal</Typography>
            <Typography
              variant="body2"
              style={{ color: "#4caf50", fontWeight: "bold" }}
            >
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(totalVendido)}
            </Typography>

            <Typography variant="body1">Falta</Typography>
            <Typography
              variant="body2"
              style={{ color: "#f50057", fontWeight: "bold" }}
            >
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(falta < 0 ? 0 : falta)}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
