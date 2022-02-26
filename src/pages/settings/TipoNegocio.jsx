import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { simpleMessage } from "../../helpers/Helpers";
import {
  deleteTipoNegocioAsync,
  getTipoNegocioAsync,
} from "../../services/TipoNegocioApi";
import PaginationComponent from "../../components/PaginationComponent";
import Loading from "../../components/Loading";
import { IconButton, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faExternalLink, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const TipoNegocio = () => {
  const { reload, setIsLoading } = useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [tipoNegocioList, setTpoNegocioList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = tipoNegocioList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getTipoNegocioAsync();
      if (!result.statusResponse) {
        setIsLoading(false);
        simpleMessage(result.error, "error");
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
            startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
            style={{ borderRadius: 20 }}
            onClick={() => {
              navigate(`/tipo-negocio/add`);
            }}
            variant="outlined"
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
            {currentItem.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
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
        <PaginationComponent
          data={tipoNegocioList}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>
      <Loading />
    </div>
  );
};

export default TipoNegocio;
