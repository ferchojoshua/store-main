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
import {
  getProductByIdAsync,
  updateProductAsync,
} from "../../services/ProductsApi";
import { getTipoNegocioAsync } from "../../services/TipoNegocioApi";
import { useParams } from "react-router-dom";

const ProductsDetails = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState("");

  const [barCode, setBarCode] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [uM, setUM] = useState("");

  const [tipoNegocio, setTipoNegocio] = useState([]);
  const [selectedTipoNegocio, setSelectedTipoNegocio] = useState("");
  const [familia, setFamilia] = useState([]);
  const [selectedFamilia, setSelectedFamilia] = useState("");

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

      const resultProduct = await getProductByIdAsync(id);
      if (!resultProduct.statusResponse) {
        simpleMessage(resultProduct.error, "error");
        return;
      }

      setSelectedFamilia(resultProduct.data.familia.id);
      setSelectedTipoNegocio(resultProduct.data.tipoNegocio.id);
      setDescription(resultProduct.data.description);
      setBarCode(resultProduct.data.barCode);
      setMarca(resultProduct.data.marca);
      setModelo(resultProduct.data.modelo);
      setUM(resultProduct.data.um);
    })();
  }, []);

  const saveChangesAsync = async () => {
    const data = {
      id: id,
      TipoNegocioId: selectedTipoNegocio,
      FamiliaId: selectedFamilia,
      description: description,
      barCode: barCode,
      marca: marca,
      modelo: modelo,
      uM: uM,
    };
    if (description === familia.description) {
      simpleMessage("Ingrese una descripcion diferente...", "error");
      return;
    }
    const result = await updateProductAsync(data);
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
              navigate("/products/");
            }}
            style={{ marginRight: 20 }}
            variant="primary"
          >
            Regresar
          </Button>

          <h1>Detalles de producto # {id}</h1>

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

        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Text>Tipo negocio</InputGroup.Text>
            <Form.Select
              disabled={!isEdit}
              onChange={(e) => setSelectedTipoNegocio(e.target.value)}
              value={selectedTipoNegocio}
            >
              <option value={0}>Seleccione un tipo de negocio...</option>
              {tipoNegocio.map((item) => {
                return <option value={item.id}>{item.description}</option>;
              })}
            </Form.Select>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>Familia</InputGroup.Text>
            <Form.Select
              value={selectedFamilia}
              disabled={!isEdit}
              onChange={(e) => setSelectedFamilia(e.target.value)}
            >
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
                disabled={!isEdit}
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
                disabled={!isEdit}
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
                disabled={!isEdit}
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
                disabled={!isEdit}
                type="text"
                aria-label="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <InputGroup className="mb-3">
            <InputGroup.Text>Unidad de Medida</InputGroup.Text>
            <Form.Select
              disabled={!isEdit}
              onChange={(e) => setUM(e.target.value)}
              value={uM}
            >
              <option>Seleccione una U/M...</option>
              <option>Pieza</option>
              <option>Set</option>
              <option>Par</option>;
            </Form.Select>
          </InputGroup>

          {isEdit ? (
            <Button
              variant="outline-primary"
              onClick={() => saveChangesAsync()}
            >
              Guardar cambios
            </Button>
          ) : (
            <></>
          )}
        </Form>
      </Container>
    </div>
  );
};

export default ProductsDetails;
