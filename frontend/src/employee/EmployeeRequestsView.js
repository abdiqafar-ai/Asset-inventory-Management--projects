import React, { useState, useEffect } from "react";
import apiService from "../services/ApiService";
import "./employeeRequestView.css";

const EmployeeRequestView = () => {
  const [users, setUsers] = useState([]); // Now holds employees
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    asset_id: "",
    request_type: "New Asset",
    reason: "",
    quantity: "",
    urgency: "High",
    category_id: "",
  });

  useEffect(() => {
    // Fetch employees (only those with role EMPLOYEE)
    apiService
      .get("/employees")
      .then((data) => {
        if (data.employees && Array.isArray(data.employees))
          setUsers(data.employees);
        else setUsers([]);
      })
      .catch((error) => console.error("Error fetching employees:", error));

    // Fetch asset categories
    apiService
      .get("/assets/categories")
      .then(setCategories)
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      apiService
        .get(`/assets/category/${selectedCategory}`)
        .then(setAssets)
        .catch((error) => console.error("Error fetching assets:", error));
    }
  }, [selectedCategory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setFormData({ ...formData, category_id: categoryId, asset_id: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiService
      .post("/requests", formData)
      .then(() => {
        // Reset the form data
        setFormData({
          user_id: "",
          asset_id: "",
          request_type: "New Asset",
          reason: "",
          quantity: "",
          urgency: "High",
          category_id: "",
        });
        // Display success message
        setShowSuccess(true);
        // Hide the message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      })
      .catch((error) => console.error("Error creating request:", error));
  };

  return (
    <div className="request-container">
      <div className="request-header">
        <h1 className="request-title">New Asset Request</h1>
        <p className="request-subtitle">
          Please fill in the form below to submit a new request
        </p>
      </div>

      {showSuccess && (
        <div className="success-message">
          <span className="check-icon">✓</span> Request well sent!
        </div>
      )}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-grid">
          {/* Employee Selection */}
          <div className="form-group">
            <label className="form-label">Select Employee</label>
            <select
              name="user_id"
              onChange={handleChange}
              value={formData.user_id}
              className="form-select"
              required
            >
              <option value="" disabled>
                Select an employee
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.username}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category_id"
              onChange={handleCategoryChange}
              value={formData.category_id}
              className="form-select"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Asset Selection */}
          <div className="form-group">
            <label className="form-label">Asset</label>
            <select
              name="asset_id"
              onChange={handleChange}
              value={formData.asset_id}
              className="form-select"
              required
            >
              <option value="" disabled>
                Select an asset
              </option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Request Type */}
          <div className="form-group">
            <label className="form-label">Request Type</label>
            <input
              type="text"
              name="request_type"
              onChange={handleChange}
              value={formData.request_type}
              className="form-input"
              required
            />
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              onChange={handleChange}
              value={formData.quantity}
              className="form-input"
              required
              min="1"
            />
          </div>

          {/* Urgency */}
          <div className="form-group">
            <label className="form-label">Urgency</label>
            <select
              name="urgency"
              onChange={handleChange}
              value={formData.urgency}
              className="form-select"
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div className="form-group">
          <label className="form-label">Reason</label>
          <input
            type="text"
            name="reason"
            onChange={handleChange}
            value={formData.reason}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default EmployeeRequestView;
