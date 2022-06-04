import React from "react";

import { Paper, Box, Tabs, Tab, Divider } from "@mui/material";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faFileInvoiceDollar,
  faHandHoldingDollar,
  faRoute,
  faCashRegister,
} from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";

import ClientList from "./clients/ClientList";
import NewSale from "./sale/NewSale";
import SalesList from "./accountStatus/SalesList";
import { isAccess } from "../../helpers/Helpers";
import { DataContext } from "../../context/DataContext";
import { Itinerario } from "./itinerario/Itinerario";
import CashMovements from "./Caja/CashMovements";

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

          <Tab
            icon={
              <FontAwesomeIcon icon={faUserGroup} style={{ fontSize: 20 }} />
            }
            label="Clientes"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />

          {/* <Tab
            icon={<FontAwesomeIcon icon={faRoute} style={{ fontSize: 20 }} />}
            label="Itinerario"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          /> */}
        </Tabs>

        <Divider style={{ marginTop: 10 }} />

        {isAccess(access, "SALES CREATE") ? (
          <TabPanel value={value} index={0}>
            <NewSale />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "SALES VER") ? (
          <TabPanel
            value={value}
            index={isAccess(access, "SALES CREATE") ? 1 : 0}
          >
            <SalesList />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "CAJA VER") ? (
          <TabPanel
            value={value}
            index={
              isAccess(access, "SALES CREATE") && isAccess(access, "SALES VER")
                ? 2
                : isAccess(access, "SALES CREATE")
                ? 1
                : isAccess(access, "SALES VER")
                ? 1
                : 0
            }
          >
            <CashMovements />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "CLIENTS VER") ? (
          <TabPanel
            value={value}
            index={
              isAccess(access, "SALES CREATE") &&
              isAccess(access, "SALES VER") &&
              isAccess(access, "CAJA VER")
                ? 3
                : isAccess(access, "SALES CREATE") &&
                  isAccess(access, "SALES VER")
                ? 2
                : isAccess(access, "SALES CREATE") &&
                  isAccess(access, "SALES VER")
                ? 2
                : isAccess(access, "SALES VER") && isAccess(access, "CAJA VER")
                ? 2
                : isAccess(access, "SALES CREATE")
                ? 1
                : isAccess(access, "SALES VER")
                ? 1
                : isAccess(access, "CAJA VER")
                ? 1
                : 0
            }
          >
            <ClientList />
          </TabPanel>
        ) : (
          <></>
        )}

        {/* <TabPanel value={value} index={3}>
          <Itinerario />
        </TabPanel> */}
      </Paper>
    </Container>
  );
};

export default SalesContainer;
