import React, { useState } from "react";
import apiService from "../services/ApiService";
import "./UsersView.css";

const UsersView = ({ data, refreshUsers }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [updateData, setUpdateData] = useState({ role: "", password: "" });
  const [manageMessage, setManageMessage] = useState("");
  const [manageError, setManageError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [createMessage, setCreateMessage] = useState("");
  const [createError, setCreateError] = useState("");

  const handleManageClick = async (userId) => {
    setLoadingUser(true);
    setManageError("");
    setManageMessage("");
    try {
      const result = await apiService.get(`/users/${userId}`);
      setSelectedUser(result);
      setUpdateData({ role: result.role || "", password: "" });
    } catch (err) {
      setManageError("Error fetching user details");
    } finally {
      setLoadingUser(false);
    }
  };

  const closeManageModal = () => {
    setSelectedUser(null);
    setManageError("");
    setManageMessage("");
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setManageError("");
    setManageMessage("");
    try {
      await apiService.put(`/users/${selectedUser.id}`, updateData);
      setManageMessage("User updated successfully");
      if (refreshUsers) refreshUsers();
      setSelectedUser((prev) => ({ ...prev, role: updateData.role }));
    } catch (err) {
      setManageError("Error updating user");
    }
  };

  const handleDelete = async () => {
    setManageError("");
    setManageMessage("");
    try {
      await apiService.delete(`/users/${selectedUser.id}`);
      setManageMessage("User deleted successfully");
      if (refreshUsers) refreshUsers();
      closeManageModal();
    } catch (err) {
      setManageError("Error deleting user");
    }
  };

  const handleActivate = async () => {
    setManageError("");
    setManageMessage("");
    try {
      await apiService.put(`/users/${selectedUser.id}/activate`);
      setManageMessage("User activated successfully");
      if (refreshUsers) refreshUsers();
      setSelectedUser((prev) => ({ ...prev, is_active: true }));
    } catch (err) {
      setManageError("Error activating user");
    }
  };

  const handleDeactivate = async () => {
    setManageError("");
    setManageMessage("");
    try {
      await apiService.put(`/users/${selectedUser.id}/deactivate`);
      setManageMessage("User deactivated successfully");
      if (refreshUsers) refreshUsers();
      setSelectedUser((prev) => ({ ...prev, is_active: false }));
    } catch (err) {
      setManageError("Error deactivating user");
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewUserData({ username: "", email: "", password: "", role: "" });
    setCreateError("");
    setCreateMessage("");
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateError("");
    setCreateMessage("");
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    setCreateError("");
    setCreateMessage("");
    try {
      await apiService.post("/auth/register", newUserData);
      setCreateMessage("User registered successfully");
      if (refreshUsers) refreshUsers();
      setTimeout(closeCreateModal, 1500);
    } catch (err) {
      setCreateError("Error creating user");
    }
  };

  return (
    <div className="users-card">
      <h2 className="users-card-title">Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.is_active ? (
                  <span className="users-text-green">Active</span>
                ) : (
                  <span className="users-text-red">Inactive</span>
                )}
              </td>
              <td>
                <button
                  className="users-btn users-btn-primary"
                  onClick={() => handleManageClick(user.id)}
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="users-create-user-container">
        <button
          className="users-btn users-btn-primary"
          onClick={openCreateModal}
        >
          Create New User
        </button>
      </div>

      {selectedUser && (
        <div className="users-modal">
          <div className="users-modal-content">
            {loadingUser ? (
              <p>Loading...</p>
            ) : (
              <>
                <h3>User Details</h3>
                <p>
                  <strong>ID:</strong> {selectedUser.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.is_active ? "Active" : "Inactive"}
                </p>
                <hr />
                <h4>Update User</h4>
                <div className="users-form-group">
                  <label htmlFor="updateRole">Role:</label>
                  <select
                    id="updateRole"
                    name="role"
                    value={updateData.role}
                    onChange={handleUpdateInputChange}
                  >
                    <option value="">Select role</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="PROCUREMENT_MANAGER">
                      PROCUREMENT_MANAGER
                    </option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                  </select>
                </div>
                <div className="users-form-group">
                  <label htmlFor="updatePassword">Password:</label>
                  <input
                    id="updatePassword"
                    type="password"
                    name="password"
                    value={updateData.password}
                    onChange={handleUpdateInputChange}
                    placeholder="Enter new password"
                  />
                </div>
                <button
                  className="users-btn users-btn-primary"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                <hr />
                <div className="users-action-buttons">
                  <button
                    className="users-btn users-btn-danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  {selectedUser.is_active ? (
                    <button
                      className="users-btn users-btn-secondary"
                      onClick={handleDeactivate}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="users-btn users-btn-secondary"
                      onClick={handleActivate}
                    >
                      Activate
                    </button>
                  )}
                </div>
                {manageMessage && (
                  <p className="users-success-message">{manageMessage}</p>
                )}
                {manageError && (
                  <p className="users-error-message">{manageError}</p>
                )}
                <button
                  className="users-btn users-btn-secondary"
                  onClick={closeManageModal}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="users-modal">
          <div className="users-modal-content">
            <h3>Create New User</h3>
            <div className="users-form-group">
              <label htmlFor="newUsername">Username:</label>
              <input
                id="newUsername"
                type="text"
                name="username"
                value={newUserData.username}
                onChange={handleCreateInputChange}
              />
            </div>
            <div className="users-form-group">
              <label htmlFor="newEmail">Email:</label>
              <input
                id="newEmail"
                type="email"
                name="email"
                value={newUserData.email}
                onChange={handleCreateInputChange}
              />
            </div>
            <div className="users-form-group">
              <label htmlFor="newPassword">Password:</label>
              <input
                id="newPassword"
                type="password"
                name="password"
                value={newUserData.password}
                onChange={handleCreateInputChange}
              />
            </div>
            <div className="users-form-group">
              <label htmlFor="newRole">Role:</label>
              <select
                id="newRole"
                name="role"
                value={newUserData.role}
                onChange={handleCreateInputChange}
              >
                <option value="">Select role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="PROCUREMENT_MANAGER">PROCUREMENT_MANAGER</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>
            </div>
            <button
              className="users-btn users-btn-primary"
              onClick={handleCreateUser}
            >
              Create
            </button>
            {createMessage && (
              <p className="users-success-message">{createMessage}</p>
            )}
            {createError && (
              <p className="users-error-message">{createError}</p>
            )}
            <button
              className="users-btn users-btn-secondary"
              onClick={closeCreateModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;
