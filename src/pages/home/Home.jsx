import React, { useState, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import {
  Paper,
  Box,
  Tabs,
  Tab,
  Divider,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isAccess } from "../../helpers/Helpers";
import { MetaMensual } from "./MetaMensual";

const Home = () => {
  const {
    reload,
    setReload,
    setIsLoading,
    isTokenNull,
    setIsTokenNull,
    access,
  } = useContext(DataContext);
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
          <Typography variant="h3">DASHBOARD</Typography>
        </div>

        <hr />
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
              }}
            >
              <MetaMensual />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
              }}
            ></Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
              }}
            ></Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={10}
              style={{
                borderRadius: 30,
                padding: 20,
              }}
            ></Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
