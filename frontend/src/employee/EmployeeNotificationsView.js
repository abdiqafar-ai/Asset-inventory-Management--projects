import React, { useState } from "react";
import PropTypes from "prop-types";
import apiService from "../services/ApiService";
import "./employeeNotificationsView.css";

const EmployeeNotificationsView = ({ data }) => {
  const [notifications, setNotifications] = useState(data || []);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const markAsRead = async (notificationId, e) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      const response = await apiService.put(
        `/notifications/${notificationId}/read`
      );

      if (response.status !== 200) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteNotification = async (notificationId, e) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      const response = await apiService.delete(
        `/notifications/${notificationId}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete notification");
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const safeMessage = (message) => {
    const safeMsg = message || "No message available";
    return {
      full: safeMsg,
      preview: safeMsg.length > 100 ? `${safeMsg.substring(0, 97)}...` : safeMsg
    };
  };

  const formatDate = (dateString) => {
    try {
      return dateString ? new Date(dateString).toLocaleDateString() : "No date";
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="employee-notification-card">
      <h2 className="employee-notification-card-title">Notifications</h2>
      <ul className="employee-notification-list">
        {notifications.map((notification) => {
          if (!notification) return null;
          
          const { id, read, created_at } = notification;
          const message = safeMessage(notification.message);
          const date = formatDate(created_at);

          return (
            <li
              key={id || Date.now()}
              className={`employee-notification-list-item ${
                read ? "employee-notification-read" : ""
              } ${expandedId === id ? "expanded" : ""}`}
              onClick={() => id && toggleExpand(id)}
            >
              <div className="notification-content-wrapper">
                <span className="employee-notification-text">
                  <span className="notification-id">#{id || "---"}</span>
                  <span className="message-preview">
                    {expandedId === id ? message.full : message.preview}
                  </span>
                  {message.full.length > 100 && (
                    <span className="read-more">
                      {expandedId === id ? "Show less" : "Read more"}
                    </span>
                  )}
                  <span className="notification-date">{date}</span>
                </span>
                <div 
                  className="employee-notification-button-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={`employee-notification-button ${
                      read
                        ? "employee-notification-read-button"
                        : "employee-notification-read-button-alt"
                    }`}
                    onClick={(e) => markAsRead(id, e)}
                    disabled={read}
                  >
                    {read ? "✓ Read" : "Mark Read"}
                  </button>
                  <button
                    className="employee-notification-delete-button"
                    onClick={(e) => deleteNotification(id, e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

EmployeeNotificationsView.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      message: PropTypes.string,
      read: PropTypes.bool,
      created_at: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date)
      ])
    })
  )
};

EmployeeNotificationsView.defaultProps = {
  data: []
};

export default EmployeeNotificationsView;