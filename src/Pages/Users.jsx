import React, { useEffect, useMemo, useState } from "react";
import "./CSS/Users.css";
import DashboardLayout from "../Components/DashboardLayout";
import axios from "axios";

const Users = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${api_url}/api/user/get-all-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users || []);
    } catch (error) {
      console.log("Error Fetching Users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      );

      if (!confirmDelete) return;

      await axios.delete(
        `${api_url}/api/user/delete-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User Deleted Successfully");

      fetchUsers();
    } catch (error) {
      console.log("Delete Error:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };


  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <DashboardLayout>
      <div className="users-page">

        <div className="users-header">
          <div>
            <h2>Users</h2>
            <p>Manage all registered users</p>
          </div>

          <div className="header-right">
            <input
              type="text"
              placeholder="Search user..."
              className="search-user"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            
          </div>
        </div>

        <div className="users-cards">

          <div className="user-card">
            <h3>{users.length}</h3>
            <span>Total Users</span>
          </div>

          <div className="user-card">
            <h3>
              {users.filter((u) => u.role === "admin").length}
            </h3>
            <span>Admins</span>
          </div>

          <div className="user-card">
            <h3>
              {users.filter((u) => u.role === "customer").length}
            </h3>
            <span>Customers</span>
          </div>

          <div className="user-card">
            <h3>{users.length}</h3>
            <span>Active Users</span>
          </div>

        </div>

        <div className="users-table">
          <table>

            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
                          {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      {user.name || "Unnamed User"}
                    </div>
                  </td>


                  <td>{user.email}</td>

                  <td>{user.phone || "-"}</td>

                  <td style={{ textTransform: "capitalize" }}>
                    {user.role}
                  </td>

                  <td>
                    <span className="status active">
                      {user.status || "Active"}
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id)}
                      >
                       Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Users;