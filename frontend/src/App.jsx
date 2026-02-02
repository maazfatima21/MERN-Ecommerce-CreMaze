import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductManagement from "./pages/AdminProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderPlaced from "./pages/OrderPlaced";
import AdminOrders from "./pages/AdminOrders";
import AdminMessages from "./pages/AdminMessages";
import Profile from "./pages/Profile";
import ProductProvider from "./context/ProductContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import MyOrders from "./pages/MyOrders";

// Component to protect login page from logged-in users
const PublicLoginRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : <Login />;
};

function App() {
  return (
    <ProductProvider>
      <Router>
       <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Login/Signup - Redirect if already logged in */}
          <Route path="/login" element={<PublicLoginRoute />} />

          {/* ===== PROTECTED ROUTES (Requires Login) ===== */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-placed" element={<ProtectedRoute><OrderPlaced /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* ===== ADMIN ONLY ROUTES ===== */}
          <Route path="/add-product" element={<ProtectedRoute adminOnly><ProductManagement /></ProtectedRoute>} />
          <Route path="/edit-product/:id" element={<ProtectedRoute adminOnly><ProductManagement /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} />
          
        </Routes>
      </Router>
    </ProductProvider>
  );
}

export default App;
