import React, { useState, useEffect } from "react";
import { Container, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../../helpers/Helpers";
import {
  getFamiliaByIdAsync,
  updateFamiliaByIdAsync,
} from "../../../services/FamiliaApi";

import { Button, IconButton, Tooltip } from "@mui/material";
import {
  faCancel,
  faCircleArrowLeft,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FamiliaDetails = () => {
  let navigate = useNavigate();
  const { id } = useParams();

  const [familia, setFamilia] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      const result = await getFamiliaByIdAsync(id);
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setDescription(result.data.description);
      setFamilia(result.data);
    })();
  }, []);

  const saveChangesAsync = async () => {
    const data = {
      id: id,
      description: description,
    };
    if (description === familia.description) {
      simpleMessage("Ingrese una descripcion diferente...", "error");
      return;
    }
    const result = await updateFamiliaByIdAsync(data);
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
              navigate("/familia/");
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

          <h1>Detalle Familia # {id}</h1>

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
          <InputGroup.Text>Descripcion</InputGroup.Text>
          <FormControl
            type="text"
            aria-label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
      </Container>
    </div>
  );
};

export default FamiliaDetails;
