import React from "react";

import { Paper, Box, Tabs, Tab, Divider } from "@mui/material";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartFlatbed,
  faDollyBox,
  faLeftRight,
  faMoneyCheckAlt,
  faTruckRampBox,
} from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";
import EntradaProduto from "./entradaProducto/EntradaProduto";
import MoverProducto from "./traslate-products/MoverProducto";
import Products from "./products/Products";
import ProductsRecal from "./productsRecal/ProductsRecal";
import ProductExistences from "./productExistences/ProductExistences";
import { isAccess } from "../../helpers/Helpers";
import { DataContext } from "../../context/DataContext";

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
          {isAccess(access, "ENTRADAPRODUCTOS VER") ? (
            <Tab
              icon={
                <FontAwesomeIcon
                  icon={faTruckRampBox}
                  style={{ fontSize: 20 }}
                />
              }
              label="Entrada de Producto"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}

          {isAccess(access, "EXISTANCE VER") ? (
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
          )}

          {isAccess(access, "PRODUCTS RECAL VER") ? (
            <Tab
              icon={
                <FontAwesomeIcon icon={faMoneyCheckAlt} style={{ fontSize: 20 }} />
              }
              label="Productos Ajuste Valor"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}
        </Tabs>

        <Divider style={{ marginTop: 10 }} />

        {isAccess(access, "ENTRADAPRODUCTOS VER") ? (
          <TabPanel value={value} index={0}>
            <EntradaProduto />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "EXISTANCE VER") ? (
          <TabPanel
            value={value} index={isAccess(access, "ENTRADAPRODUCTOS VER") ? 1 : 0}
          >
            <ProductExistences />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "PRODUCT TRANSLATE VER") ? (
          <TabPanel
            value={value}
            index={
              isAccess(access, "ENTRADAPRODUCTOS VER") ||
              isAccess(access, "EXISTANCE VER")
                ? 2 : isAccess(access, "ENTRADAPRODUCTOS VER")
                ? 1 : isAccess(access, "EXISTANCE VER")
                ? 1
                : 0
            }
          >
            <MoverProducto />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "PRODUCTS VER") ? (
          <TabPanel
            value={value}
            index={
              isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "EXISTANCE VER") && isAccess(access, "PRODUCT TRANSLATE VER")
                ? 3  : isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "EXISTANCE VER")
                ? 2 : isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "PRODUCT TRANSLATE VER")
                ? 2 : isAccess(access, "EXISTANCE VER") && isAccess(access, "PRODUCT TRANSLATE VER")
                ? 2 : isAccess(access, "ENTRADAPRODUCTOS VER")
                ? 1 : isAccess(access, "EXISTANCE VER")
                ? 1 : isAccess(access, "PRODUCT TRANSLATE VER")
                ? 1
                : 0
            }
          >
            <Products />
          </TabPanel>
        ) : (
          <></>
        )}
        {isAccess(access, "PRODUCTS RECAL VER") ? (
          <TabPanel
            value={value}
            index={
                          isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "EXISTANCE VER") && isAccess(access, "PRODUCT TRANSLATE VER") && isAccess(access, "PRODUCTS VER")
                ? 4 : isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "EXISTANCE VER") && isAccess(access, "PRODUCT TRANSLATE VER")
                ? 3 : isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "EXISTANCE VER") && isAccess(access, "PRODUCTS VER")
                ? 3 : isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "PRODUCT TRANSLATE VER") && isAccess(access, "PRODUCTS VER")
                ? 3 : isAccess(access, "EXISTANCE VER") && isAccess(access, "PRODUCT TRANSLATE VER") && isAccess(access, "PRODUCTS VER")
                ? 3 : isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "EXISTANCE VER")
                ? 2 : isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "PRODUCT TRANSLATE VER")
                ? 2 : isAccess(access, "ENTRADAPRODUCTOS VER") && isAccess(access, "PRODUCTS VER")
                ? 2 : isAccess(access, "EXISTANCE VER") && isAccess(access, "PRODUCTS VER")
                ? 2 : isAccess(access, "PRODUCT TRANSLATE VER") && isAccess(access, "PRODUCTS VER")
                ? 2 : isAccess(access, "ENTRADAPRODUCTOS VER")
                ? 1 : isAccess(access, "EXISTANCE VER")
                ? 1 : isAccess(access, "PRODUCT TRANSLATE VER")
                ? 1 : isAccess(access, "PRODUCTS VER")
                ? 1
                : 0
            }
          >
            <ProductsRecal />
          </TabPanel>
        ) : (
          <></>
        )}
      </Paper>
    </Container>
  );
};

export default InventoryContainer;