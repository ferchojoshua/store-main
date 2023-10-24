import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { getStoresByUserAsync } from "../../../../services/AlmacenApi";
/* M. Sc. Mario Talavera - Importamos el servico API para los productos, marcas y familias (grupos) */
import { getProductsAsync } from "../../../../services/ProductsApi";
import { getTipoNegocioAsync, getFamiliasByTNAsync } from "../../../../services/TipoNegocioApi";
/*************************************************************************************** */
import { useNavigate } from "react-router-dom";
import { getRuta, isAccess,toastError } from "../../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { DataContext } from "../../../../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

export const SelectorReporteInventario = () => {

    const { setIsLoading, setIsDefaultPass, setIsLogged, access, } =
    useContext(DataContext);

    const [storeList, setStoreList] = useState([]); //Array de Almacenes
    const [selectedStore, setSelectedStore] = useState("t"); //Almacen seleccionado o Todos
    const [tNegocioList, setTNegocioList] = useState([]); //Array de Tipos de Negocios
    const [selectedTNegocio, setSelectedTNegocio] = useState("t"); //Tipo de Negocio seleccionado o Todos
    const [productList, setProductList] = useState([]); //Array de Productos
    const [selectedProduct, setSelectedProduct] = useState(); //Producto seleccionado o Todos
    const [omitirStock, setOmitirStock] = useState(false); 
    const [showCost, setshowCost] = useState(false); 
    const [showststore, setstorehide] = useState(false); 
    const [familiaList, setFamiliaList] = useState([]);
    const [selectedFamilia, setSelectedFamilia] = useState("t");

    let navigate = useNavigate();
    let ruta = getRuta();
    const token = getToken();

    useEffect(() => {
        (async () => {
            
            setIsLoading(true);

            /* Traemos los datos de los productos */
            const resultProducts = await getProductsAsync(token);
            if (!resultProducts.statusResponse) {
                setIsLoading(false);
                if (resultProducts.error.request.status === 401) {
                navigate(`${ruta}/unauthorized`);
                return;
                }
                toastError(resultProducts.error.message);
                return;
            }

            if (resultProducts.data === "eX01") {
                setIsLoading(false);
                deleteUserData();
                deleteToken();
                setIsLogged(false);
                return;
            }

            if (resultProducts.data.isDefaultPass) {
                setIsLoading(false);
                setIsDefaultPass(true);
                return;
            }

            setProductList(resultProducts.data);
            if (resultProducts.data.length < 4) {
                setSelectedProduct(resultProducts.data[0].id);
            }




            /**Traemos los datos de los Alamacenes */
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

            /**Traemos los tipos de negocios */
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
    }, []);
              
    
  const onChangeTN = async (value) => {
    setSelectedTNegocio(value);
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



    const verReportInventario = () => {
        if (!selectedProduct || selectedProduct.length === 0) {
            setSelectedProduct("t");
            return;
        }
        if (setSelectedTNegocio.length === 0) {
            setSelectedTNegocio("t");
            return;
        }

        if (setSelectedFamilia.length === 0) {
            setSelectedFamilia("t");
            return;
          }


        var params = {
            selectedStore,
            selectedProduct,
            selectedTNegocio,
            selectedFamilia,
            showststore,
            showCost,
            omitirStock,
        };
        params = JSON.stringify(params);
        window.open(`${ruta}/r-inventario-prods/${params}`);

    };

    return (

        <div>
            <Container style={{ width: 550 }}>
                <Paper
                    elevation={10}
                    style={{
                      borderRadius: 30,
                      padding: 20,
                      marginBottom: 10,
                    }}
                >

                    {/* Selector de los productos */}
                    {/* <InputLabel id="demo-simple-select-standard-label">
                            Seleccione un Producto
                        </InputLabel> */}
                        <Autocomplete
                                id="demo-simple-select-standard-label"
                                
                                fullWidth
                                style={{ marginRight: 20 }}
                                options={productList}
                                getOptionLabel={(op) => (op ? `${op.description}` : "")}
                                value={selectedProduct === "t" ? 0 : selectedProduct}
                                onChange={(event, newValue) => {
                                    setSelectedProduct(newValue ? newValue.id : "0");
                                }}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="Seleccione un Producto"
                                    variant="standard"
                                    margin="normal"
                                    InputLabelProps={{
                                        ...params.InputLabelProps,
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        style: { border: 'none' },
                                    }}
                                    />
                                )}
                                >
                                <MenuItem key={-1} value="">
                                    <em>Seleccione un Producto</em>
                                </MenuItem>

                                {productList.map((item) => (
                                    <MenuItem key={item.id} value={item}>
                                    {item.description}
                                    </MenuItem>
                                ))}

                                <MenuItem key={"t"} value={"t"}>
                                Todos...
                                </MenuItem>
                                </Autocomplete>

                    <FormControl
                        variant="standard"
                        fullWidth
                        style={{ marginRight: 20 }}
                        required
                    >
                        <InputLabel id="demo-simple-select-standard-label">
                            Seleccione un Tipo de Negocio
                        </InputLabel>
                        <Select
                            defaultValue=""
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={selectedTNegocio}
                            onChange={(e) => onChangeTN(e.target.value)}
                            label="Tipo de Negocio"
                            style={{ textAlign: "left" }}
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
              style={{ marginRight: 20 }}
              required
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione una Familia
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedFamilia}
                onChange={(i) => {
                  if (i.target.value.length === 0) {
                    setSelectedFamilia("t");
                    return;
                  }
                  setSelectedFamilia(i.target.value);
                }}
                style={{ textAlign: "left" }}
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
                    
                    {/* Selector de los almacenes */}
                    <FormControl
                        variant="standard"
                        fullWidth
                        style={{ marginRight: 20 }}
                        required
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
                        storeList.length > 6 || storeList.length > 5 || storeList.length > 4 || storeList.length > 3 || storeList.length > 2
                          ? false
                          : true
                      }
                                                  >
                                Todos...
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                  control={
                    <Checkbox
                      checked={omitirStock}
                      onChange={(e) => setOmitirStock(e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Omitir Existencias Cero"
                />      
                 {isAccess(access, "COSTO VER") ? (<FormControlLabel
                  control={
                    <Checkbox
                      checked={showCost}
                      onChange={(i) => setshowCost(i.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Con costos"
                />   
                ) : (
              <></>
            )}
                


                 <FormControlLabel
                  control={
                    <Checkbox
                      checked={showststore}
                      onChange={(s) => setstorehide(s.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="A. Por Almacen"
                />   
                
                       <hr />

                    <Button
                        variant="outlined"
                        fullWidth
                        style={{ borderRadius: 20 }}
                        startIcon={<FontAwesomeIcon icon={faPrint} />}
                        onClick={() => {
                            verReportInventario();
                        }}
                    >
                        Generar Reporte
                    </Button>

                </Paper>
            </Container>
        </div>

    );

};
export default SelectorReporteInventario;