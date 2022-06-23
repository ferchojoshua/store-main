import React, { useState, useEffect, useContext } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../../helpers/Helpers";

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
  faCircleArrowLeft,
  faCirclePlus,
  faExternalLinkAlt,
  faSearch,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../../services/Account";
import {
  deleteCommunityAsync,
  getCommunitiesByMunAsync,
  getMunicipalityByIdAsync,
} from "../../../../services/CommunitiesApi";
import { DataContext } from "../../../../context/DataContext";
import NoData from "../../../../components/NoData";
import { isEmpty } from "lodash";
import PaginationComponent from "../../../../components/PaginationComponent";
import SmallModal from "../../../../components/modals/SmallModal";
import CommunityAdd from "./communities/CommunityAdd";
import CommunityDetail from "./communities/CommunityDetail";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MunicipalityDetails = () => {
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

  const [municipality, setMunicipality] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = communityList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (val.name.toString().includes(searchTerm)) {
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
      const result = await getMunicipalityByIdAsync(token, id);
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

      setMunicipality(result.data);

      const resultComms = await getCommunitiesByMunAsync(token, id);
      if (!resultComms.statusResponse) {
        setIsLoading(false);
        if (resultComms.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultComms.error.message);
        return;
      }

      if (resultComms.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultComms.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setCommunityList(resultComms.data);
      setIsLoading(false);
    })();
  }, [reload]);

  const deleteCommunity = async (item) => {
    MySwal.fire({
      icon: "warning",
      title: <p>Confirmar Eliminar</p>,
      text: `Elimiar: ${item.name}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          setIsLoading(true);
          const result = await deleteCommunityAsync(token, item.id);
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
        toastSuccess("Comunidad eliminada...!");
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
            }}
          >
            <Button
              onClick={() => {
                navigate(`/departments/${municipality.department.id}`);
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

            <h2>Comunidades Municipio: {municipality.name}</h2>
          </div>

          <hr />

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
            <h4>Lista de Comunidades</h4>

            {isAccess(access, "COMMUNITIES CREATE") ? (
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
                startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
                style={{ borderRadius: 20 }}
                variant="outlined"
              >
                Agregar Comunidad
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
            label={"Buscar Comunidad"}
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
                  <th style={{ textAlign: "left" }}>Nombre Comunidad</th>
                  {isAccess(access, "COMMUNITIES UPDATE") ||
                  isAccess(access, "COMMUNITIES DELETE") ? (
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
                      <td style={{ textAlign: "left" }}>{item.name}</td>
                      {isAccess(access, "COMMUNITIES UPDATE") ||
                      isAccess(access, "COMMUNITIES DELETE") ? (
                        <td>
                          {isAccess(access, "COMMUNITIES UPDATE") ? (
                            <IconButton
                              style={{ marginRight: 10, color: "#009688" }}
                              onClick={() => {
                                setSelectedCommunity(item);
                                setShowEditModal(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} />
                            </IconButton>
                          ) : (
                            <></>
                          )}

                          {isAccess(access, "COMMUNITIES DELETE") ? (
                            <IconButton
                              style={{ color: "#f50057" }}
                              onClick={() => deleteCommunity(item)}
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
        titulo={"Agregar Comunidad"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <CommunityAdd setShowModal={setShowModal} idMunicipality={id} />
      </SmallModal>

      <SmallModal
        titulo={`Editar: ${selectedCommunity.name}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <CommunityDetail
          selectedCommunity={selectedCommunity}
          setShowModal={setShowEditModal}
        />
      </SmallModal>
    </div>
  );
};

export default MunicipalityDetails;
