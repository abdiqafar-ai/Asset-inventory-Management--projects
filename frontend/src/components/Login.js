
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../actions/authActions'; // Assuming your action is in this file
import { Form, Button, Container } from 'react-bootstrap';
import './Login.css'; // Make sure to import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Container>
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="mt-4">Log In</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="login-button">Log In</Button>
          </Form>

          <p className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Login;