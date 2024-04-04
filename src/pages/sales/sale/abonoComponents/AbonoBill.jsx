import React from "react";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import moment from "moment";

export const AbonoBill = React.forwardRef((props, ref) => {
  const { id, monto, fechaAbono, realizedBy, sale, store } = props.data;
  const { nombreCliente } = props.client;

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
          store.id === 1 ? require("../../../../components/media/Icono.png")
            : store.id === 2 ? require("../../../../components/media/autoFull.jpeg")
            : store.id === 3 ? require("../../../../components/media/Icono.png")
            : store.id === 8 ? require("../../../../components/media/autoFull.jpeg")
            : require("../../../../components/media/superMoto.jpeg")
        }
        alt="logo"
        style={{ height: 80 }}
      />

      <Stack>
        <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
          Recibo de Pago
        </Typography>

        <Divider />

        <Grid spacing={1} container>
          <Grid item xs={4}>
            <Stack textAlign="right">
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Recibo #:
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
              <Typography style={{ fontSize: 11 }}>2810505810009A</Typography>
              {store.id === 2 || store.id === 8 ? (
                <Typography style={{ fontSize: 11 }}>
                  Chinandega, Donde fue el Variedades 1/2 al Norte
                </Typography>
              ) : (
                <Typography style={{ fontSize: 11 }}>
                  Chinandega, Semaforos Super 7, 1/2 C. al Norte
                </Typography>
              )}
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
                Fecha:
              </Typography>

              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Cliente:
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Stack textAlign="left">
            {store.id === 2 || store.id === 8 ? (
                <Typography style={{ fontSize: 11 }}>
                  +505 7633-4531
                </Typography>
              ) : (
                <Typography style={{ fontSize: 11 }}>
                  +505 7837-6964
                </Typography>
              )}
              <Typography style={{ fontSize: 11 }}>+505 2340 2464</Typography>
              <Typography style={{ fontSize: 11 }}>
                {moment(fechaAbono).format("DD/MM/YYYY HH:mm A")}
              </Typography>
              <Typography style={{ fontSize: 11 }}>{nombreCliente}</Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
          Detalle de Pago
        </Typography>

        <Divider />

        <Grid spacing={1} container>
          <Grid item xs={4}>
            <Stack textAlign="right">
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Concepto:
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Saldo Anterior:
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Abono:
              </Typography>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
                Nuevo Saldo:
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Stack textAlign="left">
              <Typography
                style={{ fontSize: 11 }}
              >{`Abono a factura #: ${sale.id}`}</Typography>
              <Typography style={{ fontSize: 11 }}>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sale.saldo + monto)}
              </Typography>
              <Typography style={{ fontSize: 11 }}>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(monto)}
              </Typography>
              <Typography style={{ fontSize: 11 }}>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(sale.saldo)}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

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
            {realizedBy.fullName}
          </Typography>
        </Stack>

        <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
          GRACIAS POR SU ABONO
        </Typography>
      </Stack>

      <hr />
      <hr />
      <hr />
      <hr />
    </div>
  );
});
