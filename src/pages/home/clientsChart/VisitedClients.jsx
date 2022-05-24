import React, { useState, useEffect, useContext } from "react";
import { Typography, Grid } from "@mui/material";
import { DataContext } from "../../../context/DataContext";
import { getToken } from "../../../services/Account";
import { toastError } from "../../../helpers/Helpers";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { sum } from "lodash";
import NoData from "../../../components/NoData";
import { getVisitedClientsByStoreAsync } from "../../../services/DashboardApi";

ChartJS.register(ArcElement, Tooltip, Legend);

const VisitedClients = ({ selectedStore }) => {
  const { setIsLoading } = useContext(DataContext);

  const token = getToken();

  const [data, setData] = useState([]);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getVisitedClientsByStoreAsync(token, selectedStore);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError(result.error.message);
        return;
      }
      setIsLoading(false);
      setData(result.data);
      setTotal(sum(result.data));

      // console.log(sum(data));
      // console.log(sum(data));
      // console.log(result.data[1] /);
    })();
  }, [selectedStore]);

  const graphicData = {
    labels: ["Existente", "Nuevo", "Potencial"],
    datasets: [
      {
        label: "# of Votes",
        data,
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
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
      <Typography variant="h6">Clientes Visitados Esta Semana</Typography>
      {sum(data) === 0 ? (
        <div style={{ marginTop: 20 }}>
          <NoData />
        </div>
      ) : (
        <Grid container spacing={2} style={{ marginTop: 3 }}>
          <Grid item xs={4} sm={7} md={5} lg={7}>
            <Doughnut
              data={graphicData}
              options={{
                plugins: {
                  legend: { display: false },
                  labels: {
                    position: "outside",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={8} sm={5} md={7} lg={5}>
            <div style={{ marginTop: 20 }}>
              <Typography variant="body1">Recurrente</Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(75, 192, 192, 1)", fontWeight: "bold" }}
              >
                {`${Math.round((data[0] / total) * 100)} %`}
              </Typography>

              <Typography variant="body1">Nuevo</Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(153, 102, 255, 1)", fontWeight: "bold" }}
              >
                {`${Math.round((data[1] / total) * 100)}%`}
              </Typography>

              <Typography variant="body1">Potencial</Typography>
              <Typography
                variant="body2"
                style={{ color: "rgba(255, 159, 64, 1)", fontWeight: "bold" }}
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

export default VisitedClients;
