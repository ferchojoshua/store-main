import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getRuta, isAccess, toastError } from "../../../helpers/Helpers";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";

import { getCashMovmentByStore } from "../../../services/CashMovmentsApi";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import SmallModal from "../../../components/modals/SmallModal";

import { AddCashMovment } from "./AddCashMovment";

const CashMovements = () => {
  let ruta = getRuta();

  const {
    isDarkMode,
    reload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
  let navigate = useNavigate();

  const [cashMovmentsList, setCashMovmentsList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const token = getToken();
  const [showModal, setShowModal] = useState(false);
  const [isEntrada, setIsEntrada] = useState(false);

  //Para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = cashMovmentsList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStore = await getStoresByUserAsync(token);
      if (!resultStore.statusResponse) {
        setIsLoading(false);
        toastError(resultStore.error.message);
        return;
      }

      if (resultStore.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultStore.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setIsLoading(false);
      setStoreList(resultStore.data);

      setSelectedStore(resultStore.data[0].id);
      const result = await getCashMovmentByStore(token, resultStore.data[0].id);

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
      setCashMovmentsList(result.data);
    })();
  }, [reload]);

  const onStoreChange = async (value) => {
    setSelectedStore(value);
    setIsLoading(true);
    const result = await getCashMovmentByStore(token, value);
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
    setCashMovmentsList(result.data);
    setIsLoading(false);
  };

  const addMovment = (value) => {
    setIsEntrada(value);
    setShowModal(true);
  };

  return (
    <div>
      <Container>
        <Grid container spacing={3} direction="row">
          <Grid item xs={6} sm={4} lg={5} xl={6}>
            <h1>Movimientos de Efectivo</h1>
          </Grid>

          {isAccess(access, "CAJA CREATE") ? (
            <Grid item xs={6} sm={8} lg={7} xl={6}>
              <Grid container spacing={3} direction="row">
                <Grid item xs={12} md={12} lg={4}>
                  <FormControl
                    variant="standard"
                    style={{
                      textAlign: "left",
                    }}
                  >
                    <InputLabel id="selProc">Seleccione un Almacen</InputLabel>
                    <Select
                      labelId="selProc"
                      id="demo-simple-select-standard"
                      value={selectedStore}
                      onChange={(e) => onStoreChange(e.target.value)}
                    >
                      {storeList.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <Button
                    variant="outlined"
                    style={{
                      borderRadius: 20,
                      borderColor: "#4caf50",
                      color: "#4caf50",
                      marginTop: 10,
                      width: 200,
                    }}
                    startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
                    onClick={() => {
                      addMovment(true);
                    }}
                  >
                    Efectivo
                  </Button>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <Button
                    variant="outlined"
                    style={{
                      borderRadius: 20,
                      borderColor: "#f50057",
                      color: "#f50057",
                      marginTop: 10,
                      width: 200,
                    }}
                    startIcon={<FontAwesomeIcon icon={faCircleMinus} />}
                    onClick={() => {
                      addMovment(false);
                    }}
                  >
                    Efectivo
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>

        <hr />
        {isEmpty(cashMovmentsList) ? (
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
                <th style={{ textAlign: "center" }}>#</th>
                <th style={{ textAlign: "left" }}>Fecha</th>
                <th style={{ textAlign: "left" }}>Descripcion</th>
                <th style={{ textAlign: "center" }}>Entradas</th>
                <th style={{ textAlign: "center" }}>Salidas</th>
                <th style={{ textAlign: "center" }}>Saldo</th>
                <th style={{ textAlign: "left" }}>Realizado Por</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "center" }}>{item.id}</td>
                    <td style={{ textAlign: "left" }}>
                      {moment(item.fecha).format("L")}
                    </td>
                    <td style={{ textAlign: "left" }}>{item.description}</td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.entradas)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.salidas)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.saldo)}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item.realizadoPor.fullName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        <PaginationComponent
          data={cashMovmentsList}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>

      <SmallModal
        titulo={isEntrada ? "Entrada de Efectivo" : "Salida de Efectivo"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <AddCashMovment
          setShowOutModal={setShowModal}
          selectedStore={selectedStore}
          isEntrada={isEntrada}
        />
      </SmallModal>
    </div>
  );
};

export default CashMovements;
