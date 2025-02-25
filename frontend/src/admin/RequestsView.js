import React, { useState, useEffect } from "react";
import apiService from "../services/ApiService";
import "bootstrap/dist/css/bootstrap.min.css";
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
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

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
    if (isDetailsVisible && requestDetails?.id === requestId) {
      setIsDetailsVisible(false);  // If the same request, hide the details
    } else {
      apiService
        .get(`/requests/${requestId}`)
        .then((data) => {
          setRequestDetails(data);
          setIsDetailsVisible(true);
          console.log("Request details fetched:", data);
        })
        .catch((error) =>
          console.error("Error fetching request details:", error)
        );
    }
  };

  const handleDeleteRequest = (requestId) => {
    apiService
      .delete(`/requests/${requestId}`)
      .then((data) => {
        console.log("Request deleted:", data);
        setRequests(requests.filter((request) => request.id !== requestId));
      })
      .catch((error) => console.error("Error deleting request:", error));
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
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h2>Requests</h2>
          <div className="row">
            {requests.map((request) => (
              <div key={request.id} className="col-md-6 mb-4">
                <div className="card request-card">
                  <div className="card-body">
                    <h5 className="card-title">Request ID: {request.id}</h5>
                    <p className="card-text">User ID: {request.user_id}</p>
                    <p className="card-text">Asset ID: {request.asset_id}</p>
                    <p className="card-text">Reason: {request.reason}</p>
                    <p className="card-text">Quantity: {request.quantity}</p>
                    <p className="card-text">Urgency: {request.urgency}</p>
                    <p className="card-text">Status: {request.status}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleViewRequestDetails(request.id)}
                    >
                      {isDetailsVisible && requestDetails?.id === request.id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => handleDeleteRequest(request.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {isDetailsVisible && requestDetails && requestDetails.id === request.id && (
                  <div className="card mt-3 details-card">
                    <div className="card-body">
                      <h5 className="card-title">Request Details</h5>
                      <p><strong>Request Sent By:</strong> {requestDetails.user?.name}</p>
                      <p><strong>Asset:</strong> {requestDetails.asset?.name}</p>
                      <p><strong>Reason:</strong> {requestDetails.reason}</p>
                      <p><strong>Quantity:</strong> {requestDetails.quantity}</p>
                      <p><strong>Urgency:</strong> {requestDetails.urgency}</p>
                      <p><strong>Status:</strong> {requestDetails.status}</p>
                      <p><strong>Created At:</strong> {requestDetails.created_at}</p>
                      <p><strong>Request Type:</strong> {requestDetails.request_type}</p>
                      {requestDetails.reviewed_by?.name && (
                        <p><strong>Reviewed By:</strong> {requestDetails.reviewed_by.name}</p>
                      )}
                      <div className="form-group">
                        <label style={{ color: 'black' }}>Select Manager:</label>
                        <select
                          className="form-control"
                          value={selectedManager}
                          onChange={(e) => setSelectedManager(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select a manager</option>
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
                            <button
                              className="btn btn-success mr-2"
                              onClick={() => handleApproveRequest(requestDetails.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleRejectRequest(requestDetails.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      {(requestDetails.status === "Approved" ||
                        requestDetails.status === "Rejected") && (
                        <div className="form-group mt-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter notification message"
                            value={notificationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                          />
                          <button
                            className="btn btn-info mt-2"
                            onClick={handleSendNotification}
                          >
                            Send Notification
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <h2>Create Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="user_id">User</label>
              <select
                id="user_id"
                name="user_id"
                className="form-control"
                value={formData.user_id}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Category</label>
              <select
                id="category_id"
                name="category_id"
                className="form-control"
                value={formData.category_id}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="asset_id">Asset</label>
              <select
                id="asset_id"
                name="asset_id"
                className="form-control"
                value={formData.asset_id}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select an asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <input
                type="text"
                id="reason"
                name="reason"
                className="form-control"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-control"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="urgency">Urgency</label>
              <select
                id="urgency"
                name="urgency"
                className="form-control"
                value={formData.urgency}
                onChange={handleChange}
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestView;
