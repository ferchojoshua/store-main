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
import { printProdHistoryAsync } from "../../../../services/ContabilidadApi";
import { Table } from "react-bootstrap";

export const ReportExistences = ({
  selectedStore,
  setSelectedStore,
  fecha,
  setFecha,
}) => {
  const [data, setData] = useState([]);

  const { setIsLoading, setIsDefaultPass, setIsLogged, access, isDarkMode } =
    useContext(DataContext);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  useEffect(() => {
    (async () => {
      const datos = {
        fecha,
        storeId: selectedStore,
      };
      setSelectedStore("");
      setFecha(new Date());

      setIsLoading(true);
      const result = await printProdHistoryAsync(token, datos);
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
            className="text-primary table-striped"
          >
            <thead style={{ position: "sticky", top: 0, margin: 0 }}>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "left" }}>Producto</th>
                <th style={{ textAlign: "center" }}>C.Barras</th>
                <th style={{ textAlign: "center" }}>T. Negocio</th>
                <th style={{ textAlign: "center" }}>Existencia</th>
                <th style={{ textAlign: "center" }}>Almacen</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {data.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "left" }}>{item.producto.id}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.producto.description}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.producto.barCode}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.producto.tipoNegocio}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.existencia}</td>
                    <td style={{ textAlign: "center" }}>{item.almacen.name}</td>
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
              Total de Productos
            </span>
            <span>{new Intl.NumberFormat("es-NI").format(data.length)}</span>
          </Stack>
        </Stack>
        <hr />
      </Container>
    </div>
  );
};
