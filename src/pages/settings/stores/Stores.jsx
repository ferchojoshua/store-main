import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../helpers/Helpers";
import { getStoresAsync } from "../../../services/AlmacenApi";

const Stores = () => {
  let navigate = useNavigate();
  const [storesList, setStoresList] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getStoresAsync();
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setStoresList(result.data);
    })();
  }, [storesList.almacen]);

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
          <h1>Almacenes</h1>

          <Button
            onClick={() => {
              navigate(`/store/add`);
            }}
            variant="primary"
          >
            Agregar Almacen
          </Button>
        </div>

        <hr />

        <Table hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ width: 150 }}>Numero de Racks</th>
              <th style={{ textAlign: "left" }}>Nombre</th>
              <th>Ver Detalles</th>
            </tr>
          </thead>
          <tbody>
            {storesList.map((item) => {
              return (
                <tr>
                  <td>{item.almacen.id}</td>
                  <td style={{ width: 150 }}>{item.racksNumber}</td>
                  <td style={{ textAlign: "left" }}>{item.almacen.name}</td>
                  <td>
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        navigate(`/store/${item.almacen.id}`);
                      }}
                      variant="info"
                    >
                      Ver
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

export default Stores;
