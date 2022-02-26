import React, { useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDolly,
  faEllipsisVertical,
  faHome,
  faLeftRight,
  faList,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const NavbarComponent = () => {
  const [active, setActive] = useState("home");

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
                fontWeight: "bold",
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
              style={{
                fontWeight: "bold",
                color: active === "products-in" ? "#bbdefb" : "#9e9e9e",
                fontSize: 17,
              }}
              eventKey="products-in"
              as={Link}
              to="/products-in"
            >
              <FontAwesomeIcon icon={faList} style={{ marginRight: 10 }} />
              Entrada de Producto
            </Nav.Link>

            <Nav.Link
              style={{
                fontWeight: "bold",
                color: active === "traslate-products" ? "#bbdefb" : "#9e9e9e",
                fontSize: 17,
              }}
              eventKey="traslate-products"
              as={Link}
              to="/traslate-products"
            >
              <FontAwesomeIcon icon={faLeftRight} style={{ marginRight: 10 }} />
              Traslado de Producto
            </Nav.Link>

            <Nav.Link
              style={{
                fontWeight: "bold",
                color: active === "products" ? "#bbdefb" : "#9e9e9e",
                fontSize: 17,
              }}
              eventKey="products"
              as={Link}
              to="/products"
            >
              <FontAwesomeIcon icon={faDolly} style={{ marginRight: 10 }} />
              Productos
            </Nav.Link>

            <Nav.Link
              style={{
                fontWeight: "bold",
                color: active === "providers" ? "#bbdefb" : "#9e9e9e",
                fontSize: 17,
              }}
              eventKey="providers"
              as={Link}
              to="/providers"
            >
              <FontAwesomeIcon icon={faUsers} style={{ marginRight: 10 }} />
              Proveedores
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
              <NavDropdown.Header>Miscelaneos</NavDropdown.Header>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/stores">
                Almacenes
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/tipo-negocio">
                Tipo Negocio
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/familia">
                Familia
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {/* <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Buscar"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Buscar</Button>
          </Form> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
