import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { simpleMessage } from "../../helpers/Helpers";

import { useParams } from "react-router-dom";
import {
  getProviderByIdAsync,
  updateProviderAsync,
} from "../../services/ProviderApi";

const ProviderDetails = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const result = await getProviderByIdAsync(id);
      if (!result.statusResponse) {
        simpleMessage(result.error, "error");
        return;
      }
      setName(result.data.nombre);
      setAddress(result.data.address);
      setPhone(result.data.phone);
      setEmail(result.data.email);
    })();
  }, []);

  const saveChangesAsync = async () => {
    const data = {
      id: id,
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

    const result = await updateProviderAsync(data);
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
              navigate("/providers/");
            }}
            style={{ marginRight: 20 }}
            variant="primary"
          >
            Regresar
          </Button>

          <h1>Detalles del Proveedor # {id}</h1>

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

        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text>Nombre</InputGroup.Text>
            <FormControl
              type="text"
              aria-label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEdit}
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
              disabled={!isEdit}
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
              disabled={!isEdit}
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
              disabled={!isEdit}
            />
          </InputGroup>
        </Form.Group>

        {isEdit ? (
          <Button variant="outline-primary" onClick={() => saveChangesAsync()}>
            Guardar cambios
          </Button>
        ) : (
          <></>
        )}
      </Container>
    </div>
  );
};

export default ProviderDetails;
