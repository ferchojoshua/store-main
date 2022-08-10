import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../../components/PaginationComponent";
import { getRuta, isAccess, toastError } from "../../../helpers/Helpers";
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
  let ruta = getRuta();

  let navigate = useNavigate();
  const {
    isDarkMode,
    setIsLoading,
    reload,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
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
          navigate(`${ruta}/unauthorized`);
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

            {isAccess(access, "MISCELANEOS CREATE") ? (
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
            ) : (
              <></>
            )}
          </div>

          <hr />

          {isEmpty(currentItem) ? (
            <NoData />
          ) : (
            <Table
              hover={!isDarkMode}
              size="sm"
              responsive
              className="text-primary"
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ width: 150 }}>Numero de Racks</th>
                  <th style={{ textAlign: "left" }}>Nombre</th>
                  <th>Ver Detalles</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
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
                            navigate(`${ruta}/store/${item.almacen.id}`);
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
