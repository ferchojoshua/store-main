import React, { useEffect, useContext, useState } from "react";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import moment from "moment";
import { Table } from "react-bootstrap";
import { isUndefined } from "lodash";
import { DataContext } from "../../../../context/DataContext";
import { getClientByIdAsync } from "../../../../services/ClientsApi";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  deleteToken,
  deleteUserData,
  getToken,
  getUser,
} from "../../../../services/Account";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import { getStoreByIdAsync } from "../../../../services/AlmacenApi";
import { getLogoByStoreIdAsync } from "../../../../services/CreateLogoApi";
 import "../../../sales/estilos.css"

const Proforma = React.forwardRef((props, ref) => {
  const { idClient, storeid, montoVenta, nombreCliente, ProformasDetails = [] } = props.data;
  
  const navigate = useNavigate();

  const { setIsLoading, setIsLogged, setIsDefaultPass } = useContext(DataContext);
  const token = getToken();
  const user = getUser();

  const ruta = getRuta();
  const [client, setClient] = useState([]);
  const [store, setStore] = useState([]);
  const [storeLogo, setStoreLogo] = useState(null);
   const [stores, setStores] = useState([]);

  const hoy = new Date();

  useEffect(() => {
    const fetchStoreLogoAndData = async () => {
      setIsLoading(true);
      try {
        const resultStore = await getStoreByIdAsync(token, storeid);
        if (!resultStore.statusResponse) {
          if (resultStore.error.request.status === 401) {
            navigate(`${ruta}/unauthorized`);
            return;
          }
          toastError(resultStore.error.message);
          return;
        }
        if (resultStore.data === "eX01") {
          deleteUserData();
          deleteToken();
          setIsLogged(false);
          return;
        }
        if (resultStore.data.isDefaultPass) {
          setIsDefaultPass(true);
          return;
        }
        setStores(resultStore.data);

        // Fetch the store logo
        const logoResult = await getLogoByStoreIdAsync(token, storeid);
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
          return null;
        }

        if (logoResult.data.isDefaultPass) {
          setIsDefaultPass(true);
          return null;
        }
        
        const imageUrl = `data:image/jpeg;base64,${logoResult.data.imagenBase64}`;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          setStoreLogo(imageUrl);
        };   
        setStore(logoResult.data);
      } catch (error) {
        toastError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreLogoAndData();
  }, [storeid, token, navigate, ruta, setIsLoading, setIsLogged, setIsDefaultPass]);

  useEffect(() => {
    const fetchClientData = async () => {
      if (isUndefined(idClient)) return;

      setIsLoading(true);
      try {
        const resultClient = await getClientByIdAsync(token, idClient);
        if (!resultClient.statusResponse) {
          if (resultClient.error.request.status === 401) {
            navigate(`${ruta}/unauthorized`);
            return;
          }
          toastError(resultClient.error.message);
          return;
        }

        if (resultClient.data === "eX01") {
          deleteUserData();
          deleteToken();
          setIsLogged(false);
          return;
        }

        if (resultClient.data.isDefaultPass) {
          setIsDefaultPass(true);
          return;
        }

        setClient(resultClient.data);
      } catch (error) {
        toastError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [idClient, token, navigate, ruta, setIsLoading, setIsLogged, setIsDefaultPass]);
  

  return (
    <div ref={ref} style={{ paddingRight: 10, textAlign: "center" }}>
     {storeLogo && ( <img loading="lazy" src={storeLogo} alt="logo" style={{ height: 60 }} />)}      
      <Stack>
      <Typography style={{ 
      fontWeight: "bold", 
      fontSize: 16,
      textAlign: 'center',
      marginBottom: '15px'
    }}>
      PROFORMA
    </Typography>

        <Divider style={{ margin: '10px 0' }} />
        <div style={{ 
      width: '400px',  // Ancho ajustable según necesites
      margin: '0 auto',
      marginBottom: '20px'
    }}>
   <Grid container spacing={1} >
          <Grid item xs={5}>
            <Stack textAlign="right">
                <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Agencia:</Typography>
                <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Ruc:</Typography>
                <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Dirección:</Typography>
              </Stack>
            </Grid>

            <Grid item xs={7}>
              <Stack textAlign="left">
                <Typography style={{ fontSize: 11 }}>{stores.name}</Typography>
                <Typography style={{ fontSize: 11 }}>{store.ruc}</Typography>
                <Typography style={{ fontSize: 11,   whiteSpace: 'normal', wordBreak: 'break-word',  lineHeight: '1.2',marginTop: '0'}}>{store.direccion}</Typography>
              </Stack>
            </Grid>
          </Grid>
          
          <Grid container spacing={1} >
          <Grid item xs={5}>
            <Stack textAlign="right">
                <Typography style={{ fontWeight: "bold", fontSize: 11 }}>WhatsApp:</Typography>
                <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Teléfono:</Typography>
                <Typography style={{ fontWeight: "bold", fontSize: 11 }}>F. Emisión:</Typography>
                <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Vence:</Typography>
                <Typography style={{ fontWeight: "bold", fontSize: 11 }}>Cliente:</Typography>
              </Stack>
            </Grid>

            <Grid item xs={7}>
              <Stack textAlign="Left">
                <Typography style={{ fontSize: 11 }}>{store.telefonoWhatsApp}</Typography>
                <Typography style={{ fontSize: 11 }}>{store.telefono}</Typography>
                <Typography style={{ fontSize: 11 }}>{moment(hoy).format("L")}</Typography>
                <Typography style={{ fontSize: 11 }}>{moment(hoy).add(15, "d").format("L")}</Typography>
                <Typography style={{ fontSize: 11 }}>
                  {idClient == null
                    ? nombreCliente === ""
                      ? "Cliente Eventual"
                      : nombreCliente
                    : client.nombreCliente}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          </div>

      
        <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
          DETALLE DE PROFORMA
        </Typography>

   
        <Table size="sm" responsive className="proforma-table">
    <thead>
      <tr>
        <th style={{ textAlign: "left", fontSize: 11 }}>Detalle</th>
        <th style={{ textAlign: "center", fontSize: 11 }}>P/Unit</th>
        <th style={{ textAlign: "center", fontSize: 11 }}>Cantidad</th>
        <th style={{ textAlign: "center", fontSize: 11 }}>Total</th>
      </tr>
    </thead>
    <tbody>
      {ProformasDetails.map((item) => (
        <tr key={ProformasDetails.indexOf(item) + 1}>
          <td style={{ fontWeight: "monospace", textAlign: "left", fontSize: 11, wordWrap: 'break-word' }}>
            {item.product.description}
          </td>
          <td style={{ fontWeight: "monospace", textAlign: "center", fontSize: 11 }}>
            {new Intl.NumberFormat("es-NI", {
              style: "currency",
              currency: "NIO",
            }).format(item.costoUnitario)}
          </td>
          <td style={{ fontWeight: "monospace", textAlign: "center", fontSize: 11 }}>
            {item.cantidad}
          </td>
          <td style={{ fontWeight: "monospace", textAlign: "center", fontSize: 11 }}>
            {new Intl.NumberFormat("es-NI", {   
              style: "currency",
              currency: "NIO",
            }).format(item.costoTotal)}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>


  <Stack className="total-amount">
  <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
    Monto Total:
  </Typography>
  <Typography style={{ fontWeight: "bold", fontSize: 11 }}>
    {new Intl.NumberFormat("es-NI", {
      style: "currency",
      currency: "NIO",
    }).format(montoVenta)}
  </Typography>
</Stack>


        <Stack  className="footer-info">
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