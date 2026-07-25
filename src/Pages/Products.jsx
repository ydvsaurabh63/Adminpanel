import React, { useEffect, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import axios from "axios";

const Products = () => {
  const api_url = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

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
      const res = await axios.get(
        `${api_url}/api/category/all-category`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setCategories(res.data.category);
    } catch (error) {
      console.log(error);
    }
  };

  // ===================== Get Products =====================

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${api_url}/api/product/get-all`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setProducts(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  // ===================== Add Product =====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("productName", data.productName);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("category", data.category);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const res = await axios.post(
        `${api_url}/api/product/create`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(res.data.message);

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

      alert(
        error.response?.data?.message ||
          "Failed To Add Product"
      );
    }
  };

  // ===================== Delete Product =====================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${api_url}/api/product/delete/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(res.data.message);

      getProducts();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  useEffect(() => {
    getCategory();
    getProducts();
  }, []);

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
      {/* Add Product Card */}
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            fontSize: "30px",
            fontWeight: "700",
          }}
        >
          Products
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={data.productName}
            onChange={(e) =>
              setData({ ...data, productName: e.target.value })
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />

          <input
            type="number"
            placeholder="Price"
            value={data.price}
            onChange={(e) =>
              setData({ ...data, price: e.target.value })
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />

          <textarea
            placeholder="Description"
            value={data.description}
            onChange={(e) =>
              setData({
                ...data,
                description: e.target.value,
              })
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />

          <select
            value={data.category}
            onChange={(e) =>
              setData({
                ...data,
                category: e.target.value,
              })
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <option value="">Select Category</option>

            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.categoryName}
              </option>
            ))}
          </select>

          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
            style={{ marginBottom: "20px" }}
          />

          <button
            type="submit"
            style={{
              background: "#6C4CF1",
              color: "#fff",
              border: "none",
              padding: "12px 30px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            + Add Product
          </button>
        </form>
      </div>

      {/* Product Table */}
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "15px",
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
          Added Products
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
              <th style={{ padding: "15px" }}>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((item) => (
                <tr
                  key={item._id}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td style={{ padding: "15px" }}>
                    <img
                      src={item.images?.[0]?.url}
                      alt={item.productName}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </td>

                  <td>{item.productName}</td>

                  <td>₹ {item.price}</td>

                  <td>
                    {item.category?.categoryName}
                  </td>

                  <td>
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
                  colSpan="5"
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#777",
                  }}
                >
                  No Product Added Yet
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

export default Products;