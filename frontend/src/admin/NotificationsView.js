import React, { useState } from "react";
import apiService from "../services/ApiService";
import "./NotificationsView.css";

const NotificationsView = ({ data }) => {
  const [notifications, setNotifications] = useState(data);

  const markAsRead = async (notificationId) => {
    try {
      const response = await apiService.put(
        `/notifications/${notificationId}/read`
      );

      if (response.status !== 200) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      console.log(response.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await apiService.delete(
        `/notifications/${notificationId}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );

      console.log(response.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="notification-card">
      <h2 className="notification-card-title">Notifications</h2>
      <ul className="notification-list">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`notification-list-item ${
              notification.read ? "notification-read" : ""
            }`}
          >
            <span className="notification-text">
              {notification.id} - {notification.message}
            </span>
            <div className="notification-button-container">
              <button
                className={`notification-button ${
                  notification.read
                    ? "notification-read-button"
                    : "notification-read-button-alt"
                }`}
                onClick={() => markAsRead(notification.id)}
                disabled={notification.read}
              >
                {notification.read ? "Already Read" : "Read"}
              </button>
              <button
                className="notification-delete-button"
                onClick={() => deleteNotification(notification.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsView;
