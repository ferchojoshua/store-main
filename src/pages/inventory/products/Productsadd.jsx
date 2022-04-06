import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../helpers/Helpers";
import { addProductAsync } from "../../../services/ProductsApi";
import {
  getTipoNegocioAsync,
  getFamiliasByTNAsync,
} from "../../../services/TipoNegocioApi";
import {
  TextField,
  Button,
  Divider,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faSave } from "@fortawesome/free-solid-svg-icons";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";
import SmallModal from "../../../components/modals/SmallModal";
import FamiliaAdd from "../../settings/familia/FamiliaAdd";

const Productsadd = ({ setShowModal }) => {
  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
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

  const [showAddModal, setShowAddModal] = useState(false);

  const token = getToken();

  const saveChangesAsync = async () => {
    const data = {
      TipoNegocioId: selectedTipoNegocio,
      FamiliaId: selectedFamilia,
      description: description,
      barCode: barCode,
      marca: marca,
      modelo: modelo,
      uM: uM,
    };

    if (selectedTipoNegocio === "" || selectedTipoNegocio === 0) {
      toastError("Seleccione un tipo de negocio...");
      return;
    }

    if (selectedFamilia === "" || selectedFamilia === 0) {
      toastError("Seleccione una familia...");
      return;
    }

    if (description === "") {
      toastError("Ingrese una descripcion...");
      return;
    }
    setIsLoading(true);
    const result = await addProductAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error.request.status === 401) {
        navigate("/unauthorized");
        return;
      }
      toastError("No se pudo guardar producto, intente de nuevo!");
      return;
    }

    if (result.data === "eX01") {
      setIsLoading(false);
      deleteUserData();
      deleteToken();
      setIsLogged(false);
      return;
    }

    if (result.data.isDefaultPass) {
      setIsDefaultPass(true);
      return;
    }
    setIsLoading(false);
    setReload(!reload);
    toastSuccess("Producto Guardado...");
    setShowModal(false);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(false);
      const resultTipoNegocio = await getTipoNegocioAsync(token);
      if (!resultTipoNegocio.statusResponse) {
        setIsLoading(false);
        if (resultTipoNegocio.error.request.status === 401) {
          navigate("/unauthorized");
          return;
        }
        toastError("No se pudo cargar la lista de tipos de negocio");
        return;
      }

      if (resultTipoNegocio.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultTipoNegocio.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }
      setTipoNegocio(resultTipoNegocio.data);
    })();
  }, []);

  const handleChangeTN = async (value) => {
    setFamilia([]);
    setSelectedTipoNegocio(value);

    if (value !== "") {
      setIsLoading(true);
      const result = await getFamiliasByTNAsync(token, value);
      if (!result.statusResponse) {
        setIsLoading(false);
        toastError("No se pudo cargar la lista de familias");
        return;
      }

      if (result.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (result.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setFamilia(result.data);
    } else {
      setFamilia([]);
    }
  };

  return (
    <div>
      <Container style={{ width: 700 }}>
        <Divider />
        <Grid container spacing={3} style={{ marginTop: 5 }}>
          <Grid item sm={6}>
            <FormControl variant="standard" fullWidth required>
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione un tipo de negocio
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedTipoNegocio}
                onChange={(e) => handleChangeTN(e.target.value)}
                label="Tipo de Negocio"
                style={{ textAlign: "left" }}
              >
                <MenuItem key={0} value="">
                  <em> Seleccione un tipo de negocio</em>
                </MenuItem>
                {tipoNegocio.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.description}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <FormControl
                variant="standard"
                fullWidth
                style={{ marginRight: 20 }}
                required
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione una familia
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedFamilia}
                  onChange={(e) => setSelectedFamilia(e.target.value)}
                  label="Familia"
                  style={{ textAlign: "left" }}
                >
                  <MenuItem key={0} value="">
                    <em> Seleccione una familia</em>
                  </MenuItem>
                  {familia.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.description}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <Tooltip title="Agregar Familia" style={{ marginTop: 5 }}>
                <IconButton
                  onClick={() => {
                    selectedTipoNegocio
                      ? setShowAddModal(!showAddModal)
                      : toastError("Seleccione un tipo de negocio");
                  }}
                >
                  <FontAwesomeIcon
                    style={{
                      fontSize: 25,
                      color: "#ff5722",
                    }}
                    icon={faCirclePlus}
                  />
                </IconButton>
              </Tooltip>
            </div>

            <TextField
              fullWidth
              required
              style={{ marginTop: 20 }}
              variant="standard"
              onChange={(e) => setDescription(e.target.value.toUpperCase())}
              label={"Descripcion"}
              value={description}
            />

            <TextField
              fullWidth
              required
              style={{ marginTop: 20 }}
              variant="standard"
              onChange={(e) => setBarCode(e.target.value)}
              label={"Codigo de barras"}
              value={barCode}
            />
          </Grid>

          <Grid item sm={6}>
            <TextField
              fullWidth
              required
              variant="standard"
              onChange={(e) => setMarca(e.target.value.toUpperCase())}
              label={"Marca"}
              value={marca}
            />

            <TextField
              fullWidth
              required
              style={{ marginTop: 20 }}
              variant="standard"
              onChange={(e) => setModelo(e.target.value.toUpperCase())}
              label={"Modelo"}
              value={modelo}
            />

            <FormControl
              variant="standard"
              fullWidth
              style={{ marginTop: 20 }}
              required
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione una U/M...
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={uM}
                onChange={(e) => setUM(e.target.value)}
                label="Unidad de Medida"
                style={{ textAlign: "left" }}
              >
                <MenuItem key={0} value="">
                  <em>Seleccione una U/M...</em>
                </MenuItem>

                <MenuItem key={1} value={"PIEZA"}>
                  PIEZA
                </MenuItem>
                <MenuItem key={2} value={"SET"}>
                  SET
                </MenuItem>
                <MenuItem key={3} value={"PAR"}>
                  PAR
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              fullWidth
              variant="outlined"
              style={{ borderRadius: 20, marginTop: 31 }}
              startIcon={<FontAwesomeIcon icon={faSave} />}
              onClick={() => saveChangesAsync()}
            >
              Agregar Producto
            </Button>
          </Grid>
        </Grid>
      </Container>

      <SmallModal
        titulo={"Agregar Familia"}
        isVisible={showAddModal}
        setVisible={setShowAddModal}
      >
        <FamiliaAdd setShowModal={setShowAddModal} idTN={selectedTipoNegocio} />
      </SmallModal>
    </div>
  );
};

export default Productsadd;
