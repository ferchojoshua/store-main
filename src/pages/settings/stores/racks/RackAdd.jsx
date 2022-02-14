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
import { simpleMessage } from "../../../../helpers/Helpers";
import { addRackToStoreAsync } from "../../../../services/AlmacenApi";

const RackAdd = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [description, setDescription] = useState("");

  const saveChangesAsync = async () => {
    const data = {
      almacenId: id,
      description: description,
    };
    if (description === "") {
      simpleMessage("Ingrese una descripcion...", "error");
      return;
    }
    const result = await addRackToStoreAsync(data);
    if (!result.statusResponse) {
      simpleMessage(result.error, "error");
      return;
    }
    simpleMessage("Exito...!", "success");
    navigate(`/store/${id}`);
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
              navigate(`/store/${id}`);
            }}
            style={{ marginRight: 20 }}
            variant="primary"
          >
            Regresar
          </Button>

          <h1>Agregar Rack</h1>
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
            Agregar Rack
          </Button>
        </InputGroup>
      </Container>
    </div>
  );
};

export default RackAdd;
