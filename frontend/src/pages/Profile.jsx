import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/Layout";
import "../styles/Profile.css";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPencilAlt, FaTimes } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
    setFormData({
      firstname: storedUser.firstname || "",
      lastname: storedUser.lastname || "",
      email: storedUser.email || "",
      phone: storedUser.phone || "",
      address: storedUser.address || "",
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.phone && !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.put("/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMessage("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>

        <div className="profile-content">
          {message && (
            <div className={`profile-message ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <div className="profile-card">
            <div className="profile-avatar">
              <FaUser />
            </div>

            {!isEditing ? (
              <div className="profile-info">
                <div className="info-group">
                  <label>Name</label>
                  <p>{user.firstname} {user.lastname}</p>
                </div>

                <div className="info-group">
                  <label>
                    <FaEnvelope /> Email
                  </label>
                  <p>{user.email}</p>
                </div>

                <div className="info-group">
                  <label>
                    <FaPhone /> Phone
                  </label>
                  <p>{user.phone || "Not provided"}</p>
                </div>

                <div className="info-group">
                  <label>
                    <FaMapMarkerAlt /> Address
                  </label>
                  <p>{user.address || "Not provided"}</p>
                </div>

                {user.isAdmin && (
                  <div className="admin-badge">
                    <span>👑 Admin User</span>
                  </div>
                )}

                <button
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <FaPencilAlt /> Edit Profile
                </button>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                  {errors.firstname && <span className="error">{errors.firstname}</span>}
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                  {errors.lastname && <span className="error">{errors.lastname}</span>}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                  />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your address"
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setIsEditing(false);
                      setErrors({});
                    }}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
