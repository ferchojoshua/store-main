import React, { useState, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, InputGroup, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../helpers/Helpers";
import { addTipoNegocioAsync } from "../../../services/TipoNegocioApi";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

const TipoNegocioAdd = () => {
  const { reload, setReload } = useContext(DataContext);
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
    setReload(!reload);
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
            style={{ marginRight: 20, borderRadius: 20 }}
            variant="outlined"
          >
            <FontAwesomeIcon
              style={{ marginRight: 10, fontSize: 20 }}
              icon={faCircleArrowLeft}
            />
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

          <Tooltip title="Agregar Tipo Negocio">
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

export default TipoNegocioAdd;
