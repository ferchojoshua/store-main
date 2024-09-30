
import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { Autocomplete, TextField, Stack } from "@mui/material";
import { getListAsync } from "../../../../services/CreateLogoApi";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { getRuta, toastError } from "../../../../helpers/Helpers";

const SelectCatalogo = ({ selectedCatalogo, setSelectedCatalogo }) => {
  let ruta = getRuta();
  const { setIsLoading, setIsLogged, reload, setIsDefaultPass } =
    useContext(DataContext);
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

      setCatalogoList(resultList.data);
      setIsLoading(false);

      const filtered = resultList.data.filter(
        (catalogs) => catalogs.catalogo && catalogs.catalogo.includes("CATALOGO DE ESTADOS")
      );

      setCatalogoList(filtered);
    })();
  }, [reload]);

  const onChangeSelectedCatalogo = (event, newValue) => {
    setSelectedCatalogo(newValue);
  };

  return (
    <div>
      <Stack direction="row" spacing={1}>
        <Autocomplete
          id="combo-box-demo"
          fullWidth
          options={catalogoList}
          getOptionLabel={(op) => (op ? `${op.valor}` || "" : "")}
          value={selectedCatalogo}
          onChange={onChangeSelectedCatalogo} // Pass the event and new value correctly
          noOptionsText="Item no encontrado..."
          renderOption={(props, option) => ( <li {...props} key={option.id}>  {option.valor}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              variant="standard"
              {...params}
              label="Seleccione un item del catálogo *"
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default SelectCatalogo;
