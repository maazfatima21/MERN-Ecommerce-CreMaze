import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "../styles/ProductPage.css";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return <p className="product-page-message">Loading...</p>;

  if (!product)
    return <p className="product-page-message">Product not found.</p>;

  return (
    <div className="product-page">
      <div className="product-page-card">
        <h2>{product.name}</h2>

        {product.image && (
          <img
            src={`http://localhost:5000/uploads/${product.image}`}
            alt={product.name}
            className="product-page-image"
          />
        )}

        <p className="product-page-price">
          Price: ₹{product.price}
        </p>

        <p className="product-page-description">
          {product.description || "No description available"}
        </p>
      </div>
    </div>
  );
}

export default ProductPage;
