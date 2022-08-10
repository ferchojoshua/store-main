import React, { useEffect, useContext, useState } from "react";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import moment from "moment";
import { Table } from "react-bootstrap";
import { isUndefined } from "lodash";
import { DataContext } from "../../../../context/DataContext";
import { getClientByIdAsync } from "../../../../services/ClientsApi";
import {
  deleteToken,
  deleteUserData,
  getToken,
  getUser,
} from "../../../../services/Account";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import { getStoreByIdAsync } from "../../../../services/AlmacenApi";

const Proforma = React.forwardRef((props, ref) => {
  const { idClient, storeid, montoVenta, nombreCliente, saleDetails } =
    props.data;

  let navigate = useNavigate();

  const { setIsLoading, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  const token = getToken();
  const user = getUser();

  let ruta = getRuta();
  const [client, setClient] = useState([]);
  const [store, setStore] = useState([]);

  const hoy = new Date();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (!isUndefined(idClient)) {
        const resultClient = await getClientByIdAsync(token, idClient);
        if (!resultClient.statusResponse) {
          setIsLoading(false);
          if (resultClient.error.request.status === 401) {
            navigate(`${ruta}/unauthorized`);
            return;
          }
          toastError(resultClient.error.message);
          return;
        }

        if (resultClient.data === "eX01") {
          setIsLoading(false);
          deleteUserData();
          deleteToken();
          setIsLogged(false);
          return;
        }

        if (resultClient.data.isDefaultPass) {
          setIsLoading(false);
          setIsDefaultPass(true);
          return;
        }

        setClient(resultClient.data);
      }

      const result = await getStoreByIdAsync(token, storeid);
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
      setStore(result.data);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        paddingRight: 10,
        textAlign: "center",
      }}
    >
      <img
        loading="lazy"
        src={
          store.id === 1
            ? require("../../../../components/media/Icono.png")
            : store.id === 2
            ? require("../../../../components/media/autoFull.jpeg")
            : store.id === 3
            ? require("../../../../components/media/Icono.png")
            : require("../../../../components/media/superMoto.jpeg")
        }
        alt="logo"
        style={{ height: 80 }}
      />

      <Stack>
        <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
          PROFORMA
        </Typography>

        <Divider />

        <Grid spacing={1} container>
          <Grid item xs={4}>
            <Stack textAlign="right">
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Agencia:
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Ruc:
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Direccion:
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={8}>
            <Stack textAlign="left">
              <Typography style={{ fontSize: 11 }}>{store.name}</Typography>
              <Typography style={{ fontSize: 11 }}>2810505580009A</Typography>
              <Typography style={{ fontSize: 11 }}>
                Chinandega, Semaforos Super 7, 1/2 C. al Norte
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Grid spacing={1} container>
          <Grid item xs={4}>
            <Stack textAlign="right">
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                WhatsApp:
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Telefono:
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                F. Emision:
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Vence:
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Cliente:
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={8}>
            <Stack textAlign="left">
              <Typography style={{ fontSize: 11 }}>+505 7837-6964</Typography>
              <Typography style={{ fontSize: 11 }}>+505 2340 2464</Typography>
              <Typography style={{ fontSize: 11 }}>
                {moment(hoy).format("L")}
              </Typography>

              <Typography style={{ fontSize: 11 }}>
                {moment(hoy).add(15, "d").format("L")}
              </Typography>

              {isUndefined(idClient) ? (
                <Typography style={{ fontSize: 11 }}>
                  {nombreCliente === "" ? "Cliente Eventual" : nombreCliente}
                </Typography>
              ) : (
                <Typography style={{ fontSize: 11 }}>
                  {client.nombreCliente}
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
          DETALLE DE PROFORMA
        </Typography>

        <Table size="sm" responsive>
          <thead>
            <tr>
              <th style={{ textAlign: "left", fontSize: 11 }}>Detalle</th>
              <th style={{ textAlign: "center", fontSize: 11 }}>P/Unit</th>
              <th style={{ textAlign: "center", fontSize: 11 }}>Cantidad</th>
              <th style={{ textAlign: "center", fontSize: 11 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {saleDetails.map((item) => {
              return (
                <tr key={saleDetails.indexOf(item) + 1}>
                  <td style={{ textAlign: "left", fontSize: 11 }}>
                    {item.product.description}
                  </td>
                  <td style={{ textAlign: "center", fontSize: 11 }}>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(item.costoUnitario)}
                  </td>
                  <td style={{ textAlign: "center", fontSize: 11 }}>
                    {item.cantidad}
                  </td>
                  <td style={{ textAlign: "center", fontSize: 11 }}>
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(item.costoTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Stack
          display="flex"
          spacing={1}
          direction="row"
          justifyContent={"center"}
        >
          <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
            Monto Total:
          </Typography>
          <Typography style={{ fontSize: 11 }}>
            {new Intl.NumberFormat("es-NI", {
              style: "currency",
              currency: "NIO",
            }).format(montoVenta)}
          </Typography>
        </Stack>

        <Stack
          display="flex"
          spacing={1}
          direction="row"
          justifyContent={"center"}
        >
          <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
            Gestor:
          </Typography>
          <Typography style={{ fontSize: 11 }}>{user}</Typography>
        </Stack>
      </Stack>

      <hr />
      <hr />
      <hr />
      <hr />
    </div>
  );
});

export default Proforma;
