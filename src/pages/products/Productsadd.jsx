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
import { getFamiliasAsync } from "../../services/FamiliaApi";
import { addProductAsync } from "../../services/ProductsApi";
import { getTipoNegocioAsync } from "../../services/TipoNegocioApi";

const Productsadd = () => {
  let navigate = useNavigate();
  const [description, setDescription] = useState("");

  const [barCode, setBarCode] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [uM, setUM] = useState("");

  const [tipoNegocio, setTipoNegocio] = useState([]);
  const [selectedTipoNegocio, setSelectedTipoNegocio] = useState("");
  const [familia, setFamilia] = useState([]);
  const [selectedFamilia, setSelectedFamilia] = useState("");

  const saveChangesAsync = async () => {
    const data = {
      TipoNegocioId: selectedTipoNegocio,
      FamiliaId: selectedFamilia,
      description: description,
      barCode: barCode,
      marca: marca,
      modelo:modelo,
      uM:uM
    };

    if (selectedTipoNegocio === "" || selectedTipoNegocio === 0) {
      simpleMessage("Seleccione un tipo de negocio...", "error");
      return;
    }

    if (selectedFamilia === "" || selectedFamilia === 0) {
      simpleMessage("Seleccione una familia...", "error");
      return;
    }

    if (description === "") {
      simpleMessage("Ingrese una descripcion...", "error");
      return;
    }

    const result = await addProductAsync(data);
    if (!result.statusResponse) {
      simpleMessage(result.error, "error");
      return;
    }
    simpleMessage("Exito...!", "success");
    navigate("/products/");
  };

  useEffect(() => {
    (async () => {
      const resultTipoNegocio = await getTipoNegocioAsync();
      if (!resultTipoNegocio.statusResponse) {
        simpleMessage(resultTipoNegocio.error, "error");
        return;
      }
      setTipoNegocio(resultTipoNegocio.data);

      const resultFamilia = await getFamiliasAsync();
      if (!resultFamilia.statusResponse) {
        simpleMessage(resultFamilia.error, "error");
        return;
      }
      setFamilia(resultFamilia.data);
    })();
  }, []);

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
              navigate("/products/");
            }}
            style={{ marginRight: 20 }}
            variant="primary"
          >
            Regresar
          </Button>

          <h1>Agregar Producto</h1>
        </div>

        <hr />
        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Text>Tipo negocio</InputGroup.Text>
            <Form.Select
              onChange={(e) => setSelectedTipoNegocio(e.target.value)}
            >
              <option value={0}>Seleccione un tipo de negocio...</option>
              {tipoNegocio.map((item) => {
                return <option value={item.id}>{item.description}</option>;
              })}
            </Form.Select>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Familia</InputGroup.Text>
            <Form.Select onChange={(e) => setSelectedFamilia(e.target.value)}>
              <option value={0}>Seleccione una familia...</option>
              {familia.map((item) => {
                return <option value={item.id}>{item.description}</option>;
              })}
            </Form.Select>
          </InputGroup>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>Descripcion</InputGroup.Text>
              <FormControl
                type="text"
                aria-label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>Codigo de Barra</InputGroup.Text>
              <FormControl
                type="text"
                aria-label="Description"
                value={barCode}
                onChange={(e) => setBarCode(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>Marca</InputGroup.Text>
              <FormControl
                type="text"
                aria-label="Marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>Modelo</InputGroup.Text>
              <FormControl
                type="text"
                aria-label="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <InputGroup className="mb-3">
            <InputGroup.Text>Unidad de Medida</InputGroup.Text>
            <Form.Select onChange={(e) => setUM(e.target.value)}>
              <option>Seleccione una U/M...</option>
              <option>Pieza</option>
              <option>Set</option>
              <option>Par</option>;
            </Form.Select>
          </InputGroup>

          <Button variant="primary" onClick={() => saveChangesAsync()}>
            Agregar Producto
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Productsadd;
