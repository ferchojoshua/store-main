import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import {
  deleteProductAsync,
  getProductsAsync,
} from "../../../services/ProductsApi";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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

const Products = () => {
  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [productList, setProductList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = productList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      // val.modelo.includes(searchTerm) ||
      // val.marca.toString().includes(searchTerm) ||
      // val.barCode.toString().includes(searchTerm) ||
      val.description.toString().includes(searchTerm)
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

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getProductsAsync(token);
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
          <h1>Lista de Productos</h1>

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
        </div>

        <hr />

        <TextField
          style={{ marginBottom: 20, width: 600 }}
          variant="standard"
          onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())}
          value={searchTerm}
          label={"Buscar producto"}
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
                <th style={{ textAlign: "left" }}>Tipo Negocio</th>
                <th style={{ textAlign: "left" }}>Familia</th>
                <th style={{ textAlign: "left" }}>Descripcion</th>
                <th style={{ textAlign: "left" }}>Codigo de Barras</th>
                <th style={{ textAlign: "left" }}>Marca</th>
                <th style={{ textAlign: "left" }}>Modelo</th>
                <th style={{ textAlign: "left" }}>U/M</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
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
                      <IconButton
                        style={{ marginRight: 10, color: "#009688" }}
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowEditModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </IconButton>
                      <IconButton
                        style={{ color: "#f50057" }}
                        onClick={() => deleteProduct(item)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
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
    </div>
  );
};

export default Products;
