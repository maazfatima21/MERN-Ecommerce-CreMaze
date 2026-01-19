import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setFormData({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
        });

        if (res.data.image) {
          setPreview(`http://localhost:5000/uploads/${res.data.image}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Updating...");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("token");

      await API.put(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus("Product updated successfully!");
      setTimeout(() => navigate("/products"), 1000);
    } catch (err) {
      setStatus(err.response?.data?.message || "Error updating product");
    }
  };

  return (
    <div className="edit-product-page">
      <div className="edit-product-card">
        <h2>Edit Product</h2>

        {status && (
          <p
            className={`edit-status ${
              status.toLowerCase().includes("success") ? "success" : "error"
            }`}
          >
            {status}
          </p>
        )}

        <form onSubmit={handleSubmit} className="edit-product-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product Description"
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />

          <input type="file" accept="image/*" onChange={handleFileChange} />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="image-preview"
            />
          )}

          <button type="submit" className="update-btn">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
