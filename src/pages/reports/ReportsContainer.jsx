import React, { useContext } from "react";
import {
  faChartLine,
  faCashRegister,
  faHandHoldingDollar,
  faDolly,
  faCalendarDay,
  faSackDollar,
  faBriefcase,
  faHandshakeAltSlash,
  faMoneyBills,
  faCartArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Grid, Paper, Stack } from "@mui/material";
import { DataContext } from "../../context/DataContext";

import { ReportCaller } from "./component/ReportCaller";
import { SelectorDocXCobrar } from "./reporteVentas/selectores/SelectorDocXCobrar";
import { SelectorMasterVentas } from "./reporteVentas/selectores/SelectorMasterVentas";
import { isAccess } from "../../helpers/Helpers";
import { SelectorArtVendidos } from "./reporteVentas/selectores/SelectorArtVendidos";
import SelectorCierreDiario from "./reporteVentas/selectores/SelectorCierreDiario";
import SelectorCajaChica from "./reporteVentas/selectores/SelectorCajaChica";
import SelectorProdNoVendido from "./reporteVentas/selectores/SelectorProdNoVendido";
import { SelectorIngrEgresos } from "./reporteVentas/selectores/SelectorIngrEgresos";
import SelectorCompras from "./reporteVentas/selectores/SelectorCompras";

export const ReportsContainer = () => {
  const { access } = useContext(DataContext);
  return (
    <Container style={{ marginTop: 20 }}>
      <Stack spacing={3}>
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
                  modalTitle="Master de Ventas"
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
                  modalTitle="Documentos por Cobrar"
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
                  text="Productos Vendidos"
                  modalTitle="Productos Vendidos"
                >
                  <SelectorArtVendidos />
                </ReportCaller>
              </Grid>
            ) : (
              <></>
            )}

            {isAccess(access, "PRODNOVENDIDOS VER") ? (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ReportCaller
                  icon={faHandshakeAltSlash}
                  text="Productos no Vendidos"
                  modalTitle="Productos no Vendidos"
                >
                  <SelectorProdNoVendido />
                </ReportCaller>
              </Grid>
            ) : (
              <></>
            )}

            {isAccess(access, "CIERREDIARIO VER") ? (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ReportCaller
                  icon={faCalendarDay}
                  text="Cierre Diario"
                  modalTitle="Cierre Diario"
                >
                  <SelectorCierreDiario />
                </ReportCaller>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Paper>

        {isAccess(access, "CAJACHICA VER") ||
        isAccess(access, "INGRESOS VER") ? (
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
                icon={faBriefcase}
                className="fa-beat-fade"
                style={{ fontSize: 40, color: "#4caf50" }}
              />

              <h1>Reportes Administrativos</h1>
            </Stack>
            <hr />
            <Grid container spacing={2}>
              {isAccess(access, "CAJACHICA VER") ? (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <ReportCaller
                    icon={faSackDollar}
                    text="Caja Chica"
                    modalTitle="Movimientos de Caja Chica"
                  >
                    <SelectorCajaChica />
                  </ReportCaller>
                </Grid>
              ) : (
                <></>
              )}
              {isAccess(access, "INGRESOS VER") ? (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <ReportCaller
                    icon={faMoneyBills}
                    text="Ingresos"
                    modalTitle="Ingresos"
                  >
                    <SelectorIngrEgresos />
                  </ReportCaller>
                </Grid>
              ) : (
                <></>
              )}
              {isAccess(access, "REPORTECOMPRAS VER") ? (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <ReportCaller
                    icon={faCartArrowDown}
                    text="Compras"
                    modalTitle="Compras"
                  >
                    <SelectorCompras />
                  </ReportCaller>
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </Paper>
        ) : (
          <></>
        )}
      </Stack>
    </Container>
  );
};
