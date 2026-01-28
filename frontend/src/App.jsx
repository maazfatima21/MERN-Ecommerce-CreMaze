import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
// import PaymentPage from "./pages/PaymentPage";
import AdminOrders from "./pages/AdminOrders";
import AdminMessages from "./pages/AdminMessages";
import ProductProvider from "./context/ProductContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import EditProduct from "./pages/EditProduct";
import MyOrders from "./pages/MyOrders";


function App() {
  return (
    <ProductProvider>
      <Router>
        <Navbar />
       
       <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />        
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductPage />} />

          {/* Protected */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          {/* <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} /> */}
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/add-product" element={<ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>} />
          <Route path="/edit-product/:id" element={<ProtectedRoute adminOnly><EditProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>}/>
          
        </Routes>

        <Footer />
      </Router>
    </ProductProvider>
  );
}

export default App;
