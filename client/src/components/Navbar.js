import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from "../actions/userActions";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function NavigationBar() {
  const cartstate = useSelector(state => state.cartReducer)
  const userstate = useSelector(state => state.loginUserReducer)
  const { currentUser } = userstate
  const dispatch = useDispatch()

  return (
    <Navbar sticky="top" expand="lg" className="navbar">
      <Container>
        <div className="navbar-brand">
          <Navbar.Brand href="/">MIZZA PIZZA</Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/pizzamenu">Pizza</Nav.Link>
            <Nav.Link href="/drinks">Băuturi</Nav.Link>
            <Nav.Link href="/book">Rezervare</Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            {currentUser ? (
              <NavDropdown
                title={
                  <>
                    {currentUser?.isPremium && <span className="badge bg-warning text-dark me-2">Premium</span>}
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

            <Nav.Link href="/cart">Coș ({cartstate.cartItems.length})</Nav.Link>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar >
  );
}

export default NavigationBar;