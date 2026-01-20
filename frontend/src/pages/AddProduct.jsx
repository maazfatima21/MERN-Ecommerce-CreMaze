import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/AddProduct.css";

const sampleProducts = [
  { name: "Mango Ice Cream", price: 190, description: "Fresh mango flavour" },
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      alert("Access denied! Only admins can add products.");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await API.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setStatus("Product added successfully!");
      setFormData({ name: "", description: "", price: "" });
      setImage(null);
      setPreview(null);
    } catch (err) {
      setStatus(err.response?.data?.message || "Error adding product");
    }
  };

  const fillSample = (product) => setFormData({ ...product });

  return (
    <div className="add-product-page">
      <h2>Add Product (Admin)</h2>
      {status && <p>{status}</p>}

      <div className="sample-products">
        <h4>Sample Products:</h4>
        {sampleProducts.map((p, i) => (
          <button key={i} onClick={() => fillSample(p)}>
            {p.name || "Sample"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="add-product-form">
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="image-preview" />}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
