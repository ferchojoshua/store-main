import React, { useState, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Button,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import { simpleMessage } from "../../helpers/Helpers";
import { addProviderAsync } from "../../services/ProviderApi";

const AddProviderComponent = ({ setShowModal }) => {
  const { reload, setReload } = useContext(DataContext);
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
    setReload(!reload);
    setShowModal(false);
    simpleMessage("Exito...!", "success");
  };

  return (
    <div>
      <Container style={{ textAlign: "center" }}>
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

        <hr />

        <Button
          variant="outline-primary"
          style={{ borderRadius: 20 }}
          onClick={() => saveChangesAsync()}
        >
          <FontAwesomeIcon style={{ marginRight: 10 }} icon={faSave} />
          Agregar Proveedor
        </Button>
      </Container>
    </div>
  );
};

export default AddProviderComponent;