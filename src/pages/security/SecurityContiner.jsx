import React, { useState, useEffect, useContext } from "react";
import { Paper, Box, Tabs, Tab, Divider } from "@mui/material";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCardClip, faUsersGear } from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";
import UserList from "./securityUsers/UserList";
import RolList from "./securityRoles/RolList";
import { DataContext } from "../../context/DataContext";
import { getRuta, isAccess } from "../../helpers/Helpers";
import { useNavigate } from "react-router-dom";

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

const SecurityContiner = () => {
  const { access } = useContext(DataContext);
  const [value, setValue] = useState(0);
  let ruta = getRuta();
  let navigate = useNavigate();

  useEffect(() => {
    if (!isAccess(access, "USER VER") && !isAccess(access, "ROLES VER")) {
      navigate(`${ruta}/unauthorized`);
    }
  }, []);

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
          {isAccess(access, "USER VER") ? (
            <Tab
              icon={
                <FontAwesomeIcon icon={faUsersGear} style={{ fontSize: 20 }} />
              }
              label="Usuarios"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}

          {isAccess(access, "ROLES VER") ? (
            <Tab
              icon={
                <FontAwesomeIcon icon={faIdCardClip} style={{ fontSize: 20 }} />
              }
              label="Roles"
              {...a11yProps(0)}
              style={{ fontSize: 12 }}
            />
          ) : (
            ""
          )}
        </Tabs>
        <Divider style={{ marginTop: 10 }} />

        {isAccess(access, "USER VER") ? (
          <TabPanel value={value} index={0}>
            <UserList />
          </TabPanel>
        ) : (
          <></>
        )}

        {isAccess(access, "ROLES VER") ? (
          <TabPanel value={value} index={isAccess(access, "USER VER") ? 1 : 0}>
            <RolList />
          </TabPanel>
        ) : (
          <></>
        )}
      </Paper>
    </Container>
  );
};

export default SecurityContiner;
