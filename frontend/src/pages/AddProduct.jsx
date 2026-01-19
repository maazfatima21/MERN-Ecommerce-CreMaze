import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AddProduct.css";

const sampleProducts = [
  { name: "", 
    price: "", 
    description: ""
   },
  
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      alert("Access denied! Only admins can add products.");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      await axios.post("/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus("Product added successfully!");
      setFormData({ name: "", description: "", price: "" });
      setImage(null);
      setPreview(null);
    } catch (err) {
      setStatus(err.response?.data?.message || "Error adding product");
    }
  };

  const fillSample = (product) => {
    setFormData({ name: product.name, description: product.description, price: product.price });
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>Add Product (Admin)</h2>
      {status && <p>{status}</p>}

      <div style={{ marginBottom: "20px" }}>
        <h4>Sample Products:</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {sampleProducts.map((p, i) => (
            <button key={i} onClick={() => fillSample(p)} style={{ padding: "5px 10px", cursor: "pointer" }}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
