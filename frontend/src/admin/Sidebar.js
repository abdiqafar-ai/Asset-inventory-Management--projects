import React, { useState } from "react";
import {
  FaUsers,
  FaFileAlt,
  FaToolbox,
  FaBell,
  FaBars,
} from "react-icons/fa";
import "./adminDashboard.css";

const AdminSidebar = ({ selectedCategory, setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Users", icon: <FaUsers />, category: "users" },
    { name: "Requests", icon: <FaFileAlt />, category: "requests" },
    { name: "Assets", icon: <FaToolbox />, category: "assets" },
    { name: "Notifications", icon: <FaBell />, category: "notifications" },
  ];

  return (
    <div className={`admin-sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="admin-sidebar-toggle">
        <button onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>
      <ul className="admin-sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => setSelectedCategory(item.category)}
            className={`admin-sidebar-item ${
              selectedCategory === item.category ? "active" : ""
            }`}
          >
            <span className="icon">{item.icon}</span>
            {isOpen && <span className="menu-text">{item.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
