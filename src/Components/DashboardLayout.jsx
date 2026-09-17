import React, { useEffect, useState } from "react";
import "./CSS/DashboardLayout.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  ChevronDown,
  X,
  ShoppingBasket,
  ListOrdered,
  LogOut,
  Users,
  Tags,
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 992);
  const navigate = useNavigate();
  const location = useLocation();

  const [loginPerson, setLoginPerson] = useState("");
  const [role, setRole] = useState("admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      navigate("/");
    } else if (user) {
      try {
        const Loginedperson = JSON.parse(user);
        setLoginPerson(Loginedperson.name || "Admin");
        setRole(Loginedperson.role || "admin");
      } catch (e) {
        setLoginPerson("Admin");
      }
    }
  }, [navigate]);

  // Automatically close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth <= 992) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const tabs = {
    admin: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Category",
        path: "/category",
        icon: <Tags size={20} />,
      },
      {
        name: "Products",
        path: "/products",
        icon: <ShoppingBasket size={20} />,
      },
      {
        name: "Orders",
        path: "/orders",
        icon: <ListOrdered size={20} />,
      },
      {
        name: "Users",
        path: "/users",
        icon: <Users size={20} />,
      },
    ],

    customer: [
      {
        name: "My Orders",
        path: "/my-orders",
        icon: <ListOrdered size={20} />,
      },
      {
        name: "Address",
        path: "/my-address",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Carts",
        path: "/my-carts",
        icon: <ShoppingBasket size={20} />,
      },
    ],
  };

  const activeTabs = tabs[role] || tabs.admin;

  return (
    <div className="dashboard-outer">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "close"}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">D</div>
          {sidebarOpen && <span>Dashboard</span>}
          <button
            className="sidebar-mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-tabs">
          {activeTabs.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.path}
              className={({ isActive }) =>
                `sidebar-tab-name ${isActive ? "active" : ""}`
              }
              onClick={() => {
                if (window.innerWidth <= 992) setSidebarOpen(false);
              }}
            >
              {tab.icon}
              {sidebarOpen && <span>{tab.name}</span>}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <button
              className="menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div>
              <h2>Welcome Back 👋</h2>
              <p>{loginPerson}</p>
            </div>
          </div>

          <div className="dashboard-header-right">
            <div className="dashboard-admin-outer">
              <div className="admin">
                {loginPerson ? loginPerson.charAt(0).toUpperCase() : "A"}
              </div>

              <div className="admin-dropdown">
                <div className="admin-dropdown-left">
                  <p>{loginPerson}</p>
                  <span>{role}</span>
                </div>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;