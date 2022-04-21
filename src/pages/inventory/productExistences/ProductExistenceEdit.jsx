import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Divider,
  Container,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../../helpers/Helpers";

import {
  getToken,
  deleteUserData,
  deleteToken,
} from "../../../services/Account";
import { DataContext } from "../../../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faPenToSquare,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { updateProductExistenceAsync } from "../../../services/ExistanceApi";

const ProductExistenceEdit = ({ selectedProduct, setShowModal }) => {
  const { existencia, precioVentaDetalle, precioVentaMayor, id } =
    selectedProduct;
  const { setIsLoading, reload, setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);

  const [newExistencias, setNewExistencias] = useState(existencia);
  const [newPVD, setNewPVD] = useState(precioVentaDetalle);
  const [newPVM, setNewPVM] = useState(precioVentaMayor);

  const token = getToken();

  const saveChangesAsync = async () => {
    const data = {
      id,
      newExistencias,
      newPVD,
      newPVM,
    };

    console.log(data);

    if (newExistencias === "" || newExistencias === null) {
      toastError("Debe establecer una existencia...");
      return;
    }

    if (newPVD === "" || newPVD === null) {
      toastError("Debe establecer un precio de venta al detalle...");
      return;
    }

    if (newPVM === "" || newPVM === null) {
      toastError("Debe establecer un precio de venta al por mayor...");
      return;
    }

    setIsLoading(true);

    const result = await updateProductExistenceAsync(token, data);
    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error.request.status === 401) {
        navigate("/unauthorized");
        return;
      }
      if (result.error.request.status === 204) {
        toastError("Producto no encontrado...");
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
    setReload(!reload);
    toastSuccess("Producto Actualizado...!");
    setIsEdit(false);
    setShowModal(false);
  };

  //Devuelve un entero positivo
  const funcCantidad = (value) => {
    if (/^[0-9]+$/.test(value.toString()) || value === "") {
      setNewExistencias(value);
      return;
    }
  };

  const funcPrecioVentaDetalle = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      setNewPVD(value);
      return;
    }
  };

  const funcPrecioVentaMayor = (value) => {
    if (/^\d*\.?\d*$/.test(value.toString())) {
      setNewPVM(value);
      return;
    }
  };

  return (
    <div>
      <Container style={{ width: 550 }}>
        <Divider />

        <div
          style={{ marginTop: 20 }}
          className="row justify-content-around align-items-center"
        >
          <div className="col-sm-2">
            <Typography variant="h6">Exist:</Typography>
          </div>

          <div className="col-sm-2">
            <Typography variant="h6" style={{ color: "#2196f3" }}>
              {existencia}
            </Typography>
          </div>

          <div className="col-sm-2">
            <Typography variant="h6">PVD:</Typography>
          </div>

          <div className="col-sm-2">
            <Typography variant="h6" style={{ color: "#2196f3" }}>
              {precioVentaDetalle}
            </Typography>
          </div>

          <div className="col-sm-2">
            <Typography variant="h6">PVM:</Typography>
          </div>
          <div className="col-sm-2">
            <Typography variant="h6" style={{ color: "#2196f3" }}>
              {precioVentaMayor}
            </Typography>
          </div>
        </div>

        {isEdit ? (
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              marginTop: 10,
              padding: 20,
            }}
          >
            <div>
              <div
                className="justify-content-around"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
                <Typography
                  variant="h6"
                  textAlign="center"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Ajuste de Existencia y Precio de Venta
                </Typography>
              </div>

              <Divider />

              <TextField
                fullWidth
                style={{ marginTop: 20 }}
                variant="standard"
                label="Nueva Existencia"
                value={newExistencias}
                onChange={(e) => funcCantidad(e.target.value)}
              />

              <TextField
                fullWidth
                style={{ marginTop: 20 }}
                variant="standard"
                label="Nuevo Precio Venta Detalle"
                value={newPVD}
                onChange={(e) => funcPrecioVentaDetalle(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">C$</InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                style={{ marginTop: 20 }}
                variant="standard"
                label="Nuevo Precio Venta Mayor"
                value={newPVM}
                onChange={(e) => funcPrecioVentaMayor(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">C$</InputAdornment>
                  ),
                }}
              />
            </div>
          </Paper>
        ) : (
          <Divider style={{ marginTop: 20 }} />
        )}

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            style={{
              borderRadius: 20,
              borderColor: isEdit ? "#9c27b0" : "#ff9800",
              color: isEdit ? "#9c27b0" : "#ff9800",
              marginRight: 10,
            }}
            startIcon={
              <FontAwesomeIcon icon={isEdit ? faCircleXmark : faPenToSquare} />
            }
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? "Cancelar" : " Editar Datos"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            style={{ borderRadius: 20, marginLeft: 10 }}
            startIcon={<FontAwesomeIcon icon={faSave} />}
            onClick={() => saveChangesAsync()}
            disabled={!isEdit}
          >
            Actualizar Datos
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default ProductExistenceEdit;
