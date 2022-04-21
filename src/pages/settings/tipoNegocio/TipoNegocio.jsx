import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toastError } from "../../../helpers/Helpers";
import {
  deleteTipoNegocioAsync,
  getTipoNegocioAsync,
} from "../../../services/TipoNegocioApi";
import PaginationComponent from "../../../components/PaginationComponent";
import TipoNegocioAdd from "./TipoNegocioAdd";
import { Button, IconButton, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLink,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import SmallModal from "../../../components/modals/SmallModal";

const TipoNegocio = () => {
  const { reload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [tipoNegocioList, setTpoNegocioList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = tipoNegocioList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const token = getToken();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getTipoNegocioAsync(token);
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
      setTpoNegocioList(result.data);
    })();
  }, [reload]);

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
        })();
        Swal.fire("Eliminado!", "", "success");
      }
    });
  };

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
            <h1>Lista de Tipo de Negocio</h1>

            <Button
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              style={{ borderRadius: 20 }}
              onClick={() => {
                setShowModal(true);
              }}
              variant="outlined"
            >
              Agregar Tipo de Negocio
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
                  <th style={{ width: 150 }}>Contador Familias</th>
                  <th style={{ textAlign: "left" }}>Descripcion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItem.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        {isEmpty(item.familias) ? 0 : item.familias.length}
                      </td>
                      <td style={{ textAlign: "left" }}>{item.description}</td>
                      <td>
                        <IconButton
                          color="primary"
                          style={{ marginRight: 10 }}
                          onClick={() => {
                            navigate(`/tipo-negocio/${item.id}`);
                          }}
                        >
                          <FontAwesomeIcon icon={faExternalLink} />
                        </IconButton>
                        <IconButton
                          style={{ color: "#f50057" }}
                          onClick={() => deleteTipoNegocio(item)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          <PaginationComponent
            data={tipoNegocioList}
            paginate={paginate}
            itemsperPage={itemsperPage}
          />
        </Paper>
      </Container>
      <SmallModal
        titulo={"Agregar Tipo de Negocio"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <TipoNegocioAdd setShowModal={setShowModal} />
      </SmallModal>
    </div>
  );
};

export default TipoNegocio;
