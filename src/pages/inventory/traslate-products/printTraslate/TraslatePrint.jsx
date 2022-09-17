import React, { useContext, useEffect, useState } from "react";
import { Container, Divider, Paper, Stack, Typography } from "@mui/material";
import moment from "moment";
import { Table } from "react-bootstrap";
import { isEmpty } from "lodash";
import { DataContext } from "../../../../context/DataContext";
import logo from "../../../../components/media/Icono.png";
import NoData from "../../../../components/NoData";
import { getStoresAsync } from "../../../../services/AlmacenApi";
import { useNavigate } from "react-router-dom";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { getRuta, toastError } from "../../../../helpers/Helpers";

export const TraslatePrint = React.forwardRef((props, ref) => {
  const [storeList, setStoreList] = useState([]);
  const { title, isDarkMode, setIsLoading, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);
  const getPageMargins = () => {
    return `body
    {
      margin: 0mm 10mm 0mm 10mm;
      padding-top:15mm;
      padding-bottom:15mm;
    }`;
  };
  const { concepto, fecha, id, movmentDetails, user } = props.data;
  const token = getToken();
  let ruta = getRuta();
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStores = await getStoresAsync(token);
      if (!resultStores.statusResponse) {
        setIsLoading(false);
        if (resultStores.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultStores.error.message);
        return;
      }

      if (resultStores.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultStores.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setStoreList(resultStores.data);
      setIsLoading(false);
    })();
  }, []);

  const getStoreName = (id) => {
    const result = storeList.filter((i) => i.almacen.id === id);
    return result.length !== 0 ? result[0].almacen.name : "";
  };

  return (
    <div
      ref={ref}
      style={{
        padding: 30,
        textAlign: "center",
      }}
    >
      {/* <style>{getPageMargins()}</style> */}
      <Stack justifyContent={"space-between"} direction="row">
        <img loading="lazy" src={logo} alt="logo" style={{ height: 50 }} />
        <Stack display="flex" justifyContent="center">
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >{`${title} - Chinandega`}</Typography>
          <Typography
            sx={{
              color: "#2196f3",
              textAlign: "center",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            Comprobante de Traslado de Inventario
          </Typography>
          <span style={{ textAlign: "center", fontSize: 12 }}>
            {moment(fecha).format("L")}
          </span>
        </Stack>

        <img loading="lazy" src={logo} alt="logo" style={{ height: 50 }} />
      </Stack>

      <hr />

      <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
        {isEmpty(props.data) ? (
          <NoData />
        ) : (
          <Stack spacing={2}>
            <Stack direction={"row"} spacing={2}>
              <Stack>
                <Stack spacing={1} direction="row">
                  <Typography color={"#1c54b2"}>Id Traslado:</Typography>
                  <Typography>{id}</Typography>
                </Stack>
                <Stack spacing={1} direction="row">
                  <Typography color={"#1c54b2"}>Emitido por:</Typography>
                  <Typography>{user.fullName}</Typography>
                </Stack>
              </Stack>
              <Stack>
                <Typography textAlign={"left"}>Concepto:</Typography>
                <Typography textAlign={"left"}>{concepto}</Typography>
              </Stack>
            </Stack>
            <Typography textAlign={"left"} style={{ fontWeight: "bold" }}>
              Detalle:
            </Typography>

            <Table
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <caption>
                <Stack direction="row" justifyContent={"space-between"}>
                  <Stack spacing={1} direction="row">
                    <Typography color={"#1c54b2"} fontWeight="bold">
                      Total de Registros:
                    </Typography>
                    <Typography fontWeight="bold">
                      {movmentDetails.length}
                    </Typography>
                  </Stack>
                </Stack>
              </caption>
              <thead>
                <tr>
                  <th style={{ textAlign: "right" }}>C. Barras</th>
                  <th style={{ textAlign: "left" }}>Producto</th>
                  <th style={{ textAlign: "center" }}>Procedencia</th>
                  <th style={{ textAlign: "center" }}>Cantidad</th>
                  <th style={{ textAlign: "center" }}>Destino</th>
                </tr>
              </thead>
              <tbody className={"text-dark"}>
                {movmentDetails ? (
                  movmentDetails.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td style={{ textAlign: "right" }}>
                          {item.producto.barCode}
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {item.producto.description}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {getStoreName(item.almacenProcedenciaId)}
                        </td>
                        <td style={{ textAlign: "center" }}>{item.cantidad}</td>
                        <td style={{ textAlign: "center" }}>
                          {getStoreName(item.almacenDestinoId)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <></>
                )}
              </tbody>
            </Table>
          </Stack>
        )}
      </Container>
    </div>
  );
});
