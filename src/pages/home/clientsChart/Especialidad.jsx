import React, { useState, useEffect, useContext } from "react";
import { Typography, Grid } from "@mui/material";

import { DataContext } from "../../../context/DataContext";
import { getToken } from "../../../services/Account";
import { toastError } from "../../../helpers/Helpers";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DatasetController,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { isEmpty, sum } from "lodash";
import NoData from "../../../components/NoData";
import { getSalesByTNAndStore } from "../../../services/DashboardApi";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Especialidad = ({ selectedStore }) => {
  const { setIsLoading } = useContext(DataContext);

  const token = getToken();

  const [data, setData] = useState([]);

  const [total, setTotal] = useState(0);

  const [motos, setMotos] = useState([]);
  const [carros, setCarros] = useState([]);
  const [lub, setLub] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getSalesByTNAndStore(token, selectedStore);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError(result.error.message);
        return;
      }
      setIsLoading(false);

      setMotos(result.data.filter((item) => item.tn === "MOTOS"));
      setCarros(result.data.filter((item) => item.tn === "CARROS"));
      setLub(result.data.filter((item) => item.tn === "LUBRICANTES"));
      setData(result.data);

      setTotal(sum(result.data.map((item) => item.contador)));
    })();
  }, [selectedStore]);

  const bgColors = () => {
    const colors = [];
    data.map((item) => {
      const { tn } = item;
      if (tn === "CARROS") {
        colors.push("rgba(255, 159, 64, 0.2)");
      } else if (tn === "LUBRICANTES") {
        colors.push("rgba(255, 99, 132, 0.2)");
      } else {
        colors.push("rgba(153, 102, 255, 0.2)");
      }
    });
    return colors;
  };

  const borderColors = () => {
    const colors = [];
    data.map((item) => {
      const { tn } = item;
      if (tn === "CARROS") {
        colors.push("rgba(255, 159, 64, 1)");
      } else if (tn === "LUBRICANTES") {
        colors.push("rgba(255, 99, 132, 1)");
      } else {
        colors.push("rgba(153, 102, 255, 1)");
      }
    });
    return colors;
  };

  const graphicData = {
    labels: data.map((item) => item.tn),
    datasets: [
      {
        data: data.map((item) => {
          const { contador } = item;
          return contador;
        }),
        backgroundColor: bgColors(),
        borderColor: borderColors(),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Typography variant="h6">Ventas por Especialidad</Typography>

      {isEmpty(data) ? (
        <div style={{ marginTop: 20 }}>
          <NoData />
        </div>
      ) : (
        <Grid container spacing={2} style={{ marginTop: 3 }}>
          <Grid item xs={4} sm={7} md={7}>
            <Doughnut
              data={graphicData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        let label = context.label || "";
                        if (label) {
                          label += ": ";
                        }
                        if (context.parsed !== null) {
                          label +=
                            Math.round((context.parsed / total) * 100) + "%";
                        }
                        return label;
                      },
                    },
                  },
                  legend: { display: false },
                },
              }}
            />
          </Grid>
          <Grid item xs={8} sm={5} md={5}>
            <div style={{ marginTop: 20 }}>
              <Typography variant="body1">Motos</Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(153, 102, 255, 1)", fontWeight: "bold" }}
              >
                {!isEmpty(motos)
                  ? `${Math.round((motos[0].contador / total) * 100)}%`
                  : "0%"}
              </Typography>

              <Typography variant="body1">Carros</Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(255, 159, 64, 1)", fontWeight: "bold" }}
              >
                {!isEmpty(carros)
                  ? `${Math.round((carros[0].contador / total) * 100)}%`
                  : "0%"}
              </Typography>

              <Typography variant="body1">Lubricantes</Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(255, 99, 132, 1)", fontWeight: "bold" }}
              >
                {!isEmpty(lub)
                  ? `${Math.round((lub[0].contador / total) * 100)}%`
                  : "0%"}
              </Typography>
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
};
