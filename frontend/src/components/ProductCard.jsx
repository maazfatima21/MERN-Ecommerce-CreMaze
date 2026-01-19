import React from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/ProductCard.css";

function ProductCard({ product, onDelete }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

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
    alert("Added to cart 🛒");
  };

  // 🗑 DELETE PRODUCT (ADMIN)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/products/${product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onDelete(product._id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="product-card">
      {product.image && (
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="product-image"
        />
      )}

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
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
