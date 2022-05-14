import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { isAccess, toastError } from "../../../helpers/Helpers";

import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faHandHoldingDollar,
  faReplyAll,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import MediumModal from "../../../components/modals/MediumModal";
import { getSalesAsync } from "../../../services/SalesApi";
import NewAbono from "../sale/abonoComponents/NewAbono";
import SaleReturn from "../sale/returnVenta/SaleReturn";

const SalesList = () => {
  const { reload, setIsLoading, setIsDefaultPass, setIsLogged, access } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [listaVentas, setListaVentas] = useState([]);

  const [selectedVenta, setSelectedVenta] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = listaVentas.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (val.id.toString().includes(searchTerm)) {
      return val;
    }
  });

  //Para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = withSearch.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const token = getToken();

  const [showModal, setShowModal] = useState(false);

  const [showRetunModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getSalesAsync(token);
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
      setIsLoading(false);
      setListaVentas(result.data);
    })();
  }, [reload]);

  return (
    <div>
      <Container>
        <h1 style={{ textAlign: "left" }}>Lista de Ventas</h1>
        <hr />

        <TextField
          style={{ marginBottom: 20, width: 600 }}
          variant="standard"
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
          value={searchTerm}
          label={"Buscar Venta"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: "#03a9f4" }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {isEmpty(withSearch) ? (
          <NoData />
        ) : (
          <Table hover size="sm">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th>#</th>
                <th style={{ textAlign: "left" }}>Cliente</th>
                <th style={{ textAlign: "center" }}>Monto Venta</th>
                <th style={{ textAlign: "center" }}>Productos</th>
                <th style={{ textAlign: "center" }}>Cancelado</th>
                <th style={{ textAlign: "center" }}>Saldo </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "center" }}>
                      {moment(item.fechaVenta).format("L")}
                    </td>
                    <td>{item.id}</td>

                    <td
                      style={{
                        textAlign: "left",
                        color: item.isEventual ? "inherit" : "#ff5722",
                        fontWeight: item.isEventual ? "normal" : "bold",
                      }}
                    >
                      {item.isEventual
                        ? item.nombreCliente === ""
                          ? "CLIENTE EVENTUAL - S/N"
                          : `CLIENTE EVENTUAL - ${item.nombreCliente}`
                        : item.client.nombreCliente}
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#03a9f4",
                      }}
                    >
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.montoVenta)}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {item.productsCount}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {
                        <FontAwesomeIcon
                          style={{
                            fontSize: 25,
                            marginTop: 5,
                            color: item.isCanceled ? "#4caf50" : "#f50057",
                          }}
                          icon={item.isCanceled ? faCircleCheck : faCircleXmark}
                        />
                      }
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: "bold",
                          color: item.isCanceled ? "#4caf50" : "#f50057",
                        }}
                      >
                        {new Intl.NumberFormat("es-NI", {
                          style: "currency",
                          currency: "NIO",
                        }).format(item.saldo)}
                      </Typography>
                      {item.isCanceled ? (
                        <></>
                      ) : (
                        <Typography
                          style={{
                            color:
                              moment(item.fechaVencimiento).format("L") >
                              moment(new Date()).format("L")
                                ? "#03a9f4"
                                : "#f50057",
                            fontSize: 13,
                          }}
                        >
                          {`Vence: ${moment(item.fechaVencimiento).format(
                            "L"
                          )}`}
                        </Typography>
                      )}
                    </td>

                    <td style={{ width: 150 }}>
                      {item.isCanceled ? (
                        <></>
                      ) : isAccess(access, "SALES CREATE") ? (
                        <Tooltip title="Abonar">
                          <IconButton
                            style={{ color: "#ff9100" }}
                            onClick={() => {
                              setSelectedVenta(item);
                              setShowModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faHandHoldingDollar} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <></>
                      )}
                      <IconButton
                        style={{ color: "#009688" }}
                        onClick={() => {
                          setSelectedVenta(item);
                          setShowReturnModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faReplyAll} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <PaginationComponent
          data={withSearch}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>

      <MediumModal
        titulo={"Abonar"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <NewAbono selectedVenta={selectedVenta} />
      </MediumModal>

      <MediumModal
        titulo={"Devolver Producto"}
        isVisible={showRetunModal}
        setVisible={setShowReturnModal}
      >
        <SaleReturn
          selectedVenta={selectedVenta}
          setVisible={setShowReturnModal}
        />
      </MediumModal>
    </div>
  );
};

export default SalesList;
