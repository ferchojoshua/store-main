import React, { useState, useEffect, useContext } from "react";

import { GetSalesByDateAsync } from "../../services/DashboardApi";
import { DataContext } from "../../context/DataContext";
import { getToken } from "../../services/Account";
import { toastError } from "../../helpers/Helpers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

export const VentaSemanal = ({ selectedStore }) => {
  const { setIsLoading } = useContext(DataContext);

  const token = getToken();
  const [labels, setLabels] = useState([]);
  const [contado, setContado] = useState([]);
  const [credito, setCredito] = useState([]);
  const [recuperacion, setRecuperacion] = useState([]);

  const dayName = (fecha) =>
    ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"][
      new Date(fecha).getDay()
    ];

  const graphicData = {
    labels: labels,
    datasets: [
      {
        datalabels: { color: "rgba(75, 192, 192, 1)" },
        label: "Contado",
        data: contado,
        backgroundColor: ["rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        pointStyle: "circle",
        pointRadius: 8,
        tension: 0.3,
      },
      {
        datalabels: { color: "rgba(255, 99, 132, 1)" },
        label: "Credito",
        data: credito,
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        pointStyle: "circle",
        pointRadius: 8,
        tension: 0.3,
      },
      {
        datalabels: { color: "rgba(54, 162, 235, 1)" },
        label: "Recuperacion",
        data: recuperacion,
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        pointStyle: "circle",
        pointRadius: 8,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    aspectRatio: 5,

    plugins: {
      datalabels: {
        formatter: function (value) {
          let result = `${new Intl.NumberFormat("es-NI", {
            style: "currency",
            currency: "NIO",
          }).format(value)}`;

          return result;
        },
        align: "end",
      },
      tooltip: { enabled: false },
      // tooltip: {
      //   callbacks: {
      //     label: function (context) {
      //       let label = context.dataset.label || "";

      //       if (label) {
      //         label += ": ";
      //       }
      //       if (context.parsed.y !== null) {
      //         label += new Intl.NumberFormat("es-NI", {
      //           style: "currency",
      //           currency: "NIO",
      //         }).format(context.parsed.y);
      //       }
      //       return label;
      //     },
      //   },
      // },

      legend: {
        position: "top",
        align: "end",
      },
      title: {
        display: false,
      },
    },
    elements: {
      line: {
        borderJoinStyle: "round",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value, index, values) => {
            return new Intl.NumberFormat("es-NI", {
              style: "currency",
              currency: "NIO",
            }).format(value);
          },
        },
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await GetSalesByDateAsync(token, selectedStore);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError(result.error.message);
        return;
      }

      let dias = [];
      let cont = [];
      let cred = [];
      let recup = [];
      result.data.map((item) => {
        dias.push(dayName(item.fecha));
        cont.push(item.contado);
        cred.push(item.credito);
        recup.push(item.recuperacion);
      });
      setLabels(dias);
      setContado(cont);
      setCredito(cred);
      setRecuperacion(recup);

      setIsLoading(false);
    })();
  }, [selectedStore]);

  return (
    <div>
      <Line options={options} data={graphicData} plugins={[ChartDataLabels]} />
    </div>
  );
};
