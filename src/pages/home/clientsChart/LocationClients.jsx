import React, { useState, useEffect, useContext } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Typography, Grid } from "@mui/material";

import { Pie } from "react-chartjs-2";
import { getClientsByLocationAndStoreAsync } from "../../../services/DashboardApi";
import { DataContext } from "../../../context/DataContext";
import { getToken } from "../../../services/Account";
import { toastError } from "../../../helpers/Helpers";
import { isEmpty, sum } from "lodash";
import NoData from "../../../components/NoData";

ChartJS.register(ArcElement, Tooltip, Legend);

export const LocationClients = ({ selectedStore }) => {
  const { setIsLoading } = useContext(DataContext);

  const token = getToken();

  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getClientsByLocationAndStoreAsync(
        token,
        selectedStore
      );
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError(result.error.message);
        return;
      }
      setIsLoading(false);
      setDatos(result.data);
      let suma = 0;
      result.data.map((item) => (suma += item.contador));
      setTotal(suma);
    })();
  }, [selectedStore]);

  const data = {
    labels: datos.map((item) => {
      return `${item.location} ${Math.round((item.contador / total) * 100)}%`;
    }),
    datasets: [
      {
        data: datos.map((item) => {
          return item.contador;
        }),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <Typography variant="h6">Clientes por Ubicacion</Typography>

      {isEmpty(datos) ? (
        <div style={{ marginTop: 20 }}>
          <NoData />
        </div>
      ) : (
        <Pie
          data={data}
          options={{
            aspectRatio: 3.5,
            plugins: {
              legend: { position: "right" },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.label || "";
                    return label;
                  },
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};
