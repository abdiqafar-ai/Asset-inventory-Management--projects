import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../actions/authActions";
import { Form, Button, Container, Alert } from "react-bootstrap";
import apiService from "../services/ApiService";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const response = await apiService.post("/auth/login", {
          email,
          password,
        });

        if (response.access_token && response.role) {
          apiService.storeTokens(response.access_token, response.refresh_token);
          dispatch(login(response.access_token));

          switch (response.role) {
            case "ADMIN":
              navigate("/admin-dashboard");
              break;
            case "PROCUREMENT_MANAGER":
              navigate("/procurement-dashboard");
              break;
            case "EMPLOYEE":
              navigate("/employee-dashboard");
              break;
            default:
              setError("Unauthorized access.");
          }
        } else {
          setError("Invalid credentials.");
        }
      } catch (err) {
        setError("Login failed. Please check your email and password.");
      }
    }
    setValidated(true);
  };

  return (
    <Container className="login-container d-flex justify-content-center align-items-center">
      <div className="login-form-container">
        <h2 className="mb-4">Log In</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="form-group mb-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

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

          <p className="forgot-password">
            <a href="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </a>
          </p>

          <Button variant="primary" type="submit" className="login-button">
            Log In
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
