import React, { useState, useEffect, useContext } from "react";
import { Typography, Grid } from "@mui/material";

import { getSalesRecupMonthAsync } from "../../services/DashboardApi";
import { DataContext } from "../../context/DataContext";
import { getToken } from "../../services/Account";
import { toastError } from "../../helpers/Helpers";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { sum } from "lodash";
import NoData from "../../components/NoData";

ChartJS.register(ArcElement, Tooltip, Legend);

export const VentasRecupercionMensual = ({ selectedStore }) => {
  const { setIsLoading } = useContext(DataContext);

  const token = getToken();

  const [data, setData] = useState([]);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getSalesRecupMonthAsync(token, selectedStore);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError(result.error.message);
        return;
      }
      setIsLoading(false);

      setData(result.data);
      setTotal(sum(result.data));
    })();
  }, [selectedStore]);

  const graphicData = {
    labels: ["Contado", "Credito", "Recuperacion"],
    datasets: [
      {
        label: "# of Votes",
        data,
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Typography variant="h6">Ventas y Recuperacion Mensual</Typography>
      {sum(data) === 0 ? (
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
                          label += new Intl.NumberFormat("es-NI", {
                            style: "currency",
                            currency: "NIO",
                          }).format(context.parsed);
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
              <Typography variant="body1">Contado</Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(75, 192, 192, 1)", fontWeight: "bold" }}
              >
                {`${Math.round((data[0] / total) * 100)}%`}
              </Typography>

              <Typography variant="body1">Credito</Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(255, 99, 132, 1)", fontWeight: "bold" }}
              >
                {`${Math.round((data[1] / total) * 100)}%`}
              </Typography>

              <Typography variant="body1">Recuperacion</Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(54, 162, 235, 1)", fontWeight: "bold" }}
              >
                {`${Math.round((data[2] / total) * 100)}%`}
              </Typography>
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
};
