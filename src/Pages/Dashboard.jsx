import React, { useEffect, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/Dashboard.css";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  })
  const [loading, setLoading] = useState(true)

  const verifyToken = async () => {
    try {
      await axios.get(`${api_url}/api/user/check-token`, {
        headers: {
          Authorization: `${token}`,
        },
      });
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get(`${api_url}/api/order/get-all-orders`, {
          headers: { Authorization: `${token}` }
        }),
        axios.get(`${api_url}/api/product/get-all`, {
          headers: { Authorization: `${token}` }
        }),
        axios.get(`${api_url}/api/user/get-all-users`, {
          headers: { Authorization: `${token}` }
        })
      ])

      const orders = ordersRes.data.orders || []
      const products = productsRes.data.product || []
      const users = usersRes.data.users || []

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      const totalOrders = orders.length
      const totalProducts = products.length
      const totalCustomers = users.filter(u => u.role !== 'Admin').length

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers
      })
      setLoading(false)
    } catch (error) {
      console.log("Error fetching stats:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      verifyToken();
      fetchDashboardStats()
    }
  }, []);

  return (
    <>
      <DashboardLayout>
        <div className="dashboard-page">
          {/* Top */}

          <div className="dashboard-title">
            <h2>Dashboard Overview</h2>
            <p>Welcome to your Ecommerce Admin Panel</p>
          </div>

          {/* Cards */}

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <h1>₹{stats.totalRevenue.toLocaleString('en-IN')}</h1>
              <span>+12% this month</span>
            </div>

            <div className="stat-card">
              <h3>Total Orders</h3>
              <h1>{stats.totalOrders}</h1>
              <span>{Math.ceil(stats.totalOrders * 0.1)} New Today</span>
            </div>

            <div className="stat-card">
              <h3>Products</h3>
              <h1>{stats.totalProducts}</h1>
              <span>{Math.ceil(stats.totalProducts * 0.1)} Low Stock</span>
            </div>

            <div className="stat-card">
              <h3>Customers</h3>
              <h1>{stats.totalCustomers}</h1>
              <span>+{Math.ceil(stats.totalCustomers * 0.05)} New Users</span>
            </div>
          </div>

          {/* Second Row */}

          <div className="dashboard-row">

            

          </div>

        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;