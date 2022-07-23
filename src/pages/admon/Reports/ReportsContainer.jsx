import { faDolly, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Grid, IconButton, Paper } from "@mui/material";
import React, { useState } from "react";
import SmallModal from "../../../components/modals/SmallModal";
import { SelectorHistorialExistencias } from "./existenceStatus/SelectorHistorialExistencias";

export const ReportsContainer = () => {
  const [showProdSelector, setShowProdSelector] = useState(false);
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper
            elevation={10}
            style={{ textAlign: "center", padding: 20, borderRadius: 20 }}
          >
            <IconButton
              onClick={() => setShowProdSelector(true)}
              sx={{
                border: 1,
                borderColor: "#03a9f4",
                p: 3,
                mb: 1,
              }}
            >
              <FontAwesomeIcon
                icon={faDolly}
                style={{ fontSize: 70, color: "#2979ff" }}
              />
            </IconButton>
            <hr />
            <h5 style={{ color: "#03a9f4" }}>Ver Existencia por Fecha</h5>
          </Paper>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper
            elevation={10}
            style={{ textAlign: "center", padding: 20, borderRadius: 20 }}
          >
            <IconButton
              sx={{
                border: 1,
                borderColor: "#2979ff",
                p: 3,
                mb: 1,
              }}
            >
              <FontAwesomeIcon
                icon={faDolly}
                style={{ fontSize: 70, color: "#2979ff" }}
              />
            </IconButton>
            <hr />
            <h5 style={{ color: "#4caf50" }}>Ver Existencia por Fecha</h5>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper
            elevation={10}
            style={{ textAlign: "center", padding: 20, borderRadius: 20 }}
          >
            <IconButton
              sx={{
                border: 1,
                borderColor: "#2979ff",
                p: 3,
                mb: 1,
              }}
            >
              <FontAwesomeIcon
                icon={faDolly}
                style={{ fontSize: 70, color: "#2979ff" }}
              />
            </IconButton>
            <hr />
            <h5 style={{ color: "#4caf50" }}>Ver Existencia por Fecha</h5>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper
            elevation={10}
            style={{ textAlign: "center", padding: 20, borderRadius: 20 }}
          >
            <IconButton
              sx={{
                border: 1,
                borderColor: "#2979ff",
                p: 3,
                mb: 1,
              }}
            >
              <FontAwesomeIcon
                icon={faDolly}
                style={{ fontSize: 70, color: "#2979ff" }}
              />
            </IconButton>
            <hr />
            <h5 style={{ color: "#4caf50" }}>Ver Existencia por Fecha</h5>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper
            elevation={10}
            style={{ textAlign: "center", padding: 20, borderRadius: 20 }}
          >
            <IconButton
              sx={{
                border: 1,
                borderColor: "#2979ff",
                p: 3,
                mb: 1,
              }}
            >
              <FontAwesomeIcon
                icon={faDolly}
                style={{ fontSize: 70, color: "#2979ff" }}
              />
            </IconButton>
            <hr />
            <h5 style={{ color: "#4caf50" }}>Ver Existencia por Fecha</h5>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper
            elevation={10}
            style={{ textAlign: "center", padding: 20, borderRadius: 20 }}
          >
            <IconButton
              sx={{
                border: 1,
                borderColor: "#2979ff",
                p: 3,
                mb: 1,
              }}
            >
              <FontAwesomeIcon
                icon={faDolly}
                style={{ fontSize: 70, color: "#2979ff" }}
              />
            </IconButton>
            <hr />
            <h5 style={{ color: "#4caf50" }}>Ver Existencia por Fecha</h5>
          </Paper>
        </Grid> */}
      </Grid>

      <SmallModal
        titulo={"Ver Historial de Existencias"}
        isVisible={showProdSelector}
        setVisible={setShowProdSelector}
      >
        <SelectorHistorialExistencias />
      </SmallModal>
    </Container>
  );
};
