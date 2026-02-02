import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/Layout";
import "../styles/Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "", lastname: "", email: "", password: "", confirmPassword: "", rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!isLogin) {
      if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
      if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setStatus("");
      return;
    }

    try {
      if (isLogin) {
        const res = await API.post("/users/login", {
        email: formData.email,
        password: formData.password
      });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("isAdmin", res.data.isAdmin );

        setStatus("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        await API.post("/users/register", {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password
        });

        setStatus("Registration successful! You can now login.");
        setFormData({ firstname: "", lastname: "", email: "", password: "", confirmPassword: "", rememberMe: false });
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || "Server error. Please try again.");
    }
  };

  return (
  <Layout>
    <div className="login-container">
      <div className="login-card">

        {/* LEFT IMAGE SECTION */}
        <div className="login-left">
          <img
            src="login.png"
            alt="Ice Cream"
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="login-right">

          <div className="login-tab-switch">
            {["Login", "Register"].map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setIsLogin(idx === 0)}
                className={(idx === 0 ? isLogin : !isLogin) ? "active-tab" : ""}
              >
                {tab}
              </button>
            ))}
          </div>

          <h2>
            {isLogin
              ? "Welcome back 🍨"
              : "Sign up to experience the most delicious!"}
          </h2>

          <form onSubmit={handleSubmit}>
            {status && (
              <p className={status.toLowerCase().includes("error") ? "server-error" : "success-message"}>
                {status}
              </p>
            )}

            {!isLogin && (
              <>
                <div className="login-input-group">
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                  {errors.firstname && <span className="error">{errors.firstname}</span>}
                </div>

                <div className="login-input-group">
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                  {errors.lastname && <span className="error">{errors.lastname}</span>}
                </div>
              </>
            )}

            <div className="login-input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="login-input-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="login-input-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <span className="error">{errors.confirmPassword}</span>
                )}
              </div>
            )}

            {isLogin && (
              <label className="remember-login">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
            )}

            <button type="submit" className="login-btn">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </Layout>
);

};

export default Login;
