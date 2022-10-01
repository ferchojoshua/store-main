import React, { useState, useContext, useEffect } from "react";
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
  faSun,
  faMoon,
  faBook,
  faBell,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { Divider, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import {
  changeThemeAsync,
  deleteToken,
  deleteUserData,
  getToken,
  logOutAsync,
} from "../services/Account";
import {
  getRuta,
  isAccess,
  simpleMessage,
  toastError,
} from "../helpers/Helpers";
import { useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  let ruta = getRuta();

  const [anchorEl, setAnchorEl] = useState(null);
  const [active, setActive] = useState("home");

  const {
    user,
    setIsLoading,
    setIsLogged,
    setTitle,
    access,
    isDarkMode,
    setIsDarkMode,
    version,
  } = useContext(DataContext);

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
    navigate(`${ruta}/account`);
    setActive("account");
    handleClose();
  };

  const changeTheme = async () => {
    const result = await changeThemeAsync(token);

    if (!result.statusResponse) {
      setIsLoading(false);
      if (result.error.request.status === 401) {
        navigate(`${ruta}/unauthorized`);
        return;
      }
      toastError(result.error.message);
      return;
    }

    if (result.data === "eX01") {
      setIsLoading(false);
      deleteUserData();
      deleteToken();
      setIsLogged(false);
      return;
    }
    setIsDarkMode(!isDarkMode);
  };

  const logOut = async () => {
    const result = await logOutAsync(token);
    if (!result.statusResponse) {
      simpleMessage("error", "No se pudo cerrar sesion, intente de nuevo");
    }
    setIsLogged(false);
    setTitle("Auto&Moto");
  };

  const [anchorElNot, setAnchorElNot] = useState(null);
  const openNotifications = Boolean(anchorElNot);
  const handleClickNot = (event) => {
    setAnchorElNot(event.currentTarget);
  };
  const handleCloseNot = () => {
    setAnchorElNot(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Navbar
      style={{
        background: "#0d47a1",
      }}
      expand="lg"
      sticky="top"
    >
      <Container fluid>
        <Navbar.Brand
          style={{
            fontWeight: "bold",
            color: "#bbdefb",
            fontSize: 20,
          }}
          as={Link}
          to={ruta}
          onClick={() => setActive("home")}
        >
          <img
            src={require("./media/Icono.png")}
            width="30"
            height="30"
            className="d-inline-block align-top"
            style={{ marginRight: 10 }}
            alt="AutoMoto logo"
          />
          AutoMoto
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto"
            onSelect={(selectedKey) => setActive(selectedKey)}
            // style={{ maxHeight: "100px" }}
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
              to={ruta}
            >
              <FontAwesomeIcon
                icon={faHome}
                style={{ marginRight: 10 }}
                className={active === "home" ? "fa-beat-fade" : ""}
              />
              Inicio
            </Nav.Link>

            {isAccess(access, "SALES VER") ||
            isAccess(access, "SALES CREATE") ||
            isAccess(access, "CLIENTS VER") ? (
              <Nav.Link
                eventKey="ventas"
                style={{
                  fontWeight: active === "ventas" ? "bold" : "",
                  color: active === "ventas" ? "#bbdefb" : "#9e9e9e",
                  fontSize: 17,
                }}
                as={Link}
                to={`${ruta}/sales`}
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  style={{ marginRight: 10 }}
                  className={active === "ventas" ? "fa-beat-fade" : ""}
                />
                Ventas
              </Nav.Link>
            ) : (
              <></>
            )}

            {isAccess(access, "ENTRADAPRODUCTOS VER") ||
            isAccess(access, "EXISTANCE VER") ||
            isAccess(access, "PRODUCT TRANSLATE VER") ||
            isAccess(access, "PRODUCTS VER") ? (
              <Nav.Link
                eventKey="inventario"
                style={{
                  fontWeight: active === "inventario" ? "bold" : "",
                  color: active === "inventario" ? "#bbdefb" : "#9e9e9e",
                  fontSize: 17,
                }}
                as={Link}
                to={`${ruta}/inventory`}
              >
                <FontAwesomeIcon
                  icon={faBoxesStacked}
                  style={{ marginRight: 10 }}
                  className={active === "inventario" ? "fa-beat-fade" : ""}
                />
                Inventario
              </Nav.Link>
            ) : (
              <></>
            )}

            <Nav.Link
              eventKey="reports"
              style={{
                fontWeight: active === "reports" ? "bold" : "",
                color: active === "reports" ? "#bbdefb" : "#9e9e9e",
                fontSize: 17,
              }}
              as={Link}
              to={`${ruta}/reports`}
            >
              <FontAwesomeIcon
                icon={faScroll}
                style={{ marginRight: 10 }}
                className={active === "reports" ? "fa-beat-fade" : ""}
              />
              Reportes
            </Nav.Link>

            {isAccess(access, "CONT VER") ? (
              <Nav.Link
                style={{
                  fontWeight: active === "admon" ? "bold" : "",
                  color: active === "admon" ? "#bbdefb" : "#9e9e9e",
                  fontSize: 17,
                }}
                eventKey="admon"
                as={Link}
                to={`${ruta}/admon`}
              >
                <FontAwesomeIcon
                  icon={faBook}
                  style={{ marginRight: 10 }}
                  className={active === "admon" ? "fa-beat-fade" : ""}
                />
                Contabilidad
              </Nav.Link>
            ) : (
              <></>
            )}
            {isAccess(access, "USER VER") || isAccess(access, "ROLES VER") ? (
              <Nav.Link
                style={{
                  fontWeight: active === "security" ? "bold" : "",
                  color: active === "security" ? "#bbdefb" : "#9e9e9e",
                  fontSize: 17,
                }}
                eventKey="security"
                as={Link}
                to={`${ruta}/security`}
              >
                <FontAwesomeIcon
                  icon={faShield}
                  style={{ marginRight: 10 }}
                  className={active === "security" ? "fa-beat-fade" : ""}
                />
                Seguridad
              </Nav.Link>
            ) : (
              <></>
            )}

            <NavDropdown
              drop="start"
              title={
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className={active === "misc" ? "fa-beat-fade" : ""}
                  style={{
                    fontWeight: active === "misc" ? "bold" : "",
                    marginRight: 10,
                    color: active === "misc" ? "#bbdefb" : "#9e9e9e",
                  }}
                />
              }
              id="navbarScrollingDropdown"
              onSelect={(selectedKey) => setActive(selectedKey)}
            >
              <NavDropdown.Header>
                <FontAwesomeIcon icon={faSliders} style={{ marginRight: 10 }} />
                Miscelaneos
              </NavDropdown.Header>
              <NavDropdown.Divider />

              {isAccess(access, "MISCELANEOS VER") ? (
                <NavDropdown.Item
                  as={Link}
                  to={`${ruta}/stores`}
                  eventKey="misc"
                >
                  <FontAwesomeIcon
                    icon={faWarehouse}
                    style={{ marginRight: 10 }}
                  />
                  Almacenes
                </NavDropdown.Item>
              ) : (
                <></>
              )}

              {isAccess(access, "MISCELANEOS VER") ? (
                <NavDropdown.Item
                  as={Link}
                  to={`${ruta}/providers`}
                  eventKey="misc"
                >
                  <FontAwesomeIcon
                    icon={faPeopleCarryBox}
                    style={{ marginRight: 10 }}
                  />
                  Proveedores
                </NavDropdown.Item>
              ) : (
                <></>
              )}

              {isAccess(access, "MISCELANEOS VER") ? (
                <NavDropdown.Item
                  as={Link}
                  to={`${ruta}/tipo-negocio`}
                  eventKey="misc"
                >
                  <FontAwesomeIcon
                    icon={faSitemap}
                    style={{ marginRight: 10 }}
                  />
                  Tipo Negocio
                </NavDropdown.Item>
              ) : (
                <></>
              )}

              {isAccess(access, "COMMUNITIES VER") ? (
                <NavDropdown.Item
                  as={Link}
                  to={`${ruta}/departments`}
                  eventKey="misc"
                >
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ marginRight: 10, marginRight: 15 }}
                  />
                  Ubicaciones
                </NavDropdown.Item>
              ) : (
                <></>
              )}
            </NavDropdown>
          </Nav>

          {isAccess(access, "CONT VER") ? (
            <Tooltip title="Notificaciones">
              <IconButton
                onClick={handleClickNot}
                sx={{ mr: 1, width: 40 }}
                aria-controls={openNotifications ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openNotifications ? "true" : undefined}
              >
                <FontAwesomeIcon icon={faBell} style={{ color: "#ffc107" }} />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}

          <Menu
            anchorEl={anchorElNot}
            id="account-menu"
            open={openNotifications}
            onClose={handleCloseNot}
            onClick={handleCloseNot}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem style={{ display: "flex", justifyContent: "center" }}>
              <span style={{ color: "#2196f3", fontWeight: "bold" }}>
                Notificaciones
              </span>
            </MenuItem>
            <Divider />
            {/* <MenuItem> */}
            {/* <ListItemIcon> */}
            {/* <PersonAdd fontSize="small" /> */}
            {/* </ListItemIcon> */}
            {/* Notificaciones */}
            {/* </MenuItem> */}
          </Menu>

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
                className={active === "account" ? "fa-beat-fade" : ""}
                style={{
                  color: active === "account" ? "#bbdefb" : "#9e9e9e",
                }}
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

              <MenuItem onClick={changeTheme}>
                <FontAwesomeIcon
                  icon={isDarkMode ? faSun : faMoon}
                  style={{ marginRight: 20 }}
                />
                {isDarkMode ? "Tema Claro" : "Tema Oscuro"}
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
                {`Version - ${version}`}
              </MenuItem>
            </Menu>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
