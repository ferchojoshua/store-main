import React, { useContext } from "react";
import {
  faChartLine,
  faCashRegister,
  faHandHoldingDollar,
  faCartFlatbed,
  faDolly,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Grid, Paper, Stack } from "@mui/material";
import { DataContext } from "../../context/DataContext";

import { ReportCaller } from "./component/ReportCaller";
import { SelectorDocXCobrar } from "./reporteVentas/selectores/SelectorDocXCobrar";
import { SelectorMasterVentas } from "./reporteVentas/selectores/SelectorMasterVentas";
import { isAccess } from "../../helpers/Helpers";
import { SelectorArtVendidos } from "./reporteVentas/selectores/SelectorArtVendidos";

export const ReportsContainer = () => {
  const { access } = useContext(DataContext);
  return (
    <Container style={{ marginTop: 20 }}>
      <Paper
        elevation={20}
        style={{ textAlign: "center", padding: 20, borderRadius: 20 }}
      >
        <Stack
          spacing={3}
          direction="row"
          display="flex"
          justifyContent="center"
        >
          <FontAwesomeIcon
            icon={faChartLine}
            className="fa-beat-fade"
            style={{ fontSize: 40, color: "#4caf50" }}
          />

          <h1>Reportes de Ventas</h1>
        </Stack>
        <hr />

        <Grid container spacing={2}>
          {isAccess(access, "MASTER VENTAS VER") ? (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ReportCaller
                icon={faCashRegister}
                text="Master de Ventas"
                modalTitle="Ver Existencias por Fecha"
              >
                <SelectorMasterVentas />
              </ReportCaller>
            </Grid>
          ) : (
            <></>
          )}

          {isAccess(access, "CUENTASXCOBRAR VER") ? (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ReportCaller
                icon={faHandHoldingDollar}
                text="Doc por Cobrar"
                modalTitle="Ver Documentos por Cobrar"
              >
                <SelectorDocXCobrar />
              </ReportCaller>
            </Grid>
          ) : (
            <></>
          )}

          {isAccess(access, "PRODVENDIDOS VER") ? (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ReportCaller
                icon={faDolly}
                text="Articulos Vendidos"
                modalTitle="Ver Articulos Vendidos"
              >
                <SelectorArtVendidos />
              </ReportCaller>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};
