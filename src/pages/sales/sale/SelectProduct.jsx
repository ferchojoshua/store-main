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
} from "@mui/material";

import {
  deleteToken,
  deleteUserData,
  getToken,
  getUserAsync,
} from "../../../services/Account";
import { toastError } from "../../../helpers/Helpers";

import { getExistencesByStoreAsync } from "../../../services/ExistanceApi";

const SelectProduct = ({ selectedProduct, setSelectedProduct }) => {
  const { setIsLoading, setIsLogged, setIsDefaultPass, reload } =
    useContext(DataContext);
  let navigate = useNavigate();

  const token = getToken();

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getUserAsync(token);
      if (!result.statusResponse) {
        setIsLoading(false);
        if (result.error.request.status === 401) {
          navigate("/unauthorized");
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
            navigate("/unauthorized");
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
    setSelectedStore(event.target.value);
    const data = {
      idAlmacen: event.target.value,
    };
    setIsLoading(true);
    const result = await getExistencesByStoreAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error.request.status === 401) {
        navigate("/unauthorized");
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

      <Autocomplete
        style={{ marginTop: 20 }}
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
              style={{ color: option.existencia <= 0 ? "#ab003c" : "#357a38" }}
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
    </div>
  );
};

export default SelectProduct;