import React from "react";

import { Paper, Box, Tabs, Tab, Divider } from "@mui/material";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartFlatbed,
  faDollyBox,
  faLeftRight,
  faListCheck,
  faListOl,
  faScroll,
  faTruckRampBox,
} from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";

import { isAccess } from "../../helpers/Helpers";
import { DataContext } from "../../context/DataContext";
import { CountList } from "./counts/CountList";
import { AsientoList } from "./asientosContable/AsientoList";
import { ReportsContainer } from "./Reports/ReportsContainer";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AdmonContainer = () => {
  const { access } = React.useContext(DataContext);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container>
      <Paper
        elevation={10}
        style={{
          borderRadius: 30,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon label tabs example"
          centered
        >
          <Tab
            icon={<FontAwesomeIcon icon={faListOl} style={{ fontSize: 20 }} />}
            label="Cuentas"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />

          <Tab
            icon={
              <FontAwesomeIcon icon={faListCheck} style={{ fontSize: 20 }} />
            }
            label="Diario General"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />

          <Tab
            icon={<FontAwesomeIcon icon={faScroll} style={{ fontSize: 20 }} />}
            label="Reportes"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />

          {/* {isAccess(access, "EXISTANCE VER") ? (
            <Tab
              icon={
                <FontAwesomeIcon
                  icon={faCartFlatbed}
                  style={{ fontSize: 20 }}
                />
              }
              label="Existencias de Producto"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}

          {isAccess(access, "PRODUCT TRANSLATE VER") ? (
            <Tab
              icon={
                <FontAwesomeIcon icon={faLeftRight} style={{ fontSize: 20 }} />
              }
              label="Traslado de Producto"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}

          {isAccess(access, "PRODUCTS VER") ? (
            <Tab
              icon={
                <FontAwesomeIcon icon={faDollyBox} style={{ fontSize: 20 }} />
              }
              label="Productos"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )} */}
        </Tabs>

        <Divider style={{ marginTop: 10 }} />

        <TabPanel value={value} index={0}>
          <CountList />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <AsientoList />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <ReportsContainer />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdmonContainer;
