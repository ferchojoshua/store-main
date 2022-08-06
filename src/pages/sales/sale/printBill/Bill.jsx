import React from "react";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import moment from "moment";
import { Table } from "react-bootstrap";
import { isEmpty } from "lodash";

export const Bill = React.forwardRef((props, ref) => {
  const {
    id,
    client,
    facturedBy,
    fechaVenta,
    fechaVencimiento,
    isContado,
    isEventual,
    montoVenta,
    nombreCliente,
    saldo,
    saleDetails,
    store,
  } = props.data;

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
          store.id === 4
            ? require("../../../../components/media/superMoto.jpeg")
            : require("../../../../components/media/Icono.png")
        }
        alt="logo"
        style={{ height: 80 }}
      />
      <Stack>
        <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
          Recibo de Compra
        </Typography>

        <Divider />

        <Grid spacing={1} container>
          <Grid item xs={4}>
            <Stack textAlign="right">
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                FACTURA:
              </Typography>
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
              <Typography style={{ fontSize: 11 }}>{id}</Typography>
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
              {isContado ? (
                <></>
              ) : (
                <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                  Vence:
                </Typography>
              )}
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
                {moment(fechaVenta).format("DD/MM/YYYY HH:mm A")}
              </Typography>
              {isContado ? (
                <></>
              ) : (
                <Typography style={{ fontSize: 11 }}>
                  {moment(fechaVencimiento).format("L")}
                </Typography>
              )}
              {isEmpty(client) ? (
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

        <Divider />

        <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
          Detalle de Compra
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
                <tr key={item.id}>
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
            Gestor:
          </Typography>
          <Typography style={{ fontSize: 11 }}>
            {facturedBy.fullName}
          </Typography>
        </Stack>

        <Stack display={"flex"} justifyContent="space-between" direction="row">
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

          {isContado ? (
            <Stack
              display="flex"
              spacing={1}
              direction="row"
              justifyContent={"center"}
            >
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Saldo:
              </Typography>
              <Typography style={{ fontSize: 11 }}>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(saldo)}
              </Typography>
            </Stack>
          ) : (
            <Stack
              display="flex"
              spacing={1}
              direction="row"
              justifyContent={"center"}
            >
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Dias de Credito:
              </Typography>
              <Typography style={{ fontSize: 11 }}>15</Typography>
            </Stack>
          )}
        </Stack>

        <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
          NO SE ACEPTAN DEVOLUCIONES
        </Typography>
      </Stack>

      <hr />
      <hr />
      <hr />
      <hr />
    </div>
  );
});
