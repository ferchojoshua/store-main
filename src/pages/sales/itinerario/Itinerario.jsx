import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Grid,
} from "@mui/material";

import { SelectDepartment } from "./SelectDepartment";
import { SelectMunicipalities } from "./SelectMunicipalities";
import NoData from "../../../components/NoData";
import { SelectedMunicipalities } from "./SelectedMunicipalities";

export const Itinerario = () => {
  const [selectedDepartment, setSelectedDepartment] = useState([]);

  const [municipalityList, setMunicipalityList] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const [municipalityListSelected, setMunicipalityListSelected] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={4}>
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 20,
            }}
          >
            <Typography variant="h6" style={{ color: "#1769aa" }}>
              Departamentos
            </Typography>
            <SelectDepartment
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              setMunicipalityList={setMunicipalityList}
              municipalityListSelected={municipalityListSelected}
            />

            <Typography
              variant="h6"
              style={{ marginTop: 20, color: "#1769aa" }}
            >
              Municipios
            </Typography>
            <SelectMunicipalities
              municipalityList={municipalityList}
              setMunicipalityList={setMunicipalityList}
              municipalityListSelected={municipalityListSelected}
              setMunicipalityListSelected={setMunicipalityListSelected}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          <Paper
            elevation={10}
            style={{
              borderRadius: 30,
              padding: 20,
            }}
          >
            <SelectedMunicipalities
              municipalityListSelected={municipalityListSelected}
              setMunicipalityListSelected={setMunicipalityListSelected}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
