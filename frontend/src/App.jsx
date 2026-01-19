import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Cart from './pages/Cart';
import ProductProvider from "./context/ProductContext";

function App() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <ProductProvider>
      <Router>
        <Navbar />

        <Routes>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          {/* ---------- ADMIN ROUTES ---------- */}
          <Route
            path="/add-product"
            element={isAdmin ? <AddProduct /> : <Navigate to="/" replace />}
          />
          <Route
            path="/edit-product/:id"
            element={isAdmin ? <EditProduct /> : <Navigate to="/" replace />}
          />
        </Routes>

        <Footer />
      </Router>
    </ProductProvider>
  );
}

export default App;
