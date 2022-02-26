import React, { useState, useEffect } from "react";
import { Container, InputGroup, FormControl, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../helpers/Helpers";
import {
  deleteRackAsync,
  getRackStoreAsync,
  getStoreByIdAsync,
  updateStoreAsync,
} from "../../../services/AlmacenApi";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Button, IconButton, Tooltip } from "@mui/material";
import {
  faCancel,
  faCircleArrowLeft,
  faCirclePlus,
  faEdit,
  faSave,
  faExternalLinkAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StoreDetails = () => {
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const { id } = useParams();

  const [store, setStore] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");

  const [rackList, setRackList] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getStoreByIdAsync(id);
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setName(result.data.name);
      setStore(result.data);

      const resultRacks = await getRackStoreAsync(id);
      if (!resultRacks.statusResponse) {
        simpleMessage(resultRacks.error, "error");
        return;
      }

      setRackList(resultRacks.data);
    })();
  }, [rackList]);

  const saveChangesAsync = async () => {
    const data = {
      id: id,
      name: name,
    };
    if (name === store.name) {
      simpleMessage("Ingrese un nombre diferente...", "error");
      return;
    }
    const result = await updateStoreAsync(data);
    if (!result.statusResponse) {
      simpleMessage(result.error, "error");
      return;
    }
    simpleMessage("Exito...!", "success");
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
          const result = await deleteRackAsync(item.id);
          if (!result.statusResponse) {
            Swal.fire(result.error, "", "error");
            return;
          }
        })();
        Swal.fire("Eliminado!", "", "success");
      }
    });
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

          <IconButton
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: 30, color: isEdit ? "#2196f3" : "#ff9800" }}
              icon={isEdit ? faCancel : faEdit}
            />
          </IconButton>
        </div>

        <hr />

        <InputGroup className="mb-3">
          <InputGroup.Text>Nombre</InputGroup.Text>
          <FormControl
            type="text"
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEdit}
          />
          {isEdit ? (
            <Tooltip title="Agregar Tipo Negocio">
              <IconButton onClick={() => saveChangesAsync()}>
                <FontAwesomeIcon
                  icon={faSave}
                  style={{ fontSize: 30, color: "#2196f3" }}
                />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}
        </InputGroup>

        <hr />

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

          <Button
            onClick={() => {
              navigate(`/store/rack/add/${id}`);
            }}
            startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
            style={{ borderRadius: 20 }}
            variant="outlined"
          >
            Agregar Rack
          </Button>
        </div>

        <hr />

        <Table hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left" }}>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rackList.map((item) => {
              return (
                <tr>
                  <td>{item.id}</td>
                  <td style={{ textAlign: "left" }}>{item.description}</td>
                  <td>
                    <IconButton
                      style={{ marginRight: 10, color: "#009688" }}
                      onClick={() => {
                        var data = { id: id, rackId: item.id };
                        data = JSON.stringify(data);
                        navigate(`/store/rack/${data}`);
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
      </Container>
    </div>
  );
};

export default StoreDetails;
