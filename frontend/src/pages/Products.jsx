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
  const [showFilter, setShowFilter] = useState(false);

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

  const handleDelete = (id) => setProducts(products.filter((p) => p._id !== id));

  const filteredProducts = [...products]
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
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
          <button className="add-product-btn" onClick={() => navigate("/admin/add-product")}>
            + Add Product
          </button>
        )}

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
          <option value="">Sort</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
          <option value="new">Newest</option>
        </select>

        <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>Filters</button>
      </div>

      {showFilter && (
        <div className="mobile-filter">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
            <option value="new">Newest</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="products-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : filteredProducts.length ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <p className="products-status">No products found</p>
      )}
    </div>
  );
};

export default Products;
