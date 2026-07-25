import React, { useEffect, useMemo, useState } from "react";
import "./CSS/Orders.css";
import DashboardLayout from "../Components/DashboardLayout";
import axios from "axios";

const Orders = () => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/order/get-all-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log("Error Fetching Orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Search Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = order.user?.name || "";

      const products = order.items
        ?.map((item) => item.productId?.productName || "")
        .join(" ");

      return (
        customer.toLowerCase().includes(search.toLowerCase()) ||
        products.toLowerCase().includes(search.toLowerCase()) ||
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.status?.toLowerCase().includes(search.toLowerCase()) ||
        order.paymentType?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [orders, search]);

  // Revenue
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "delivered";

      case "Pending":
        return "pending";

      case "Processing":
        return "processing";

      case "Shipped":
        return "shipped";

      case "Cancelled":
        return "cancelled";

      default:
        return "";
    }
  };
    return (
    <DashboardLayout>
      <div className="orders-page">
        <div className="orders-header">
          <div>
            <h2>Orders</h2>
            <p>Manage all customer orders</p>
          </div>

          <input
            type="text"
            placeholder="Search Order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="order-search"
          />
        </div>

        <div className="orders-cards">
          <div className="order-card">
            <h3>{orders.length}</h3>
            <span>Total Orders</span>
          </div>

          <div className="order-card">
            <h3>
              {orders.filter((o) => o.status === "Pending").length}
            </h3>
            <span>Pending</span>
          </div>

          <div className="order-card">
            <h3>
              {orders.filter((o) => o.status === "Delivered").length}
            </h3>
            <span>Delivered</span>
          </div>

          <div className="order-card">
            <h3>₹{totalRevenue}</h3>
            <span>Total Revenue</span>
          </div>
        </div>

        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6).toUpperCase()}</td>

                    <td>{order.user?.name || "N/A"}</td>

                    <td>
                      {order.items
                        ?.map(
                          (item) =>
                            item.productId?.productName || "Deleted Product"
                        )
                        .join(", ")}
                    </td>

                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td>₹{order.totalAmount}</td>

                    <td>{order.paymentType}</td>

                    <td>
                      <span
                        className={`status ${getStatusClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() => console.log(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    No Orders Found
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

export default Orders;