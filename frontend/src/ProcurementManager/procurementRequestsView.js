import React, { useState, useEffect } from "react";
import apiService from "../services/ApiService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./procurementRequestView.css";

const ProcurementRequestsView = () => {
  const [requests, setRequests] = useState([]);
  const [managers, setManagers] = useState([]);
  const [requestDetails, setRequestDetails] = useState(null);
  const [selectedManager, setSelectedManager] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  useEffect(() => {
    apiService
      .get("/requests")
      .then((data) => setRequests(data))
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
                <div className="card procurement-card">
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
      </div>
    </div>
  );
};

export default ProcurementRequestsView;