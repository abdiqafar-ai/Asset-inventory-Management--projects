import React, { useEffect, useState } from "react";
import apiService from "../services/ApiService";
import "./AssetsView.css";

const AssetsView = () => {
  // Category management states
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "" });

  // Asset management states
  const [assets, setAssets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAssets, setShowAssets] = useState(false);
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
  const [allocationAssetId, setAllocationAssetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories and employees on mount
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
        setEmployees([]);
      }
    };
    fetchEmployees();
  }, []);

  // Category actions
  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await apiService.post("/assets/categories", newCategory);
      setNewCategory({ name: "" });
      const result = await apiService.get("/assets/categories");
      setCategories(result);
    } catch (err) {
      setError("Error adding category");
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await apiService.delete(`/assets/categories/${categoryId}`);
      setCategories(categories.filter((cat) => cat.id !== categoryId));
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
        setAssets([]);
      }
    } catch (err) {
      setError("Error deleting category");
    }
  };

  // Asset actions
  const fetchAssetsByCategory = async (categoryId) => {
    setLoading(true);
    setError("");
    if (selectedCategory === categoryId && showAssets) {
      setShowAssets(false);
      setSelectedCategory(null);
      setAssets([]);
      setLoading(false);
      return;
    }
    setSelectedCategory(categoryId);
    setShowAssets(true);
    try {
      const result = await apiService.get(`/assets/category/${categoryId}`);
      setAssets(result);
      setNewAsset((prev) => ({ ...prev, category_id: categoryId }));
      setEditingAsset(null);
      setAssigningAsset(null);
      setAllocationAssetId(null);
      setAllocationInfo(null);
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
        category_id: selectedCategory,
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
        force: !!assigningAsset.allocated_to?.id,
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
      setAllocationAssetId(assetId);
    } catch (err) {
      setError("Error fetching allocation info");
    }
  };

  return (
    <div className="assets-view-container">
      {/* Category Management */}
      <div className="category-panel assets-card">
        <h2 className="assets-card-title">Asset Categories</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="assets-error-message">{error}</p>}
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <h4>{category.name}</h4>
              <div>
                <button
                  className="category-btn btn-view"
                  onClick={() => fetchAssetsByCategory(category.id)}
                >
                  {selectedCategory === category.id && showAssets
                    ? "Hide"
                    : "View"}
                </button>
                <button
                  className="category-btn btn-delete"
                  onClick={() => deleteCategory(category.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <form className="add-category-form" onSubmit={addCategory}>
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ name: e.target.value })}
            required
          />
          <button type="submit">Add Category</button>
        </form>
      </div>

      {/* Asset Management (when a category is selected) */}
      {showAssets && selectedCategory && (
        <div className="assets-panel assets-card">
          <h3>
            Assets in {categories.find((c) => c.id === selectedCategory)?.name}
          </h3>
          <div>
            <h4>Add New Asset</h4>
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
              <button type="submit" className="assets-btn btn-assign">
                Add Asset
              </button>
            </form>
          </div>
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
                  <div className="button-group">
                    <button
                      className="assets-btn btn-update"
                      onClick={() => setEditingAsset(asset)}
                    >
                      Update
                    </button>
                    <button
                      className="assets-btn btn-delete-asset"
                      onClick={() => deleteAsset(asset.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="assets-btn btn-assign"
                      onClick={() => setAssigningAsset(asset)}
                    >
                      {asset.allocated_to && asset.allocated_to.id
                        ? "Reassign"
                        : "Assign"}
                    </button>
                    <button
                      className="assets-btn btn-view-asset"
                      onClick={() => viewAllocation(asset.id)}
                    >
                      View Allocation
                    </button>
                  </div>
                  {editingAsset && editingAsset.id === asset.id && (
                    <div className="assets-update-form">
                      <h3>Update Asset</h3>
                      <form onSubmit={updateAsset}>
                        <input
                          type="text"
                          placeholder="Name"
                          value={editingAsset.name}
                          onChange={(e) =>
                            setEditingAsset({
                              ...editingAsset,
                              name: e.target.value,
                            })
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
                            setEditingAsset({
                              ...editingAsset,
                              status: e.target.value,
                            })
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
                        <div className="button-group">
                          <button
                            type="submit"
                            className="assets-btn btn-update"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            className="assets-btn btn-view-asset"
                            onClick={() => setEditingAsset(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  {assigningAsset && assigningAsset.id === asset.id && (
                    <div className="assets-assign-form">
                      <h3>
                        {assigningAsset.allocated_to &&
                        assigningAsset.allocated_to.id
                          ? "Reassign Asset"
                          : "Assign Asset"}
                      </h3>
                      <form onSubmit={allocateOrReassignAsset}>
                        <select
                          value={selectedEmployeeId}
                          onChange={(e) =>
                            setSelectedEmployeeId(e.target.value)
                          }
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
                        <div className="button-group">
                          <button
                            type="submit"
                            className="assets-btn btn-assign"
                          >
                            {assigningAsset.allocated_to &&
                            assigningAsset.allocated_to.id
                              ? "Reassign"
                              : "Assign"}
                          </button>
                          <button
                            type="button"
                            className="assets-btn btn-view-asset"
                            onClick={() => setAssigningAsset(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  {allocationAssetId === asset.id && allocationInfo && (
                    <div className="allocation-info">
                      <h3>Allocation Information</h3>
                      <p>
                        <strong>Allocated To:</strong>{" "}
                        {allocationInfo.allocated_to_name || "Not allocated"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetsView;
