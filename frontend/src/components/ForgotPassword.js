import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import apiService from "../services/ApiService";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const response = await apiService.post("/auth/forgot-password", {
          email,
        });

        if (response.message) {
          setMessage(response.message);
          setError("");
        } else {
          setError("Failed to send reset password email.");
        }
      } catch (err) {
        setError("Failed to send reset password email.");
      }
    }
    setValidated(true);
  };

  return (
    <Container className="forgot-password-container d-flex justify-content-center align-items-center">
      <div className="forgot-password-form-container">
        <h2 className="mb-4">Forgot Password</h2>
        {message && <Alert variant="success">{message}</Alert>}
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

          <Button variant="primary" type="submit" className="submit-button">
            Send Reset Link
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ForgotPassword;
