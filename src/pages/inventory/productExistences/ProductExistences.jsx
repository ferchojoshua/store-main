import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { isAccess, toastError } from "../../../helpers/Helpers";

import {
  IconButton,
  InputAdornment,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import MediumModal from "../../../components/modals/MediumModal";
import { getStoresAsync } from "../../../services/AlmacenApi";
import { getExistencesByStoreAsync } from "../../../services/ExistanceApi";
import ProductExistenceEdit from "./ProductExistenceEdit";

const ProductExistences = () => {
  const { reload, setIsLoading, setIsDefaultPass, setIsLogged, access } =
    useContext(DataContext);
  let navigate = useNavigate();

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(4);
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const withSearch = productList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (val.producto.description.toString().includes(searchTerm)) {
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

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      //Traemos los Almacenes de la DB
      const resultStores = await getStoresAsync(token);
      if (!resultStores.statusResponse) {
        setIsLoading(false);
        if (resultStores.error.request.status === 401) {
          navigate("/unauthorized");
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

      //Traemoslos productos del almacen de la deb
      const data = {
        idAlmacen: selectedStore,
      };

      const result = await getExistencesByStoreAsync(token, data);
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
      setProductList(result.data);
    })();
  }, [reload]);

  const handleChangeStore = async (event) => {
    setSelectedStore(event.target.value);
    const data = {
      idAlmacen: event.target.value,
    };
    setIsLoading(true);
    const result = await getExistencesByStoreAsync(token, data);
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

    setProductList(result.data);
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
          }}
        >
          <h1>Existencia de Productos</h1>

          <FormControl
            variant="standard"
            fullWidth
            style={{ textAlign: "left", width: 250 }}
          >
            <InputLabel id="selProc">Almacen</InputLabel>
            <Select
              labelId="selProc"
              id="demo-simple-select-standard"
              value={selectedStore}
              onChange={handleChangeStore}
            >
              <MenuItem value="">
                <em>Seleccione un Almacen...</em>
              </MenuItem>
              {storeList.map((item) => {
                return (
                  <MenuItem key={item.almacen.id} value={item.almacen.id}>
                    {item.almacen.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <Divider style={{ marginBottom: 10, marginTop: 10 }} />

        <TextField
          style={{ marginBottom: 20, width: 600 }}
          variant="standard"
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
          value={searchTerm}
          label={"Buscar Producto"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: "#1769aa" }}
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
                <th>#</th>
                <th style={{ textAlign: "left" }}>T.Negocio</th>
                <th style={{ textAlign: "left" }}>Producto</th>
                <th style={{ textAlign: "left" }}>Marca</th>
                <th style={{ textAlign: "left" }}>Modelo</th>
                <th style={{ textAlign: "center" }}>Existencias</th>
                <th style={{ textAlign: "center" }}>PVM</th>
                <th style={{ textAlign: "center" }}>PVD</th>
                {isAccess(access, "EXISTANCE UPDATE") ? (
                  <th>Acciones</th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.producto.id}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.producto.tipoNegocio.description}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item.producto.description}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item.producto.marca ? item.producto.marca : "S/M"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item.producto.modelo ? item.producto.modelo : "S/M"}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.existencia}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.precioVentaMayor.toLocaleString("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      })}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.precioVentaDetalle.toLocaleString("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      })}
                    </td>
                    {isAccess(access, "EXISTANCE UPDATE") ? (
                      <td>
                        <IconButton
                          style={{ marginRight: 10, color: "#009688" }}
                          onClick={() => {
                            setSelectedProduct(item);
                            setShowEditModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </IconButton>
                      </td>
                    ) : (
                      <></>
                    )}
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
        titulo={
          isEmpty(selectedProduct)
            ? ""
            : `Ajustar Existencias: ${selectedProduct.producto.description}`
        }
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <ProductExistenceEdit
          selectedProduct={selectedProduct}
          setShowModal={setShowEditModal}
        />
      </MediumModal>
    </div>
  );
};

export default ProductExistences;
