import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD CART + ADDRESS ---------- */
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      navigate("/cart");
      return;
    }

    setCartItems(cart);

    const savedAddress = localStorage.getItem("address");
    if (savedAddress) setAddress(savedAddress);
  }, [navigate]);

  /* ---------- SAVE ADDRESS ---------- */
  useEffect(() => {
    localStorage.setItem("address", address);
  }, [address]);

  /* ---------- PRICE CALCULATIONS ---------- */
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  /* ---------- PLACE ORDER ---------- */
  const placeOrderHandler = async () => {
    if (address.trim().length < 10) {
      setStatus("Please enter a valid delivery address.");
      return;
    }

    /* ---------- ONLINE PAYMENT ---------- */
    if (paymentMethod === "ONLINE") {
      navigate("/payment", {
        state: {
          cartItems,
          address,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
      });
      return;
    }

    /* ---------- CASH ON DELIVERY ---------- */
    try {
      setLoading(true);
      setStatus("");

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
          taxPrice,
          shippingPrice,
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
      navigate("/");
    } catch (err) {
      console.error(err);
      setStatus("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {status && <p className="error">{status}</p>}

      <div className="checkout-box">
        {/* ---------- ADDRESS ---------- */}
        <h3>Shipping Address</h3>
        <textarea
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* ---------- PAYMENT METHOD ---------- */}
        <h3>Payment Method</h3>
        <div className="payment-method">
          <label>
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash On Delivery
          </label>

          <label>
            <input
              type="radio"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Online Payment
          </label>
        </div>

        {/* ---------- ORDER SUMMARY ---------- */}
        <h3>Order Summary</h3>

        {cartItems.map((item) => (
          <div key={item._id} className="checkout-item">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <div className="price-box">
          <p>Items: ₹{itemsPrice}</p>
          <p>Shipping: ₹{shippingPrice}</p>
          <p>Tax (5%): ₹{taxPrice}</p>
          <h3>Grand Total: ₹{totalPrice}</h3>
        </div>

        {/* ---------- PLACE ORDER ---------- */}
        <div class="parent-container">
        <button
          className="place-order-btn"
          disabled={loading || cartItems.length === 0 || address.trim() === ""}
          onClick={placeOrderHandler}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


