import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../actions/authActions"; // Ensure this action exists
import { Form, Button, Container } from "react-bootstrap";
import "./Login.css"; // Ensure this file exists for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      dispatch(login(email, password));
    }
    setValidated(true);
  };

  return (
    <Container className="login-container d-flex justify-content-center align-items-center">
      <div className="login-form-container">
        <h2 className="mb-4">Log In</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* Email Field */}
          <Form.Group controlId="formEmail" className="form-group mb-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby="emailHelp"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Password Field */}
          <Form.Group controlId="formPassword" className="form-group mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Password is required.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Forgot Password Link */}
          <p className="forgot-password">
            <a href="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </a>
          </p>

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="login-button">
            Log In
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;