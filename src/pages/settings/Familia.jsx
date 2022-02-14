import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import {
  deleteFamiliaAsync,
  getFamiliasAsync,
} from "../../services/FamiliaApi";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { simpleMessage } from "../../helpers/Helpers";

const Familia = () => {
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [familiaList, setFamiliaList] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getFamiliasAsync();
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setFamiliaList(result.data);
    })();
  }, [familiaList]);

  const deleteFamilia = async (item) => {
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
          const result = await deleteFamiliaAsync(item.id);
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
          <h1>Lista de Familias</h1>

          <Button
            onClick={() => {
              navigate(`/familia/add`);
            }}
            variant="primary"
          >
            Agregar Familia
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
            {familiaList.map((item) => {
              return (
                <tr>
                  <td>{item.id}</td>
                  <td style={{ textAlign: "left" }}>{item.description}</td>
                  <td>
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        navigate(`/familia/${item.id}`);
                      }}
                      variant="info"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteFamilia(item)}
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

export default Familia;
