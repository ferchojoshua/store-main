import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpellCheck, faBarcode } from "@fortawesome/free-solid-svg-icons";

import {
  deleteToken,
  deleteUserData,
  getToken,
  getUserAsync,
} from "../../../services/Account";
import { getRuta, toastError } from "../../../helpers/Helpers";

import { getExistencesByStoreAsync } from "../../../services/ExistanceApi";
import { isEmpty } from "lodash";

const SelectProduct = ({
  selectedProductList,
  selectedProduct,
  setSelectedProduct,
  selectedStore,
  setSelectedStore,
  barCodeSearch,
  setBarCodeSearch,
}) => {
  let ruta = getRuta();

  const { setIsLoading, setIsLogged, setIsDefaultPass, reload } =
    useContext(DataContext);
  let navigate = useNavigate();

  const token = getToken();

  const [storeList, setStoreList] = useState([]);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getUserAsync(token);
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
      setStoreList(result.data.storeAccess);

      if (selectedStore !== "") {
        const data = {
          idAlmacen: selectedStore,
        };
        setIsLoading(true);

        const result = await getExistencesByStoreAsync(token, data);
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
      }
      setIsLoading(false);
    })();
  }, [reload]);

  const handleChangeStore = async (event) => {
    setSelectedProduct("");
    if (!isEmpty(selectedProductList)) {
      toastError("No puede haber dos almacenes en la misma factura");
      return;
    }
    setSelectedStore(event.target.value);
    const data = {
      idAlmacen: event.target.value,
    };
    setIsLoading(true);
    const result = await getExistencesByStoreAsync(token, data);
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
  };

  return (
    <div>
      <FormControl
        variant="standard"
        fullWidth
        style={{ textAlign: "left", marginTop: 20 }}
      >
        <InputLabel id="selProc">Almacen</InputLabel>
        <Select
          labelId="selProc"
          id="demo-simple-select-standard"
          value={selectedStore}
          onChange={handleChangeStore}
        >
          <MenuItem value="">
            <em>Seleccione un Almacen...</em>
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

      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        {barCodeSearch ? (
          <Autocomplete
            fullWidth
            options={productList}
            getOptionLabel={(op) => (op ? `${op.producto.barCode}` || "" : "")}
            value={selectedProduct === "" ? null : selectedProduct}
            onChange={(event, newValue) => {
              setSelectedProduct(newValue);
            }}
            noOptionsText="Producto no encontrado..."
            renderOption={(props, option) => {
              return (
                <li
                  {...props}
                  key={option.producto.id}
                  style={{
                    color: option.existencia <= 0 ? "#ab003c" : "#357a38",
                  }}
                >
                  {option.producto.barCode}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                label="Seleccione un producto..."
              />
            )}
          />
        ) : (
          <Autocomplete
            id="combo-box-demo"
            fullWidth
            options={productList}
            getOptionLabel={(op) => (op ? `${op.producto.description}` : "")}
            value={selectedProduct === "" ? null : selectedProduct}
            onChange={(event, newValue) => {
              setSelectedProduct(newValue);
            }}
            noOptionsText="Producto no encontrado..."
            renderOption={(props, option) => {
              return (
                <li
                  {...props}
                  key={option.producto.id}
                  style={{
                    color: option.existencia <= 0 ? "#ab003c" : "#357a38",
                  }}
                >
                  {option.producto.description}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                label="Seleccione un producto..."
              />
            )}
          />
        )}

        <Tooltip
          title={
            barCodeSearch ? "Buscar por Codigo de Barras" : "Buscar por Nombre"
          }
          style={{ marginTop: 5 }}
        >
          <IconButton
            onClick={() => {
              setBarCodeSearch(!barCodeSearch);
            }}
          >
            <FontAwesomeIcon
              style={{
                fontSize: 25,
                color: "#2196f3",
              }}
              icon={barCodeSearch ? faBarcode : faSpellCheck}
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default SelectProduct;
