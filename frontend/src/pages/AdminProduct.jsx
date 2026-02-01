import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/Layout";
import "../styles/AdminProduct.css";

const AdminProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Check admin access
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      setToast({ show: true, message: "Access denied! Admins only." });
      setTimeout(() => navigate("/"), 1500);
    }
  }, [navigate]);

  // Load product data if editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchProduct = async () => {
        try {
          const res = await API.get(`/products/${id}`);
          setFormData(res.data);
          if (res.data.image) {
            setCurrentImage(`http://localhost:5000/uploads/${res.data.image}`);
          }
          setPreview(null);
          setImage(null);
        } catch (err) {
          console.error("Failed to fetch product:", err);
          setStatus("❌ Failed to load product");
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (image) data.append("image", image);

      if (isEditing) {
        // UPDATE
        await API.put(`/products/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setStatus("✅ Product updated successfully!");
      } else {
        // CREATE
        await API.post("/products", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setStatus("✅ Product added successfully!");
        setFormData({ name: "", description: "", price: "" });
        setImage(null);
        setPreview(null);
      }

      setTimeout(() => navigate("/products"), 1200);
    } catch (err) {
      setStatus(
        err.response?.data?.message ||
          `❌ Failed to ${isEditing ? "update" : "add"} product`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={`admin-product-page ${isEditing ? "edit-mode" : "add-mode"}`}>
        <div className={`admin-product-card ${isEditing ? "edit-mode" : "add-mode"}`}>
          <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
          <p className="subtitle">Admin dashboard</p>

          {status && <p className="status-msg">{status}</p>}

          <form onSubmit={handleSubmit} className="admin-product-form">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              value={formData.price}
              onChange={handleChange}
              required
            />

            {isEditing && !preview && currentImage && (
              <div className="current-image-container">
                <label>Current Image:</label>
                <img src={currentImage} alt="Current" className="current-image" />
              </div>
            )}

            {preview && (
              <img src={preview} alt="Preview" className="image-preview" />
            )}

            {!isEditing && (
              <>
                <label htmlFor="image-upload" className="file-label">
                    {image ? image.name : "Choose Image"}
                </label>

                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </>
            )}

            {isEditing && (
              <>
                <label htmlFor="image-upload-edit" className="file-label">
                    {image ? image.name : currentImage ? "Change Image" : "Add Image"}
                </label>

                <input
                  id="image-upload-edit"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </>
            )}

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {toast.show && (
          <div className="admin-product-toast">
            <span>{toast.message}</span>
            <button
              className="admin-product-toast-close"
              onClick={() => setToast({ show: false, message: "" })}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminProduct;
