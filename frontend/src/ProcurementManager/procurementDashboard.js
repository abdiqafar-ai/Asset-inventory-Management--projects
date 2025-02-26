import React, { useEffect, useState } from "react";
import apiService from "../services/ApiService";
import ProcurementRequestsView from "./procurementRequestsView";
import ProcurementAssetsView from "./procurementAssetsView";
import ProcurementSidebar from "./procurementSidebar";
import "./procurementDashboard.css";

const ProcurementDashboard = () => {
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
      default:
        console.warn(`Unknown category: ${category}`);
        endpoint = "/requests"; // Default to '/requests'
        break;
    }
    try {
      const result = await apiService.get(endpoint); // Correctly fetch data
      setData(result.data);  // Access the data in the response
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
    if (loading) return <div className="procurement-card">Loading...</div>;
    switch (selectedCategory) {
      case "requests":
        return <ProcurementRequestsView data={data} />;
      case "assets":
        return <ProcurementAssetsView data={data} />;
      default:
        return (
          <div className="procurement-card">Select a category to view data.</div>
        );
    }
  };

  return (
    <div className="procurement-dashboard-container">
      <ProcurementSidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="procurement-content-container">{renderContent()}</div>
    </div>
  );
};

export default ProcurementDashboard;