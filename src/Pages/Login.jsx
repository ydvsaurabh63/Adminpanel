import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CSS/Login.css";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

const Login = () => {
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email.trim() || !formData.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${api_url}/api/user/login`, {
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.status === 200 && res.data.success) {
        const userData = res.data.user || res.data.userData || null;

        localStorage.setItem("token", res.data.token);
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        }

        setFormData({
          email: "",
          password: "",
        });

        navigate("/dashboard");
      } else {
        setErrorMsg(res.data.message || "Invalid Email or Password");
      }
    } catch (error) {
      console.log("Admin Login Error:", error);
      setErrorMsg(
        error.response?.data?.message || "Invalid credentials. Please verify email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Background Ambient Glows */}
      <div className="admin-glow-orb glow-1"></div>
      <div className="admin-glow-orb glow-2"></div>
      <div className="admin-glow-orb glow-3"></div>

      <div className="admin-login-card">
        {/* Logo & Portal Header */}
        <div className="admin-badge-container">
          <div className="admin-badge-icon">
            <ShieldCheck size={28} />
          </div>
          <span className="admin-portal-pill">
            <Sparkles size={13} /> Admin Portal
          </span>
        </div>

        <div className="admin-card-title">
          <h1>Products Store</h1>
          <p>Sign in to manage inventory, orders, and users</p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && <div className="admin-login-alert">{errorMsg}</div>}

        <form onSubmit={loginUser} className="admin-login-form">
          {/* Email Input */}
          <div className="admin-input-box">
            <label>Admin Email</label>
            <div className="admin-field-wrapper">
              <Mail className="admin-field-icon" size={18} />
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="admin-input-box">
            <div className="admin-password-label-row">
              <label>Password</label>
              <Link to="/forgot-password" className="admin-forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="admin-field-wrapper">
              <Lock className="admin-field-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="admin-signin-btn" disabled={loading}>
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                Sign In to Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="admin-card-footer">
          <p>Protected by Enterprise-grade Authentication</p>
        </div>
      </div>
    </div>
  );
};

export default Login;