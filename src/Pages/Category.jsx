import React, { useEffect, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import "./CSS/Products.css";
import "./CSS/Category.css";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

const Category = () => {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const api_url = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  // ================= Fetch Categories =================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${api_url}/api/category/all-category`);
      setCategories(res.data.category || []);
    } catch (error) {
      console.log("Fetch Category Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= Add Category =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName.trim());
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${api_url}/api/category/create-category`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(res.data.message || "Category Created Successfully");
      setCategoryName("");
      setImage(null);
      fetchCategories();
    } catch (error) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // ================= Delete Category =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${api_url}/api/category/delete-category/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(res.data.message || "Category Deleted Successfully");
      fetchCategories();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-category-page">
        {/* Add Category Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Add Category</h2>
            <p>Create and organize store product categories</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="admin-input-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Fashion, Footwear"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-input-group">
                <label>Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
            </div>

            <button type="submit" className="admin-submit-btn" disabled={loading}>
              <Plus size={18} /> {loading ? "Adding Category..." : "Add Category"}
            </button>
          </form>
        </div>

        {/* Categories Table Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Added Categories ({categories.length})</h2>
            <p>List of all product categories in your database</p>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>#</th>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.length > 0 ? (
                  categories.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={item.image || "https://placehold.co/50"}
                          alt={item.categoryName}
                          className="category-preview-img"
                        />
                      </td>

                      <td style={{ fontWeight: 600 }}>{item.categoryName}</td>

                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="table-delete-btn"
                        >
                          <Trash2 size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#94a3b8",
                      }}
                    >
                      No Categories Added Yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Category;