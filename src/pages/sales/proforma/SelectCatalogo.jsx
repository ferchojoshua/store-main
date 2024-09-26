import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Stack,
} from "@mui/material"; // Ensure these are imported

import { getListAsync } from "../../../../src/CreateLogoApi";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../src/Account";
import { getRuta, toastError }  from "../../../helpers/Helpers";

const SelectCatalogo = ({
   selectedCatalogo,
   setSelectedCatalogo,
}) => {
  let ruta = getRuta();
  const { setIsLoading, setIsLogged, reload, setIsDefaultPass } = useContext(DataContext);
  let navigate = useNavigate();

  const token = getToken();
  const [catalogoList, setCatalogoList] = useState([]);
  // const [selectedCatalogo, setSelectedCatalogo] = useState(null); // Initialize selectedCatalogo

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data = { operacion: 2 };

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
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setCatalogoList(resultList.data); // Ensure this is the correct structure
      setIsLoading(false);


      const filtered = resultList.data.filter(catalogs => 
        catalogs.valor && catalogs.valor.includes("2")
      );

      setCatalogoList(filtered.data);

    })();
  }, [reload]);

  const onChangeSelectedCatalogo = (catalogo) => {
    setSelectedCatalogo(catalogo);
  };

  return (
    <div>
     <Stack direction="row" spacing={1}>
            <Autocomplete
              id="combo-box-demo"
              fullWidth
              options={catalogoList}
              getOptionLabel={(op) => (op ? `${op.nombreCliente}` || "" : "")}
              value={selectedCatalogo === "" ? null : selectedCatalogo}
              onChange={(event, newValue) => {  onChangeSelectedCatalogo(newValue);
              }}
              noOptionsText="Cliente no encontrado..."
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.nombreCliente}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label="Seleccione un cliente..."
                />
              )}
            />
            </Stack>
      {/* <FormControl
        variant="standard"
        fullWidth
        style={{
          textAlign: "left",
          width: 250,
          marginTop: 20,
        }}
      >
        <InputLabel id="catalogo-select-label">Seleccione</InputLabel>
        <Select
          labelId="catalogo-select-label"
          id="catalogo-select"
          value={selectedCatalogo || ""} // Default to empty string if null
          onChange={(e) => onChangeSelectedCatalogo(e.target.value)}
          label="Catálogo"
        >
          <MenuItem key={0} value="">
            <em>Seleccione un item del catálogo</em>
          </MenuItem>
          {catalogoList.map((item) => (
            <MenuItem key={item.id} value={item.valor}>
              {item.valor}%
            </MenuItem>
          ))}
        </Select>
      </FormControl>*/}
    </div> 
  );
};

export default SelectCatalogo;

