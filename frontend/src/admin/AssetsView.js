import React, { useEffect, useState } from "react";
import apiService from "../services/ApiService";
import "./AssetsView.css";

const AssetsView = () => {
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newAsset, setNewAsset] = useState({
    name: "",
    description: "",
    status: "",
    image_url: "",
    category_id: "",
  });
  const [editingAsset, setEditingAsset] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [assigningAsset, setAssigningAsset] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [allocationInfo, setAllocationInfo] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await apiService.get("/assets/categories");
        setCategories(result);
      } catch (err) {
        setError("Error fetching asset categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await apiService.get("/employees");
        if (result && Array.isArray(result.employees)) {
          setEmployees(result.employees);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        setError("Error fetching employees");
        setEmployees([]); // Ensure employees is an array even on error
      }
    };
    fetchEmployees();
  }, []);

  const fetchAssetsByCategory = async (category_id) => {
    setLoading(true);
    setError("");
    setSelectedCategory(category_id);
    try {
      const result = await apiService.get(`/assets/category/${category_id}`);
      setAssets(result);
    } catch (err) {
      setError("Error fetching assets for this category");
    } finally {
      setLoading(false);
    }
  };

  const updateAsset = async (e) => {
    e.preventDefault();
    try {
      const updatedAsset = {
        ...editingAsset,
        allocated_to:
          editingAsset.allocated_to?.id || editingAsset.allocated_to,
      };

      await apiService.put(`/assets/${editingAsset.id}`, updatedAsset);
      setEditingAsset(null);
      fetchAssetsByCategory(selectedCategory);
    } catch (err) {
      setError("Error updating asset");
    }
  };

  const deleteAsset = async (assetId) => {
    try {
      await apiService.delete(`/assets/${assetId}`);
      setAssets(assets.filter((asset) => asset.id !== assetId));
    } catch (err) {
      setError("Error deleting asset");
    }
  };

  const addAsset = async (e) => {
    e.preventDefault();
    try {
      await apiService.post("/assets/add", newAsset);
      setNewAsset({
        name: "",
        description: "",
        status: "",
        image_url: "",
        category_id: "",
      });
      fetchAssetsByCategory(selectedCategory);
    } catch (err) {
      setError("Error adding asset");
    }
  };

  const allocateOrReassignAsset = async (e) => {
    e.preventDefault();
    try {
      await apiService.put(`/assets/${assigningAsset.id}/allocate`, {
        employee_id: selectedEmployeeId,
        force: !!assigningAsset.allocated_to?.id, // Force reassign if already allocated
      });
      setAssigningAsset(null);
      setSelectedEmployeeId("");
      fetchAssetsByCategory(selectedCategory);
    } catch (err) {
      setError("Error allocating or reassigning asset");
    }
  };

  const viewAllocation = async (assetId) => {
    try {
      const result = await apiService.get(`/assets/${assetId}/allocation`);
      setAllocationInfo(result);
    } catch (err) {
      setError("Error fetching allocation info");
    }
  };

  return (
    <div className="assets-card">
      <h2 className="assets-card-title">Asset Categories</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="assets-error-message">{error}</p>}

      <ul className="assets-list">
        {categories.map((category) => (
          <li key={category.id} className="assets-list-item">
            {category.name}
            <button
              className="assets-btn assets-btn-primary"
              onClick={() => fetchAssetsByCategory(category.id)}
            >
              View
            </button>
          </li>
        ))}
      </ul>

      {selectedCategory && (
        <div className="assets-card">
          <h3>
            Assets in {categories.find((c) => c.id === selectedCategory)?.name}
          </h3>
          {loading ? (
            <p>Loading assets...</p>
          ) : (
            <div className="assets-grid">
              {assets.map((asset) => (
                <div key={asset.id} className="assets-asset-card">
                  <img
                    src={asset.image_url}
                    alt={asset.name}
                    className="assets-asset-image"
                  />
                  <h4>{asset.name}</h4>
                  <p>
                    <strong>Description:</strong> {asset.description}
                  </p>
                  <p>
                    <strong>Status:</strong> {asset.status}
                  </p>
                  <button onClick={() => setEditingAsset(asset)}>Update</button>
                  <button onClick={() => deleteAsset(asset.id)}>Delete</button>
                  <button onClick={() => setAssigningAsset(asset)}>
                    {asset.allocated_to && asset.allocated_to.id
                      ? "Reassign"
                      : "Assign"}
                  </button>
                  <button onClick={() => viewAllocation(asset.id)}>
                    View Allocation
                  </button>
                </div>
              ))}
            </div>
          )}

          {allocationInfo && (
            <div className="allocation-info">
              <h3>Allocation Information</h3>
              <p>
                <strong>Allocated To:</strong>{" "}
                {allocationInfo.allocated_to_name || "Not allocated"}
              </p>
            </div>
          )}

          {editingAsset && (
            <div className="assets-update-form">
              <h3>Update Asset</h3>
              <form onSubmit={updateAsset}>
                <input
                  type="text"
                  placeholder="Name"
                  value={editingAsset.name}
                  onChange={(e) =>
                    setEditingAsset({ ...editingAsset, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={editingAsset.description}
                  onChange={(e) =>
                    setEditingAsset({
                      ...editingAsset,
                      description: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Status"
                  value={editingAsset.status}
                  onChange={(e) =>
                    setEditingAsset({ ...editingAsset, status: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={editingAsset.image_url}
                  onChange={(e) =>
                    setEditingAsset({
                      ...editingAsset,
                      image_url: e.target.value,
                    })
                  }
                  required
                />
                <select
                  value={editingAsset.category_id}
                  onChange={(e) =>
                    setEditingAsset({
                      ...editingAsset,
                      category_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingAsset(null)}>
                  Cancel
                </button>
              </form>
            </div>
          )}

          {assigningAsset && (
            <div className="assets-assign-form">
              <h3>
                {assigningAsset.allocated_to && assigningAsset.allocated_to.id
                  ? "Reassign Asset"
                  : "Assign Asset"}
              </h3>
              <form onSubmit={allocateOrReassignAsset}>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Employee
                  </option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.username}
                    </option>
                  ))}
                </select>
                <button type="submit">
                  {assigningAsset.allocated_to && assigningAsset.allocated_to.id
                    ? "Reassign"
                    : "Assign"}
                </button>
                <button type="button" onClick={() => setAssigningAsset(null)}>
                  Cancel
                </button>
              </form>
            </div>
          )}

          <h3>Add New Asset</h3>
          <form className="assets-add-form" onSubmit={addAsset}>
            <input
              type="text"
              placeholder="Name"
              value={newAsset.name}
              onChange={(e) =>
                setNewAsset({ ...newAsset, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newAsset.description}
              onChange={(e) =>
                setNewAsset({ ...newAsset, description: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Status"
              value={newAsset.status}
              onChange={(e) =>
                setNewAsset({ ...newAsset, status: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newAsset.image_url}
              onChange={(e) =>
                setNewAsset({ ...newAsset, image_url: e.target.value })
              }
              required
            />
            <select
              value={newAsset.category_id}
              onChange={(e) =>
                setNewAsset({ ...newAsset, category_id: e.target.value })
              }
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button type="submit">Add Asset</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssetsView;
