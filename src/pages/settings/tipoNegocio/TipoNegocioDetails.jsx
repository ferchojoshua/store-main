import React, { useState, useEffect, useContext } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getRuta,
  isAccess,
  simpleMessage,
  toastError,
  toastSuccess,
} from "../../../helpers/Helpers";
import {
  deleteFamiliaAsync,
  getFamiliasByTNAsync,
  getTipoNegocioByIdAsync,
  updateTipoNegocioByIdAsync,
} from "../../../services/TipoNegocioApi";

import {
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Container,
  Paper,
} from "@mui/material";
import {
  faCancel,
  faCircleArrowLeft,
  faCirclePlus,
  faEdit,
  faExternalLinkAlt,
  faPaperPlane,
  faSearch,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";
import { DataContext } from "../../../context/DataContext";
import NoData from "../../../components/NoData";
import { isEmpty } from "lodash";
import PaginationComponent from "../../../components/PaginationComponent";
import SmallModal from "../../../components/modals/SmallModal";
import FamiliaAdd from "../familia/FamiliaAdd";
import FamiliaDetails from "../familia/FamiliaDetails";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const TipoNegocioDetails = () => {
  let ruta = getRuta();

  const {
    isDarkMode,
    setIsLoading,
    reload,
    setReload,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
  const token = getToken();
  let navigate = useNavigate();
  const { id } = useParams();
  const MySwal = withReactContent(Swal);

  const [tipoNegocio, setTipoNegocio] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState("");

  const [familiaList, setFamiliaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFamilia, setSelectedFamilia] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = familiaList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (val.description.toString().includes(searchTerm)) {
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

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getTipoNegocioByIdAsync(token, id);
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
      setDescription(result.data.description);
      setTipoNegocio(result.data);

      const resultFamilias = await getFamiliasByTNAsync(token, id);
      if (!resultFamilias.statusResponse) {
        setIsLoading(false);
        if (resultFamilias.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error.message);
        return;
      }

      if (resultFamilias.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultFamilias.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setFamiliaList(resultFamilias.data);
    })();
  }, [reload]);

  const saveChangesAsync = async () => {
    const data = {
      id: id,
      description: description,
    };
    if (description === tipoNegocio.description) {
      simpleMessage("Ingrese una descripcion diferente...", "error");
      return;
    }
    const result = await updateTipoNegocioByIdAsync(data);
    if (!result.statusResponse) {
      simpleMessage(result.error, "error");
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
    toastSuccess("Tipo de negocio Actualizado...!");
    setIsEdit(false);
  };

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
          setIsLoading(true);
          const result = await deleteFamiliaAsync(token, item.id);
          if (!result.statusResponse) {
            setIsLoading(false);
            if (result.error.request.status === 401) {
              navigate(`${ruta}/unauthorized`);
              return;
            }
            toastError("Ocurrio un error al eliminar familia");
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
        toastSuccess("Familia eliminada...");
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
            <Button
              onClick={() => {
                navigate(`${ruta}/tipo-negocio/`);
              }}
              style={{ marginRight: 20, borderRadius: 20 }}
              variant="outlined"
            >
              <FontAwesomeIcon
                style={{ marginRight: 10, fontSize: 20 }}
                icon={faCircleArrowLeft}
              />
              Regresar
            </Button>

            <h2>Detalle Tipo Negocio # {id}</h2>

            {isAccess(access, "MISCELANEOS UPDATE") ? (
              <IconButton
                onClick={() => {
                  setIsEdit(!isEdit);
                }}
              >
                <FontAwesomeIcon
                  style={{
                    fontSize: 30,
                    color: isEdit ? "#4caf50" : "#ff5722",
                  }}
                  icon={isEdit ? faCancel : faEdit}
                />
              </IconButton>
            ) : (
              <div />
            )}
          </div>

          <hr />

          <TextField
            fullWidth
            variant="standard"
            onChange={(e) => setDescription(e.target.value.toUpperCase())}
            value={description}
            label={"Descripcion"}
            disabled={!isEdit}
            placeholder={"Ingrese descripcion"}
            InputProps={
              isEdit
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          style={{ marginRight: 10 }}
                          onClick={() => saveChangesAsync()}
                        >
                          <FontAwesomeIcon
                            style={{ color: "#ff5722" }}
                            icon={faPaperPlane}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                : {}
            }
          />

          <Divider />

          <div
            style={{
              marginTop: 10,
              marginBottom: 10,
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <h4>Lista de Familias</h4>

            {isAccess(access, "MISCELANEOS CREATE") ? (
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
                startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
                style={{ borderRadius: 20 }}
                variant="outlined"
              >
                Agregar Familia
              </Button>
            ) : (
              <></>
            )}
          </div>

          <Divider />

          <TextField
            style={{ marginBottom: 20, width: 600, marginTop: 20 }}
            variant="standard"
            onChange={(e) => onChangeSearch(e.target.value.toUpperCase())}
            value={searchTerm}
            label={"Buscar familia"}
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
                  <th style={{ textAlign: "left" }}>Descripcion</th>
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
                      <td style={{ textAlign: "left" }}>{item.description}</td>
                      {isAccess(access, "MISCELANEOS UPDATE") ||
                      isAccess(access, "MISCELANEOS DELETE") ? (
                        <td>
                          {isAccess(access, "MISCELANEOS UPDATE") ? (
                            <IconButton
                              style={{ marginRight: 10, color: "#009688" }}
                              onClick={() => {
                                setSelectedFamilia(item);
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
                              onClick={() => deleteFamilia(item)}
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
            data={withSearch}
            paginate={paginate}
            itemsperPage={itemsperPage}
          />
        </Paper>
      </Container>

      <SmallModal
        titulo={"Agregar Familia"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <FamiliaAdd setShowModal={setShowModal} idTN={id} />
      </SmallModal>

      <SmallModal
        titulo={`Editar: ${selectedFamilia.description}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <FamiliaDetails
          selectedFamilia={selectedFamilia}
          setShowModal={setShowEditModal}
        />
      </SmallModal>
    </div>
  );
};

export default TipoNegocioDetails;
