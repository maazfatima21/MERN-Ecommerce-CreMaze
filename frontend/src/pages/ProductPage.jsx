import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api/axios";
import "../styles/ProductPage.css";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        if (isMounted) setProduct(res.data);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to load product. Please try again later.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - My Store`;
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product.countInStock === 0) return;
    console.log(`${product.name} added to cart`);
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <p className="product-page-message">{error}</p>;
  if (!product) return <p className="product-page-message">Product not found.</p>;

  return (
    <Layout>
      <div className="product-page">
        <div className="product-page-card product-page-flex">
          {/* LEFT SIDE — DETAILS */}
          <div className="product-page-details">
            <h2>{product.name}</h2>

            <p className="product-page-description">
              {product.description || "No description available"}
            </p>

            <p className="product-page-price">Price: ₹{product.price}</p>

            <p
              className={`product-page-stock ${
                product.countInStock > 0 ? "in-stock" : "out-of-stock"
              }`}
            >
              {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            {product.rating && (
              <p className="product-page-rating">
                Rating: {product.rating} / 5
              </p>
            )}

            <button
              className="product-page-button"
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
            >
              {product.countInStock > 0 ? "Add to Cart" : "Notify Me"}
            </button>
          </div>

          {/* RIGHT SIDE — IMAGE */}
          <div className="product-page-image-wrapper">
            <img
              src={
                product.image
                  ? `http://localhost:5000/uploads/${product.image}`
                  : "/placeholder.png"
              }
              alt={product.name}
              className="product-page-image"
            />
          </div>
        </div>
      </div>

    </Layout>
  );
}

export default ProductPage;
