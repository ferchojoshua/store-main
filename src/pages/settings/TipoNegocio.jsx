import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { simpleMessage } from "../../helpers/Helpers";
import { deleteTipoNegocioAsync, getTipoNegocioAsync } from "../../services/TipoNegocioApi";

const TipoNegocio = () => {
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [tipoNegocioList, setTpoNegocioList] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getTipoNegocioAsync();
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setTpoNegocioList(result.data);
    })();
  }, [tipoNegocioList]);

  const deleteTipoNegocio = (item) => {
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
          const result = await deleteTipoNegocioAsync(item.id);
          if (!result.statusResponse) {
            alert("Error");
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
          <h1>Lista de Tipo de Negocio</h1>

          <Button
            onClick={() => {
              navigate(`/tipo-negocio/add`);
            }}
            variant="primary"
          >
            Agregar Tipo de Negocio
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
            {tipoNegocioList.map((item) => {
              return (
                <tr>
                  <td>{item.id}</td>
                  <td style={{ textAlign: "left" }}>{item.description}</td>
                  <td>
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        navigate(`/tipo-negocio/${item.id}`);
                      }}
                      variant="info"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteTipoNegocio(item)}
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

export default TipoNegocio;
