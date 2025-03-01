import React, { useEffect, useState } from "react";
import apiService from "../services/ApiService";
import Sidebar from "./Sidebar";
import UsersView from "./UsersView";
import RequestsView from "./RequestsView";
import AssetsView from "./AssetsView";
import NotificationsView from "./NotificationsView";
import ActivityLogsView from "./ActivityLogsView";
import "./adminDashboard.css";
const AdminDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDataForCategory = async (category) => {
    setLoading(true);
    let endpoint = "";
    switch (category) {
      case "users":
        endpoint = "/users";
        break;
      case "requests":
        endpoint = "/requests";
        break;
      case "assets":
        endpoint = "/assets/categories";
        break;
      case "notifications":
        endpoint = "/notifications";
        break;
      case "activityLogs":
        endpoint = "/activity-logs";
        break;
      default:
        endpoint = "/users";
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
    if (loading) return <div className="admin-card">Loading...</div>;
    switch (selectedCategory) {
      case "users":
        return <UsersView data={data} />;
      case "requests":
        return <RequestsView data={data} />;
      case "assets":
        return <AssetsView data={data} />;
      case "notifications":
        return <NotificationsView data={data} />;
      case "activityLogs":
        return <ActivityLogsView data={data} />;
      default:
        return (
          <div className="admin-card">Select a category to view data.</div>
        );
    }
  };

  return (
    <div className="admin-dashboard-container">
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="admin-content-container">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
