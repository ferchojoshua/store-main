import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { simpleMessage } from "../../helpers/Helpers";

const EntradaProduto = () => {
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [entradaList, setEntradaList] = useState([]);

  useEffect(() => {
    (async () => {
      // const result = await getFamiliasAsync();
      // if (!result.statusResponse) {
      //   simpleMessage(result.error, "error");
      //   return;
      // }
      // setFamiliaList(result.data);
    })();
  }, []);

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
          <h1>Lista de Entrada de Productos</h1>

          <Button
            onClick={() => {
              navigate(`/entrada/add`);
            }}
            variant="primary"
          >
            Agregar Entrada
          </Button>
        </div>

        <hr />

        <Table hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left" }}>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {entradaList.map((item) => {
              return (
                <tr>
                  <td>{item.id}</td>
                  <td style={{ textAlign: "left" }}>{item.description}</td>
                  <td>
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        navigate(`/entrada/${item.id}`);
                      }}
                      variant="info"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="danger"
                      // onClick={() => deleteFamilia(item)}
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

export default EntradaProduto;
