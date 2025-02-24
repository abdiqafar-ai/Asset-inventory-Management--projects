import React, { useState, useEffect } from "react";
import apiService from "../services/ApiService";
import "./procurementRequestView.css";

const ProcurementRequestsView = () => {
  const [requests, setRequests] = useState([]);
  const [managers, setManagers] = useState([]);
  const [requestDetails, setRequestDetails] = useState(null);
  const [selectedManager, setSelectedManager] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
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
      <div className="procurement-requests-list mt-4">
        <h2>Requests</h2>
        <div className="procurement-cards-container">
          {requests.map((request) => (
            <div key={request.id} className="procurement-card">
              <h3>Request ID: {request.id}</h3>
              <p>User ID: {request.user_id}</p>
              <p>Asset ID: {request.asset_id}</p>
              <p>Reason: {request.reason}</p>
              <p>Quantity: {request.quantity}</p>
              <p>Urgency: {request.urgency}</p>
              <p>Status: {request.status}</p>
              <button
                className="procurement-btn"
                onClick={() => handleViewRequestDetails(request.id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {requestDetails && (
        <div className="procurement-request-details mt-4">
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
                <button
                  className="procurement-btn"
                  onClick={() => handleApproveRequest(requestDetails.id)}
                >
                  Approve
                </button>
                <button
                  className="procurement-btn"
                  onClick={() => handleRejectRequest(requestDetails.id)}
                >
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
              <button
                className="procurement-btn"
                onClick={handleSendNotification}
              >
                Send Notification
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProcurementRequestsView;