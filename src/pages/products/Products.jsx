import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { simpleMessage } from "../../helpers/Helpers";
import {
  deleteProductAsync,
  getProductsAsync,
} from "../../services/ProductsApi";
import { Button, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../components/PaginationComponent";
import Loading from "../../components/Loading";

const Products = () => {
  const { reload, setIsLoading } = useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [productList, setProductList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = productList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getProductsAsync();
      if (!result.statusResponse) {
        setIsLoading(false);
        simpleMessage(result.error, "error");
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
          const result = await deleteProductAsync(item.id);
          if (!result.statusResponse) {
            Swal.fire(result.error, "", "error");
            return;
          }
        })();
        Swal.fire("Eliminado!", "", "success");
      }
    });
  };

  return (
    <div>
      <Container>
        <div
          style={{
            marginTop: 20,
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
              navigate(`/products/add`);
            }}
          >
            Agregar Producto
          </Button>
        </div>

        <hr />

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
                    {item.familia.description}
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
                        navigate(`/product/${item.id}`);
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
        <PaginationComponent
          data={productList}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>
      <Loading />
    </div>
  );
};

export default Products;
