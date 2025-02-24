import React, { useState } from "react";
import {
  FaFileAlt,
  FaToolbox,
  FaBars,
} from "react-icons/fa";
import "./procurementDashboard.css"; // Assuming your stylesheet is called `procurementDashboard.css`

const ProcurementSidebar = ({ selectedCategory, setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Requests", icon: <FaFileAlt />, category: "requests" },
    { name: "Assets", icon: <FaToolbox />, category: "assets" },
  ];

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
    </div>
  );
};

export default ProcurementSidebar;