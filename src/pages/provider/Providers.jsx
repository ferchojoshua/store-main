import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { simpleMessage } from "../../helpers/Helpers";

import { deleteProviderAsync, getprovidersAsync } from "../../services/ProviderApi";

const Providers = () => {
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [providerList, setProviderList] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getprovidersAsync();
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setProviderList(result.data);
    })();
  }, [providerList]);

  const deleteProvider = async (item) => {
    MySwal.fire({
      icon: "warning",
      title: <p>Confirmar Eliminar</p>,
      text: `Elimiar: ${item.nombre}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          const result = await deleteProviderAsync(item.id);
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
          <h1>Lista de Proveedores</h1>

          <Button
            onClick={() => {
              navigate(`/provider/add`);
            }}
            variant="primary"
          >
            Agregar Proveedor
          </Button>
        </div>

        <hr />

        <Table hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left" }}>Nombre</th>
              <th style={{ textAlign: "left" }}>Direccion</th>
              <th style={{ textAlign: "left" }}>Telefono</th>
              <th style={{ textAlign: "left" }}>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providerList.map((item) => {
              return (
                <tr>
                  <td>{item.id}</td>
                  <td style={{ textAlign: "left" }}>{item.nombre}</td>
                  <td style={{ textAlign: "left" }}>{item.address}</td>
                  <td style={{ textAlign: "left" }}>{item.phone}</td>
                  <td style={{ textAlign: "left" }}>{item.email}</td>
                  <td>
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        navigate(`/provider/${item.id}`);
                      }}
                      variant="info"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteProvider(item)}
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

export default Providers;
