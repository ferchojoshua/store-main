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
      console.log(result.data);
      setData(result.data);
      getAbonos(result.data);
      saleDesgloce(result.data);
      setIsLoading(false);
    })();
  }, []);

  const getAbonos = (datos) => {
    setDataAbonos(datos.abonoList);
  };

  const saleDesgloce = (datos) => {
    console.log(datos.saleList);
    let contSales = datos.saleList.map(
      (item) => item.isContado === true && item.isAnulado === false
    );
    let credSales = datos.saleList.map(
      (item) => item.isContado === false && item.isAnulado === false
    );
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
                <th style={{ textAlign: "right" }}>#.Factura</th>
                <th style={{ textAlign: "left" }}>Cliente</th>
                <th style={{ textAlign: "center" }}>Neto</th>
                <th style={{ textAlign: "center" }}>Descuento</th>
                <th style={{ textAlign: "center" }}>Venta Neta</th>
                <th style={{ textAlign: "center" }}>Utilidad</th>
              </tr>
            </thead>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default CierreDiario;
