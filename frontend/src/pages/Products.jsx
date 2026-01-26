import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";
import { ProductContext } from "../context/ProductContext";

const Products = () => {
  const { search } = useContext(ProductContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");
  const [toast, setToast] = useState("");
  const [deleteProduct, setDeleteProduct] = useState(null);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🛒 ADD TO CART
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((p) => p._id === product._id);

    if (exists) {
      exists.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setToast("Added to cart!");
    setTimeout(() => setToast(""), 3000);
  };

  // 🗑️ DELETE PRODUCT
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/products/${deleteProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p._id !== deleteProduct._id));
      setToast("Product Deleted Successfully!");
    } catch (err) {
      console.error(err);
      setToast("Delete failed");
    } finally {
      setDeleteProduct(null);
    }
  };

  const filteredProducts = [...products]
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "new") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>All Products</h1>

        {isAdmin && (
          <button
            className="add-product-btn"
            onClick={() => navigate("/add-product")}
          >
            + Add Product
          </button>
        )}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          <option value="">Sort</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
          <option value="new">Newest</option>
        </select>
      </div>

      {loading ? (
        <div className="products-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : filteredProducts.length ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onDeleteClick={setDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <p className="products-status">No products found</p>
      )}

      {/* GLOBAL TOAST */}
      {toast && (
        <div className="global-toast">
          {toast}
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteProduct && (
        <div className="delete-overlay" onClick={() => setDeleteProduct(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Product?</h3>
            <p>Are you sure? This cannot be undone.</p>
            <div className="delete-actions">
              <button className="delete-cancel" onClick={() => setDeleteProduct(null)}>
                Cancel
              </button>
              <button className="delete-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
