import React, { useState } from "react";
import { FaFileAlt, FaToolbox, FaBars, FaSignOutAlt } from "react-icons/fa";
import apiService from "../services/ApiService"; // Import the ApiService
import "./procurementDashboard.css"; // Assuming your stylesheet is called `procurementDashboard.css`

const ProcurementSidebar = ({
  selectedCategory,
  setSelectedCategory,
  user,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Requests", icon: <FaFileAlt />, category: "requests" },
    { name: "Assets", icon: <FaToolbox />, category: "assets" },
  ];

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      try {
        await apiService.post("/auth/logout");
        apiService.clearTokens();
        window.location.href = "/login";
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <div className={`procurement-sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="procurement-sidebar-toggle">
        <button onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>
      <ul className="procurement-sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => setSelectedCategory(item.category)}
            className={`procurement-sidebar-item ${
              selectedCategory === item.category ? "active" : ""
            }`}
          >
            <span className="icon">{item.icon}</span>
            {isOpen && <span className="menu-text">{item.name}</span>}
          </li>
        ))}
      </ul>
      {user && (
        <div
          className={`user-avatar-container ${
            isOpen ? "expanded" : "collapsed"
          }`}
        >
          <img src={user.avatarUrl} alt="User Avatar" className="avatar" />
          {isOpen && <span className="user-name">{user.name}</span>}
        </div>
      )}
      <div className="procurement-sidebar-logout">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt />
          {isOpen && <span className="menu-text">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default ProcurementSidebar;
