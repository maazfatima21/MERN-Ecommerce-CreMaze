import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Checkout = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/orders",
        { products: cart, total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("cart");
      setStatus("Order placed successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to place order. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Checkout</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item._id}>
                {item.name} × {item.qty} = ₹{item.price * item.qty}
              </li>
            ))}
          </ul>

          <h3>Total: ₹{total}</h3>
          <button onClick={handleCheckout}>Place Order</button>
        </>
      )}

      {status && <p>{status}</p>}
    </div>
  );
};

export default Checkout;
