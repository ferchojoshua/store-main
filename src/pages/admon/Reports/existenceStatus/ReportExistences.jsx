import { Container } from "@mui/material";
import { isEmpty } from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NoData from "../../../../components/NoData";
import { DataContext } from "../../../../context/DataContext";
import { getRuta, toastError } from "../../../../helpers/Helpers";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../../services/Account";
import { printProdHistoryAsync } from "../../../../services/ContabilidadApi";

export const ReportExistences = ({
  selectedStore,
  setSelectedStore,
  fecha,
  setFecha,
}) => {
  const [data, setData] = useState([]);

  const { setIsLoading, setIsDefaultPass, setIsLogged, access } =
    useContext(DataContext);

  let navigate = useNavigate();
  let ruta = getRuta();
  const token = getToken();

  useEffect(() => {
    (async () => {
      const datos = {
        fecha,
        storeId: selectedStore,
      };
      setSelectedStore("");
      setFecha(new Date());

      setIsLoading(true);
      const result = await printProdHistoryAsync(token, datos);
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
      console.log(result.data);
      setData(result.data);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div>
      <Container fixed maxWidth="xl" sx={{ textAlign: "center" }}>
        {isEmpty(data) ? <NoData /> : <></>}
      </Container>
    </div>
  );
};
