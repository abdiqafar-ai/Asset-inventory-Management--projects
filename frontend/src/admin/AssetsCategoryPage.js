import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/ApiService";
import "./adminDashboard.css";

const AssetsCategoryPage = () => {
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
        // Fetch assets for the category using the backend endpoint:
        // @asset_bp.route('/category/<int:category_id>', methods=['GET'])
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
      // Fetch detailed asset info using a dedicated endpoint (assumed to be /assets/{asset.id})
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
    <div className="card">
      <h2 className="card-title">Assets in Category {category_id}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="list">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="list-item clickable"
              onClick={() => handleAssetClick(asset)}
            >
              {asset.id} - {asset.name}
            </li>
          ))}
        </ul>
      )}
      {/* Modal for displaying asset details */}
      {selectedAsset && (
        <div className="modal">
          <div className="modal-content">
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
            {/* Add additional fields as needed */}
            <button className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsCategoryPage;
