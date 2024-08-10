import React, { useEffect, useState , useContext} from "react";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import { DataContext } from "../../../../context/DataContext";
import moment from "moment";
import { Table } from "react-bootstrap";
import { isEmpty } from "lodash";import {
  deleteToken,
  deleteUserData,
  getToken,
  getUser,
} from "../../../../services/Account";
import { useNavigate } from "react-router-dom";
import { getLogoByStoreIdAsync } from "../../../../services/CreateLogoApi";
import { getRuta, toastError } from "../../../../helpers/Helpers";


export const Bill = React.forwardRef((props, ref) => {
  const {
    id,
    client,
    facturedBy,
    fechaVenta,
    fechaVencimiento,
    isContado,
    montoVenta,
    nombreCliente,
    saldo,
    saleDetails,
    store,
    montoVentaAntesDescuento,
    descuentoXMonto,
  } = props.data;

  const [storeLogo, setStoreLogo] = useState(null);
  const navigate = useNavigate();
  
  const token = getToken();
  const ruta = getRuta();
  const { setIsLoading, setIsLogged, setIsDefaultPass } = useContext(DataContext);
  const [stores, setStores] = useState([]);

  

  // useEffect(() => {
  //   const fetchLogo = async () => {
  //     try {
  //       const response = await getLogoByStoreIdAsync(store.id);
  //       setStoreLogo(response.imagenBase64);
  //     } catch (error) {
  //       console.error("Error al obtener el logo:", error);
  //     }
  //   };

  //   fetchLogo();
  // }, [store.id]);

  
        // Fetch the store logo
        useEffect(() => {
          const fetchLogo = async () => {
            try {
              const logoResult = await getLogoByStoreIdAsync(token,  store.storeid);
        
              if (!logoResult.statusResponse) {
                if (logoResult.error?.request?.status === 401) {
                  navigate(`${ruta}/unauthorized`);
                  return;
                }
                toastError(logoResult.error.message);
                return;
              }
        
              if (logoResult.data === "eX01") {
                deleteUserData();
                deleteToken();
                setIsLogged(false);
                return;
              }
        
              if (logoResult.data.isDefaultPass) {
                setIsDefaultPass(true);
                return;
              }
        
              const imageUrl = `data:image/jpeg;base64,${logoResult.data.imagenBase64}`;
              setStoreLogo(imageUrl);
              setStores(logoResult.data);
            } catch (error) {
              toastError(error.message);
            } finally {
              setIsLoading(false);
            }
          };
        
          fetchLogo();
        }, [store.storeid, token, navigate, ruta, setIsLoading, setIsLogged, setIsDefaultPass]);
        


  
  return (
    <div
      ref={ref}
      style={{
        paddingRight: 10,
        textAlign: "center",
      }}
    >
       {storeLogo ? (
        <img loading="lazy" src={storeLogo} alt="logo" style={{ height: 80 }} />
      ) : (
        <p>Cargando logotipo...</p>
      )}
      <Stack textAlign="center">
        <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
          FACTURA
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
              <Typography style={{ fontSize: 11 }}>{store.ruc}</Typography>
              <Typography style={{ fontSize: 11 }}>{store.direccion}</Typography>
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
              {!isContado && (
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
              <Typography style={{ fontSize: 11 }}>{store.telefonoWhatsApp}</Typography>
              <Typography style={{ fontSize: 11 }}>{store.telefono}</Typography>
              <Typography style={{ fontSize: 11 }}>
                {moment(fechaVenta).format("DD/MM/YYYY HH:mm A")}
              </Typography>
              {!isContado && (
                <Typography style={{ fontSize: 11 }}>
                  {moment(fechaVencimiento).format("L")}
                </Typography>
              )}
              <Typography style={{ fontSize: 11 }}>
                {isEmpty(client) ? (nombreCliente === "" ? "Cliente Eventual" : nombreCliente) : client.nombreCliente}
              </Typography>
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
              <th style={{ textAlign: "left", fontSize: 10 }}>Detalle</th>
              <th style={{ textAlign: "center", fontSize: 10 }}>Cant.</th>
              <th style={{ textAlign: "center", fontSize: 10 }}>P. Unit</th>
              <th style={{ textAlign: "center", fontSize: 10 }}>Desc</th>
              <th style={{ textAlign: "center", fontSize: 10 }}>Total</th>
            </tr>
          </thead>

          <tbody>
            {saleDetails.map((item) => (
              <tr key={item.id}>
                <td style={{ textAlign: "left", fontSize: 9 }}>
                  {item.product.description}
                </td>
                <td style={{ textAlign: "center", fontSize: 9 }}>
                  {item.cantidad}
                </td>
                <td style={{ textAlign: "center", fontSize: 9 }}>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(item.costoUnitario)}
                </td>
                <td style={{ textAlign: "center", fontSize: 9 }}>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(item.descuento * item.cantidad)}
                </td>
                <td style={{ textAlign: "center", fontSize: 9 }}>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                  }).format(item.costoTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Stack justifyContent="right">
          <Stack display="flex" spacing={1} direction="row" justifyContent={"right"}>
            <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Sub Total:</Typography>
            <Typography style={{ fontSize: 11 }}>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(montoVentaAntesDescuento)}
            </Typography>
          </Stack>

          <Stack display="flex" spacing={1} direction="row" justifyContent={"right"}>
            <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Descuento:</Typography>
            <Typography style={{ fontSize: 11 }}>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(descuentoXMonto)}
            </Typography>
          </Stack>

          <Stack display="flex" spacing={1} direction="row" justifyContent={"right"}>
            <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Monto Total:</Typography>
            <Typography style={{ fontSize: 11 }}>
              {new Intl.NumberFormat("es-NI", {
                style: "currency",
                currency: "NIO",
              }).format(montoVenta)}
            </Typography>
          </Stack>

          {isContado ? (
            <Stack display="flex" spacing={1} direction="row" justifyContent={"right"}>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Saldo:</Typography>
              <Typography style={{ fontSize: 11 }}>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(saldo)}
              </Typography>
            </Stack>
          ) : (
            <Stack display="flex" spacing={1} direction="row" justifyContent={"left"}>
              <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Dias de Credito:</Typography>
              <Typography style={{ fontSize: 11 }}>15</Typography>
            </Stack>
          )}
        </Stack>

        <Stack display="flex" spacing={1} direction="row" justifyContent={"center"}>
          <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Gestor:</Typography>
          <Typography style={{ fontSize: 11 }}>{facturedBy.fullName}</Typography>
        </Stack>

        <Typography style={{ fontWeight: "bold", fontSize: 11 }}>GRACIAS POR SU COMPRA!</Typography>
        <Typography style={{ fontWeight: "bold", fontSize: 11 }}>NO SE ACEPTAN DEVOLUCIONES</Typography>
      </Stack>

      <hr />
      <hr />
      <hr />
      <hr />
    </div>
  );
});
