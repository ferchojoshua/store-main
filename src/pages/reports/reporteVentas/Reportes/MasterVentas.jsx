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

import { Table } from "react-bootstrap";
import { getMasterVentasAsync } from "../../../../services/ReportApi";
import moment from "moment";
import "../../../../components/styles/estilo.css";

export const MasterVentas = ({
  selectedStore,
  desde,
  hasta,
  contadoSales,
  creditSales,
}) => {
  const [data, setData] = useState([]);

  const { setIsLoading, setIsDefaultPass, setIsLogged, access, isDarkMode } =
    useContext(DataContext);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  useEffect(() => {
    (async () => {
      const datos = {
        desde,
        hasta,
        storeId: selectedStore === "t" ? 0 : selectedStore,
        contadoSales,
        creditSales,
      };

      setIsLoading(true);
      const result = await getMasterVentasAsync(token, datos);
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
      setIsLoading(false);
    })();
  }, []);

  const sumSales = () => {
    let sum = 0;
    data.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumContadoSales = () => {
    const contSales = data.filter((item) => item.isContado);
    let sum = 0;
    contSales.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumCreditoSales = () => {
    const credSales = data.filter((item) => item.isContado === false);
    let sum = 0;
    credSales.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumAbonado = () => {
    const credSales = data.filter((item) => item.isContado === false);
    let sum = 0;
    credSales.map((item) => (sum += item.montoVenta - item.saldo));
    return sum;
  };

  const sumSaldo = () => {
    const credSales = data.filter((item) => item.isContado === false);
    let sum = 0;
    credSales.map((item) => (sum += item.saldo));
    return sum;
  };

  return (
    <div>
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
                <th style={{ textAlign: "center" }}>Factura</th>
                <th style={{ textAlign: "left" }}>Cliente</th>
                <th style={{ textAlign: "center" }}>Almacen</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th style={{ textAlign: "center" }}>M. Venta</th>
                <th style={{ textAlign: "center" }}>T. Abonado</th>
                <th style={{ textAlign: "center" }}>Saldo</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {data.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "center" }}>
                      {moment(item.fechaVenta).format("L")}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.id}</td>
                    <td style={{ textAlign: "left" }}>
                      {isEmpty(item.client)
                        ? "CLIENTE EVENTUAL"
                        : item.client.nombreCliente}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.store.name}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.isContado ? "Contado" : "Credito"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.montoVenta)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.montoVenta - item.saldo)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.saldo)}
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
              Total de Ventas
            </span>
            <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
          </Stack>

          <Stack textAlign="center">
            <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
              Total de Ventas
            </span>
            <span>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(sumSales())}
            </span>
          </Stack>

          {contadoSales ? (
            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Ventas de Contado
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumContadoSales())}
              </span>
            </Stack>
          ) : (
            <></>
          )}

          {creditSales ? (
            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Ventas de Credito
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumCreditoSales())}
              </span>
            </Stack>
          ) : (
            <></>
          )}

          {creditSales ? (
            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Abonado
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumAbonado())}
              </span>
            </Stack>
          ) : (
            <></>
          )}

          {creditSales ? (
            <Stack textAlign="center">
              <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
                Total de Saldo
              </span>
              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sumSaldo())}
              </span>
            </Stack>
          ) : (
            <></>
          )}
        </Stack>
        <hr />
      </Container>
    </div>
  );
};