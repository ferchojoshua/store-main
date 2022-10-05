import React, { useState } from "react";
import { DatePicker } from "@mui/lab";
import {
  Container,
  Paper,
  TextField,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { getRuta, toastError } from "../../../../helpers/Helpers";

const SelectorCompras = () => {
  var date = new Date();
  const [fechaDesde, setDesdeFecha] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );

  const [fechaHasta, setHastaFecha] = useState(new Date());

  const [selectAll, setSelectAll] = useState(true);
  const [selectCreditSales, setSelectCreditSales] = useState(true);
  const [selectContadoSales, setSelectContadoSales] = useState(true);

  let ruta = getRuta();

  const verReport = () => {
    if (!moment(fechaDesde).isValid()) {
      toastError("Ingrese una fecha de inicio valida");
      return;
    }
    if (!moment(fechaHasta).isValid()) {
      toastError("Ingrese una fecha de final valida");
      return;
    }

    if (!selectCreditSales && !selectContadoSales) {
      toastError("Seleccione al menos un tipo de compra");
      return;
    }

    var params = {
      desde: fechaDesde,
      hasta: fechaHasta,
      creditCompras: selectCreditSales,
      contadoCompras: selectContadoSales,
    };
    params = JSON.stringify(params);
    window.open(`${ruta}/r-compras/${params}`);
  };

  const seleccionarTodos = () => {
    setSelectAll(!selectAll);
    setSelectContadoSales(!selectAll);
    setSelectCreditSales(!selectAll);
  };

  return (
    <div>
      <Container style={{ width: 550 }}>
        <Paper
          elevation={10}
          style={{
            borderRadius: 30,
            padding: 20,
            marginBottom: 10,
          }}
        >
          <Stack spacing={2} direction="row">
            <DatePicker
              label="Desde"
              value={fechaDesde}
              onChange={(newValue) => {
                setDesdeFecha(newValue);
              }}
              renderInput={(params) => (
                <TextField required fullWidth variant="standard" {...params} />
              )}
            />

            <DatePicker
              label="Hasta"
              value={fechaHasta}
              onChange={(newValue) => {
                setHastaFecha(newValue);
              }}
              renderInput={(params) => (
                <TextField required fullWidth variant="standard" {...params} />
              )}
            />
          </Stack>

          <Stack style={{ marginTop: 20 }}>
            <span style={{ fontWeight: "bold", color: "#2196f3" }}>
              Tipo de Venta
            </span>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={() => seleccionarTodos()}
                  />
                }
                label="Seleccionar Todos"
              />
            </FormGroup>
          </Stack>

          <hr />

          <Stack direction="row" display="flex" justifyContent="space-around">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectContadoSales}
                    onChange={() => {
                      setSelectAll(false);
                      setSelectContadoSales(!selectContadoSales);
                    }}
                  />
                }
                label="Ventas de Contado"
              />
            </FormGroup>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectCreditSales}
                    onChange={() => {
                      setSelectAll(false);
                      setSelectCreditSales(!selectCreditSales);
                    }}
                  />
                }
                label="Ventas de Credito"
              />
            </FormGroup>
          </Stack>

          <Button
            variant="outlined"
            fullWidth
            style={{ borderRadius: 20, marginTop: 30 }}
            startIcon={<FontAwesomeIcon icon={faPrint} />}
            onClick={() => {
              verReport();
            }}
          >
            Generar Reporte
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default SelectorCompras;
