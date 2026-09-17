import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/ForgotPassword.css";
import { KeyRound, Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const sendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      setLoading(true);
      const res = await axios.post(`${api_url}/api/user/forgot-password`, { email });
      setSuccessMsg(res.data?.message || "OTP sent to your email!");
      setStep(2);
    } catch (error) {
      console.error("Send OTP Error:", error);
      setErrorMsg(
        error.response?.data?.message || "Failed to send OTP. Please check your email address."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      setLoading(true);
      const res = await axios.post(`${api_url}/api/user/reset-password`, {
        email,
        otp,
        password,
      });

      alert(res.data?.message || "Password changed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Reset Password Error:", error);
      setErrorMsg(
        error.response?.data?.message || "Failed to reset password. Please verify the OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-forgot-page">
      <div className="admin-glow-orb glow-1"></div>
      <div className="admin-glow-orb glow-2"></div>

      <div className="admin-forgot-card">
        <div className="admin-badge-container">
          <div className="admin-badge-icon">
            <KeyRound size={26} />
          </div>
          <span className="admin-portal-pill">Account Recovery</span>
        </div>

        <div className="admin-card-title">
          <h1>{step === 1 ? "Forgot Password" : "Reset Password"}</h1>
          <p>
            {step === 1
              ? "Enter your registered admin email to receive an OTP"
              : "Enter the OTP received and create a new password"}
          </p>
        </div>

        {errorMsg && <div className="admin-login-alert">{errorMsg}</div>}
        {successMsg && <div className="admin-success-alert">{successMsg}</div>}

        {step === 1 ? (
          <form onSubmit={sendOtp} className="admin-login-form">
            <div className="admin-input-box">
              <label>Admin Email</label>
              <div className="admin-field-wrapper">
                <Mail className="admin-field-icon" size={18} />
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="admin-signin-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send Verification OTP"} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="admin-login-form">
            <div className="admin-input-box">
              <label>Admin Email</label>
              <div className="admin-field-wrapper">
                <Mail className="admin-field-icon" size={18} />
                <input type="email" value={email} disabled />
              </div>
            </div>

            <div className="admin-input-box">
              <label>Enter OTP (4 Digits)</label>
              <div className="admin-field-wrapper">
                <ShieldCheck className="admin-field-icon" size={18} />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-input-box">
              <label>New Password</label>
              <div className="admin-field-wrapper">
                <Lock className="admin-field-icon" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="admin-signin-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password & Login"}
            </button>
          </form>
        )}

        <div className="admin-card-footer">
          <Link to="/" className="admin-back-btn">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;