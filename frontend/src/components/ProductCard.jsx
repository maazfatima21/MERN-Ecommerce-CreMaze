import React from "react";
import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

function ProductCard({ product, onAddToCart, onDeleteClick }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

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

        <button className="cart-btn" onClick={() => onAddToCart(product)}>
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
            onClick={() => onDeleteClick(product)}
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
