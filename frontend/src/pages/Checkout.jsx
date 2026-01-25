import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  /* ---------- CUSTOMER DETAILS ---------- */
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  /* ---------- SHIPPING ADDRESS ---------- */
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  /* ---------- LOAD CART ---------- */
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }
    setCartItems(cart);
  }, [navigate]);

  /* ---------- PRICE CALCULATION ---------- */
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  /* ---------- PLACE ORDER ---------- */
  const placeOrderHandler = async () => {
    if (
      !customer.name ||
      !customer.phone ||
      !address.street ||
      !address.city ||
      !address.pincode
    ) {
      setStatus("Please fill all required fields.");
      return;
    }

    if (paymentMethod === "ONLINE") {
      navigate("/payment", {
        state: {
          cartItems,
          customer,
          address,
          totalPrice,
        },
      });
      return;
    }

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
          customerDetails: customer,
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
      navigate("/myorders");
    } catch (err) {
      console.error(err);
      setStatus("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Secure Checkout</h2>
      <div className="checkout-card">

      {status && <p className="error">{status}</p>}

      {/* ---------- CUSTOMER DETAILS ---------- */}
      <div className="checkout-section">
        <h3>Customer Information</h3>

        <input
          type="text"
          placeholder="Full Name"
          value={customer.name}
          onChange={(e) =>
            setCustomer({ ...customer, name: e.target.value })
          }
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={customer.phone}
          onChange={(e) =>
            setCustomer({ ...customer, phone: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email (optional)"
          value={customer.email}
          onChange={(e) =>
            setCustomer({ ...customer, email: e.target.value })
          }
        />
      </div>

      {/* ---------- SHIPPING ADDRESS ---------- */}
      <div className="checkout-section">
        <h3>Shipping Address</h3>

        <textarea
          placeholder="Street Address"
          value={address.street}
          onChange={(e) =>
            setAddress({ ...address, street: e.target.value })
          }
        />

        <div className="two-col">
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) =>
              setAddress({ ...address, state: e.target.value })
            }
          />
        </div>

        <div className="two-col">
          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) =>
              setAddress({ ...address, pincode: e.target.value })
            }
          />
          <input type="text" value="India" disabled />
        </div>
      </div>

      {/* ---------- PAYMENT ---------- */}
      <div className="checkout-section">
        <h3>Payment Method</h3>

        <div className="payment-options">
          <label>
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash On Delivery
          </label>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Online Payment
          </label>
        </div>
      </div>


      {/* ---------- ORDER SUMMARY ---------- */}
      <div className="checkout-section summary">
        <h3>Order Summary</h3>

        {cartItems.map((item) => (
          <div key={item._id} className="summary-row">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <div className="summary-total">
          <p>Items: ₹{itemsPrice}</p>
          <p>Shipping: ₹{shippingPrice}</p>
          <p>Tax: ₹{taxPrice}</p>
          <h3>Total: ₹{totalPrice}</h3>
        </div>
      </div>

      {/* ---------- PLACE ORDER ---------- */}
      <button
        className="place-order-btn"
        disabled={loading}
        onClick={placeOrderHandler}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
    </div>
  );
};

export default Checkout;
