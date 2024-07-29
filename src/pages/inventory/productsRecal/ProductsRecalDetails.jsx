import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Container,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";
import { updateProductrecallAsync } from "../../../services/ProductsApi";
import {
  getFamiliasByTNAsync,
  getTipoNegocioAsync,
} from "../../../services/TipoNegocioApi";
import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import { getListAsync } from "../../../services/CreateLogoApi";
import { DataContext } from "../../../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faPenToSquare,
  faSave,
} from "@fortawesome/free-solid-svg-icons";


const ProductsRecalDetails = ({ selectedProduct, setShowModal,}) => {
  let ruta = getRuta();

  const { setIsLoading, reload, setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState(selectedProduct.description);
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(selectedProduct.aid);
  const [tipoNegocio, setTipoNegocio] = useState([]);
  const [selectedTNegocio, setselectedTNegocio] = useState(selectedProduct.tnId);
  const [familia, setFamilia] = useState([]);
  const [selectedFamilia, setSelectedFamilia] = useState(selectedProduct.fid);
  const [marca, setmarca] = useState(selectedProduct.marca);
  const [modelo, setModelo] = useState(selectedProduct.modelo);
  const [pvd, setPvd] = useState(selectedProduct.pvd);
  const [pvm, setPvm] = useState(selectedProduct.pvm);
  const [um, setUM] = useState(selectedProduct.um); 
  const [catalogo, setCatalogo] = useState([]);
  const [selectedCatalogo, setSelectedCatalogo] = useState("");

  const [actualizarVentaDetalle, setActualizarVentaDetalle] = useState(false);
  const [actualizarVentaMayor, setActualizarVentaMayor] = useState(false);

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultTipoNegocio = await getTipoNegocioAsync(token);
      if (!resultTipoNegocio.statusResponse) {
        setIsLoading(false);
        if (resultTipoNegocio.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultTipoNegocio.error.message);
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

      const data = { operacion: 2, };

      const resultStore = await getStoresByUserAsync(token);
      if (!resultStore.statusResponse) {
        setIsLoading(false);
        if (resultStore.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultStore.error.message);
        return;
      }

      if (resultStore.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultStore.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setStoreList(resultStore.data);
      if (resultStore.data.length < 4) {
        setSelectedStore(resultStore.data[0].id);
      }

      const resultList = await getListAsync(token, data);
      if (!resultList.statusResponse) {
        setIsLoading(false);
        if (resultList.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultList.error.message);
        return;
      }

      if (resultList.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultList.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }
      setCatalogo(resultList.data);

      const result = await getFamiliasByTNAsync(
        token,
        selectedProduct.tipoNegocio.id
      );
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
        }
        toastError(result.error.message);
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
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setFamilia(result.data);
    })();
  }, []);

  const savesChangesAsync = async () => {
    const data = {
      id: selectedProduct.id,

      storeId: selectedStore?.id ?? 0,
      porcentaje: selectedCatalogo,
      actualizarVentaDetalle,
      actualizarVentaMayor,
    };

    try {
      if (selectedTNegocio === "" || selectedTNegocio === 0) {
        toastError("Seleccione un tipo de negocio...");
        return;
      }

      if (selectedFamilia === "" || selectedFamilia === 0) {
        toastError("Seleccione una familia...");
        return;
      }

      if (description.trim() === "") {
        toastError("Ingrese una descripcion...");
        return;
      }

      setIsLoading(true);
      const result = await updateProductrecallAsync(token, data);
      if (!result.statusResponse) {
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error.message);
        return;
      }

      if (result.data === "eX01") {
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (result.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }

      toastSuccess("Producto Actualizado...!");
      setReload(!reload);
      setIsEdit(false);
      setShowModal(false);
    } catch (error) {
      toastError("Ocurrió un error al actualizar el producto.");
      console.error("Error en savesChangesAsync:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeTN = async (value) => {
    setFamilia([]);
    setSelectedFamilia("");
    setselectedTNegocio(value);

    if (value !== "") {
      setIsLoading(true);

      const result = await getFamiliasByTNAsync(token, value);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(result.error.message);
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
        setIsLoading(false);
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
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
          marginBottom: 10,
        }}
      >
        <Container>
        <FormControl
            variant="standard"
            fullWidth
            style={{ marginRight: 20 }}
            disabled={!isEdit}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Seleccione un Almacen
            </InputLabel>
            <Select
              defaultValue=""
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              label="Almacen"
              style={{ textAlign: "left" }}
            >
              <MenuItem key={-1} value="">
                <em> Seleccione un Almacen</em>
              </MenuItem>
              {storeList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
              <MenuItem
                key={"t"}
                value={"t"}
                disabled={
                  storeList.length <= 6 ||
                  storeList.length <= 5 ||
                  storeList.length <= 4 ||
                  storeList.length <= 3 ||
                  storeList.length <= 2 ||
                  storeList.length <= 1
                    ? false
                    : true
                }
              >
                Todos...
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl
            variant="standard"
            fullWidth
            required
            style={{ marginTop: 20 }}
            disabled={!isEdit}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Seleccione un tipo de negocio
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedTNegocio}
              onChange={(e) => handleChangeTN(e.target.value)}
              label="Tipo de Negocio"
              style={{ textAlign: "left" }}
              disabled={true}
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

          <FormControl
            variant="standard"
            fullWidth
            style={{ marginTop: 20 }}
            disabled={!isEdit}
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
              disabled={true}
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

          <TextField
            fullWidth
            required
            style={{ marginTop: 20 }}
            variant="standard"
            onChange={(e) => setDescription(e.target.value.toUpperCase())}
            label={"Descripcion"}
            value={description ? description : ""}
            disabled={true}
          />
          {/* 
          <TextField
            fullWidth
            required
            style={{ marginTop: 20 }}
            variant="standard"
            onChange={(e) => setBarCode(e.target.value)}
            label={"Codigo de barras"}
            value={barCode ? barCode : ""}
            disabled={true}
          /> */}

          <TextField
            fullWidth
            required
            variant="standard"
            onChange={(e) => setmarca(e.target.value.toUpperCase())}
            label={"marca"}
            value={marca ? marca : ""}
            style={{ marginTop: 20 }}
            disabled={true}
          />

          <TextField
            fullWidth
            required
            style={{ marginTop: 20 }}
            variant="standard"
            onChange={(e) => setModelo(e.target.value.toUpperCase())}
            label={"Modelo"}
            value={modelo ? modelo : ""}
            disabled={true}
          /> 
          
          <TextField
            fullWidth
            required
            style={{ marginTop: 20 }}
            variant="standard"
            onChange={(e) => setPvd(e.target.value.toUpperCase())}
            label={"PVD"}
            value={pvd ? pvd : ""}
            disabled={true}
          />

          <TextField
          fullWidth
          required
          style={{ marginTop: 20 }}
          variant="standard"
          onChange={(e) => setPvm(e.target.value.toUpperCase())}
          label={"PVM"}
          value={pvm ? pvm : ""}
          disabled={true}
          />

          <FormControl
            variant="standard"
            fullWidth
            style={{ marginTop: 20 }}
            required
            disabled={true}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Seleccione una U/M...
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={um}
              onChange={(e) => setUM(e.target.value)}
              label="Unidad de Medida"
              style={{ textAlign: "left" }}
              disabled={true}
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
       

          <FormControl
            variant="standard"
            fullWidth
            style={{ marginTop: 20 }}
            required
            disabled={!isEdit}
          >
            <InputLabel id="catalogo-select-label">
              Seleccione un item del catálogo
            </InputLabel>
            <Select
              labelId="catalogo-select-label"
              id="catalogo-select"
              value={selectedCatalogo}
              onChange={(e) => setSelectedCatalogo(e.target.value)}
              label="Catálogo"
              style={{ textAlign: "left" }}
            >
              <MenuItem key={0} value="">
                <em>Seleccione un item del catálogo</em>
              </MenuItem>
              {catalogo.map((item) => {
                // Filtrar solo los elementos con estado activo (estado === true)
                if (item.estado) {
                  return (
                    <MenuItem key={item.id} value={item.valor}>
                      {item.valor} %
                    </MenuItem>
                  );
                }
                return null; // Si el estado no es activo, no renderizar el MenuItem
              })}
            </Select>
          </FormControl>

          {/* Agregar Checkboxes */}
          <div style={{ marginTop: 20 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={actualizarVentaDetalle}
                  onChange={(e) => setActualizarVentaDetalle(e.target.checked)}
                  disabled={!isEdit}
                />
              }
              label="Actualizar Venta Detalle"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={actualizarVentaMayor}
                  onChange={(e) => setActualizarVentaMayor(e.target.checked)}
                  disabled={!isEdit}
                />
              }
              label="Actualizar Venta Mayor"
            />
          </div>

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
              fullWidth
              variant="outlined"
              style={{
                borderRadius: 20,
                borderColor: isEdit ? "#9c27b0" : "#ff9800",
                color: isEdit ? "#9c27b0" : "#ff9800",
                marginRight: 10,
              }}
              startIcon={
                <FontAwesomeIcon
                  icon={isEdit ? faCircleXmark : faPenToSquare}
                />
              }
              onClick={() => setIsEdit(!isEdit)}
            >
              {isEdit ? "Cancelar" : " Editar Producto"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              style={{ borderRadius: 20, marginLeft: 10 }}
              startIcon={<FontAwesomeIcon icon={faSave} />}
              onClick={() => savesChangesAsync()}
              disabled={!isEdit}
            >
              Actualizar Producto
            </Button>
          </div>
        </Container>
      </Paper>
    </div>
  );
};

export default ProductsRecalDetails;
