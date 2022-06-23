import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getRuta, isAccess, toastError } from "../../../helpers/Helpers";

import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faExternalLinkAlt,
  faHandHoldingDollar,
  faMoneyBillTransfer,
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
import {
  getAnulatedSalesByStoreAsync,
  getContadoSalesByStoreAsync,
  getCreditoSalesByStoreAsync,
} from "../../../services/SalesApi";
import NewAbono from "../sale/abonoComponents/NewAbono";
import SaleReturn from "../sale/returnVenta/SaleReturn";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";

const SalesList = () => {
  let ruta = getRuta();

  const {
    reload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
    isDarkMode,
  } = useContext(DataContext);
  let navigate = useNavigate();
  const [listaVentas, setListaVentas] = useState([]);

  const [selectedVenta, setSelectedVenta] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const withSearch = listaVentas.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.id.toString().includes(searchTerm) ||
      val.client.nombreCliente.toString().includes(searchTerm)
    ) {
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

  const [active, setActive] = useState(0);

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const resultStores = await getStoresByUserAsync(token);
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

      if (selectedStore === "") {
        setSelectedStore(resultStores.data[0].id);

        const result = await getContadoSalesByStoreAsync(
          token,
          resultStores.data[0].id
        );
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
        setListaVentas(result.data);
      } else {
        onSelectChange(active);
      }
      setIsLoading(false);
    })();
  }, [reload]);

  const handleChangeStore = async (event) => {
    setSelectedStore(event.target.value);
    if (active === 0) {
      setIsLoading(true);
      const result = await getContadoSalesByStoreAsync(
        token,
        event.target.value
      );
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
      setIsLoading(false);
      setListaVentas(result.data);
    } else if (active === 1) {
      setIsLoading(true);
      const result = await getCreditoSalesByStoreAsync(
        token,
        event.target.value
      );
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
      setIsLoading(false);
      setListaVentas(result.data);
    } else {
      setIsLoading(true);
      const result = await getAnulatedSalesByStoreAsync(
        token,
        event.target.value
      );
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
      setIsLoading(false);
      setListaVentas(result.data);
    }
  };

  const onSelectChange = async (value) => {
    setActive(value);
    if (value === 0) {
      setIsLoading(true);
      const result = await getContadoSalesByStoreAsync(token, selectedStore);
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
      setIsLoading(false);
      setListaVentas(result.data);
    } else if (value === 1) {
      setIsLoading(true);
      const result = await getCreditoSalesByStoreAsync(token, selectedStore);
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
      setIsLoading(false);
      setListaVentas(result.data);
    } else {
      setIsLoading(true);
      const result = await getAnulatedSalesByStoreAsync(token, selectedStore);
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
      setIsLoading(false);
      setListaVentas(result.data);
    }
  };

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
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
          <h1 style={{ textAlign: "left" }}>Lista de Ventas</h1>

          <div>
            <FormControl
              variant="standard"
              fullWidth
              style={{
                textAlign: "left",
                width: 200,
                marginTop: 10,
                marginRight: 20,
              }}
            >
              <Select
                labelId="selProc"
                id="demo-simple-select-standard"
                value={selectedStore}
                onChange={handleChangeStore}
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

            <FormControl
              variant="standard"
              style={{
                textAlign: "left",
                width: 200,
                marginTop: 10,
                marginRight: 20,
              }}
            >
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                onChange={(e) => onSelectChange(e.target.value)}
                value={active}
              >
                <MenuItem key={0} value={0}>
                  <FontAwesomeIcon
                    icon={faHandHoldingDollar}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      color: "#1769aa",
                    }}
                  />
                  Ventas de Contado
                </MenuItem>
                <MenuItem key={1} value={1}>
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      color: "#b23c17",
                    }}
                  />
                  Ventas de Credito
                </MenuItem>
                <MenuItem key={2} value={2}>
                  <FontAwesomeIcon
                    icon={faMoneyBillTransfer}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      color: "#6d1b7b",
                    }}
                  />
                  Devoluciones
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <hr />

        <TextField
          style={{ marginBottom: 20, width: 600 }}
          variant="standard"
          onChange={(e) => {
            onChangeSearch(e.target.value.toUpperCase());
          }}
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
          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th>#</th>
                <th style={{ textAlign: "left" }}>Cliente</th>
                <th style={{ textAlign: "center" }}>Monto Venta</th>
                <th style={{ textAlign: "center" }}>Productos</th>

                {active === 1 ? (
                  <th style={{ textAlign: "center" }}>Saldo </th>
                ) : (
                  <></>
                )}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
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

                    {active === 1 ? (
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
                              color: moment().isAfter(
                                item.fechaVencimiento,
                                "day"
                              )
                                ? "#f50057"
                                : "#03a9f4",

                              fontSize: 13,
                            }}
                          >
                            {`Vence: ${moment(item.fechaVencimiento).format(
                              "L"
                            )}`}
                          </Typography>
                        )}
                      </td>
                    ) : (
                      <></>
                    )}

                    <td style={{ width: 150 }}>
                      {item.isCanceled ? (
                        <></>
                      ) : isAccess(access, "PAGO CREATE") ? (
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
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
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
        <NewAbono
          selectedVenta={selectedVenta}
          active={active}
          setActive={setActive}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
        />
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
