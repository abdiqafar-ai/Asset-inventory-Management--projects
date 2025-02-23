import React, { useState, useEffect } from "react";
import apiService from "../services/ApiService";
import "./RequestView.css";

const RequestView = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    user_id: "",
    asset_id: "",
    request_type: "New Asset",
    reason: "",
    quantity: "",
    urgency: "High",
    category_id: "",
  });
  const [requestDetails, setRequestDetails] = useState(null);
  const [selectedManager, setSelectedManager] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    apiService
      .get("/users")
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Unexpected response for users:", data);
          setUsers([]);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));

    apiService
      .get("/assets/categories")
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));

    apiService
      .get("/requests")
      .then((data) => {
        setRequests(data);
      })
      .catch((error) => console.error("Error fetching requests:", error));

    apiService
      .get("/managers")
      .then((data) => {
        if (data.managers && Array.isArray(data.managers)) {
          setManagers(data.managers);
        } else {
          console.error("Unexpected response for managers:", data);
          setManagers([]);
        }
      })
      .catch((error) => console.error("Error fetching managers:", error));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      apiService
        .get(`/assets/category/${selectedCategory}`)
        .then((data) => {
          setAssets(data);
        })
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
    console.log("Submitting request with data:", formData);
    apiService
      .post("/requests", formData)
      .then((data) => {
        console.log("Request created:", data);
        setFormData({
          user_id: "",
          asset_id: "",
          request_type: "New Asset",
          reason: "",
          quantity: "",
          urgency: "High",
          category_id: "",
        });
        return apiService.get("/requests");
      })
      .then((data) => setRequests(data))
      .catch((error) => console.error("Error creating request:", error));
  };

  const handleViewRequestDetails = (requestId) => {
    apiService
      .get(`/requests/${requestId}`)
      .then((data) => {
        setRequestDetails(data);
        console.log("Request details fetched:", data);
      })
      .catch((error) =>
        console.error("Error fetching request details:", error)
      );
  };

  const handleApproveRequest = (requestId) => {
    if (!selectedManager) {
      alert("Please select a manager to approve the request.");
      return;
    }
    apiService
      .put(`/requests/${requestId}/approve`, { manager_id: selectedManager })
      .then((data) => {
        alert("Request approved successfully.");
        setRequestDetails({ ...requestDetails, status: "Approved" });
        setRequests(
          requests.map((req) =>
            req.id === requestId ? { ...req, status: "Approved" } : req
          )
        );
      })
      .catch((error) => console.error("Error approving request:", error));
  };

  const handleRejectRequest = (requestId) => {
    if (!selectedManager) {
      alert("Please select a manager to reject the request.");
      return;
    }
    apiService
      .put(`/requests/${requestId}/reject`, { manager_id: selectedManager })
      .then((data) => {
        alert("Request rejected successfully.");
        setRequestDetails({ ...requestDetails, status: "Rejected" });
        setRequests(
          requests.map((req) =>
            req.id === requestId ? { ...req, status: "Rejected" } : req
          )
        );
      })
      .catch((error) => console.error("Error rejecting request:", error));
  };

  const handleSendNotification = () => {
    if (!notificationMessage) {
      alert("Please enter a notification message.");
      return;
    }
    if (!requestDetails || !requestDetails.user || !requestDetails.id) {
      alert("Request details are missing or incomplete.");
      console.error(
        "Request details are missing or incomplete:",
        requestDetails
      );
      return;
    }

    const payload = {
      user_id: requestDetails.user.id,
      request_id: requestDetails.id,
      message: notificationMessage,
    };

    console.log("Sending notification with payload:", payload);

    apiService
      .post("/notifications", payload)
      .then((data) => {
        alert("Notification sent successfully.");
        setNotificationMessage("");
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
        alert(
          "Failed to send notification. Please check the console for more details."
        );
      });
  };

  return (
    <div>
      <div className="requests-list mt-4">
        <h2>Requests</h2>
        <div className="cards-container">
          {requests.map((request) => (
            <div key={request.id} className="card">
              <h3>Request ID: {request.id}</h3>
              <p>User ID: {request.user_id}</p>
              <p>Asset ID: {request.asset_id}</p>
              <p>Reason: {request.reason}</p>
              <p>Quantity: {request.quantity}</p>
              <p>Urgency: {request.urgency}</p>
              <p>Status: {request.status}</p>
              <button onClick={() => handleViewRequestDetails(request.id)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {requestDetails && (
        <div className="request-details mt-4">
          <h2>Request Details</h2>
          <p>REQUEST SENT BY: {requestDetails.user?.name}</p>
          <p>ASSET: {requestDetails.asset?.name}</p>
          <p>Reason: {requestDetails.reason}</p>
          <p>Quantity: {requestDetails.quantity}</p>
          <p>Urgency: {requestDetails.urgency}</p>
          <p>Status: {requestDetails.status}</p>
          <p>Created At: {requestDetails.created_at}</p>
          <p>Request Type: {requestDetails.request_type}</p>
          {requestDetails.reviewed_by?.name && (
            <p>Reviewed By: {requestDetails.reviewed_by.name}</p>
          )}
          <div>
            <label>Select Manager:</label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a manager
              </option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.username}
                </option>
              ))}
            </select>
          </div>
          {requestDetails.status !== "Approved" &&
            requestDetails.status !== "Rejected" && (
              <>
                <button onClick={() => handleApproveRequest(requestDetails.id)}>
                  Approve
                </button>
                <button onClick={() => handleRejectRequest(requestDetails.id)}>
                  Reject
                </button>
              </>
            )}
          {(requestDetails.status === "Approved" ||
            requestDetails.status === "Rejected") && (
            <div>
              <input
                type="text"
                placeholder="Enter notification message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
              <button onClick={handleSendNotification}>
                Send Notification
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form p-4 border rounded">
        <label>User:</label>
        <select
          name="user_id"
          onChange={handleChange}
          value={formData.user_id}
          required
        >
          <option value="" disabled>
            Select a user
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.username}
            </option>
          ))}
        </select>

        <label>Category:</label>
        <select
          name="category_id"
          onChange={handleCategoryChange}
          value={formData.category_id}
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

        <label>Asset:</label>
        <select
          name="asset_id"
          onChange={handleChange}
          value={formData.asset_id}
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

        <label>Request Type:</label>
        <input
          type="text"
          name="request_type"
          onChange={handleChange}
          value={formData.request_type}
          required
        />

        <label>Reason:</label>
        <input
          type="text"
          name="reason"
          onChange={handleChange}
          value={formData.reason}
          required
        />

        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          onChange={handleChange}
          value={formData.quantity}
          required
        />

        <label>Urgency:</label>
        <select
          name="urgency"
          onChange={handleChange}
          value={formData.urgency}
          required
        >
          <option value="" disabled>
            Select urgency
          </option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestView;
