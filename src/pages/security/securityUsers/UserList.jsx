import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isAccess, toastError, toastSuccess } from "../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faExternalLinkAlt,
  faKey,
  faSearch,
  faTrashAlt,
  faUserCheck,
  faUserLargeSlash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import {
  deactivateUserAsync,
  getActiveUsersAsync,
  getAllUsersAsync,
  getInactiveUsersAsync,
  resetPasswordAsync,
} from "../../../services/UsersApi";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import { isEmpty } from "lodash";
import MediumModal from "../../../components/modals/MediumModal";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import NoData from "../../../components/NoData";

const UserList = () => {
  const {
    setReload,
    reload,
    setIsLoading,
    setIsLogged,
    setIsDefaultPass,
    access,
  } = useContext(DataContext);
  const MySwal = withReactContent(Swal);
  const [userList, setUserList] = useState([]);
  let navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const withSearch = userList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.fullName.toString().includes(searchTerm) ||
      val.userName.toString().includes(searchTerm.toLowerCase())
    ) {
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

  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState([]);

  const [active, setActive] = useState(0);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let result = [];
      if (active === 0) {
        result = await getActiveUsersAsync(token);
      }

      if (active === 1) {
        result = await getInactiveUsersAsync(token);
      }

      if (active === 2) {
        result = await getAllUsersAsync(token);
      }

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
      setUserList(result.data);
    })();
  }, [reload]);

  const deactivateUser = async (item) => {
    MySwal.fire({
      icon: "warning",
      title: item.isActive ? (
        <p>Confirmar Desactivar</p>
      ) : (
        <p>Confirmar Activar</p>
      ),
      text: item.isActive
        ? `Desactivar: ${item.fullName}!`
        : `Activar: ${item.fullName}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          const result = await deactivateUserAsync(token, item.userName);
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
          setReload(!reload);
        })();
        toastSuccess("Usuario desactivado!");
      }
    });
  };

  const resetPassword = async (item) => {
    MySwal.fire({
      icon: "warning",
      title: <p>Resetear Contraseña</p>,
      text: `Usuario: ${item.fullName}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          const result = await resetPasswordAsync(token, item.id);
          if (!result.statusResponse) {
            setIsLoading(false);
            if (result.error.request.status === 401) {
              navigate("/unauthorized");
              return;
            }
            toastError("No puedo resetear la contraseña, Intentelo de nuevo!");
            return;
          }

          if (result.data === "eX01") {
            setIsLoading(false);
            deleteUserData();
            deleteToken();
            setIsLogged(false);
            return;
          }
          setReload(!reload);
        })();
        toastSuccess("Contraseña reseteada, por defecto es: 123456");
      }
    });
  };

  const userEdit = (item) => {
    setSelectedUser(item);
    setShowEditModal(true);
  };

  const onSelectChange = async (value) => {
    setActive(value);
    setIsLoading(true);
    let result = [];
    if (value === 0) {
      result = await getActiveUsersAsync(token);
    }

    if (value === 1) {
      result = await getInactiveUsersAsync(token);
    }

    if (value === 2) {
      result = await getAllUsersAsync(token);
    }

    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error.request.status === 401) {
        navigate("/unauthorized");
        return;
      }
      toastError("No se pudo cargar la lista de usuarios");
      return;
    }

    if (result.data === "eX01") {
      setIsLoading(false);
      deleteUserData();
      deleteToken();
      setIsLogged(false);
      return;
    }

    setIsLoading(false);
    setUserList(result.data);
  };

  return (
    <div>
      <Container>
        <div
          style={{
            // marginTop: 10,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Lista de Usuarios</h1>
          <div>
            <FormControl
              variant="standard"
              style={{ textAlign: "left", width: 200, height: 5 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Estado
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                onChange={(e) => onSelectChange(e.target.value)}
                value={active}
              >
                <MenuItem key={0} value={0}>
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      color: "#1769aa",
                    }}
                  />
                  Activo
                </MenuItem>
                <MenuItem key={1} value={1}>
                  <FontAwesomeIcon
                    icon={faUserLargeSlash}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      color: "#b23c17",
                    }}
                  />
                  Inactivo
                </MenuItem>
                <MenuItem key={2} value={2}>
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      color: "#6d1b7b",
                    }}
                  />
                  Todos
                </MenuItem>
              </Select>
            </FormControl>
            {isAccess(access, "USER CREATE") ? (
              <Button
                variant="outlined"
                style={{ borderRadius: 20, marginLeft: 20, padding: 10 }}
                startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Agregar Usuario
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>

        <hr />

        <TextField
          style={{ marginBottom: 20, width: 600 }}
          variant="standard"
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
          value={searchTerm}
          label={"Buscar usuario"}
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
          <Table hover size="sm">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Usuario</th>
                <th style={{ textAlign: "left" }}>Nombre</th>
                <th style={{ textAlign: "left" }}>Correo</th>
                <th style={{ textAlign: "left" }}>Telefono</th>
                <th style={{ textAlign: "left" }}>Rol</th>
                <th style={{ width: 150 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "left" }}>{item.userName}</td>
                    <td style={{ textAlign: "left" }}>{item.fullName}</td>
                    <td style={{ textAlign: "left" }}>{item.email}</td>
                    <td style={{ textAlign: "left" }}>{item.phoneNumber}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.rol ? item.rol.roleName : ""}
                    </td>
                    <td style={{ width: 150 }}>
                      <IconButton
                        style={{ marginRight: 5, color: "#009688" }}
                        onClick={() => {
                          userEdit(item);
                        }}
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </IconButton>

                      {isAccess(access, "USER UPDATE") ? (
                        item.isActive ? (
                          <IconButton
                            style={{ marginRight: 5, color: "#f44336" }}
                            onClick={() => {
                              resetPassword(item);
                            }}
                          >
                            <FontAwesomeIcon icon={faKey} />
                          </IconButton>
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}

                      {isAccess(access, "USER DELETE") ? (
                        <IconButton
                          style={{ color: "#f50057" }}
                          onClick={() => deactivateUser(item)}
                        >
                          <FontAwesomeIcon
                            icon={item.isActive ? faTrashAlt : faUserCheck}
                          />
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
          data={withSearch}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>
      <MediumModal
        titulo={"Agregar Usuario"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <AddUser setShowModal={setShowModal} />
      </MediumModal>

      <MediumModal
        titulo={`Usuario ${selectedUser.fullName}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <EditUser selectedUser={selectedUser} setShowModal={setShowEditModal} />
      </MediumModal>
    </div>
  );
};

export default UserList;
