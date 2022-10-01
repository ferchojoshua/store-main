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
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Stack,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCirclePlus,
  faCircleUser,
  faCircleXmark,
  faExternalLinkAlt,
  faKey,
  faSearch,
  faTrashAlt,
  faUser,
  faUserCheck,
  faUserLargeSlash,
  faUsers,
  faUserSlash,
  faUsersSlash,
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
  let ruta = getRuta();

  const {
    setReload,
    reload,
    setIsLoading,
    setIsLogged,
    setIsDefaultPass,
    access,
    isDarkMode,
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
              navigate(`${ruta}/unauthorized`);
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
        navigate(`${ruta}/unauthorized`);
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

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

  return (
    <div>
      <Container>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h1>Lista de Usuarios</h1>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <FormControl
              variant="standard"
              style={{ textAlign: "left", width: 200, marginTop: 10 }}
            >
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
          </Stack>
        </Stack>

        <hr />

        <TextField
          style={{ marginBottom: 20, maxWidth: 600 }}
          fullWidth
          variant="standard"
          onChange={(e) => onChangeSearch(e.target.value.toUpperCase())}
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
          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Usuario</th>
                <th style={{ textAlign: "left" }}>Nombre</th>
                <th style={{ textAlign: "left" }}>Telefono</th>
                <th style={{ textAlign: "left" }}>Rol</th>
                <th style={{ textAlign: "center" }}>En Linea</th>
                <th style={{ width: 150 }}>Acciones</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td style={{ textAlign: "left" }}>{item.userName}</td>
                    <td style={{ textAlign: "left" }}>{item.fullName}</td>

                    <td style={{ textAlign: "left" }}>{item.phoneNumber}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.rol ? item.rol.roleName : ""}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <FontAwesomeIcon
                        icon={item.isActiveSession ? faCircleUser : faUserSlash}
                        style={{
                          fontSize: 20,
                          marginTop: 10,
                          color: item.isActiveSession ? "#00a152" : "#ab003c",
                        }}
                      />
                    </td>
                    <td style={{ width: 150 }}>
                      <IconButton
                        style={{ marginRight: 5, color: "#00a152" }}
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
