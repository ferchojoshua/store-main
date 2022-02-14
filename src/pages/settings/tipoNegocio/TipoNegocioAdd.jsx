import React, { useState } from "react";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../helpers/Helpers";
import { addTipoNegocioAsync } from "../../../services/TipoNegocioApi";

const TipoNegocioAdd = () => {
  let navigate = useNavigate();
  const [description, setDescription] = useState("");

  const saveChangesAsync = async () => {
    const data = {
      description: description,
    };
    if (description === "") {
      simpleMessage("Ingrese una descripcion...", "error");
      return;
    }
    const result = await addTipoNegocioAsync(data);
    if (!result.statusResponse) {
      simpleMessage(result.error, "error");
      return;
    }
    simpleMessage("Exito...!", "success");
    navigate("/tipo-negocio/");
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

          <h1>Agregar Tipo Negocio</h1>
        </div>
        <hr />

        <InputGroup className="mb-3">
          <InputGroup.Text>Descripcion</InputGroup.Text>
          <FormControl
            type="text"
            aria-label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={() => saveChangesAsync()}
          >
            Agregar Tipo de Negocio
          </Button>
        </InputGroup>
      </Container>
    </div>
  );
};

export default TipoNegocioAdd;
