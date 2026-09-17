import React, { useEffect, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import "./CSS/Products.css";
import axios from "axios";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

const Products = () => {
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    productName: "",
    price: "",
    description: "",
    category: "",
  });

  const [images, setImages] = useState([]);

  // ===================== Get Categories =====================
  const getCategory = async () => {
    try {
      const res = await axios.get(`${api_url}/api/category/all-category`);
      setCategories(res.data.category || []);
    } catch (error) {
      console.log("Get Category Error:", error);
    }
  };

  // ===================== Get Products =====================
  const getProducts = async () => {
    try {
      const res = await axios.get(`${api_url}/api/product/get-all`);
      setProducts(res.data.product || []);
    } catch (error) {
      console.log("Get Products Error:", error);
    }
  };

  // ===================== Add Product =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.productName.trim() || !data.price) {
      alert("Product name and price are required");
      return;
    }

    const formData = new FormData();
    formData.append("productName", data.productName.trim());
    formData.append("price", data.price);
    formData.append("description", data.description);
    if (data.category) {
      formData.append("category", data.category);
    }

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${api_url}/api/product/create`, formData, {
        headers: {
          Authorization: token,
        },
      });

      alert(res.data.message || "Product Created Successfully");
      setData({
        productName: "",
        price: "",
        description: "",
        category: "",
      });
      setImages([]);
      getProducts();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed To Add Product");
    } finally {
      setLoading(false);
    }
  };

  // ===================== Delete Product =====================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${api_url}/api/product/delete/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      alert(res.data.message || "Product Deleted Successfully");
      getProducts();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  useEffect(() => {
    getCategory();
    getProducts();
  }, []);

  return (
    <DashboardLayout>
      <div className="admin-products-page">
        {/* Add Product Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Manage Products</h2>
            <p>Create new products and manage inventory</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="admin-input-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Noise Canceling Headphones"
                  value={data.productName}
                  onChange={(e) =>
                    setData({ ...data, productName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="admin-input-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 2999"
                  value={data.price}
                  onChange={(e) =>
                    setData({ ...data, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="admin-input-group">
                <label>Category</label>
                <select
                  value={data.category}
                  onChange={(e) =>
                    setData({ ...data, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-input-group">
                <label>Product Images (Max 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                />
              </div>

              <div className="admin-input-group admin-form-full">
                <label>Description</label>
                <textarea
                  placeholder="Enter detailed product description..."
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  rows="3"
                />
              </div>
            </div>

            <button type="submit" className="admin-submit-btn" disabled={loading}>
              <Plus size={18} /> {loading ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>

        {/* Product Table Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Product Catalog ({products.length})</h2>
            <p>All active products currently listed in store</p>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.length > 0 ? (
                  products.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img
                          src={item.images?.[0]?.url || "https://placehold.co/50"}
                          alt={item.productName}
                          className="table-product-img"
                        />
                      </td>

                      <td style={{ fontWeight: 600 }}>{item.productName}</td>

                      <td style={{ fontWeight: 700, color: "#4f46e5" }}>
                        ₹{Number(item.price).toLocaleString()}
                      </td>

                      <td>
                        <span className="table-badge">
                          {item.category?.categoryName || "Uncategorized"}
                        </span>
                      </td>

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
                      colSpan="5"
                      style={{
                        padding: "30px",
                        textAlign: "center",
                        color: "#94a3b8",
                      }}
                    >
                      No Products Found. Add your first product above.
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

export default Products;