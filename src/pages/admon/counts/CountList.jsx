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
import { Button, IconButton, TextField, InputAdornment } from "@mui/material";
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

import {
  deleteCountAsync,
  getCuentasAsync,
} from "../../../services/ContabilidadApi";
import { CountAdd } from "./CountAdd";
import SmallModal from "../../../components/modals/SmallModal";
import { CountDetails } from "./CountDetails";

export const CountList = () => {
  const {
    isDarkMode,
    reload,
    setReload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
  let ruta = getRuta();

  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [countList, setCountList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = countList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.descripcion.toString().includes(searchTerm) ||
      val.countNumber.toString().includes(searchTerm)
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

  const token = getToken();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCount, setSelectedCount] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const result = await getCuentasAsync(token);
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
      setCountList(result.data);
    })();
  }, [reload]);

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

  const deleteCuenta = (item) => {
    MySwal.fire({
      icon: "warning",
      title: <p>Eliminar Cuenta</p>,
      text: `Elimiar: ${item.descripcion}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          setIsLoading(true);
          const result = await deleteCountAsync(token, item.id);
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
        toastSuccess("Cuenta Eliminado!");
      }
    });
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
          <h1>Lista de Cuentas</h1>

          {isAccess(access, "CONT CREATE") ? (
            <Button
              variant="outlined"
              style={{ borderRadius: 20 }}
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Agregar cuenta
            </Button>
          ) : (
            <></>
          )}
        </div>

        <hr />

        <TextField
          style={{ marginBottom: 20, width: 600 }}
          variant="standard"
          onChange={(e) => onChangeSearch(e.target.value.toUpperCase())}
          value={searchTerm}
          label={"Buscar Cuenta"}
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
                <th>#.Cuenta</th>
                <th style={{ textAlign: "left" }}>Nombre Cuenta</th>
                <th style={{ textAlign: "center" }}>Clasficacion</th>
                <th style={{ width: 150 }}>Acciones</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.countNumber}</td>
                    <td style={{ textAlign: "left" }}>{item.descripcion}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.countGroup.description}
                    </td>

                    <td style={{ width: 150 }}>
                      {isAccess(access, "CONT VER") ? (
                        <IconButton
                          style={{ marginRight: 10, color: "#009688" }}
                          onClick={() => {
                            setSelectedCount(item);
                            setShowEditModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </IconButton>
                      ) : (
                        <></>
                      )}
                      {isAccess(access, "CONT DELETE") ? (
                        <IconButton
                          style={{ color: "#f50057" }}
                          onClick={() => deleteCuenta(item)}
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
          data={withSearch}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>

      <SmallModal
        titulo={"Agregar Cuenta"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <CountAdd setShowModal={setShowModal} />
      </SmallModal>

      <SmallModal
        titulo={`Editar: ${selectedCount.descripcion}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <CountDetails
          selectedCount={selectedCount}
          setShowModal={setShowEditModal}
        />
      </SmallModal>
    </div>
  );
};
