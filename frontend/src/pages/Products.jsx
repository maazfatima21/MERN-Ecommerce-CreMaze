import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";
import { ProductContext } from "../context/ProductContext";

function Products() {
  const { search } = useContext(ProductContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // 🔄 SEARCH + SORT
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

        {/* DESKTOP SORT */}
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
          <option value="new">Newest</option>
        </select>

        {/* MOBILE FILTER BUTTON */}
        <button
          className="filter-btn"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filters
        </button>
      </div>

      {/* MOBILE FILTER DROPDOWN */}
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

      {/* 🖼 SKELETON LOADER */}
      {loading ? (
        <div className="products-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      ) : filteredProducts.length ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="products-status">No products found</p>
      )}
    </div>
  );
}

export default Products;
