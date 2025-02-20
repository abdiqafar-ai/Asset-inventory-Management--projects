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
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-container p-4 rounded">
        <h2 className="text-center mb-4">Log In</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* Email Field */}
          <Form.Group controlId="formEmail" className="mb-3">
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
          <Form.Group controlId="formPassword" className="mb-3">
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
          <p className="text-center">
            <a href="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </a>
          </p>

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100">
            Log In
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;