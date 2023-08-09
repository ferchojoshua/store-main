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
  toastSuccess,
} from "../../../helpers/Helpers";
import {
  deleteProductAsync,
  getProductsAsync,
} from "../../../services/ProductsApi";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import { getFamiliaByIdAsync, getTipoNegocioByIdAsync, } from "../../../services/TipoNegocioApi";
import {
  FormControl,
  Button,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  TextField,
  Stack,
  InputLabel
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesPacking,
  // faCirclePlus,
  faExternalLinkAlt,
  faSearch,
  faTrashAlt,
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
import Productsadd from "../products/Productsadd";
// import ProductsDetails from "../products/ProductsDetails";
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
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [active, setActive] = useState(0);
  const [tipoNegocio, setTipoNegocio] = useState([]);
  const [selectedTipoNegocio, setSelectedTipoNegocio] = useState("");
  const [familia, setFamilia] = useState([]);
  const [selectedFamilia, setSelectedFamilia] = useState("");

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

  //Para la paginacion
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

  const [showKardexModal, setShowKardexModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resultStores = await getStoresByUserAsync(token);
      if (!resultStores.statusResponse) {
        setIsLoading(false);
        if (resultStores.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultStores.error.message);
        return;
      }

      if (resultStores.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultStores.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setStoreList(resultStores.data);
      if (resultStores.data.length < 4) {
        setSelectedStore(resultStores.data[0].id);
      }
      const resultTipoNegocio = await getTipoNegocioByIdAsync(token);
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
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }
      setTipoNegocio(resultTipoNegocio.data);

      const result = await getProductsAsync(token);
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
      setProductList(result.data);
      setIsLoading(false);      
    })();
  }, [reload]);

  const handleChangeStore = async (event) => {
    setSelectedStore(event.target.value);
    if (active === 0) {
      setIsLoading(true);
      const result = await getStoresByUserAsync(
        token,
        event.target.value
      );
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

      setStoreList(result.data);

      setIsLoading(true);
      setProductList(result.data);
    }

  };

  const onChangeTN = async (value) => {
    setFamilia([]);
    setSelectedFamilia("");
    setSelectedTipoNegocio(value);

    if (value !== "") {
      setIsLoading(true);
      const result = await getFamiliaByIdAsync(token, value);
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


  const deleteProduct = async (item) => {
    MySwal.fire({
      icon: "warning",
      title: <p>Confirmar Eliminar</p>,
      text: `Elimiar: ${item.description}!`,
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          setIsLoading(true);
          const result = await deleteProductAsync(token, item.id);
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
        })();
        setIsLoading(false);
        setReload(!reload);
        toastSuccess("Producto Eliminado");
      }
    });
  };

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

  return (
    <div>
         <h1>Modificar Precio Masivo  </h1>
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
      
          <FormControl
              variant="standard"
              fullWidth
              style={{
                textAlign: "left",
                width: 250,
                marginTop: 20,
              }}
            >

              <InputLabel id="demo-simple-select-standard-label">
                Seleccione un Almacen
              </InputLabel>
              <Select
                labelId="selProc"
                id="demo-simple-select-standard"
                value={selectedStore}
                onChange={handleChangeStore}
                label="Almacen"
                style={{ textAlign: "left" }}
              >
               <MenuItem key={-1} value="">
                  <em> Seleccione una Almacen</em>
                </MenuItem>
                {storeList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
           variant="standard"
              fullWidth
              style={{                
                textAlign: "left",
                width: 250,
                marginTop: 20,
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione un Tipo de Negocio
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedTipoNegocio}
                onChange={(e) => onChangeTN(e.target.value)}
                label="Tipo de Negocio"
                style={{ textAlign: "left" }}
              >
                <MenuItem key={-1} value="">
                  <em> Seleccione un Tipo de Negocio</em>
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
              style={{   
                textAlign: "left",
                width: 200,
                 marginTop: 20,
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione una Familia
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedFamilia}
                onChange={(e) => {
                  if (e.target.value.length === 0) {
                    setSelectedFamilia("t");
                    return;
                  }
                  setSelectedFamilia(e.target.value);
                }}
                style={{ textAlign: "left" }}
              >
                <MenuItem key={-1} value="">
                  <em> Seleccione una Familia</em>
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
            

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
          
          {isAccess(access, "KARDEX VER") ? (
              <Button
                variant="outlined"
                style={{
                  borderRadius: 20,
                  color: "#ff5722",
                  borderColor: "#009688",
                   bottom: 0, 
                   right: '50%', 
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  alignSelf: 'Center',
                  marginHorizontal: '1%',
                  marginBottom: 6,   
                      flex: 1,
                     marginTop: 38,               
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
                Actualizar Precio
              </Button>
            ) : (
              <></>
            )} 
            {/* {isAccess(access, "PRODUCTS CREATE") ? (
              <Button
                variant="outlined"
                style={{ borderRadius: 20 }}
                startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Agregar Producto
              </Button>
            ) : (
              <></>
            )}
            <></> */}

          </div>
        </div>

        <hr />

        <TextField
          style={{ marginBottom: 20, maxWidth: 600 }}
          fullWidth
          variant="standard"
          onChange={(e) => onChangeSearch(e.target.value.toUpperCase())}
          value={searchTerm}
          label={"Buscar Producto"}
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

                        {isAccess(access, "PRODUCTS DELETE") ? (
                          <IconButton
                            style={{ color: "#f50057" }}
                            onClick={() => deleteProduct(item)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
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
        <Productsadd setShowModal={setShowModal} />
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
