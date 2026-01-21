import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", price: "", description: "" });

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) navigate("/");
  }, [navigate]);

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => setFormData(res.data));
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await API.put(`/products/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Product updated");
    navigate("/products");
  };

  return (
  <div className="edit-product-page">
    <div className="edit-product-card">
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit} className="edit-product-form">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name"/>
        <input name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        
        <div className="edit-product-actions">
          <button type="submit">Update</button>
          <button type="button" onClick={() => navigate("/products")}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
);

};

export default EditProduct;
