import React, { useState } from "react";
import { Container, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../../helpers/Helpers";
import { addRackToStoreAsync } from "../../../../services/AlmacenApi";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";

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
            style={{ marginRight: 20, borderRadius: 20 }}
            variant="outlined"
          >
            <FontAwesomeIcon
              style={{ marginRight: 10, fontSize: 20 }}
              icon={faCircleArrowLeft}
            />
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

          <Tooltip title="Agregar Rack">
            <IconButton onClick={() => saveChangesAsync()}>
              <FontAwesomeIcon
                icon={faSave}
                style={{ fontSize: 30, color: "#2196f3" }}
              />
            </IconButton>
          </Tooltip>
        </InputGroup>
      </Container>
    </div>
  );
};

export default RackAdd;
