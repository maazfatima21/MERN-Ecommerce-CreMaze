import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showRequired, setShowRequired] = useState(false);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  /* ---------- REFS FOR AUTO SCROLL ---------- */
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const houseRef = useRef(null);
  const streetRef = useRef(null);
  const cityRef = useRef(null);
  const pincodeRef = useRef(null);

  /* ---------- CUSTOMER ---------- */
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  /* ---------- ADDRESS ---------- */
  const [address, setAddress] = useState({
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  /* ---------- LOAD CART ---------- */
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) navigate("/cart");
    else setCartItems(cart);
  }, [navigate]);

  /* ---------- PRICE ---------- */
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const isFormValid =
    customer.name.trim() &&
    customer.phone.trim() &&
    address.houseNo.trim() &&
    address.street.trim() &&
    address.city.trim() &&
    address.pincode.trim();

  /* ---------- SCROLL TO FIRST ERROR ---------- */
  const scrollToFirstError = () => {
    const fields = [
      { value: customer.name, ref: nameRef },
      { value: customer.phone, ref: phoneRef },
      { value: address.houseNo, ref: houseRef },
      { value: address.street, ref: streetRef },
      { value: address.city, ref: cityRef },
      { value: address.pincode, ref: pincodeRef },
    ];

    const firstInvalid = fields.find((f) => !f.value.trim());
    if (firstInvalid?.ref?.current) {
      firstInvalid.ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      firstInvalid.ref.current.focus();
    }
  };

  /* ---------- PLACE ORDER ---------- */
  const placeOrderHandler = async () => {
    if (!isFormValid) {
      setShowRequired(true);
      setShake(true);
      scrollToFirstError();
      setTimeout(() => setShake(false), 400);
      return;
    }

    if (paymentMethod === "ONLINE") {
      navigate("/payment", {
        state: { cartItems, customer, address, totalPrice },
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("cart");
      setToast({ show: true, message: "Order placed successfully 🎉" });
      
      setTimeout(() => {
        navigate("/myorders");
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className={`checkout-card ${shake ? "shake" : ""}`}>
        {status && <p className="error">{status}</p>}

        {/* ---------- CUSTOMER ---------- */}
        <div className="checkout-section">
          <h3>Customer Information</h3>

          <input
            ref={nameRef}
            type="text"
            className={showRequired && !customer.name ? "invalid" : ""}
            placeholder={`Full Name${showRequired && !customer.name ? " *" : ""}`}
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />

          <input
            ref={phoneRef}
            type="tel"
            className={showRequired && !customer.phone ? "invalid" : ""}
            placeholder={`Phone Number${
              showRequired && !customer.phone ? " *" : ""
            }`}
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

        {/* ---------- ADDRESS ---------- */}
        <div className="checkout-section">
          <h3>Shipping Address</h3>

          <input
            ref={houseRef}
            type="text"
            className={showRequired && !address.houseNo ? "invalid" : ""}
            placeholder={`House / Flat No.${
              showRequired && !address.houseNo ? " *" : ""
            }`}
            value={address.houseNo}
            onChange={(e) =>
              setAddress({ ...address, houseNo: e.target.value })
            }
          />

          <textarea
            ref={streetRef}
            className={showRequired && !address.street ? "invalid" : ""}
            placeholder={`Street / Area${
              showRequired && !address.street ? " *" : ""
            }`}
            value={address.street}
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Landmark (optional)"
            value={address.landmark}
            onChange={(e) =>
              setAddress({ ...address, landmark: e.target.value })
            }
          />

          <div className="two-col">
            <input
              ref={cityRef}
              type="text"
              className={showRequired && !address.city ? "invalid" : ""}
              placeholder={`City${showRequired && !address.city ? " *" : ""}`}
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />

            <input
              ref={pincodeRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              className={showRequired && !address.pincode ? "invalid" : ""}
              placeholder={`Pincode${
                showRequired && !address.pincode ? " *" : ""
              }`}
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />
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

        {/* ---------- SUMMARY ---------- */}
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

        {/* ---------- BUTTON ---------- */}
        <div className="place-order-wrapper">
          <button
            className="place-order-btn"
            disabled={loading}
            onClick={placeOrderHandler}
          >
            {loading
              ? "Processing..."
              : paymentMethod === "ONLINE"
              ? "Pay Securely"
              : "Place Order"}
          </button>

        </div>
      </div>

      {toast.show && (
        <div className="checkout-toast">
          <span>{toast.message}</span>
          <button
            className="checkout-toast-close"
            onClick={() => setToast({ show: false, message: "" })}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
