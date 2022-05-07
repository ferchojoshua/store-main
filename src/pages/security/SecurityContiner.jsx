import * as React from "react";
import { Paper, Box, Tabs, Tab, Divider } from "@mui/material";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCardClip, faUsersGear } from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";
import UserList from "./securityUsers/UserList";
import RolList from "./securityRoles/RolList";


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
            icon={
              <FontAwesomeIcon icon={faUsersGear} style={{ fontSize: 20 }} />
            }
            label="Usuarios"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />

          <Tab
            icon={
              <FontAwesomeIcon icon={faIdCardClip} style={{ fontSize: 20 }} />
            }
            label="Roles"
            {...a11yProps(0)}
            style={{ fontSize: 12 }}
          />
        </Tabs>
        <Divider style={{ marginTop: 10 }} />

        <TabPanel value={value} index={0}>
          <UserList />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RolList />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default SecurityContiner;