import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toastError } from "../../../helpers/Helpers";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import MediumModal from "../../../components/modals/MediumModal";

import { getCashMovmentByStore } from "../../../services/CashMovmentsApi";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import SmallModal from "../../../components/modals/SmallModal";
import AddCashOut from "./AddCashOut";

const CashMovements = () => {
  const { reload, setIsLoading, setIsDefaultPass, setIsLogged, access } =
    useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [cashMovmentsList, setCashMovmentsList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const token = getToken();
  const [showModal, setShowModal] = useState(false);

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
          navigate("/unauthorized");
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
        navigate("/unauthorized");
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

  return (
    <div>
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Movimientos de Efectivo</h1>

          <div>
            <FormControl
              variant="standard"
              fullWidth
              style={{
                textAlign: "left",
                width: 200,
                marginRight: 20,
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

            <Button
              variant="outlined"
              style={{
                borderRadius: 20,
                borderColor: "#f50057",
                color: "#f50057",
                marginTop: 10,
                width: 200,
              }}
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Salida de efectivo
            </Button>
          </div>
        </div>

        <hr />
        {isEmpty(cashMovmentsList) ? (
          <NoData />
        ) : (
          <Table hover size="sm">
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

            <tbody>
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
        titulo={"Salida de Efectivo"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <AddCashOut />
      </SmallModal>
    </div>
  );
};

export default CashMovements;
