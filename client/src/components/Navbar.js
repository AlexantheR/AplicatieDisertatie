import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../actions/userActions";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import MobileDrawer from "./MobileDrawer";

function NavigationBar() {
  const cartstate = useSelector(state => state.cartReducer);
  const userstate = useSelector(state => state.loginUserReducer);
  const { currentUser } = userstate;
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Navbar sticky="top" expand="lg" className="navbar bg-danger text-white px-3" variant="dark" expanded={expanded}>
        <Container fluid className="d-flex justify-content-between align-items-center">

          {/* Mobile - Left Burger */}
          <div className="d-lg-none d-flex align-items-center">
            {!drawerOpen && (
              <button className="btn text-white me-2" onClick={() => setDrawerOpen(true)}>
                <FaBars size={22} />
              </button>
            )}
          </div>

          {/* Title always centered on mobile */}
          <div className="mx-auto d-lg-none text-center">
            <Navbar.Brand as={Link} to="/" className="m-0 text-white">MIZZA PIZZA</Navbar.Brand>
          </div>

          {/* Desktop layout */}
          <Navbar.Brand as={Link} to="/" className="d-none d-lg-block text-white">MIZZA PIZZA</Navbar.Brand>



          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between d-none d-lg-flex">
            <Nav className="navbarPageLinks">
              <Nav.Link href="/pizzamenu">Pizza</Nav.Link>
              <Nav.Link href="/drinks">Băuturi</Nav.Link>
              <Nav.Link href="/book">Rezervare</Nav.Link>
            </Nav>

            <Nav className="align-items-center">
              {currentUser ? (
                <NavDropdown
                  title={
                    <>
                      {currentUser?.isPremium && (
                        <span className="badge bg-warning text-dark me-2">Premium</span>
                      )}
                      {currentUser.name}
                    </>
                  }
                  id="user-dropdown"
                >
                  <NavDropdown.Item href="/orders">Comenzile mele</NavDropdown.Item>
                  {currentUser.isAdmin === 1 && (
                    <NavDropdown.Item href="/admin">Panou Admin</NavDropdown.Item>
                  )}
                  <NavDropdown.Item href="/makeuserpremium">
                    {currentUser?.isPremium ? "Dezabonare Premium?" : "Premium?"}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => dispatch(logoutUser())}>
                    Deconectare
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link href="/login">Autentificare</Nav.Link>
              )}
              <Nav.Link href="/cart" className="ms-3">
                Coș ({cartstate.cartItems.length})
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentUser={currentUser}
        cartItems={cartstate.cartItems}
      />
    </>
  );
}

export default NavigationBar;
