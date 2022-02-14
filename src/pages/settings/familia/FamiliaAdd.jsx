import React, { useState } from "react";
import { Container, Button, InputGroup, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../helpers/Helpers";
import { addFamiliaAsync } from "../../../services/FamiliaApi";

const FamiliaAdd = () => {
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
    const result = await addFamiliaAsync(data);
    if (!result.statusResponse) {
      simpleMessage(result.error, "error");
      return;
    }
    simpleMessage("Exito...!", "success");
    navigate("/familia/");
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
              navigate("/familia/");
            }}
            style={{ marginRight: 20 }}
            variant="primary"
          >
            Regresar
          </Button>

          <h1>Agregar Familia</h1>
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
            Agregar Familia
          </Button>
        </InputGroup>
      </Container>
    </div>
  );
};

export default FamiliaAdd;
