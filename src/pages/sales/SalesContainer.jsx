import React from "react";

import { Paper, Box, Tabs, Tab, Divider } from "@mui/material";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faFileInvoiceDollar,
  faHandHoldingDollar,
  faCashRegister,
  faCartPlus,
  faMoneyCheckDollar,
  faMapMarked,
} from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";

import ClientList from "./clients/ClientList";
import NewSale from "./sale/NewSale";
 import Proform from "./sale/proforma/ProformVentas";
import SalesList from "./accountStatus/SalesList";
import { isAccess } from "../../helpers/Helpers";
import { DataContext } from "../../context/DataContext";
import CashMovements from "./Caja/CashMovements";
import Facrturar from "./sale/facturacion/Facrturar";
import Caja from "./sale/facturacion/Caja";

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

const SalesContainer = () => {
  const { access } = React.useContext(DataContext);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabIndex = (value) => {
    let result = null;
    for (let index = 0; index <= value; index++) {
      if (isAccess(access, "SALES CREATE") && index === 0) {
        result === null ? (result = 0) : result++;
      } 
      if (isAccess(access, "SALES CREATE") && index === 1) {
        result === null ? (result = 0) : result++;
      }
      if (isAccess(access, "SALES FACTURACION") && index === 2) {
        result === null ? (result = 0) : result++;
      }
      if (isAccess(access, "SALES CAJA") && index === 3) {
        result === null ? (result = 0) : result++;
      }
      if (isAccess(access, "SALES VER") && index === 4) {
        result === null ? (result = 0) : result++;
      }
      if (isAccess(access, "CAJA VER") && index === 5) {
        result === null ? (result = 0) : result++;
      }
      if (isAccess(access, "CLIENTS VER") && index === 6) {
        result === null ? (result = 0) : result++;
      }
    }

    return result;
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
          {isAccess(access, "SALES CREATE") ? (
            <Tab
              icon={
                <FontAwesomeIcon
                  icon={faMapMarked}
                  style={{ fontSize: 20 }}
                />
              }
              label="Nueva Proforma"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )} 
          
           {isAccess(access, "SALES CREATE") ? (
            <Tab
              icon={
                <FontAwesomeIcon
                  icon={faHandHoldingDollar}
                  style={{ fontSize: 20 }}
                />
              }
              label="Nueva Venta"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}

          {isAccess(access, "SALES FACTURACION") ? (
            <Tab
              icon={
                <FontAwesomeIcon icon={faCartPlus} style={{ fontSize: 20 }} />
              }
              label="Facturar"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}

          {isAccess(access, "SALES CAJA") ? (
            <Tab
              icon={
                <FontAwesomeIcon
                  icon={faCashRegister}
                  style={{ fontSize: 20 }}
                />
              }
              label="Caja"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}

          {isAccess(access, "SALES VER") ? (
            <Tab
              icon={
                <FontAwesomeIcon
                  icon={faFileInvoiceDollar}
                  style={{ fontSize: 20 }}
                />
              }
              label="Estado de Cuenta"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}

          {isAccess(access, "CAJA VER") ? (
            <Tab
              icon={
                <FontAwesomeIcon
                  icon={faMoneyCheckDollar}
                  style={{ fontSize: 20 }}
                />
              }
              label="Caja Chica"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}

          <Tab
            icon={
              <FontAwesomeIcon icon={faUserGroup} style={{ fontSize: 20 }} />
            }
            label="Clientes"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />
        </Tabs>

        <Divider style={{ marginTop: 10 }} />

        {isAccess(access, "SALES CREATE") ? (
          <TabPanel value={value} index={tabIndex(0)}>
            <Proform />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "SALES CREATE") ? (
          <TabPanel value={value} index={tabIndex(1)}>
            <NewSale />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "SALES FACTURACION") ? (
          <TabPanel value={value} index={tabIndex(2)}>
            <Facrturar />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "SALES CAJA") ? (
          <TabPanel value={value} index={tabIndex(3)}>
            <Caja />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "SALES VER") ? (
          <TabPanel value={value} index={tabIndex(4)}>
            <SalesList />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "CAJA VER") ? (
          <TabPanel value={value} index={tabIndex(5)}>
            <CashMovements />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "CLIENTS VER") ? (
          <TabPanel value={value} index={tabIndex(6)}>
            <ClientList />
          </TabPanel>
        ) : (
          <></>
        )}
      </Paper>
    </Container>
  );
};

export default SalesContainer;
