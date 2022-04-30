import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toastError, toastSuccess } from "../../../helpers/Helpers";

import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
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
import { getSalesAsync } from "../../../services/SalesApi";

const SalesList = () => {
  const { reload, setReload, setIsLoading, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [listaVentas, setListaVentas] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const withSearch = listaVentas.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (val.id.toString().includes(searchTerm)) {
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

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getSalesAsync(token);
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
      setListaVentas(result.data);
      console.log(result.data);
    })();
  }, [reload]);

  return (
    <div>
      <Container>
        <h1 style={{ textAlign: "left" }}>Lista de Ventas</h1>
        <hr />

        <TextField
          style={{ marginBottom: 20, width: 600 }}
          variant="standard"
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
          value={searchTerm}
          label={"Buscar Venta"}
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

        {isEmpty(withSearch) ? <NoData /> : <></>}
      </Container>
    </div>
  );
};

export default SalesList;
