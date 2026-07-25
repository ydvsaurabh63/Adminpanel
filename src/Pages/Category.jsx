import React, { useEffect, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import axios from "axios";

const Category = () => {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const api_url = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // ================= Fetch Categories =================

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${api_url}/api/category/all-category`
      );

      setCategories(res.data.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= Add Category =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("categoryName", categoryName);

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(
        `${api_url}/api/category/create-category`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(res.data.message || "Category Created");

      setCategoryName("");
      setImage(null);

      fetchCategories();
    } catch (error) {
      console.error(error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Failed to add category"
      );
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

      alert(res.data.message);

      fetchCategories();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  return (
    <>
  <DashboardLayout>
    <div
      style={{
        padding: "30px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Add Category Card */}
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          maxWidth: "900px",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "700",
            marginBottom: "25px",
          }}
        >
          Category
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Category Image
            </label>

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "#6C4CF1",
              color: "#fff",
              border: "none",
              padding: "12px 25px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            + Add Category
          </button>
        </form>
      </div>

      {/* Added Categories */}
      <div
        style={{
          marginTop: "30px",
          background: "#fff",
          borderRadius: "15px",
          padding: "25px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          Added Categories
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#6C4CF1",
                color: "#fff",
              }}
            >
              <th style={{ padding: "15px" }}>#</th>
              <th>Image</th>
              <th>Category Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((item, index) => (
                <tr
                  key={item._id}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td style={{ padding: "15px" }}>
                    {index + 1}
                  </td>

                  <td style={{ padding: "15px" }}>
                    <img
                      src={item.image}
                      alt={item.categoryName}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </td>

                  <td
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                    }}
                  >
                    {item.categoryName}
                  </td>

                  <td style={{ padding: "15px" }}>
                    <button
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      style={{
                        background: "#ff3b3b",
                        color: "#fff",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
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
                    color: "#888",
                  }}
                >
                  No Category Added Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
</>
  );
};

export default Category;