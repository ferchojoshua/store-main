import * as React from "react";
import { useContext } from "react";
import { Paper, Box, Tabs, Tab, Divider } from "@mui/material";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartFlatbed,
  faCartFlatbedSuitcase,
  faDollyBox,
  faLeftRight,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";

import EntradaProduto from "./entradaProducto/EntradaProduto";
import MoverProducto from "./traslate-products/MoverProducto";
import Products from "./products/Products";
import ProductExistences from "./productExistences/ProductExistences";

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

const InventoryContainer = () => {
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
            icon={<FontAwesomeIcon icon={faList} style={{ fontSize: 20 }} />}
            label="Entrada de Producto"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />

          <Tab
            icon={
              <FontAwesomeIcon icon={faCartFlatbed} style={{ fontSize: 20 }} />
            }
            label="Existencias de Producto"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />

          <Tab
            icon={
              <FontAwesomeIcon icon={faLeftRight} style={{ fontSize: 20 }} />
            }
            label="Traslado de Producto"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />

          <Tab
            icon={
              <FontAwesomeIcon icon={faDollyBox} style={{ fontSize: 20 }} />
            }
            label="Productos"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />
        </Tabs>
        <Divider style={{ marginTop: 10 }} />

        <TabPanel value={value} index={0}>
          <EntradaProduto />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <ProductExistences />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <MoverProducto />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Products />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default InventoryContainer;
