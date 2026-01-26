import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/ProductCard.css";

function ProductCard({ product, onDelete }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  // 🛒 ADD TO CART
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((item) => item._id === product._id);

    if (exists) {
      exists.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setToast({ show: true, message: "Added to cart !" });
    
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };
  // 🗑️ DELETE PRODUCT
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");

      await API.delete(`/products/${product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onDelete(product._id);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Failed to delete product" });
      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 4000);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="product-card">
      <img
        src={
          product.image
            ? `http://localhost:5000/uploads/${product.image}`
            : "/no-image.png"
        }
        alt={product.name}
        className="product-image"
      />

      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>

      <div className="card-buttons">
        <Link to={`/products/${product._id}`} className="view-btn">
          View
        </Link>

        <button className="cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      {isAdmin && (
        <div className="admin-actions">
          <Link
            to={`/edit-product/${product._id}`}
            className="edit-btn"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="delete-btn"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {toast.show && (
        <div className="product-toast">
          <span>{toast.message}</span>
          <button
            className="product-toast-close"
            onClick={() => setToast({ show: false, message: "" })}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
