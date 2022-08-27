import { Container, Divider, Stack, Typography } from "@mui/material";
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
import {
  getGetCierreDiarioAsync,
  getMasterVentasAsync,
} from "../../../../services/ReportApi";
import moment from "moment";

const CierreDiario = ({
  selectedStore,
  fechaDesde,
  fechaHasta,
  horaDesde,
  horaHasta,
}) => {
  const [data, setData] = useState([]);
  const [dataVentasCredito, setDataVentasCredito] = useState([]);
  const [dataVentasContado, setDataVentasContado] = useState([]);
  const [dataDevoluciones, setDataDevoluciones] = useState([]);
  const [dataAbonos, setDataAbonos] = useState([]);

  const [sumContadoSales, setSumContadoSales] = useState(0);
  const [sumRecuperacion, setSumRecuperacion] = useState(0);
  const [sumCreditoSales, setSumCreditoSales] = useState(0);
  const [sumAnulatedSales, setSumAnulatedSales] = useState(0);

  const { setIsLoading, setIsDefaultPass, setIsLogged, access, isDarkMode } =
    useContext(DataContext);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  useEffect(() => {
    (async () => {
      const datos = {
        fechaDesde: new Date(fechaDesde).toLocaleDateString(),
        fechaHasta: new Date(fechaHasta).toLocaleDateString(),
        horaDesde: new Date(horaDesde).toLocaleTimeString(),
        horaHasta: new Date(horaHasta).toLocaleTimeString(),
        storeId: selectedStore === "t" ? 0 : selectedStore,
      };

      setIsLoading(true);
      const result = await getGetCierreDiarioAsync(token, datos);
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
      saleDesgloce(result.data);
      setDataDevoluciones(result.data.anulatedSaleList);
      setDataAbonos(result.data.abonoList);
      sumRec(result.data.abonoList);
      setIsLoading(false);
    })();
  }, []);

  const saleDesgloce = (datos) => {
    const { saleList } = datos;
    let contSales = saleList.filter(
      (item) => item.isContado === true && item.isAnulado === false
    );
    let credSales = saleList.filter(
      (item) => item.isContado === false && item.isAnulado === false
    );
    setDataVentasContado(contSales);
    setDataVentasCredito(credSales);

    sumContado(contSales);
    sumCredito(credSales);
  };

  const sumContado = (data) => {
    let result = 0;
    data.map((item) => (result += item.montoVenta));
    setSumContadoSales(result);
  };

  const sumCredito = (data) => {
    let result = 0;
    data.map((item) => (result += item.montoVenta));
    setSumCreditoSales(result);
  };

  const sumRec = (data) => {
    let result = 0;
    data.map((item) => (result += item.monto));
    setSumRecuperacion(result);
  };

  return (
    <div>
      <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
        {isEmpty(data) ? (
          <NoData />
        ) : (
          <Stack spacing={2}>
            <Typography variant="h5">Ventas de Contado</Typography>
            <Table
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <caption style={{ color: "#4caf50" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    variant="h6"
                    style={{ color: "#4caf50", fontWeight: "bold" }}
                  >
                    Total Ventas de Contado:
                  </Typography>
                  <Typography variant="h6" style={{ color: "#4caf50" }}>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumContadoSales)}
                  </Typography>
                </Stack>
              </caption>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>#.Factura</th>
                  <th style={{ textAlign: "left" }}>Cliente</th>
                  <th style={{ textAlign: "center" }}>Neto</th>
                  <th style={{ textAlign: "center" }}>Descuento</th>
                  <th style={{ textAlign: "center" }}>Venta Neta</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {dataVentasContado.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: "center" }}>{item.id}</td>
                      <td style={{ textAlign: "left" }}>
                        {item.client
                          ? item.client.nombreCliente
                          : item.nombreCliente === ""
                          ? "CLIENTE EVENTUAL"
                          : item.nombreCliente}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.montoVentaAntesDescuento)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.descuentoXMonto)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.montoVenta)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Divider />

            <Typography variant="h5">Recuperacion Sobre Ventas</Typography>
            <Table
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <caption style={{ color: "#357a38" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    variant="h6"
                    style={{ color: "#357a38", fontWeight: "bold" }}
                  >
                    Total de Recuperacion:
                  </Typography>
                  <Typography variant="h6" style={{ color: "#357a38" }}>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumRecuperacion)}
                  </Typography>
                </Stack>
              </caption>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>#.Abono</th>
                  <th style={{ textAlign: "center" }}>#.Factura</th>
                  <th style={{ textAlign: "left" }}>Cliente</th>
                  <th style={{ textAlign: "center" }}>Monto Abonado</th>
                  <th style={{ textAlign: "center" }}>Almacen</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {dataAbonos.map((item) => {
                  const { id, monto, sale, store } = item;
                  return (
                    <tr key={id}>
                      <td style={{ textAlign: "center" }}>{id}</td>
                      <td style={{ textAlign: "center" }}>{sale.id}</td>
                      <td style={{ textAlign: "left" }}>
                        {sale.client
                          ? sale.client.nombreCliente
                          : sale.nombreCliente === ""
                          ? "CLIENTE EVENTUAL"
                          : sale.nombreCliente}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(monto)}
                      </td>
                      <td style={{ textAlign: "center" }}>{store.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Divider />

            <Typography variant="h5">Ventas de Credito</Typography>
            <Table
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <caption style={{ color: "#ffc107" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    variant="h6"
                    style={{ color: "#ffc107", fontWeight: "bold" }}
                  >
                    Total de Ventas de Credito:
                  </Typography>
                  <Typography variant="h6" style={{ color: "#ffc107" }}>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumCreditoSales)}
                  </Typography>
                </Stack>
              </caption>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>#.Factura</th>
                  <th style={{ textAlign: "left" }}>Cliente</th>
                  <th style={{ textAlign: "center" }}>Neto</th>
                  <th style={{ textAlign: "center" }}>Descuento</th>
                  <th style={{ textAlign: "center" }}>Venta Neta</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {dataVentasCredito.map((item) => {
                  const {
                    id,
                    client,
                    montoVentaAntesDescuento,
                    descuentoXMonto,
                    montoVenta,
                    nombreCliente,
                  } = item;
                  return (
                    <tr key={id}>
                      <td style={{ textAlign: "center" }}>{id}</td>
                      <td style={{ textAlign: "left" }}>
                        {client
                          ? client.nombreCliente
                          : nombreCliente === ""
                          ? "CLIENTE EVENTUAL"
                          : nombreCliente}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(montoVentaAntesDescuento)}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(descuentoXMonto)}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(montoVenta)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Divider />

            <Typography variant="h5">Ventas de Devoluciones</Typography>
            <Table
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <caption style={{ color: "#ffc107" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    variant="h6"
                    style={{ color: "#ffc107", fontWeight: "bold" }}
                  >
                    Total de Devoluciones:
                  </Typography>
                  <Typography variant="h6" style={{ color: "#ffc107" }}>
                    {/* {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(sumCreditoSales)} */}
                  </Typography>
                </Stack>
              </caption>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>#.Factura</th>
                  <th style={{ textAlign: "left" }}>Cliente</th>
                  <th style={{ textAlign: "center" }}>Neto</th>
                  <th style={{ textAlign: "center" }}>Descuento</th>
                  <th style={{ textAlign: "center" }}>Venta Neta</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {dataDevoluciones.map((item) => {
                  const { id } = item;
                  console.log(item);
                  return (
                    <tr key={id}>
                      {/* <td style={{ textAlign: "center" }}>{id}</td>
                      <td style={{ textAlign: "left" }}>
                        {client
                          ? client.nombreCliente
                          : nombreCliente === ""
                          ? "CLIENTE EVENTUAL"
                          : nombreCliente}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(montoVentaAntesDescuento)}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(descuentoXMonto)}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(montoVenta)}
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Divider />
          </Stack>
        )}
      </Container>
    </div>
  );
};

export default CierreDiario;