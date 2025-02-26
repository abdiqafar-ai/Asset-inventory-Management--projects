import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/ApiService";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || password !== confirmPassword) {
      e.stopPropagation();
      setError("Passwords do not match.");
    } else {
      try {
        const response = await apiService.post(
          `/auth/reset-password/${resetToken}`,
          {
            password,
          }
        );

        if (response.message) {
          setMessage(response.message);
          setError("");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setError("Failed to reset password.");
        }
      } catch (err) {
        setError("Failed to reset password.");
      }
    }
    setValidated(true);
  };

  return (
    <Container className="reset-password-container d-flex justify-content-center align-items-center">
      <div className="reset-password-form-container">
        <h2 className="mb-4">Reset Password</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formPassword" className="form-group mb-4">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a new password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            controlId="formConfirmPassword"
            className="form-group mb-4"
          >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please confirm your new password.
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="submit-button">
            Reset Password
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ResetPassword;
