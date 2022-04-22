import React, { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faCodeBranch,
  faEllipsisVertical,
  faHome,
  faPeopleCarryBox,
  faShield,
  faSignOutAlt,
  faSitemap,
  faSliders,
  faUserCircle,
  faUserCog,
  faWarehouse,
  faChartLine,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { getToken, logOutAsync } from "../services/Account";
import { simpleMessage } from "../helpers/Helpers";
import { useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [active, setActive] = useState("home");

  const { user, setIsLogged, setTitle } = useContext(DataContext);
  let navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const token = getToken();

  const myAccount = () => {
    setTitle("Mi Cuenta");
    navigate(`/account`);
  };

  const logOut = async () => {
    const result = await logOutAsync(token);
    if (!result.statusResponse) {
      simpleMessage("error", "No se pudo cerrar sesion, intente de nuevo");
    }
    setIsLogged(false);
    setTitle("Auto&Moto");
  };

  return (
    <Navbar
      style={{
        background: "#0d47a1",
      }}
      expand="lg"
    >
      <Container fluid>
        <Navbar.Brand
          style={{
            fontWeight: "bold",
            color: "#bbdefb",
            fontSize: 20,
          }}
          as={Link}
          to="/"
          onClick={() => setActive("home")}
        >
          <img
            src={require("./media/Icono.png")}
            width="30"
            height="30"
            className="d-inline-block align-top"
            style={{ marginRight: 10 }}
            alt="Auto&Moto logo"
          />
          Auto&Moto
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto"
            onSelect={(selectedKey) => setActive(selectedKey)}
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link
              eventKey="home"
              style={{
                fontWeight: active === "home" ? "bold" : "",
                color: active === "home" ? "#bbdefb" : "#9e9e9e",
                fontSize: 17,
              }}
              as={Link}
              to="/"
            >
              <FontAwesomeIcon icon={faHome} style={{ marginRight: 10 }} />
              Inicio
            </Nav.Link>

            <Nav.Link
              eventKey="ventas"
              style={{
                fontWeight: active === "ventas" ? "bold" : "",
                color: active === "ventas" ? "#bbdefb" : "#9e9e9e",
                fontSize: 17,
              }}
              as={Link}
              to="/sales"
            >
              <FontAwesomeIcon icon={faChartLine} style={{ marginRight: 10 }} />
              Ventas
            </Nav.Link>

            <Nav.Link
              eventKey="inventario"
              style={{
                fontWeight: active === "Inventario" ? "bold" : "",
                color: active === "inventario" ? "#bbdefb" : "#9e9e9e",
                fontSize: 17,
              }}
              as={Link}
              to="/inventory"
            >
              <FontAwesomeIcon
                icon={faBoxesStacked}
                style={{ marginRight: 10 }}
              />
              Inventario
            </Nav.Link>

            <Nav.Link
              style={{
                fontWeight: active === "traslate-products" ? "bold" : "",
                color: active === "security" ? "#bbdefb" : "#9e9e9e",
                fontSize: 17,
              }}
              eventKey="security"
              as={Link}
              to="/security"
            >
              <FontAwesomeIcon icon={faShield} style={{ marginRight: 10 }} />
              Seguridad
            </Nav.Link>

            <NavDropdown
              drop="start"
              title={
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  style={{ marginRight: 10, color: "#9e9e9e" }}
                />
              }
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Header>
                <FontAwesomeIcon icon={faSliders} style={{ marginRight: 10 }} />
                Miscelaneos
              </NavDropdown.Header>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/stores">
                <FontAwesomeIcon
                  icon={faWarehouse}
                  style={{ marginRight: 10 }}
                />
                Almacenes
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/providers">
                <FontAwesomeIcon
                  icon={faPeopleCarryBox}
                  style={{ marginRight: 10 }}
                />
                Proveedores
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/tipo-negocio">
                <FontAwesomeIcon icon={faSitemap} style={{ marginRight: 10 }} />
                Tipo Negocio
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/departments">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ marginRight: 10, marginRight: 15 }}
                />
                Ubicaciones
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div>
            <a
              href="#"
              onClick={myAccount}
              style={{
                fontWeight: "bold",
                color: "#a7ffeb",
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              {user}
            </a>

            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              style={{ marginLeft: 10 }}
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                style={{ color: "#9e9e9e" }}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={myAccount}>
                <FontAwesomeIcon icon={faUserCog} style={{ marginRight: 20 }} />
                Mi cuenta
              </MenuItem>
              <MenuItem onClick={logOut}>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  style={{ marginRight: 20 }}
                />
                Cerrar Sesion
              </MenuItem>
              <Divider />
              <MenuItem disabled style={{ color: "#2196f3" }}>
                <FontAwesomeIcon
                  icon={faCodeBranch}
                  style={{ marginRight: 20 }}
                />
                Version - 1.0
              </MenuItem>
            </Menu>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
