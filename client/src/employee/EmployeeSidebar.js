import React, { useState } from "react";
import { FaFileAlt, FaBell, FaBars, FaSignOutAlt } from "react-icons/fa";
import apiService from "../services/ApiService"; // Import the ApiService
import "./employeeDashboard.css";

const EmployeeSidebar = ({ selectedCategory, setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Requests", icon: <FaFileAlt />, category: "requests" },
    { name: "Notifications", icon: <FaBell />, category: "notifications" },
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
    <div className={`employee-sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="employee-sidebar-toggle">
        <button onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>
      <ul className="employee-sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => setSelectedCategory(item.category)}
            className={`employee-sidebar-item ${
              selectedCategory === item.category ? "active" : ""
            }`}
          >
            <span className="icon">{item.icon}</span>
            {isOpen && <span className="menu-text">{item.name}</span>}
          </li>
        ))}
      </ul>
      <div className="employee-sidebar-logout">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt />
          {isOpen && <span className="menu-text">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
