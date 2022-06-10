import React, { useState, useEffect, useContext } from "react";
import { Typography, Grid } from "@mui/material";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getSalesMensualAsync } from "../../services/DashboardApi";
import { DataContext } from "../../context/DataContext";
import { getToken } from "../../services/Account";
import { toastError } from "../../helpers/Helpers";

export const MetaMensual = ({ selectedStore }) => {
  const { setIsLoading } = useContext(DataContext);
  const [meta, setMeta] = useState(0);
  const [falta, setFalta] = useState(0);
  const [percent, setPercent] = useState(0);

  const metas = [
    { id: 1, meta: 260000 },
    { id: 2, meta: 160000 },
    { id: 3, meta: 360000 },
    { id: 4, meta: 460000 },
  ];

  const [totalVendido, setTotalVendido] = useState(0);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getSalesMensualAsync(token, selectedStore);
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
      <Typography variant="h6">Meta Mensual</Typography>

      <Typography variant="h5" style={{ color: "#2196f3", fontWeight: "bold" }}>
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
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{ marginTop: 20 }}>
            <Typography variant="body1">Venta Mensual</Typography>
            <Typography
              variant="body2"
              style={{ color: "#2196f3", fontWeight: "bold" }}
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
