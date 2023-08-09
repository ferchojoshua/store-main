import React, { useState, useEffect, useContext } from "react";
import { Typography, Grid } from "@mui/material";

import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getNewClientsByStoreAsync } from "../../services/DashboardApi";
import { DataContext } from "../../context/DataContext";
import { getToken } from "../../services/Account";
import { toastError } from "../../helpers/Helpers";

export const MetaClientes = ({ selectedStore }) => {
  const { setIsLoading } = useContext(DataContext);
  const [meta, setMeta] = useState(0);
  const [falta, setFalta] = useState(0);
  const [percent, setPercent] = useState(0);

   //Cambiar el Datos a la meta
  const metas = [
    { id: 1, meta: 15 },
    { id: 2, meta: 16 },
    { id: 3, meta: 17 },
    { id: 4, meta: 18 },
  ];

  const token = getToken();

  const [newClients, setNewClients] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getNewClientsByStoreAsync(token, selectedStore);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError(result.error.message);
        return;
      }
      setIsLoading(false);
      let res = metas.filter((e) => e.id === selectedStore);
      setMeta(res[0].meta);
      setFalta(res[0].meta - result.data);
      setNewClients(result.data);
      setPercent((result.data / res[0].meta) * 100);
    })();
  }, [selectedStore]);

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <Typography variant="h6">Meta Mensual</Typography>
      <Typography variant="h5" style={{ color: "#d500f9", fontWeight: "bold" }}>
        {`${meta} Clientes Nuevos`}
      </Typography>

      <hr />

      <Grid container spacing={5}>
        <Grid item xs={6}>
          <div style={{ width: 150, height: 150 }}>
            <CircularProgressbar
              value={percent}
              text={`${Math.round(percent)}%`}
              styles={buildStyles({
                pathColor: "#d500f9",
                textColor: "#d500f9",
              })}
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{ marginTop: 20 }}>
            <Typography variant="body1">Clientes Nuevos</Typography>
            <Typography
              variant="body2"
              style={{ color: "#d500f9", fontWeight: "bold" }}
            >
              {newClients}
            </Typography>

            <Typography variant="body1">Falta</Typography>
            <Typography
              variant="body2"
              style={{ color: "#f50057", fontWeight: "bold" }}
            >
              {falta < 0 ? 0 : falta}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
