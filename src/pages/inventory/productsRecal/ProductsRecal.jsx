import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
//import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
//import withReactContent from "sweetalert2-react-content";
import {
  getRuta,
  isAccess,
  toastError,
  //toastSuccess,
} from "../../../helpers/Helpers";
import {
  getProductsAsync,
  // deleteProductAsync,
  // getProductsAsync,
  getProductsRecalByIdAsync,
} from "../../../services/ProductsApi";
import { getStoresByUserAsync } from "../../../services/AlmacenApi";
import {
  // getFamiliaByIdAsync,
  getFamiliasByTNAsync,
  //getTipoNegocioAsync,
  getTipoNegocioByIdAsync,
} from "../../../services/TipoNegocioApi";
import {
  FormControl,
  Button,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  TextField,
  Stack,
  InputLabel,
  FormLabel,
  // Paper,
} from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesPacking,
  // faCirclePlus,
  faExternalLinkAlt,
  faSearch,
  //faTrashAlt,
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
  // const MySwal = withReactContent(Swal);
  const [productList, setProductList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("selectedStore");
  const [active, setActive] = useState(0);
  const [tipoNegocio, setTipoNegocio] = useState([]);
  const [selectedTipoNegocio, setSelectedTipoNegocio] = useState("");
  const [familia, setFamilia] = useState(null);
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
  const [selectedradio, setSelectedRadio] = useState(null);

  const [showKardexModal, setShowKardexModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
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
      setIsLoading(false);
      setProductList(result.data);
    })();
  }, [reload]);

  // useEffect(() => {
  //   (async () => {
  //     setIsLoading(true);
  //     const resultStores = await getStoresByUserAsync(token);
  //     //  console.log(resultStores)
  //     //  console.log( "resultStores")
  //     if (!resultStores.statusResponse) {
  //       setIsLoading(false);
  //       if (resultStores.error.request.status === 401) {
  //         navigate(`${ruta}/unauthorized`);
  //         return;
  //       }
  //       toastError(resultStores.error.message);
  //       return;
  //     }

  //     if (resultStores.data === "eX01") {
  //       setIsLoading(false);
  //       deleteUserData();
  //       deleteToken();
  //       setIsLogged(false);
  //       return;
  //     }

  //     if (resultStores.data.isDefaultPass) {
  //       setIsLoading(false);
  //       setIsDefaultPass(true);
  //       return;
  //     }

  //     setStoreList(resultStores.data);

  //     if (resultStores.data === "Todos") {
  //       const data = {
  //         idAlmacen: selectedStore,
  //       };
  //       setIsLoading(true)

  //     if (resultStores === null) {
  //       setSelectedStore(resultStores.data[0].id);

  //       const result = await getProductsRecalByIdAsync(
  //         token,
  //         resultStores.data[0].id
  //       );
  //       if (!result.statusResponse) {
  //         setIsLoading(false);
  //         if (result.error.request.status === 401) {
  //           navigate(`${ruta}/unauthorized`);
  //           return;
  //         }
  //         toastError(result.error.message);
  //         return;
  //       }

  //       if (result.data === "eX01") {
  //         setIsLoading(false);
  //         deleteUserData();
  //         deleteToken();
  //         setIsLogged(false);
  //         return;
  //       }

  //       if (result.data.isDefaultPass) {
  //         setIsLoading(false);
  //         setIsDefaultPass(true);
  //         return;
  //       }

  //       setProductList(result.data);
  //     } else {
  //       onSelectChange(active);
  //     }
  //     setIsLoading(false);
  //     const result = await getStoresByUserAsync(token);
  //     if (!result.statusResponse) {
  //       setIsLoading(false);
  //       if (result.error.request.status === 401) {
  //         navigate(`${ruta}/unauthorized`);
  //         return;
  //       }
  //       toastError(result.error.message);
  //       return;
  //     }

  //     if (result.data === "eX01") {
  //       setIsLoading(false);
  //       deleteUserData();
  //       deleteToken();
  //       setIsLogged(false);
  //       return;
  //     }

  //     if (result.data.isDefaultPass) {
  //       setIsLoading(false);
  //       setIsDefaultPass(true);
  //       return;
  //     }
  //     setIsLoading(false);
  //     setStoreList(
  //       result.data.map((item) => {
  //         return item.almacen;
  //       })
  //     );
  //   })();
  // }, [reload]);

  //  const handleChangeStore = async ( event ) =>{
  //       // console.log( event.target.value)
  //      setSelectedStore(event.target.value);
  //  const result = await getProductsRecalByIdAsync(token, event.target.value);
  // if (!result.statusResponse) {
  //           setIsLoading(false);
  //            if (result.error.request.status === 401) {
  //              navigate(`${ruta}/unauthorized`);
  //              return;
  //            }
  //            toastError(result.error.message);
  //           return;
  //          }
  //          if (result.data === "eX01") {
  //                   setIsLoading(false);
  //                  deleteUserData();
  //                 deleteToken();
  //                 setIsLogged(false);
  //                 return;
  //                }
  //                if (result.data.isDefaultPass) {
  //                  setIsLoading(false);
  //                   setIsDefaultPass(true);
  //                 return;
  //                }
  //                  if(setProductList(result.data).val() !== "0"){('#onChangeTN').prop('disabled', false)
  //                }

  //     // console.log(result)
  //           setIsLoading(true);
  //     setProductList(result.data)
  //   }

  //    useEffect(() => {
  //     const fetchData = async () => {
  //       setIsLoading(true);

  //       // Obtén los datos del tipo de negocio
  //       const resultTipoNegocio = await getTipoNegocioByIdAsync(token);

  //       if (!resultTipoNegocio.statusResponse) {
  //         setIsLoading(false);
  //         if (resultTipoNegocio.error.request.status === 401) {
  //           navigate(`${ruta}/unauthorized`);
  //           return;
  //         }
  //         toastError(resultTipoNegocio.error.message);
  //         return;
  //       }

  //       if (resultTipoNegocio.data === "eX01") {
  //         setIsLoading(false);
  //         deleteUserData();
  //         deleteToken();
  //         setIsLogged(false);
  //         return;
  //       }

  //       if (resultTipoNegocio.data.isDefaultPass) {
  //         setIsLoading(false);
  //         setIsDefaultPass(true);
  //         return;
  //       }

  //       setTipoNegocio(resultTipoNegocio.data);

  //     //    const resultProducts = await getProductsAsync(token, storeList);

  //     //   if (!resultProducts.statusResponse) {
  //     //     setIsLoading(false);
  //     //     if (resultProducts.error.request.status === 401) {
  //     //       navigate(`${ruta}/unauthorized`);
  //     //       return;
  //     //     }
  //     //     toastError(resultProducts.error.message);
  //     //     return;
  //     //   }

  //     //   if (resultProducts.data === "eX01") {
  //     //     setIsLoading(false);
  //     //     deleteUserData();
  //     //     deleteToken();
  //     //     setIsLogged(false);
  //     //     return;
  //     //   }

  //     //   if (resultProducts.data.isDefaultPass) {
  //     //     setIsLoading(false);
  //     //     setIsDefaultPass(true);
  //     //     return;
  //     //   }

  //     //   // Aquí puedes trabajar con resultProducts.data
  //     //   setProductList(resultProducts.data);
  //     //   setIsLoading(false);
  //     // };

  //     // Llama a fetchData directamente o cuando cambie 'reload'
  //     fetchData();
  //   }, [reload]);

  //     const handleChangeStore = async (event) => {
  //       setSelectedStore(event.target.value);
  //       if (active === 0) {
  //         setIsLoading(true);
  //         const result = await getStoresByUserAsync(token, event.target.value);
  //         if (!result.statusResponse) {
  //           setIsLoading(false);
  //           if (result.error.request.status === 401) {
  //            navigate(`${ruta}/unauthorized`);
  //             return;
  //           }
  //           toastError(result.error.message);
  //           return;
  //        }
  //         if (result.data === "eX01") {
  //           setIsLoading(false);
  //           deleteUserData();
  //           deleteToken();

  //           setIsLogged(false);
  //           return;
  //         }
  //         if (result.data.isDefaultPass) {
  //           setIsLoading(false);
  //           setIsDefaultPass(true);
  //           return;
  //         }
  //        setStoreList(result.data);
  //        setIsLoading(true);
  //         setProductList(result.data);
  //       }
  // //    };

   const onChangeTN = async (value) => {
     setSelectedTipoNegocio(value);
     if (value !== "") {
       setIsLoading(true);
       const result = await getFamiliasByTNAsync(token, value);
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
     } else {
       setFamilia([]);
     }
   };

  // const onSelectChange = async (value) => {
  //   setActive(value);
  //   if (value === 0) {
  //     setIsLoading(true);
  //     const result = await getProductsRecalByIdAsync(token, selectedStore);
  //     if (!result.statusResponse) {
  //       setIsLoading(false);
  //       if (result.error.request.status === 401) {
  //         navigate(`${ruta}/unauthorized`);
  //         return;
  //       }
  //       toastError(result.error.message);
  //       return;
  //     }
  //     if (result.data === "eX01") {
  //       setIsLoading(false);
  //       deleteUserData();
  //       deleteToken();
  //       setIsLogged(false);
  //       return;
  //     }
  //     if (result.data.isDefaultPass) {
  //       setIsLoading(false);
  //       setIsDefaultPass(true);
  //       return;
  //     }
  //     setIsLoading(false);
  //     setProductList(result.data);
  //   }
  // };

  // const deleteProduct = async (item) => {
  //   MySwal.fire({
  //     icon: "warning",
  //     title: <p>Confirmar Eliminar</p>,
  //     text: `Elimiar: ${item.description}!`,
  //     showDenyButton: true,
  //     confirmButtonText: "Aceptar",
  //     denyButtonText: `Cancelar`,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       (async () => {
  //         setIsLoading(true);
  //         const result = await deleteProductAsync(token, item.id);
  //         if (!result.statusResponse) {
  //           setIsLoading(false);
  //           if (result.error.request.status === 401) {
  //             navigate(`${ruta}/unauthorized`);
  //             return;
  //           }
  //           toastError(result.error.message);
  //           return;
  //         }

  //         if (result.data === "eX01") {
  //           setIsLoading(false);
  //           deleteUserData();
  //           deleteToken();
  //           setIsLogged(false);
  //           return;
  //         }

  //         if (result.data.isDefaultPass) {
  //           setIsLoading(false);
  //           setIsDefaultPass(true);
  //           return;
  //         }
  //       })();
  //       setIsLoading(false);
  //       setReload(!reload);
  //       toastSuccess("Producto Eliminado");
  //     }
  //   });
  // };

  const onChangeSearch = (val) => {
    setCurrentPage(1);
    setSearchTerm(val);
    paginate(1);
  };

  const handleChangeRadio = (event) => {
    setSelectedRadio(event.target.value);
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
            <FormControlLabel
              value="Masivo"
              control={<Radio />}
              label="Masivo"
            />
          </RadioGroup>
        </FormControl>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <FormControl
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
              defaultValue=""
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedStore}
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  setSelectedStore("TODOS");
                  return;
                }
                setSelectedStore(e.target.value);
              }}
              style={{ textAlign: "left" }}
            >
              {/* Assuming you want a default option with an empty value */}
          {/* <MenuItem value="">
                {/* Add a label for the default option 
              </MenuItem>

              {storeList &&
                storeList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl> */}
{/* 
          <FormControl
            variant="standard"
            fullWidth
            style={{
              textAlign: "left",
              width: 200,
              marginTop: 10,
            }}
          >
            <Select
              labelId="selProc"
              id="demo-simple-select-standard"
              value={selectedStore}
              //   onChange={handleChangeStore}
            >
              {storeList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl> */}

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

              {familia &&
                Array.isArray(familia) &&
                familia.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.description}
                  </MenuItem>
                ))}
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
            {/* <InputLabel id="demo-simple-select-label">Porcentaje</InputLabel> */}
            <div>
              {/* <Paper
         // elevation={10}
         // style={{
         //   borderRadius: 30,
         //   padding: 20,
         //   marginBottom: 10,
         // }}
       > */}
              <TextField
                fullWidth
                required
                variant="standard"
                // onChange={(e) => setDescription(e.target.value.toUpperCase())}
                label={"Porcentaje"}
                // value={description}
              />
              {/* </Paper> */}
            </div>
          </FormControl>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
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

        {selectedradio === "Individual" && (
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
                {isAccess(access, "PRODUCTS UPDATE") ? (
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
                    <td style={{ textAlign: "left" }}>{item.tipoNegocio}</td>
                    <td style={{ textAlign: "left" }}>{item.familia}</td>
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

                        {/* {isAccess(access, "PRODUCTS DELETE") ? (
                           <IconButton
                             style={{ color: "#f50057" }}
                             onClick={() => deleteProduct(item)}
                           >
                             <FontAwesomeIcon icon={faTrashAlt} />
                           </IconButton>
                         ) : (
                           <></>
                         )} */}
                      </Stack>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        {isAccess(access, "KARDEX VER") ? (
          <Button
            variant="outlined"
            style={{
              borderRadius: 20,
              color: "#ff5722",
              borderColor: "#009688",
              bottom: 0,
              left: "39%",
              paddingHorizontal: 8,
              paddingVertical: 6,
              alignSelf: "Center",
              marginHorizontal: "1%",
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
