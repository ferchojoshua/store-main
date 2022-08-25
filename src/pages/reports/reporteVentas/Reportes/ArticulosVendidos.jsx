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
import { getProductosVendidosAsync } from "../../../../services/ReportApi";

import "../../../../components/styles/estilo.css";

export const ArticulosVendidos = ({
  selectedStore,
  desde,
  hasta,
  selectedClient,
  selectedTNegocio,
  selectedFamilia,
}) => {
  const [data, setData] = useState([]);

  const { setIsLoading, setIsDefaultPass, setIsLogged, isDarkMode } =
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
        tipoNegocioId: selectedTNegocio === "t" ? 0 : selectedTNegocio,
        familiaId: selectedFamilia === "t" ? 0 : selectedFamilia,
        clientId:
          selectedClient === "" || selectedClient === null
            ? 0
            : selectedClient.id,
      };

      setIsLoading(true);

      const result = await getProductosVendidosAsync(token, datos);
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

  const sumCostoCompra = () => {
    let sum = 0;
    data.map((item) => (sum += item.costoCompra));
    return sum;
  };

  const sumVentaNeta = () => {
    let sum = 0;
    data.map((item) => (sum += item.montoVenta));
    return sum;
  };

  const sumUtilidad = () => {
    let sum = 0;
    data.map((item) => (sum += item.utilidad));
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
                <th style={{ textAlign: "right" }}>C. Barras</th>
                <th style={{ textAlign: "left" }}>Producto</th>
                <th style={{ textAlign: "center" }}>Cant. Vendida</th>
                <th style={{ textAlign: "center" }}>Costo</th>
                <th style={{ textAlign: "center" }}>Venta Neta</th>
                <th style={{ textAlign: "center" }}>Utilidad</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {data.map((item) => {
                return (
                  <tr key={item.barCode}>
                    <td style={{ textAlign: "right" }}>{item.barCode}</td>
                    <td style={{ textAlign: "left" }}>{item.producto}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.cantidadVendida}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.costoCompra)}
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
                      }).format(item.utilidad)}
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
              Total Productos Vendidos
            </span>
            <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
          </Stack>

          <Stack textAlign="center">
            <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
              Total Costo de Compra
            </span>
            <span>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(sumCostoCompra())}
            </span>
          </Stack>

          <Stack textAlign="center">
            <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
              Total Ventas Netas
            </span>
            <span>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(sumVentaNeta())}
            </span>
          </Stack>

          <Stack textAlign="center">
            <span style={{ fontWeight: "bold", color: "#03a9f4" }}>
              Utilidad Neta
            </span>
            <span>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(sumUtilidad())}
            </span>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
};
