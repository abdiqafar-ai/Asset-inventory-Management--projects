import React, { useState } from "react";
import { FaFileAlt, FaBell, FaBars } from "react-icons/fa";
import "./employeeDashboard.css";

const EmployeeSidebar = ({ selectedCategory, setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Requests", icon: <FaFileAlt />, category: "requests" },
    { name: "Notifications", icon: <FaBell />, category: "notifications" },
  ];

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
    </div>
  );
};

export default EmployeeSidebar; // Ensure default export
