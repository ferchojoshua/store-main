import React, { useState, useEffect } from "react";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../../helpers/Helpers";
import {
  getRackByIdAsync,
  updateRackAsync,
} from "../../../../services/AlmacenApi";

const RackDetail = () => {
  let navigate = useNavigate();
  const { data } = useParams();
  const parametros = JSON.parse(data);

  const [rack, setRack] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      const result = await getRackByIdAsync(parametros.rackId);
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setDescription(result.data.description);
      setRack(result.data);
    })();
  }, []);

  const saveChangesAsync = async () => {
    const data = {
      id: parametros.rackId,
      description: description,
    };
    if (description === rack.description) {
      simpleMessage("Ingrese una descripcion diferente...", "error");
      return;
    }
    const result = await updateRackAsync(data);
    if (!result.statusResponse) {
      simpleMessage(result.error, "error");
      return;
    }
    simpleMessage("Exito...!", "success");
    setIsEdit(false);
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
              navigate(`/store/${parametros.id}`);
            }}
            style={{ marginRight: 20 }}
            variant="primary"
          >
            Regresar
          </Button>

          <h1>Detalle Rack # {parametros.rackId}</h1>

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
          <InputGroup.Text>Descripcion</InputGroup.Text>
          <FormControl
            type="text"
            aria-label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
      </Container>
    </div>
  );
};

export default RackDetail;
