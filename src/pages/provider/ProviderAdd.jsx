import React, { useState, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { Container, InputGroup, FormControl, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../helpers/Helpers";
import { addProviderAsync } from "../../services/ProviderApi";

import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

const ProviderAdd = () => {
  const { reload, setReload } = useContext(DataContext);
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const saveChangesAsync = async () => {
    const data = {
      nombre: name,
      address: address,
      phone: phone,
      email: email,
    };
    if (name === "") {
      simpleMessage("Ingrese un nombre...", "error");
      return;
    }

    if (address === "") {
      simpleMessage("Ingrese una direccion...", "error");
      return;
    }

    if (phone === "") {
      simpleMessage("Ingrese un telefono...", "error");
      return;
    }

    const result = await addProviderAsync(data);
    if (!result.statusResponse) {
      simpleMessage(result.error, "error");
      return;
    }
    simpleMessage("Exito...!", "success");
    setReload(!reload);
    navigate("/providers/");
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
              navigate("/providers/");
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

          <h1>Agregar Proveedor</h1>
        </div>

        <hr />

        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text>Nombre</InputGroup.Text>
            <FormControl
              type="text"
              aria-label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text>Direccion</InputGroup.Text>
            <FormControl
              type="text"
              aria-label="Direccion"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text>Telefono</InputGroup.Text>
            <FormControl
              type="text"
              aria-label="Telefono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text>Correo</InputGroup.Text>
            <FormControl
              type="text"
              aria-label="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Button
          style={{ borderRadius: 20 }}
          variant="outlined"
          onClick={() => saveChangesAsync()}
        >
          <FontAwesomeIcon
            style={{ marginRight: 10, fontSize: 20 }}
            icon={faCirclePlus}
          />
          Agregar Proveedor
        </Button>
      </Container>
    </div>
  );
};

export default ProviderAdd;
