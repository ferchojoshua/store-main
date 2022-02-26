import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import PaginationComponent from "../../../components/PaginationComponent";
import { simpleMessage } from "../../../helpers/Helpers";
import { getStoresAsync } from "../../../services/AlmacenApi";
import { Button, IconButton } from "@mui/material";
import {
  faCirclePlus,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Stores = () => {
  let navigate = useNavigate();
  const { setIsLoading } = useContext(DataContext);
  const [storesList, setStoresList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(5);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = storesList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getStoresAsync();
      if (!result.statusResponse) {
        setIsLoading(false);
        simpleMessage(result.error, "error");
        return;
      }
      setIsLoading(false);
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
            style={{ borderRadius: 20 }}
            startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
            onClick={() => {
              navigate(`/store/add`);
            }}
            variant="outlined"
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
            {currentItem.map((item) => {
              return (
                <tr key={item.almacen.id}>
                  <td>{item.almacen.id}</td>
                  <td style={{ width: 150 }}>{item.racksNumber}</td>
                  <td style={{ textAlign: "left" }}>{item.almacen.name}</td>
                  <td>
                    <IconButton
                      style={{ marginRight: 10, color: "#009688" }}
                      onClick={() => {
                        navigate(`/store/${item.almacen.id}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <PaginationComponent
          data={storesList}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>
      <Loading />
    </div>
  );
};

export default Stores;
