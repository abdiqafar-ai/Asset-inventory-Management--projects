import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../services/ApiService"; // Import API service
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }


    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    try {
      const response = await apiService.post("/auth/register", {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      console.log("Registration successful:", response);
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create Your Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select a Role
              </option>
              <option value="ADMIN">Admin</option>
              <option value="PROCUREMENT_MANAGER">Procurement Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p className="existing-account">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
