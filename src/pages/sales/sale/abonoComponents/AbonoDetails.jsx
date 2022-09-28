import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  Divider,
  Container,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../../services/Account";
import moment from "moment";

import { Table } from "react-bootstrap";
import { isEmpty } from "lodash";
import NoData from "../../../../components/NoData";
import { getQuotesBySaleAsync } from "../../../../services/SalesApi";
import SmallModal from "../../../../components/modals/SmallModal";
import { AbonoBillComponent } from "./AbonoBillComponent";

const AbonoDetails = ({ selectedVenta }) => {
  // console.log(selectedVenta);
  let ruta = getRuta();
  const token = getToken();
  let navigate = useNavigate();
  const { id, fechaVenta, montoVenta, client, nombreCliente, isAnulado } =
    selectedVenta;
  const {
    reload,
    setReload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
    isDarkMode,
  } = useContext(DataContext);

  const [quoteList, setQuoteList] = useState([]);
  const [showprintModal, setShowprintModal] = useState(false);
  const [dataBill, setDataBill] = useState([]);

  const totalAbonado = () => {
    let result = 0;
    quoteList.map((item) => {
      result += item.monto;
    });
    return result;
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getQuotesBySaleAsync(token, id);
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
      setIsLoading(false);

      let abonoList = [];

      setQuoteList(result.data);

      setIsLoading(false);
    })();
  }, [reload]);

  const setDataToPrint = (data) => {
    setDataBill(data);
    setShowprintModal(true);
  };

  return (
    <div>
      <Container>
        <Divider />
        <Stack spacing={2} justifyContent="center">
          <Stack spacing={2} direction="row" justifyContent="space-between">
            <Stack spacing={2} direction="row">
              <span>Id Venta:</span>
              <span style={{ color: "#2196f3", fontWeight: "bold" }}>{id}</span>
            </Stack>

            <Stack spacing={2} direction="row">
              <span>F. Venta:</span>
              <span style={{ color: "#2196f3", fontWeight: "bold" }}>
                {moment(fechaVenta).format("L")}
              </span>
            </Stack>

            <Stack spacing={2} direction="row">
              <span>Monto Venta:</span>
              <span style={{ color: "#2196f3", fontWeight: "bold" }}>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(montoVenta)}
              </span>
            </Stack>
          </Stack>
        </Stack>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <span>Cliente:</span>
            <span
              style={{
                color: "#2196f3",
                fontWeight: "bold",
                marginLeft: 10,
              }}
            >
              {client
                ? client.nombreCliente
                : nombreCliente === ""
                ? "SIN NOMBRE"
                : nombreCliente}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <h4
            style={{
              marginTop: 20,
              color: isAnulado ? "#f50057" : "#4caf50",
            }}
          >
            Lista de Abonos
          </h4>

          <span
            style={{
              color: "#4caf50",
              fontWeight: "bold",
              marginTop: 20,
            }}
          >
            {`Saldo: ${new Intl.NumberFormat("es-NI", {
              style: "currency",
              currency: "NIO",
            }).format(0)}`}
          </span>
        </div>

        <Divider />

        {isEmpty(quoteList) ? (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <NoData />
          </div>
        ) : (
          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <caption style={{ color: "#4caf50" }}>
              <Typography variant="body1" style={{ textAlign: "right" }}>
                {`Total Abonado: ${new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(totalAbonado())}`}
              </Typography>
            </caption>
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "center" }}>Fecha Abono</th>
                <th style={{ textAlign: "center" }}>Monto Abono</th>
                <th style={{ textAlign: "center" }}># Factura</th>
                <th style={{ textAlign: "left" }}>Realizado por</th>
                <th style={{ textAlign: "center" }}>Reimprimir</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {quoteList.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td style={{ textAlign: "center" }}>
                      {moment(item.fechaAbono).format("L")}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.monto)}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.sale.id}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.realizedBy ? item.realizedBy.fullName : ""}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <IconButton
                        style={{ color: "#2979ff" }}
                        onClick={() => {
                          setDataToPrint(item);
                        }}
                      >
                        <FontAwesomeIcon icon={faPrint} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        <Divider />
      </Container>

      <SmallModal
        titulo={"Reimprimir Recibo"}
        isVisible={showprintModal}
        setVisible={setShowprintModal}
      >
        <AbonoBillComponent
          data={dataBill}
          client={client}
          multipleBill={false}
        />
      </SmallModal>
    </div>
  );
};

export default AbonoDetails;
