import React from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const NavbarComponent = () => {
  return (
    <Navbar
      style={{
        background: "#35baf6",
      }}
      expand="lg"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            <Nav.Link as={Link} to="/products-in">
              Entrada de Producto
            </Nav.Link>

            <Nav.Link as={Link} to="/products">
              Productos
            </Nav.Link>

            <Nav.Link as={Link} to="/providers">
              Proveedores
            </Nav.Link>

            <NavDropdown title="Miscelaneos" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="/stores">
                Almacenes
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/tipo-negocio">
                Tipo Negocio
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/familia">
                Familia
              </NavDropdown.Item>
              {/* <NavDropdown.Divider />
              <NavDropdown.Item href="#action5"></NavDropdown.Item> */}
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Buscar"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Buscar</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
