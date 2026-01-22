import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      navigate("/cart");
    }
    setCartItems(cart);
  }, [navigate]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const placeOrderHandler = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/orders",
        {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            product: item._id,
          })),
          shippingAddress: address,
          paymentMethod: "Cash On Delivery",
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("cart");
      alert("Order placed successfully 🎉");
      navigate("/products");
    } catch (err) {
      console.error(err);
      setStatus("Failed to place order");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {status && <p className="error">{status}</p>}

      <div className="checkout-box">
        <h3>Shipping Address</h3>
        <textarea
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item._id} className="checkout-item">
            <span>{item.name} × {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <h3>Total: ₹{totalPrice}</h3>

        <button  className="place-order-btn"
          disabled={cartItems.length === 0 || address.trim() === ""}
          onClick={placeOrderHandler}>
          Place Order (COD)
        </button>

      </div>
    </div>
  );
};

export default Checkout;
