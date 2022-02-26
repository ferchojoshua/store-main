import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import {
  deleteFamiliaAsync,
  getFamiliasAsync,
} from "../../services/FamiliaApi";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { simpleMessage } from "../../helpers/Helpers";
import PaginationComponent from "../../components/PaginationComponent";
import Loading from "../../components/Loading";

import { Button, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const Familia = () => {
  const { setIsLoading, reload } = useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [familiaList, setFamiliaList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = familiaList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getFamiliasAsync();
      if (!result.statusResponse) {
        setIsLoading(false);
        simpleMessage(result.error, "error");
        return;
      }
      setIsLoading(false);
      setFamiliaList(result.data);
    })();
  }, [reload]);

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
            variant="outlined"
            startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
            style={{ borderRadius: 20 }}
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
            {currentItem.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td style={{ textAlign: "left" }}>{item.description}</td>
                  <td>
                    <IconButton
                      style={{ marginRight: 10, color: "#009688" }}
                      onClick={() => {
                        navigate(`/familia/${item.id}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </IconButton>
                    <IconButton
                      style={{ color: "#f50057" }}
                      onClick={() => deleteFamilia(item)}
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
          data={familiaList}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>
      <Loading />
    </div>
  );
};

export default Familia;
