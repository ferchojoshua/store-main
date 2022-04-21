import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../../components/PaginationComponent";
import { toastError } from "../../../helpers/Helpers";
import { getStoresAsync } from "../../../services/AlmacenApi";
import { Button, IconButton, Paper } from "@mui/material";
import {
  faCirclePlus,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { isEmpty } from "lodash";
import SmallModal from "../../../components/modals/SmallModal";
import StoreAdd from "./StoreAdd";
import NoData from "../../../components/NoData";

const Stores = () => {
  let navigate = useNavigate();
  const { setIsLoading, reload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  const [storesList, setStoresList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(5);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = storesList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const token = getToken();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getStoresAsync(token);
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
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setStoresList(result.data);
    })();
  }, [reload]);

  return (
    <div>
      <Container>
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
          }}
        >
          <div
            style={{
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
                setShowModal(true);
              }}
              variant="outlined"
            >
              Agregar Almacen
            </Button>
          </div>

          <hr />

          {isEmpty(currentItem) ? (
            <NoData />
          ) : (
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
          )}
          <PaginationComponent
            data={storesList}
            paginate={paginate}
            itemsperPage={itemsperPage}
          />
        </Paper>
      </Container>

      <SmallModal
        titulo={"Agregar Almacen"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <StoreAdd setShowModal={setShowModal} />
      </SmallModal>
    </div>
  );
};

export default Stores;
