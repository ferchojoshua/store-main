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
import ProviderAdd from "./ProviderAdd";
import {
  deleteProviderAsync,
  getprovidersAsync,
} from "../../../services/ProviderApi";
import PaginationComponent from "../../../components/PaginationComponent";

import { Button, IconButton, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import { isEmpty } from "lodash";
import SmallModal from "../../../components/modals/SmallModal";
import ProviderDetails from "./ProviderDetails";
import NoData from "../../../components/NoData";

const Providers = () => {
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
  const [providerList, setProviderList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = providerList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState([]);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getprovidersAsync(token);
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
          setIsLoading(true);
          const result = await deleteProviderAsync(item.id);
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
        toastSuccess("Proveedor Eliminado");
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
            <h1>Lista de Proveedores</h1>

            {isAccess(access, "MISCELANEOS UPDATE") ? (
              <Button
                style={{ borderRadius: 20 }}
                startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
                onClick={() => {
                  setShowModal(true);
                }}
                variant="outlined"
              >
                Agregar Proveedor
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
                  <th style={{ textAlign: "left" }}>Nombre</th>
                  <th style={{ textAlign: "left" }}>Direccion</th>
                  <th style={{ textAlign: "left" }}>Telefono</th>
                  <th style={{ textAlign: "left" }}>Correo</th>
                  {isAccess(access, "MISCELANEOS UPDATE") ||
                  isAccess(access, "MISCELANEOS DELETE") ? (
                    <th>Acciones</th>
                  ) : (
                    <></>
                  )}
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {currentItem.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td style={{ textAlign: "left" }}>{item.nombre}</td>
                      <td style={{ textAlign: "left" }}>{item.address}</td>
                      <td style={{ textAlign: "left" }}>{item.phone}</td>
                      <td style={{ textAlign: "left" }}>{item.email}</td>
                      {isAccess(access, "MISCELANEOS UPDATE") ||
                      isAccess(access, "MISCELANEOS DELETE") ? (
                        <td style={{ width: 150 }}>
                          {isAccess(access, "MISCELANEOS UPDATE") ? (
                            <IconButton
                              style={{ marginRight: 10, color: "#009688" }}
                              onClick={() => {
                                setSelectedProvider(item);
                                setShowEditModal(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} />
                            </IconButton>
                          ) : (
                            <></>
                          )}
                          {isAccess(access, "MISCELANEOS DELETE") ? (
                            <IconButton
                              style={{ color: "#f50057" }}
                              onClick={() => deleteProvider(item)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </IconButton>
                          ) : (
                            <></>
                          )}
                        </td>
                      ) : (
                        <></>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          <PaginationComponent
            data={providerList}
            paginate={paginate}
            itemsperPage={itemsperPage}
          />
        </Paper>
      </Container>

      <SmallModal
        titulo={"Agregar Proveedor"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <ProviderAdd setShowModal={setShowModal} />
      </SmallModal>

      <SmallModal
        titulo={`Editar: ${selectedProvider.nombre}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <ProviderDetails
          selectedProvider={selectedProvider}
          setShowModal={setShowEditModal}
        />
      </SmallModal>
    </div>
  );
};

export default Providers;
