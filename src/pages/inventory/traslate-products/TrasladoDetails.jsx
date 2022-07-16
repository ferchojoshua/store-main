import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError } from "../../../helpers/Helpers";

import { Table } from "react-bootstrap";

import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";

import { Paper } from "@mui/material";

import { getStoresAsync } from "../../../services/AlmacenApi";

import moment from "moment";

export const TrasladoDetails = ({ selectedTransaction }) => {
  const { concepto, fecha, id, movmentDetails, user } = selectedTransaction;

  console.log(selectedTransaction);
  let ruta = getRuta();
  let navigate = useNavigate();

  const [storeList, setStoreList] = useState([]);

  const { isDarkMode, reload, setIsLoading, setIsLogged, setIsDefaultPass } =
    useContext(DataContext);

  const token = getToken();

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
  }, [reload]);

  const getStoreName = (id) => {
    const result = storeList.filter((i) => i.almacen.id === id);
    return result.length !== 0 ? result[0].almacen.name : "";
  };

  return (
    <div>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <span
              style={{ color: "#2196f3", marginRight: 10, fontWeight: "bold" }}
            >
              Id:
            </span>
            <span>{id}</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <span
              style={{ color: "#2196f3", marginRight: 10, fontWeight: "bold" }}
            >
              Fecha:
            </span>
            <span>{moment(fecha).format("L")}</span>
          </div>
        </div>
      </Paper>

      <Table hover={!isDarkMode} size="sm" responsive className="text-primary">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>#</th>
            <th style={{ textAlign: "left" }}>Producto</th>
            <th style={{ textAlign: "center" }}>Procedencia</th>
            <th style={{ textAlign: "center" }}>Cantidad</th>
            <th style={{ textAlign: "center" }}>Destino</th>
          </tr>
        </thead>
        <tbody className={isDarkMode ? "text-white" : "text-dark"}>
          {movmentDetails ? (
            movmentDetails.map((item) => {
              return (
                <tr key={item.id}>
                  <td style={{ textAlign: "center" }}>{item.id}</td>
                  <td>{item.producto.description}</td>
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

      <Paper
        elevation={10}
        style={{
          marginTop: 20,
          borderRadius: 30,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <span
              style={{ color: "#2196f3", marginRight: 10, fontWeight: "bold" }}
            >
              Concepto:
            </span>
            <span>{concepto}</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <span
              style={{ color: "#2196f3", marginRight: 10, fontWeight: "bold" }}
            >
              Realizado por:
            </span>
            <span>{user.fullName}</span>
          </div>
        </div>
      </Paper>
    </div>
  );
};
