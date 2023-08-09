import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../helpers/Helpers";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
  faSearch,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import MediumModal from "../../../components/modals/MediumModal";
import {
  deleteClientAsync,
  getClientsAsync,
} from "../../../services/ClientsApi";
import AddClient from "./AddClient";
import ClientDetails from "./ClientDetails";

const ClientList = () => {
  let ruta = getRuta();

  const {
    isDarkMode,
    reload,
    setReload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [clientList, setClientList] = useState([]);
  const [dialog, setDialog] = useState(false) 
  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = clientList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (val.nombreCliente.toString().includes(searchTerm)) {
      return val;
    }
  });

  //Para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = withSearch.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const token = getToken();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const result = await getClientsAsync(token);
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
      setClientList(result.data);
    })();
  }, [reload]);

  const deleteClient = async (item) => {
    MySwal.fire({
      icon: "warning",
      title: <p>Confirmar Eliminar</p>,
      text: `Elimiar: ${item.nombreCliente}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          setIsLoading(true);
          const result = await deleteClientAsync(token, item.id);
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
        })();
        setIsLoading(false);
        setReload(!reload);
        toastSuccess("Cliente Eliminado!");
      }
    });
  };

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

  return (
    <div>
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Lista de Clientes</h1>

          {isAccess(access, "CLIENTS CREATE") ? (
            <Button
              variant="outlined"
              style={{ borderRadius: 20 }}
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Agregar Cliente
            </Button>
          ) : (
            <></>
          )}
        </div>

        <hr />

        <TextField
          style={{ marginBottom: 20, maxWidth: 600 }}
          fullWidth
          variant="standard"
          onChange={(e) => onChangeSearch(e.target.value.toUpperCase())}
          value={searchTerm}
          label={"Buscar Cliente"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: "#1769aa" }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {isEmpty(withSearch) ? (
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
                <th style={{ textAlign: "left" }}>Nombre Cliente</th>
                <th style={{ textAlign: "center" }}>Telefono</th>
                <th style={{ textAlign: "left" }}>Comunidad</th>
                <th style={{ textAlign: "left" }}>Direccion</th>
                <th style={{ textAlign: "center" }}>L. Credito</th>
                <th style={{ width: 150 }}>Acciones</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td style={{ textAlign: "left" }}>{item.nombreCliente}</td>
                    <td style={{ textAlign: "center" }}>{item.telefono}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.community ? item.community.name : ""}
                    </td>
                    <td style={{ textAlign: "left" }}>{item.direccion}</td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(item.limiteCredito)}
                    </td>

                    <td style={{ width: 150 }}>
                      <Stack direction={"row"} spacing={1}>
                        {isAccess(access, "CLIENTS VER") ? (
                          <IconButton
                            style={{ color: "#009688" }}
                            onClick={() => {
                              setSelectedClient(item);
                              setShowEditModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                        {isAccess(access, "CLIENTS DELETE") ? (
                          <IconButton
                            style={{ color: "#f50057" }}
                            onClick={() => deleteClient(item)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </Stack>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <PaginationComponent
          data={withSearch}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>

      <MediumModal
        titulo={"Agregar Cliente"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <AddClient setShowModal={setShowModal} />
      </MediumModal>

      <MediumModal
        titulo={`Editar: ${selectedClient.nombreCliente}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <ClientDetails
          selectedClient={selectedClient}
          setShowModal={setShowEditModal}
        />
      </MediumModal>
    </div>
  );
};

export default ClientList;
