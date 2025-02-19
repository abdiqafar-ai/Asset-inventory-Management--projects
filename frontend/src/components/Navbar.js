import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/authActions';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import './Navbar.css';

const NavbarComponent = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar expand="lg" sticky="top" style={{ backgroundColor: '#0077b6' }} className="d-flex justify-content-between">
      <Container fluid>
        {/* Logo and Brand Name */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-white font-weight-bold" style={{ fontSize: '1.5rem' }}>
          <img
            src="/logo.jpeg" // Reference to the image in the public folder
            alt="Investa Track Logo"
            style={{ height: '40px', marginRight: '10px' }} // Adjust height and margin as needed
          />
          Investa Track
        </Navbar.Brand>

        {/* Navbar Links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto d-flex flex-row" style={{ marginLeft: 'auto', marginRight: '20px' }}>
            {isAuthenticated ? (
              <>
                <Nav.Item className="mx-3">
                  <Button variant="outline-light" as={Link} to="/assets" className="font-weight-bold text-white">
                    Assets
                  </Button>
                </Nav.Item>
                {role === 'Admin' && (
                  <Nav.Item className="mx-3">
                    <Button variant="outline-light" as={Link} to="/manage" className="font-weight-bold text-white">
                      Manage
                    </Button>
                  </Nav.Item>
                )}
                <Nav.Item className="mx-3">
                  <Button variant="outline-danger" onClick={handleLogout} className="font-weight-bold text-white">
                    Logout
                  </Button>
                </Nav.Item>
              </>
            ) : null}

            {/* About Us and Contact Us Buttons */}
            <Nav.Item className="mx-3">
              <Button variant="outline-light" as={Link} to="/about" className="font-weight-bold text-white">
                About Us
              </Button>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <a href="#contact" className="contact-nav-link font-weight-bold text-white">
                Contact Us
              </a>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
