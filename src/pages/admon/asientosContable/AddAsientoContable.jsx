import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { useNavigate } from "react-router-dom";
import DatePicker from "@mui/lab/DatePicker";
import {
  getRuta,
  isAccess,
  toastError,
  toastSuccess,
} from "../../../helpers/Helpers";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCirclePlus,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

import { isEmpty } from "lodash";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getToken,
  deleteToken,
  deleteUserData,
} from "../../../services/Account";

import {
  addAsientoContableAsync,
  getCountFuentesContablesAsync,
  getCountLibrosAsync,
} from "../../../services/ContabilidadApi";
import SmallModal from "../../../components/modals/SmallModal";
import { AddCountDetail } from "./AddCountDetail";
import NoData from "../../../components/NoData";
import { Table } from "react-bootstrap";
import { getStoresAsync } from "../../../services/AlmacenApi";

export const AddAsientoContable = ({ setShowModal }) => {
  const [fecha, setFecha] = useState(new Date());
  const [referencia, setReferencia] = useState("");

  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  const [libroList, setLibroList] = useState([]);
  const [selectedLibro, setSelectedLibro] = useState("");

  const [fuenteList, setFuenteList] = useState([]);
  const [selectedFuente, setSelectedFuente] = useState("");

  const [showCountModal, setShowCountModal] = useState(false);
  const [selectedCount, setSelectedCount] = useState("");
  const [debito, setDebito] = useState("");
  const [credito, setCredito] = useState("");

  const [sumdebito, setSumDebito] = useState(0);
  const [sumcredito, setSumCredito] = useState(0);
  const [diferencia, setDiferencia] = useState(0);

  const [detalleAtoContab, setDetalleAtoContab] = useState([]);

  const [mR, setMR] = useState(0);
  const [mR2, setMR2] = useState(0);
  const MySwal = withReactContent(Swal);

  const {
    isDarkMode,
    reload,
    setReload,
    setIsLoading,
    setIsDefaultPass,
    setIsLogged,
    access,
  } = useContext(DataContext);

  let navigate = useNavigate();
  let ruta = getRuta();

  const token = getToken();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getCountFuentesContablesAsync(token);
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
      setFuenteList(result.data);

      const resultLibro = await getCountLibrosAsync(token);
      if (!resultLibro.statusResponse) {
        setIsLoading(false);
        if (resultLibro.error.request.status === 401) {
          navigate(`${ruta}/unauthorized`);
          return;
        }
        toastError(resultLibro.error.message);
        return;
      }

      if (resultLibro.data === "eX01") {
        setIsLoading(false);
        deleteUserData();
        deleteToken();
        setIsLogged(false);
        return;
      }

      if (resultLibro.data.isDefaultPass) {
        setIsLoading(false);
        setIsDefaultPass(true);
        return;
      }

      setLibroList(resultLibro.data);

      const resultStore = await getStoresAsync(token);
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
      setIsLoading(false);
      reportWindowSize();
    })();
  }, [reload]);

  const addToDetail = () => {
    if (debito.length === 0 && credito.length === 0) {
      toastError("Debe ingresar un monto a debitar o acreditar");
      return;
    }
    if (debito === "0") {
      toastError("Debito no puede ser 0");
      return;
    }
    if (credito === "0") {
      toastError("Credito no puede ser 0");
      return;
    }

    const { countNumber, descripcion, id } = selectedCount;
    const data = {
      countId: id,
      countNumber,
      descripcion,
      debito: debito === "" ? 0 : debito,
      credito: credito === "" ? 0 : credito,
    };

    const tempData = [...detalleAtoContab, data];
    setDetalleAtoContab(tempData);

    let sC = 0;
    let sD = 0;

    tempData.map((item) => {
      if (item.credito !== "") {
        sC += parseInt(item.credito);
      }
      if (item.debito !== "") {
        sD += parseInt(item.debito);
      }
    });

    setSumCredito(sC);
    setSumDebito(sD);
    setDiferencia(Math.abs(sC - sD));
    setShowCountModal(false);
    setSelectedCount("");
    setDebito("");
    setCredito("");
  };

  function reportWindowSize() {
    if (window.innerWidth < 599) {
      setMR2(Math.round(window.innerWidth * 0.03));
    } else if (window.innerWidth >= 600 && window.innerWidth < 699) {
      setMR2(Math.round(window.innerWidth * 0.05));
    } else if (window.innerWidth >= 700 && window.innerWidth < 799) {
      setMR2(Math.round(window.innerWidth * 0.08));
    } else if (window.innerWidth >= 800 && window.innerWidth < 849) {
      setMR2(Math.round(window.innerWidth * 0.1));
    } else if (window.innerWidth >= 850 && window.innerWidth < 1000) {
      setMR2(Math.round(window.innerWidth * 0.11));
    } else {
    }
    setMR(Math.round(window.innerWidth * 0.03));
  }

  window.onresize = reportWindowSize;

  const saveAsientoContable = async () => {
    if (diferencia !== 0) {
      toastError("El asiento presenta errores");
      return;
    }
    if (referencia.length <= 0) {
      toastError("Debe ingresar una referencia de asiento contable");
      return;
    }

    if (selectedFuente === "") {
      toastError("Debe seleccionar una fuente contable");
      return;
    }
    if (selectedStore === "") {
      toastError("Debe seleccionar un almacen");
      return;
    }
    if (selectedLibro === "") {
      toastError("Debe seleccionar un libro contable");
      return;
    }
    if (isEmpty(detalleAtoContab)) {
      toastError("Debe ingresar el detalle del asiento contable");
      return;
    }
    const data = {
      fecha,
      referencia,
      idLibroContable: selectedLibro,
      idFuenteContable: selectedLibro,
      asientoContableDetails: detalleAtoContab,
      store: selectedStore,
    };

    setIsLoading(true);
    const result = await addAsientoContableAsync(token, data);
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
    setReload(!reload);
    toastSuccess("Asiento contable agregado");
    setShowModal(false);
  };

  const regresar = async () => {
    MySwal.fire({
      icon: "warning",
      title: <p>Salir</p>,
      text: "¿Salir sin guardar los cambios?",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setShowModal(false);
      }
    });
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
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <DatePicker
              label="Fecha"
              value={fecha}
              onChange={(newValue) => {
                setFecha(newValue);
              }}
              renderInput={(params) => (
                <TextField required fullWidth variant="standard" {...params} />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              variant="standard"
              onChange={(e) => setReferencia(e.target.value.toUpperCase())}
              label={"Referencia"}
              value={referencia}
            />
          </Grid>
          <Grid item xs={3}>
           {/* Combo de Almacén */}
<FormControl
  variant="standard"
  fullWidth
  style={{
    textAlign: "left",
    marginRight: 20,
    width: "calc(33.33% - 24px)", // Mismo tamaño que el código proporcionado
    display: isAlmacenSelected && isMasivoSelected ? "block" : "none",
  }}
>
  <InputLabel id="demo-simple-select-standard-label">
    Seleccione un Almacen
  </InputLabel>
  <Select
    defaultValue=""
    labelId="demo-simple-select-standard-label"
    id="demo-simple-select-standard"
    value={selectedStore || ""}
    onChange={(e) => {
      setSelectedStore(e.target.value);
      setIsAlmacenSelected(true);
    }}
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
        storeList.length > 6 ||
        storeList.length > 5 ||
        storeList.length > 4 ||
        storeList.length > 3 ||
        storeList.length > 2
          ? false
          : true
      }
    >
      Todos...
    </MenuItem>
  </Select>
</FormControl>

{/* Combo de Tipo de Negocio */}
<FormControl
  variant="standard"
  fullWidth
  style={{
    textAlign: "left",
    marginRight: 20,
    width: "calc(33.33% - 24px)", // Mismo tamaño que el código proporcionado
    display: isAlmacenSelected && isMasivoSelected ? "block" : "none",
  }}
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
    disabled={!isAlmacenSelected}
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

{/* Combo de Familia */}
<FormControl
  variant="standard"
  fullWidth
  style={{
    textAlign: "left",
    marginRight: 20,
    width: "calc(33.33% - 24px)", // Mismo tamaño que el código proporcionado
    display: isAlmacenSelected && isMasivoSelected ? "block" : "none",
  }}
>
  <InputLabel id="demo-simple-select-standard-label">
    Seleccione una Familia
  </InputLabel>
  <Select
    defaultValue=""
    labelId="demo-simple-select-standard-label"
    id="demo-simple-select-standard"
    value={selectedFamilia}
    onChange={(e) => {
      if (e.target.value.length === 0) {
        setSelectedFamilia("t");
        return;
      }
      setSelectedFamilia(e.target.value);
    }}
    style={{ textAlign: "left" }}
    disabled={!isAlmacenSelected}
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

          </Grid>
          <Grid item xs={4}>
            <FormControl
              variant="standard"
              fullWidth
              style={{ marginRight: 20 }}
              required
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione una fuente
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedFuente}
                onChange={(e) => setSelectedFuente(e.target.value)}
                label="Fuente Contable"
                style={{ textAlign: "left" }}
              >
                <MenuItem key={-1} value="">
                  <em> Seleccione una Fuente</em>
                </MenuItem>
                {fuenteList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.description}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl
              variant="standard"
              fullWidth
              style={{ marginRight: 20 }}
              required
            >
              <InputLabel id="demo-simple-select-standard-label">
                Seleccione un Libro
              </InputLabel>
              <Select
                defaultValue=""
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedLibro}
                onChange={(e) => setSelectedLibro(e.target.value)}
                label="Libro Contable"
                style={{ textAlign: "left" }}
              >
                <MenuItem key={-1} value="">
                  <em> Seleccione una Libro</em>
                </MenuItem>
                {libroList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.description}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <Button
              variant="outlined"
              fullWidth
              style={{ borderRadius: 20, marginTop: 10 }}
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={() => {
                setShowCountModal(true);
              }}
            >
              Seleccionar cuenta
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={10}
        style={{
          textAlign: "center",
          borderRadius: 30,
          padding: 20,
          marginBottom: 10,
        }}
      >
        {isEmpty(detalleAtoContab) ? (
          <NoData />
        ) : (
          <Table
            hover={!isDarkMode}
            size="sm"
            responsive
            className="text-primary"
          >
            <caption>
              <Stack
                style={{
                  float: "right",
                }}
              >
                <Stack direction="row" spacing={5}>
                  <span style={{ color: "#ffc107" }}>C$:</span>
                  <Stack direction="row" className="stack">
                    <span
                      style={{
                        marginRight: mR2,
                        color: "#ffc107",
                        fontWeight: "bold",
                      }}
                    >
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumdebito)}
                    </span>
                    <span
                      style={{
                        marginRight: mR,
                        color: "#ffc107",
                        fontWeight: "bold",
                      }}
                    >
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(sumcredito)}
                    </span>
                  </Stack>
                </Stack>
                <hr />

                <Stack spacing={2} direction="row" justifyContent="center">
                  <span
                    style={{ color: diferencia > 0 ? "#f50057" : "#4caf50" }}
                  >
                    Diferencia:
                  </span>
                  <span
                    style={{
                      color: diferencia > 0 ? "#f50057" : "#4caf50",
                      fontWeight: "bold",
                    }}
                  >
                    {new Intl.NumberFormat("es-NI", {
                      style: "currency",
                      currency: "NIO",
                    }).format(diferencia)}
                  </span>
                </Stack>
              </Stack>
            </caption>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>#Cta</th>
                <th style={{ textAlign: "left" }}>Descripcion</th>
                <th style={{ textAlign: "center" }}>Debito C$</th>
                <th style={{ textAlign: "center" }}>Credito C$</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {detalleAtoContab.map((item) => {
                const { countId, countNumber, credito, debito, descripcion } =
                  item;

                return (
                  <tr key={detalleAtoContab.indexOf(item) + 1}>
                    <td style={{ textAlign: "left" }}>{countNumber}</td>
                    <td style={{ textAlign: "left" }}>{descripcion}</td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(debito)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {new Intl.NumberFormat("es-NI", {
                        style: "currency",
                        currency: "NIO",
                      }).format(credito)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <Divider style={{ marginBottom: 20 }} />
        <Stack
          spacing={2}
          direction="row"
          display="flex"
          justifyContent="space-around"
        >
          <Button
            variant="outlined"
            style={{
              borderRadius: 20,
              color: "#ffc400",
              borderColor: "#ffc400",
            }}
            startIcon={<FontAwesomeIcon icon={faCircleChevronLeft} />}
            onClick={() => {
              regresar();
            }}
          >
            Regresar
          </Button>
          <Button
            variant="outlined"
            style={{ borderRadius: 20 }}
            startIcon={<FontAwesomeIcon icon={faSave} />}
            onClick={() => {
              saveAsientoContable(true);
            }}
          >
            Guardar
          </Button>
        </Stack>
      </Paper>

      <SmallModal
        titulo={"Agregar Cuenta"}
        isVisible={showCountModal}
        setVisible={setShowCountModal}
      >
        <AddCountDetail
          selectedCount={selectedCount}
          setSelectedCount={setSelectedCount}
          addToDetail={addToDetail}
          debito={debito}
          setDebito={setDebito}
          credito={credito}
          setCredito={setCredito}
        />
      </SmallModal>
    </div>
  );
};
