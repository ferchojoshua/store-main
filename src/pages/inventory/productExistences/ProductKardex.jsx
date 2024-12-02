import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError } from "../../../helpers/Helpers";
import {
  TextField,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
  Autocomplete,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";

import { isEmpty } from "lodash";

import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import DatePicker from "@mui/lab/DatePicker";

import NoData from "../../../components/NoData";
import PaginationComponent from "../../../components/PaginationComponent";
import {
  getAllStoresKardexAsync,
  getKardexAsync,
} from "../../../services/ProductsApi";
import { Table } from "react-bootstrap";
import moment from "moment";

export const ProductKardex = ({ productList }) => {
  let ruta = getRuta();

  const { reload, setIsLoading, setIsDefaultPass, setIsLogged, isDarkMode } =
    useContext(DataContext);

  const [desde, setDesde] = useState(new Date());
  const [hasta, setHasta] = useState(new Date());

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");

  const [isVisible, setIsVisible] = useState(false);

  const [kardex, setKardex] = useState([]);



     // Pagination
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsperPage] = useState(5);
     const indexLast = currentPage * itemsperPage;
     const indexFirst = indexLast - itemsperPage;
     const currentItem = kardex.slice(indexFirst, indexLast);
     const paginate = (pageNumber) => setCurrentPage(pageNumber);

  let navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      //Traemos los Almacenes de la DB
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
      setIsLoading(false);
    })();
  }, [reload]);

  const generarKardex = async () => {
    if (!moment(desde).isValid()) {
      toastError("Ingrese una fecha de inicio valida");
      return;
    }
    if (!moment(hasta).isValid()) {
      toastError("Ingrese una fecha de final valida");
      return;
    }
    if (selectedStore.length === 0) {
      toastError("Debe seleccionar un almacen");
      return;
    }
    if (isEmpty(selectedProduct)) {
      toastError("Debe seleccionar un producto");
      return;
    }

    const data = {
      desde,
      hasta,
      storeId: selectedStore,
      productId: selectedProduct.id,
    };

    setIsLoading(true);
    const result = await getKardexAsync(token, data);
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

    setKardex(result.data);
    setIsLoading(false);
    setIsVisible(true);
  };

  const generarAllStoreKardex = async () => {
    const data = {
      desde,
      hasta,
      productId: selectedProduct.id,
    };

    setIsLoading(true);
    const result = await getAllStoresKardexAsync(token, data);
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
    setKardex(result.data);
    setIsLoading(false);
    setIsVisible(true);
  };

  const getDocument = (item) => {
    const {
      ajusteInventario,
      entradaProduct,
      sale,
      saleAnulation,
      trasladoInventario,
    } = item;
    if (ajusteInventario) {
      return `AJUSTE INVENTARIO: ${ajusteInventario}`;
    } else if (entradaProduct) {
      return `ENTRADA DE PRODUCTO: ${entradaProduct}`;
    } else if (sale) {
      return `VENTA DE PRODUCTO: ${sale}`;
    } else if (saleAnulation) {
      return `ANULACION DE VENTA: ${saleAnulation}`;
    } else if (trasladoInventario) {
      return `TRASLADO DE INVENTARIO: ${trasladoInventario}`;
    } else {
      return "NO GUARDADO";
    }
  };

  return (
    <div>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 30,
          margin: 60,
          marginBottom: 10,
        }}
      >
        <div className="row justify-content-around">
          <div className="col-sm-6">
            <DatePicker
              label="Desde"
              value={desde}
              onChange={(newValue) => {
                if (newValue > hasta) {
                  toastError("Seleccione un rango de fechas correcto");
                  return;
                }
                setDesde(newValue);
              }}
              renderInput={(params) => (
                <TextField fullWidth variant="standard" {...params} />
              )}
            />
          </div>

          <div className="col-sm-6">
            <DatePicker
              label="Hasta"
              value={hasta}
              onChange={(newValue) => {
                if (newValue < desde) {
                  toastError("Seleccione un rango de fechas correcto");
                  return;
                }
                setHasta(newValue);
              }}
              renderInput={(params) => (
                <TextField fullWidth variant="standard" {...params} />
              )}
            />
          </div>

          <div className="col-sm-6">
            <FormControl
              variant="standard"
              fullWidth
              style={{ textAlign: "left" }}
            >
              <InputLabel id="selProc">Almacen</InputLabel>
              <Select
                labelId="selProc"
                id="demo-simple-select-standard"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
              >
                <MenuItem value="">
                  <em>Seleccione un Almacen...</em>
                </MenuItem>
                {storeList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  );
                })}
                <MenuItem key={-1} value={-1}>
                  Todos...
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-sm-6">
            <Autocomplete
              fullWidth
              options={productList}
              getOptionLabel={(op) => (op ? `${op.description}` : "")}
              value={selectedProduct === "" ? null : selectedProduct}
              onChange={(event, newValue) => {
                setSelectedProduct(newValue);
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.description}
                  </li>
                );
              }}
              noOptionsText="Producto no encontrado..."
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label="Seleccione un producto..."
                />
              )}
            />
          </div>

          <Button
            variant="outlined"
            style={{ borderRadius: 20, marginTop: 20 }}
            startIcon={<FontAwesomeIcon icon={faList} />}
            onClick={() => {
              selectedStore === -1 ? generarAllStoreKardex() : generarKardex();
            }}
          >
            Ver Kardex
          </Button>
        </div>
      </Paper>  

      {isVisible ? (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h6>Lista de Movimientos</h6>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              {/* <Tooltip title="Imprimir">
                <IconButton
                  size="large"
                  //   onClick={() => {
                  //     setShowModal(true);
                  //   }}
                >
                  <FontAwesomeIcon
                    icon={faPrint}
                    style={{ color: "#1769aa" }}
                  />
                </IconButton>
              </Tooltip> */}
            </div>
          </div>

          <hr />

          {isEmpty(kardex) ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <NoData />
            </div>
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
                  <th style={{ textAlign: "left" }}>Documento</th>
                  <th style={{ textAlign: "left" }}>Concepto</th>
                  <th style={{ textAlign: "center" }}>Almacen</th>
                  <th style={{ textAlign: "center" }}>Entradas</th>
                  <th style={{ textAlign: "center" }}>Salidas</th>
                  <th style={{ textAlign: "center" }}>Saldo</th>
                  <th style={{ textAlign: "left" }}>Usuario</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {currentItem.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{moment(item.fecha).format("L")}</td>
                      <td style={{ textAlign: "center" }}>
                        {getDocument(item)}
                      </td>
                      <td style={{ textAlign: "left" }}>{item.concepto}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.almacen.name}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.entradas}</td>
                      <td style={{ textAlign: "center" }}>{item.salidas}</td>
                      <td style={{ textAlign: "center" }}>{item.saldo}</td>
                      <td style={{ textAlign: "left" }}>
                        {item.user.fullName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
            <PaginationComponent
            data={kardex}
            paginate={paginate}
            itemsperPage={itemsperPage}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
