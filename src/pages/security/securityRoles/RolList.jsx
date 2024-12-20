import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../helpers/Helpers";

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
import moment from "moment/moment";

const RolList = () => {
  let ruta = getRuta();

  const {
    isDarkMode,
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
              navigate(`${ruta}/unauthorized`);
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
          toastSuccess("Rol Eliminado!");
        })();
        setReload(!reload);
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
          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>#</th>
                <th style={{ textAlign: "left" }}>Nombre de rol</th>
                <th style={{ textAlign: "center" }}>Inicio Operaciones</th>
                <th style={{ textAlign: "center" }}>Fin Operaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item) => {
                let inicio = new Date();
                inicio.setHours(0);
                inicio.setMinutes(0);
                inicio.setSeconds(0);

                let fin = new Date();
                fin.setHours(12);
                fin.setMinutes(0);
                fin.setSeconds(0);

                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "center" }}>{item.id}</td>
                    <td style={{ textAlign: "left" }}>{item.roleName}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.startOperations === null ||
                      item.startOperations === ""
                        ? moment(inicio).format("hh:mm A")
                        : moment(item.startOperations).format("hh:mm A")}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.endOperations === null || item.endOperations === ""
                        ? moment(fin).format("hh:mm A")
                        : moment(item.endOperations).format("hh:mm A")}
                    </td>
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
