import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/ApiService";
import "./procurementAssetsCategoryPage.css";

const ProcurementAssetsCategoryPage = () => {
  const { category_id } = useParams();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    const fetchAssetsByCategory = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await apiService.get(`/assets/category/${category_id}`);
        setAssets(result);
      } catch (err) {
        setError("Error fetching assets for this category");
      } finally {
        setLoading(false);
      }
    };

    fetchAssetsByCategory();
  }, [category_id]);

  const handleAssetClick = async (asset) => {
    try {
      const result = await apiService.get(`/assets/${asset.id}`);
      setSelectedAsset(result);
    } catch (err) {
      setError("Error fetching asset details");
    }
  };

  const closeModal = () => {
    setSelectedAsset(null);
  };

  return (
    <div className="procurement-card">
      <h2 className="procurement-card-title">Assets in Category {category_id}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="procurement-error-message">{error}</p>
      ) : (
        <ul className="procurement-list">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="procurement-list-item clickable"
              onClick={() => handleAssetClick(asset)}
            >
              {asset.id} - {asset.name}
            </li>
          ))}
        </ul>
      )}
      {selectedAsset && (
        <div className="procurement-modal">
          <div className="procurement-modal-content">
            <h3>Asset Details</h3>
            <p>
              <strong>ID:</strong> {selectedAsset.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedAsset.name}
            </p>
            {selectedAsset.description && (
              <p>
                <strong>Description:</strong> {selectedAsset.description}
              </p>
            )}
            <button className="procurement-btn procurement-btn-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementAssetsCategoryPage;