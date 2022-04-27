import React, { useState, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { simpleMessage, toastError } from "../../../helpers/Helpers";

import {
  Button,
  Divider,
  Container,
  Paper,
  Typography,
  Grid,
  IconButton,
  FormControl,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faSave,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { addEntradaProductoAsync } from "../../../services/ProductIsApi";
import {
  deleteToken,
  deleteUserData,
  getToken,
} from "../../../services/Account";
import { constant } from "lodash";
import SelectClient from "./SelectClient";
import SelectProduct from "./SelectProduct";
import SelectTipoVenta from "./SelectTipoVenta";
import ProductDescription from "./ProductDescription";

const NewSale = () => {
  const { setIsLoading, setIsLogged, reload, setReload, setIsDefaultPass } =
    useContext(DataContext);
  let navigate = useNavigate();

  const [typeClient, setTypeClient] = useState(false);

  const [selectedClient, setSelectedClient] = useState("");
  const [eventualClient, setEventualClient] = useState("");

  const [typeVenta, setTypeVenta] = useState("contado");

  const [selectedProduct, setSelectedProduct] = useState("");

  const [cantidad, setCantidad] = useState("");
  const [descuento, setDescuento] = useState("");
  const [costoXProducto, setcostoXProducto] = useState("");

  return (
    <div>
      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <h1>Agregar Venta de Productos</h1>
        </div>

        <hr />

        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
              }}
            >
              <SelectClient
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                eventualClient={eventualClient}
                setEventualClient={setEventualClient}
                typeClient={typeClient}
                setTypeClient={setTypeClient}
              />

              <SelectProduct
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
              />

              <SelectTipoVenta
                typeVenta={typeVenta}
                setTypeVenta={setTypeVenta}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <ProductDescription
              selectedProduct={selectedProduct}
              cantidad={cantidad}
              setCantidad={setCantidad}
              descuento={descuento}
              setDescuento={setDescuento}
              costoXProducto={costoXProducto}
              setcostoXProducto={setcostoXProducto}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default NewSale;
