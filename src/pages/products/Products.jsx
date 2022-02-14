import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { simpleMessage } from "../../helpers/Helpers";
import {
  deleteProductAsync,
  getProductsAsync,
} from "../../services/ProductsApi";

const Products = () => {
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getProductsAsync();
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setProductList(result.data);
    })();
  }, [productList]);

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
            onClick={() => {
              navigate(`/products/add`);
            }}
            variant="primary"
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
            {productList.map((item) => {
              return (
                <tr>
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
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        navigate(`/product/${item.id}`);
                      }}
                      variant="info"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteProduct(item)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Products;
