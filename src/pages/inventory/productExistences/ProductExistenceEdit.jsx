import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Divider,
  Container,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getRuta, toastError, toastSuccess } from "../../../helpers/Helpers";

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

const ProductExistenceEdit = ({ selectedStore, setShowModal }) => {
  let ruta = getRuta();

  const { exisistencia, pvd, pvm, idExistence } = selectedStore;
  const { setIsLoading, reload, setReload, setIsDefaultPass, setIsLogged } =
    useContext(DataContext);
  let navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);

  const [newExistencias, setNewExistencias] = useState(exisistencia);
  const [newPVD, setNewPVD] = useState(pvd);
  const [newPVM, setNewPVM] = useState(pvm);

  const token = getToken();

  const saveChangesAsync = async () => {
    const data = {
      id: idExistence,
      newExistencias,
      newPVD,
      newPVM,
    };

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
        navigate(`${ruta}/unauthorized`);
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
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
          padding: 20,
          marginBottom: 10,
        }}
      >
        <Container>
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 20,
              marginBottom: 10,
            }}
          >
            <div
              style={{ marginTop: 20 }}
              className="row justify-content-around"
            >
              <div className="col-sm-3">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography variant="h6">Exist:</Typography>

                  <Typography variant="h6" style={{ color: "#2196f3" }}>
                    {exisistencia}
                  </Typography>
                </div>
              </div>

              <div className="col-sm-3">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography variant="h6">PVD:</Typography>
                  <Typography variant="h6" style={{ color: "#2196f3" }}>
                    {pvd}
                  </Typography>
                </div>
              </div>

              <div className="col-sm-3">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography variant="h6">PVM:</Typography>
                  <Typography variant="h6" style={{ color: "#2196f3" }}>
                    {pvm}
                  </Typography>
                </div>
              </div>
            </div>
          </Paper>

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
                <FontAwesomeIcon
                  icon={isEdit ? faCircleXmark : faPenToSquare}
                />
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
      </Paper>
    </div>
  );
};

export default ProductExistenceEdit;
