import React, { useState, useEffect } from "react";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../helpers/Helpers";
import {
  getTipoNegocioByIdAsync,
  updateTipoNegocioByIdAsync,
} from "../../../services/TipoNegocioApi";

const TipoNegocioDetails = () => {
  let navigate = useNavigate();
  const { id } = useParams();

  const [tipoNegocio, setTipoNegocio] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      const result = await getTipoNegocioByIdAsync(id);
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setDescription(result.data.description);
      setTipoNegocio(result.data);
    })();
  }, []);

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
              navigate("/tipo-negocio/");
            }}
            style={{ marginRight: 20 }}
            variant="primary"
          >
            Regresar
          </Button>

          <h1>Detalle Tipo Negocio # {id}</h1>

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

export default TipoNegocioDetails;
