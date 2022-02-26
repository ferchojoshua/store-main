import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { simpleMessage } from "../../helpers/Helpers";

import {
  deleteProviderAsync,
  getprovidersAsync,
} from "../../services/ProviderApi";
import PaginationComponent from "../../components/PaginationComponent";

import { Button, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../components/Loading";

const Providers = () => {
  const { reload, setIsLoading } = useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [providerList, setProviderList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(5);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = providerList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getprovidersAsync();
      if (!result.statusResponse) {
        setIsLoading(false);
        simpleMessage(result.error, "error");
        return;
      }
      setIsLoading(false);
      setProviderList(result.data);
    })();
  }, [reload]);

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
            style={{ borderRadius: 20 }}
            startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
            onClick={() => {
              navigate(`/provider/add`);
            }}
            variant="outlined"
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
            {currentItem.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td style={{ textAlign: "left" }}>{item.nombre}</td>
                  <td style={{ textAlign: "left" }}>{item.address}</td>
                  <td style={{ textAlign: "left" }}>{item.phone}</td>
                  <td style={{ textAlign: "left" }}>{item.email}</td>
                  <td>
                    <IconButton
                      style={{ marginRight: 10, color: "#009688" }}
                      onClick={() => {
                        navigate(`/provider/${item.id}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </IconButton>
                    <IconButton
                      style={{ color: "#f50057" }}
                      onClick={() => deleteProvider(item)}
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
          data={providerList}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>
      <Loading />
    </div>
  );
};

export default Providers;
