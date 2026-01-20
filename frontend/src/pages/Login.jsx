import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
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
    <div className="auth-container">
      <h1>Login/Register</h1>
      <div className={`auth-box ${isLogin ? "login-mode" : "register-mode"}`}>

        <div className="tab-switch">
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

        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit}>
          {status && (
            <p className={status.toLowerCase().includes("error") ? "server-error" : "success-message"}>
              {status}
            </p>
          )}

          {!isLogin && ["firstname", "lastname"].map((field) => (
            <div className="input-group" key={field}>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field === "firstname" ? "First Name" : "Last Name"}
              />
              {errors[field] && <span className="error">{errors[field]}</span>}
            </div>
          ))}

          {["email", "password"].map((field) => (
            <div className="input-group" key={field}>
              <input
                type={field === "password" ? "password" : "email"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
              {errors[field] && <span className="error">{errors[field]}</span>}
            </div>
          ))}

          {!isLogin && (
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
          )}

          {isLogin && (
            <label className="remember-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              /> 
              Remember Me
            </label>
          )}

          <button type="submit" className={isLogin ? "login-btn" : "register-btn"}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>

      <svg
        className="wave" 
        viewBox="0 0 1400 320"
        preserveAspectRatio="none"
      >
        <path
          className="wave-path"
            d="M 0,320  L 26.7,309.3 C 53.3,299,107,277,160,250.7 C 213.3,224,267,192,320,192 C 373.3,192,427,224,480,245.3 C 533.3,267,587,277,640,256
              C 693.3,235,747,181,800,170.7 C 853.3,160,907,192,960,170.7 C 1013.3,149,1067,75,1120,90.7 C 1173.3,107,1227,213,1280,261.3
              C 1333.3,309,1387,299,1413,293.3 L 1440,288 L 1440,0 L 1413.3,0 C 1386.7,0,1333,0,1280,0 C 1226.7,0,1173,0,1120,0 C 1066.7,0,1013,0,960,0
              C 906.7,0,853,0,800,0 C 746.7,0,693,0,640,0 C 586.7,0,533,0,480,0 C 426.7,0,373,0,320,0 C 266.7,0,213,0,160,0 C 106.7,0,53,0,27,0
              L 0,0 Z" 
        />
      </svg>
        
      <img src="login-bg2.png" alt="" className="bottom-cone" />
      
      <div className="fun-facts">
        <h3>🍨 Did You Know?</h3>
          <ul>
            <li>Ice cream was first invented over 2,000 years ago.</li>
            <li>The most popular ice-cream flavor in the world is Vanilla.</li>
            <li>Such as from Cremaze, smooth texture comes from slow churning.</li>
            <li>Brain freeze happens when something cold touches the roof of your mouth!</li>
          </ul>
      </div>
      
    </div>
  );
};

export default Login;
