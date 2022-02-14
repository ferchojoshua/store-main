import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  InputGroup,
  FormControl,
  Table,
} from "react-bootstrap";
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
            style={{ marginRight: 20 }}
            variant="primary"
          >
            Regresar
          </Button>

          <h1>Detalle Almacen # {id}</h1>

          <Button
            onClick={() => {
              setIsEdit(!isEdit);
            }}
            variant="danger"
          >
            {isEdit ? "Cancelar" : "Editar"}
          </Button>
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
            <Button
              variant="outline-secondary"
              id="button-addon2"
              onClick={() => saveChangesAsync()}
            >
              Guardar cambios
            </Button>
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
            variant="success"
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
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        var data = { id: id, rackId: item.id };
                        data = JSON.stringify(data);
                        navigate(`/store/rack/${data}`);
                      }}
                      variant="info"
                    >
                      Ver
                    </Button>
                    <Button variant="danger" onClick={() => deleteRack(item)}>
                      Eliminar
                    </Button>
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
