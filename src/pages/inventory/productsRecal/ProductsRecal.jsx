import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getRuta,
  isAccess,
  toastError,
  // toastSuccess,
} from "../../../helpers/Helpers";
import {
  getProductsAsync,
} from "../../../services/ProductsApi";
import {getFamiliasByTNAsync,getTipoNegocioAsync,} from "../../../services/TipoNegocioApi";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesPacking,
  faCirclePlus,
  faExternalLinkAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../../components/PaginationComponent";
import { isEmpty } from "lodash";
import NoData from "../../../components/NoData";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";
import MediumModal from "../../../components/modals/MediumModal";
import ProductsRecalDetails from "./ProductsRecalDetails";
import { ProductKardex } from "../productExistences/ProductKardex";

const ProductsRecal = () => {
  let ruta = getRuta();

  const {
    isDarkMode,
    reload,
    setReload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);
  let navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [productList, setProductList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = productList.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.description.toString().includes(searchTerm) ||
      val.barCode.toString().includes(searchTerm)
    ) {
      return val;
    }
  });

  // Para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperPage] = useState(10);
  const indexLast = currentPage * itemsperPage;
  const indexFirst = indexLast - itemsperPage;
  const currentItem = withSearch.slice(indexFirst, indexLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const token = getToken();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedradio, setSelectedRadio] = useState(null);

  const [showKardexModal, setShowKardexModal] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [tNegocioList, setTNegocioList] = useState([]);
  const [selectedTNegocio, setSelectedTNegocio] = useState("t");
  const [familiaList, setFamiliaList] = useState([]);
  const [selectedFamilia, setSelectedFamilia] = useState("t");
  const [isAlmacenSelected, setIsAlmacenSelected] = useState(false);
  const [isMasivoSelected, setIsMasivoSelected] = useState(false);
  const [isTNEnabled, setIsTNEnabled] = useState(false);
  const [isFamiliaEnabled, setIsFamiliaEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      // Obtener la lista de productos
      const productResult = await getProductsAsync(token); // Asegúrate de que getProductsAsync esté definido
      if (!productResult.statusResponse) {
        setIsLoading(false);
        if (productResult.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(productResult.error.message);
        return;
      }

      if (productResult.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (productResult.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setProductList(productResult.data);

      // Obtener la lista de almacenes
      const storeResult = await getStoresByUserAsync(token); // Asegúrate de que getStoresByUserAsync esté definido
      if (!storeResult.statusResponse) {
        setIsLoading(false);
        if (storeResult.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(storeResult.error.message);
        return;
      }

      if (storeResult.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (storeResult.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setStoreList(storeResult.data);
      if (storeResult.data.length > 0) {
        setSelectedStore(storeResult.data[0].id);
      }
      const result = await getTipoNegocioAsync(token);
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
      setTNegocioList(result.data);
      setIsLoading(false);
    })();
  }, [reload]);

  const onChangeAlmacen = (value) => {
    setSelectedStore(value);
    setIsTNEnabled(true); // Habilitar el combo de Tipo de Negocio
  };

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

  const handleChangeRadio = (event) => {
    setSelectedRadio(event.target.value);
    setIsMasivoSelected(event.target.value === 'Masivo');
    setIsAlmacenSelected(event.target.value === 'Masivo');
  };

  const onChangeTN = async (value) => {
    setSelectedTNegocio(value);
    setIsFamiliaEnabled(true); // Habilitar el combo de Familia
    if (value === "t") {
      setSelectedFamilia("t");
      return;
    } else if (value === "") {
      setSelectedFamilia("");
      return;
    } else {
      setSelectedFamilia("t");
      setIsLoading(true);
      const resultFamilias = await getFamiliasByTNAsync(token, value);
      if (!resultFamilias.statusResponse) {
        setIsLoading(false);
        if (resultFamilias.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultFamilias.error.message);
        return;
      }

      if (resultFamilias.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultFamilias.data.isDefaultPass) {
        setIsDefaultPass(true);
        return;
      }
      setIsLoading(false);
      setFamiliaList(resultFamilias.data);
    }
  };
  const record = { id: 0, name: "Todos" };

  return (
    <div>
      <h1>Modificar Precio Masivo </h1>
      <Container>
        <FormControl
          variant="standard"
          fullWidth
          style={{
            textAlign: "left",
            width: 250,
            marginTop: 20,
          }}
        >
          <FormLabel id="demo-radio-buttons-group-label">
            Seleccione una opcion
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Individual"
            name="radio-buttons-group"
            value={selectedradio}
            onChange={handleChangeRadio}
          >
            <FormControlLabel
              value="Individual"
              control={<Radio />}
              label="Individual"
            />
            <FormControlLabel value="Masivo" control={<Radio />} label="Masivo" />
          </RadioGroup>
        </FormControl>

        {selectedradio === "Individual" || !isMasivoSelected ? (
          <></>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
          <FormControl
  variant="standard"
  fullWidth
  style={{
    textAlign: "left",
    width: 250,
    marginTop: 20,
    marginRight: 20,
    display: isAlmacenSelected && isMasivoSelected ? 'block' : 'none',
  }}
>
  <InputLabel id="demo-simple-select-standard-label">
    Seleccione un Almacén
  </InputLabel>
  <Select
    defaultValue=""
    labelId="demo-simple-select-standard-label"
    id="demo-simple-select-standard"
    value={selectedStore || ""}
    onChange={(e) => {
      setSelectedStore(e.target.value);  
      onChangeAlmacen(e.target.value);                
    }}
    label="Almacén"
    style={{ textAlign: "left" }}
  >
    <MenuItem value="">
      <em>Seleccione un Almacén</em>
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
              style={{
                textAlign: "left",
                width: 250,
                marginTop: 20,
                marginRight: 20,
                display: isAlmacenSelected && isMasivoSelected ? 'block' : 'none',
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione un Tipo de Negocio
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedTNegocio || ""}
                onChange={(e) => onChangeTN(e.target.value)}
                label="Tipo de Negocio"
                style={{ textAlign: "left" }}
                disabled={!isTNEnabled}
              >
                <MenuItem key={-1} value="">
                  <em> Seleccione un Tipo de Negocio</em>
                </MenuItem>

                {tNegocioList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.description}
                    </MenuItem>
                  );
                })}
                <MenuItem key={"t"} value={"t"}>
                  Todos...
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="standard"
              fullWidth
              style={{
                textAlign: "left",
                width: 250,
                marginTop: 20,
                marginRight: 20,
                display: isAlmacenSelected && isMasivoSelected ? 'block' : 'none',
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione una Familia
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedFamilia || ""}
                onChange={(e) => {
                  if (e.target.value.length === 0) {
                    setSelectedFamilia("t");
                    return;
                  }
                  setSelectedFamilia(e.target.value);
                }}
                style={{ textAlign: "left" }}
                disabled={!isFamiliaEnabled}
              >
                <MenuItem key={-1} value="">
                  <em> Seleccione una Familia</em>
                </MenuItem>

                {familiaList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.description}
                    </MenuItem>
                  );
                })}
                <MenuItem key={"t"} value={"t"}>
                  Todos...
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

        <hr />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Lista de Productos</h1>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <></>

            {isAccess(access, "KARDEX VER") ? (
              <Button
                variant="outlined"
                style={{
                  borderRadius: 20,
                  color: "#ff5722",
                  borderColor: "#ff5722",
                  marginLeft: 10,
                }}
                startIcon={
                  <FontAwesomeIcon
                    icon={faBoxesPacking}
                    style={{
                      color: "#ff5722",
                    }}
                  />
                }
                onClick={() => {
                  setShowKardexModal(true);
                }}
              >
                Consultar Kardex
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>

        <hr />

        {selectedradio === "Individual" && (
          <TextField
            style={{ marginBottom: 20, maxWidth: 600 }}
            fullWidth
            variant="standard"
            onChange={(e) => onChangeSearch(e.target.value.toUpperCase())}
            value={searchTerm}
            label={"Modificar Precio Masivo"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <FontAwesomeIcon
                      icon={faSearch}
                      style={{ color: "#1769aa" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        {isEmpty(withSearch) ? (
          <NoData />
        ) : (
          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "center" }}>T. Negocio</th>
                <th style={{ textAlign: "left" }}>Familia</th>
                <th style={{ textAlign: "left" }}>Descripcion</th>
                <th style={{ textAlign: "right" }}>C. Barras</th>
                <th style={{ textAlign: "left" }}>Marca</th>
                <th style={{ textAlign: "left" }}>Modelo</th>
                <th style={{ textAlign: "left" }}>U/M</th>
                {isAccess(access, "PRODUCTS UPDATE") ||
                isAccess(access, "PRODUCTS DELETE") ? (
                  <th>Acciones</th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentItem.map((item) => {
                const isSelected = selectedProducts.includes(item.id);
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td style={{ textAlign: "left" }}>
                      {item.tipoNegocio.description}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item.familia ? item.familia.description : ""}
                    </td>
                    <td style={{ textAlign: "left" }}>{item.description}</td>
                    <td style={{ textAlign: "left" }}>{item.barCode}</td>
                    <td style={{ textAlign: "left" }}>{item.marca}</td>
                    <td style={{ textAlign: "left" }}>{item.modelo}</td>
                    <td style={{ textAlign: "left" }}>{item.um}</td>
                    <td>
                      <Stack spacing={1} direction="row">
                        {isAccess(access, "PRODUCTS UPDATE") ? (
                          <IconButton
                            style={{ color: "#009688" }}
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowEditModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </Stack> 
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <PaginationComponent
          data={withSearch}
          paginate={paginate}
          itemsperPage={itemsperPage}
        />
      </Container>

      <MediumModal
        titulo={"Agregar Producto"}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        {/* <Productsadd setShowModal={setShowModal} /> */}
      </MediumModal>

      <MediumModal
        titulo={`Editar: ${selectedProduct.description}`}
        isVisible={showEditModal}
        setVisible={setShowEditModal}
      >
        <ProductsRecalDetails
        selectedProduct={selectedProduct}
        setShowModal={setShowEditModal}
      />
      </MediumModal>

      <MediumModal
        titulo="Consultar Cardex"
        isVisible={showKardexModal}
        setVisible={setShowKardexModal}
      >
        <ProductKardex productList={productList} />
      </MediumModal>
    </div>
  );
};

export default ProductsRecal;
