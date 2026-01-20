import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

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
    <form onSubmit={handleSubmit}>
      <h2>Edit Product</h2>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="price" value={formData.price} onChange={handleChange} />
      <textarea name="description" value={formData.description} onChange={handleChange} />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditProduct;
