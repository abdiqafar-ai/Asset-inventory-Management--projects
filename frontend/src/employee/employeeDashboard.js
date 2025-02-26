import React, { useEffect, useState } from "react";
import apiService from "../services/ApiService";
import EmployeeSidebar from "./EmployeeSidebar"; // Ensure correct import
import EmployeeRequestsView from "./EmployeeRequestsView";
import EmployeeNotificationsView from "./EmployeeNotificationsView";
import "./employeeDashboard.css"; // Fixed import path

const EmployeeDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("requests");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDataForCategory = async (category) => {
    setLoading(true);
    let endpoint = "";
    switch (category) {
      case "requests":
        endpoint = "/requests";
        break;
      case "assets":
        endpoint = "/assets/categories";
        break;
      case "notifications":
        endpoint = "/notifications";
        break;
      default:
        endpoint = "/requests";
    }
    try {
      const result = await apiService.get(endpoint);
      setData(result);
    } catch (error) {
      console.error(`Error fetching ${category} data:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataForCategory(selectedCategory);
  }, [selectedCategory]);

  const renderContent = () => {
    if (loading) return <div className="employee-card">Loading...</div>;
    switch (selectedCategory) {
      case "requests":
        return <EmployeeRequestsView data={data} />;
      case "notifications":
        return <EmployeeNotificationsView data={data} />;
      default:
        return (
          <div className="employee-card">Select a category to view data.</div>
        );
    }
  };

  return (
    <div className="employee-dashboard-container">
      <EmployeeSidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="employee-content-container">{renderContent()}</div>
    </div>
  );
};

export default EmployeeDashboard;
