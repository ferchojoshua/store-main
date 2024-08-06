import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../helpers/Helpers";
import {
  deleteProductAsync,
  getProductsAsync,
} from "../../../services/ProductsApi";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Stack,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesPacking,
  faCirclePlus,
  faExternalLinkAlt,
  faSearch,
  faTrashAlt,
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
import Productsadd from "./Productsadd";
import ProductsDetails from "./ProductsDetails";
import { ProductKardex } from "../productExistences/ProductKardex";

const Products = () => {
  let ruta = getRuta();

  const {
    isDarkMode,
    reload,
    setReload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [productList, setProductList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = productList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.description.toString().includes(searchTerm) ||
      val.barCode.toString().includes(searchTerm)
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [showKardexModal, setShowKardexModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getProductsAsync(token);
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
      setProductList(result.data);
    })();
  }, [reload]);

  const deleteProduct = async (item) => {
    MySwal.fire({
      icon: "warning",
      title: <p>Confirmar Eliminar</p>,
      text: `Elimiar: ${item.description}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          setIsLoading(true);
          const result = await deleteProductAsync(token, item.id);
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
        })();
        setIsLoading(false);
        setReload(!reload);
        toastSuccess("Producto Eliminado");
      }
    });
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
          <h1>Lista de Productos</h1>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            {isAccess(access, "PRODUCTS CREATE") ? (
              <Button
                variant="outlined"
                style={{ borderRadius: 20 }}
                startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Agregar Producto
              </Button>
            ) : (
              <></>
            )}
            <></>

            {isAccess(access, "KARDEX VER") ? (
              <Button
                variant="outlined"
                style={{
                  borderRadius: 20,
                  color: "#ff5722",
                  borderColor: "#ff5722",
                  marginLeft: 10,
                }}
                startIcon={
                  <FontAwesomeIcon
                    icon={faBoxesPacking}
                    style={{
                      color: "#ff5722",
                    }}
                  />
                }
                onClick={() => {
                  setShowKardexModal(true);
                }}
              >
                Consultar Kardex
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>

        <hr />

        <TextField
          style={{ marginBottom: 20, maxWidth: 600 }}
          fullWidth
          variant="standard"
          onChange={(e) => onChangeSearch(e.target.value.toUpperCase())}
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
          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "center" }}>T. Negocio</th>
                <th style={{ textAlign: "left" }}>Familia</th>
                <th style={{ textAlign: "left" }}>Descripcion</th>
                <th style={{ textAlign: "right" }}>C. Barras</th>
                <th style={{ textAlign: "left" }}>Marca</th>
                <th style={{ textAlign: "left" }}>Modelo</th>
                <th style={{ textAlign: "left" }}>U/M</th>
                {isAccess(access, "PRODUCTS UPDATE") ||
                isAccess(access, "PRODUCTS DELETE") ? (
                  <th>Acciones</th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item, index) => {
                return (
                  <tr key={item.id  || index}>
                    <td>{item.id}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.tipoNegocio.description}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item.familia ? item.familia.description : ""}
                    </td>
                    <td style={{ textAlign: "left" }}>{item.description}</td>
                    <td style={{ textAlign: "left" }}>{item.barCode}</td>
                    <td style={{ textAlign: "left" }}>{item.marca}</td>
                    <td style={{ textAlign: "left" }}>{item.modelo}</td>
                    <td style={{ textAlign: "left" }}>{item.um}</td>
                    <td>
                      <Stack spacing={1} direction="row">
                        {isAccess(access, "PRODUCTS UPDATE") ? (
                          <IconButton
                            style={{ color: "#009688" }}
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowEditModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </IconButton>
                        ) : (
                          <></>
                        )}

                        {isAccess(access, "PRODUCTS DELETE") ? (
                          <IconButton
                            style={{ color: "#f50057" }}
                            onClick={() => deleteProduct(item)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </Stack>
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
        titulo={"Agregar Producto"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <Productsadd setShowModal={setShowModal} />
      </MediumModal>

      <MediumModal
        titulo={`Editar: ${selectedProduct.description}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <ProductsDetails
          selectedProduct={selectedProduct}
          setShowModal={setShowEditModal}
        />
      </MediumModal>

      <MediumModal
        titulo="Consultar Cardex"
        isVisible={showKardexModal}
        setVisible={setShowKardexModal}
      >
        <ProductKardex productList={productList} />
      </MediumModal>
    </div>
  );
};

export default Products;