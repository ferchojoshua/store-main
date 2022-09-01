import { Container, Stack } from "@mui/material";
import { isEmpty } from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NoData from "../../../../components/NoData";
import { DataContext } from "../../../../context/DataContext";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import moment from "moment";
import { Table } from "react-bootstrap";
import { getGetCajaChicaAsync } from "../../../../services/ReportApi";

const CajaChica = ({ selectedStore, desde, hasta }) => {
  const [data, setData] = useState([]);
  const [saldoAnterior, setSaldoAnterior] = useState(0);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  const {
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    isDarkMode,
    setIsDarkMode,
  } = useContext(DataContext);

  useEffect(() => {
    (async () => {
      const datos = {
        desde,
        hasta,
        storeId: selectedStore === "t" ? 0 : selectedStore,
      };

      setIsLoading(true);

      const result = await getGetCajaChicaAsync(token, datos);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error.message);
        return;
      }
      if (result.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }
      if (result.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setData(result.data);
      setSaldoAnterior(
        result.data[0].saldo - result.data[0].entradas + result.data[0].salidas
      );
      setIsLoading(false);
      setIsDarkMode(false);
    })();
  }, []);

  const sumEntradas = () => {
    let sum = 0;
    data.map((item) => (sum += item.entradas));
    return sum;
  };

  const sumSalidas = () => {
    let sum = 0;
    data.map((item) => (sum += item.salidas));
    return sum;
  };

  return (
    <div>
      <hr />
      <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
        {isEmpty(data) ? (
          <NoData />
        ) : (
          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th style={{ textAlign: "left" }}>Descripcion</th>
                <th style={{ textAlign: "center" }}>Entrada</th>
                <th style={{ textAlign: "center" }}>Salida</th>
                <th style={{ textAlign: "center" }}>Saldo</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {data.map((item) => {
                const { id, fecha, description, entradas, salidas, saldo } =
                  item;

                return (
                  <tr key={id}>
                    <td style={{ textAlign: "center" }}>
                      {moment(fecha).format("L")}
                    </td>
                    <td style={{ textAlign: "left" }}>{description}</td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(entradas)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(salidas)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(saldo)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        <hr />

        <Stack direction="row" flex="row" justifyContent="space-around">
          <Stack textAlign="center">
            <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
              Total de Entradas:
            </span>
            <span>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(sumEntradas())}
            </span>
          </Stack>

          <Stack textAlign="center">
            <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
              Total de Salidas:
            </span>
            <span>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(sumSalidas())}
            </span>
          </Stack>

          <Stack textAlign="center">
            <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
              Saldo Inicial:
            </span>
            <span>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(saldoAnterior)}
            </span>
          </Stack>

          <Stack textAlign="center">
            <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
              Saldo Final:
            </span>
            <span>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(sumEntradas() - sumSalidas() + saldoAnterior)}
            </span>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
};

export default CajaChica;
