import React, { useState } from "react";
import { Container, InputGroup, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../helpers/Helpers";
import { addStoreAsync } from "../../../services/AlmacenApi";

import { Button, IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

const StoreAdd = () => {
  let navigate = useNavigate();
  const [name, setName] = useState("");

  const saveChangesAsync = async () => {
    const data = {
      name: name,
    };
    if (name === "") {
      simpleMessage("Ingrese un nombre...", "error");
      return;
    }
    const result = await addStoreAsync(data);
    if (!result.statusResponse) {
      simpleMessage(result.error, "error");
      return;
    }
    simpleMessage("Exito...!", "success");
    navigate("/stores/");
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

          <h1>Agregar Almacen</h1>
        </div>

        <hr />

        <InputGroup className="mb-3">
          <InputGroup.Text>Nombre</InputGroup.Text>
          <FormControl
            type="text"
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Tooltip title="Agregar Almacen">
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

export default StoreAdd;
