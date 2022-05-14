import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isAccess, toastError, toastSuccess } from "../../../helpers/Helpers";

import { Button, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import { deleteRolAsync, getRolesAsync } from "../../../services/RolApi";
import { isEmpty } from "lodash";
import MediumModal from "../../../components/modals/MediumModal";
import AddRol from "./AddRol";
import EditRol from "./EditRol";
import NoData from "../../../components/NoData";
import { useNavigate } from "react-router-dom";

const RolList = () => {
  const {
    setReload,
    reload,
    setIsLoading,
    setIsLogged,
    setIsDefaultPass,
    access,
  } = useContext(DataContext);
  const MySwal = withReactContent(Swal);
  const [rolList, setRolList] = useState([]);

  let navigate = useNavigate();

  //Para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = rolList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedRol, setSelectedRol] = useState([]);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getRolesAsync(token);
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
      setRolList(result.data);
    })();
  }, [reload]);

  const deleteRol = async (item) => {
    MySwal.fire({
      icon: "warning",
      title: <p>Confirmar Eliminar</p>,
      text: `Desactivar: ${item.roleName}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          const result = await deleteRolAsync(token, item.roleName);
          if (!result.statusResponse) {
            setIsLoading(false);
            if (result.error.request.status === 401) {
              navigate("/unauthorized");
              return;
            }
            toastError("No puedo eliminar rol, Intentelo de nuevo!");
            return;
          }

          if (result.data === "eX01") {
            setIsLoading(false);
            deleteUserData();
            deleteToken();
            setIsLogged(false);
            return;
          }
        })();
        setReload(!reload);
        toastSuccess("Rol Eliminado!");
      }
    });
  };

  const editarRol = (item) => {
    setSelectedRol(item);
    setShowEditModal(true);
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
          <h1>Lista de Roles</h1>

          {isAccess(access, "ROLES CREATE") ? (
            <Button
              variant="outlined"
              style={{ borderRadius: 20 }}
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Agregar Rol
            </Button>
          ) : (
            <></>
          )}
        </div>

        <hr />

        {isEmpty(currentItem) ? (
          <NoData />
        ) : (
          <Table hover size="sm">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>#</th>
                <th style={{ textAlign: "left" }}>Nombre de rol</th>

                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "left" }}>{item.id}</td>
                    <td style={{ textAlign: "left" }}>{item.roleName}</td>
                    <td>
                      <IconButton
                        style={{ marginRight: 10, color: "#009688" }}
                        onClick={() => {
                          editarRol(item);
                        }}
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </IconButton>
                      {isAccess(access, "ROLES DELETE") ? (
                        <IconButton
                          style={{ color: "#f50057" }}
                          onClick={() => deleteRol(item)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </IconButton>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        <PaginationComponent
          data={rolList}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>

      <MediumModal
        titulo={"Agregar Rol"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <AddRol setShowModal={setShowModal} />
      </MediumModal>

      <MediumModal
        titulo={`Editar Rol: ${selectedRol.roleName}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <EditRol selectedRol={selectedRol} setShowModal={setShowEditModal} />
      </MediumModal>
    </div>
  );
};

export default RolList;
