import React, { useEffect, useState } from "react";
import apiService from "../services/ApiService";
import "./procurementAssetsView.css";

const ProcurementAssetsView = () => {
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
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
        setEmployees([]);
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
    } catch (err) {
      setError("Error fetching allocation info");
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const result = await apiService.post("/assets/categories", {
        name: newCategory,
      });
      setCategories([...categories, result.category]);
      setNewCategory("");
    } catch (err) {
      setError("Error adding category");
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await apiService.delete(`/assets/categories/${categoryId}`);
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (err) {
      setError("Error deleting category");
    }
  };

  return (
    <div className="procurement-card">
      <h2 className="procurement-card-title">Asset Categories</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="procurement-error-message">{error}</p>}

      <ul className="procurement-list">
        {categories.map((category) => (
          <li key={category.id} className="procurement-list-item">
            {category.name}
            <div>
              <button
                className="procurement-btn procurement-btn-primary"
                onClick={() => fetchAssetsByCategory(category.id)}
              >
                View
              </button>
              <button
                className="procurement-btn procurement-btn-delete"
                onClick={() => deleteCategory(category.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form className="procurement-add-category-form" onSubmit={addCategory}>
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <button type="submit" className="procurement-btn">
          Add Category
        </button>
      </form>

      {selectedCategory && (
        <div className="procurement-card">
          <h3>
            Assets in {categories.find((c) => c.id === selectedCategory)?.name}
          </h3>
          {loading ? (
            <p>Loading assets...</p>
          ) : (
            <div className="procurement-grid">
              {assets.map((asset) => (
                <div key={asset.id} className="procurement-asset-card">
                  <img
                    src={asset.image_url}
                    alt={asset.name}
                    className="procurement-asset-image"
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
            <div className="procurement-allocation-info">
              <h3>Allocation Information</h3>
              <p>
                <strong>Allocated To:</strong>{" "}
                {allocationInfo.allocated_to_name || "Not allocated"}
              </p>
            </div>
          )}

          {editingAsset && (
            <div className="procurement-update-form">
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
            <div className="procurement-assign-form">
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
          <form className="procurement-add-form" onSubmit={addAsset}>
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

export default ProcurementAssetsView;