import React, { useState, useEffect, useContext } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import RackAdd from "./racks/RackAdd";
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
  deleteRackAsync,
  getRackStoreAsync,
  getStoreByIdAsync,
  updateStoreAsync,
} from "../../../services/AlmacenApi";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  faCancel,
  faCircleArrowLeft,
  faCirclePlus,
  faExternalLinkAlt,
  faTrashAlt,
  faPaperPlane,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { DataContext } from "../../../context/DataContext";
import SmallModal from "../../../components/modals/SmallModal";
import { isEmpty } from "lodash";
import PaginationComponent from "../../../components/PaginationComponent";
import RackDetail from "./racks/RackDetail";
import NoData from "../../../components/NoData";
import { isAccess } from "../../../helpers/Helpers";

const StoreDetails = () => {
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
  const MySwal = withReactContent(Swal);
  const { id } = useParams();

  const [store, setStore] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");

  const [rackList, setRackList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRack, setSelectedRack] = useState([]);

  //Para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = rackList.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getStoreByIdAsync(token, id);
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
      setName(result.data.name);
      setStore(result.data);

      const resultRacks = await getRackStoreAsync(token, id);
      if (!resultRacks.statusResponse) {
        setIsLoading(false);
        if (resultRacks.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultRacks.error.message);
        return;
      }

      if (resultRacks.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultRacks.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setRackList(resultRacks.data);
    })();
  }, [reload]);

  const saveChangesAsync = async () => {
    const data = {
      id: id,
      name: name,
    };
    if (name === store.name) {
      toastError("Ingrese un nombre diferente...");
      return;
    }
    const result = await updateStoreAsync(token, data);
    if (!result.statusResponse) {
      if (result.error.request.status === 401) {
        navigate(`${ruta}/unauthorized`);
        return;
      }
      toastError("Ocurrio un error al guardar los cambios");
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
    toastSuccess("Cambios realizados...");
    setIsEdit(false);
  };

  const deleteRack = async (item) => {
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
          const result = await deleteRackAsync(token, item.id);
          if (!result.statusResponse) {
            setIsLoading(false);
            if (result.error.request.status === 401) {
              navigate(`${ruta}/unauthorized`);
              return;
            }
            toastError("Ocurrio un error al eliminar rack");
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
        toastSuccess("Rack eliminado...");
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
            <Button
              onClick={() => {
                navigate("/stores/");
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

            <h1>Detalle Almacen # {id}</h1>

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
                  icon={isEdit ? faCancel : faPenToSquare}
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
            onChange={(e) => setName(e.target.value.toUpperCase())}
            value={name}
            label={"Nombre Almacen"}
            disabled={!isEdit}
            placeholder={"Ingrese nombre almacen"}
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
              marginTop: 20,
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <h4>Lista de Raks</h4>

            {isAccess(access, "MISCELANEOS CREATE") ? (
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
                startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
                style={{ borderRadius: 20 }}
                variant="outlined"
              >
                Agregar Rack
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
                  <th style={{ textAlign: "left" }}>Descripcion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                {rackList.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td style={{ textAlign: "left" }}>{item.description}</td>
                      <td>
                        <IconButton
                          style={{ marginRight: 10, color: "#009688" }}
                          onClick={() => {
                            setSelectedRack(item);
                            setShowEditModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </IconButton>
                        <IconButton
                          style={{ color: "#f50057" }}
                          onClick={() => deleteRack(item)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          <PaginationComponent
            data={rackList}
            paginate={paginate}
            itemsperPage={itemsperPage}
          />
        </Paper>
      </Container>
      <SmallModal
        titulo={"Agregar Rack"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        <RackAdd setShowModal={setShowModal} />
      </SmallModal>

      <SmallModal
        titulo={`Editar: ${selectedRack.description}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <RackDetail
          selectedRack={selectedRack}
          setShowModal={setShowEditModal}
        />
      </SmallModal>
    </div>
  );
};

export default StoreDetails;
