import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
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
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [confirmError, setConfirmError] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const houseRef = useRef(null);
  const streetRef = useRef(null);
  const cityRef = useRef(null);
  const pincodeRef = useRef(null);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [address, setAddress] = useState({
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [toast.show]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) navigate("/cart");
    else setCartItems(cart);
  }, [navigate]);

  useEffect(() => {
    if (confirmChecked) setConfirmError(false);
  }, [confirmChecked]);


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

  const placeOrderHandler = async () => {
    if (loading) return;

    if (!isFormValid || !confirmChecked) {
      setShowRequired(true);
      setShake(true);

      if (!confirmChecked) {
        setConfirmError(true);
      }

      scrollToFirstError();
      setTimeout(() => setShake(false), 400);
      return;
    }


    try {
      setLoading(true);
      setStatus("");

      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("Please login to place an order.");
        setLoading(false);
        return;
      }

      const orderRes = await API.post(
        "/orders",
        {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            product: item._id,
            image: item.image,
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
        navigate("/order-placed", { state: { orderId: orderRes.data._id } });
      }, 900);
    } catch (err) {
      console.error(err);
      setStatus("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Layout>
      <div className="cm-checkout-page">
        <div className="cm-checkout-header"><h1>Checkout</h1>
          <p className="cm-checkout-subtitle">Almost Yours! One Last Step.</p>
        </div>

        <div className="cm-checkout-container">

          {status && <p className="cm-error">{status}</p>}

          <div className="cm-checkout-form">
            <div className="cm-details">
              <h3>Customer Details</h3>

              <input
                ref={nameRef}
                className={showRequired && !customer.name ? "invalid" : ""}
                placeholder="Full Name *"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />

              <input
                ref={phoneRef}
                className={showRequired && !customer.phone ? "invalid" : ""}
                placeholder="Phone Number *"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />

              <input
                placeholder="Email (optional)"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
            </div>

            <div className="cm-address">
              <h3>Shipping Address</h3>

              <input
                ref={houseRef}
                className={showRequired && !address.houseNo ? "invalid" : ""}
                placeholder="House / Flat No *"
                value={address.houseNo}
                onChange={(e) => setAddress({ ...address, houseNo: e.target.value })}
              />

              <textarea
                ref={streetRef}
                className={showRequired && !address.street ? "invalid" : ""}
                placeholder="Street / Area *"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />

              <input
                placeholder="Landmark (optional)"
                value={address.landmark}
                onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
              />

              <div className="cm-row">
                <input
                  ref={cityRef}
                  className={showRequired && !address.city ? "invalid" : ""}
                  placeholder="City *"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />

                <input
                  ref={pincodeRef}
                  maxLength={6}
                  className={showRequired && !address.pincode ? "invalid" : ""}
                  placeholder="Pincode *"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                />
              </div>
            </div>

          </div>

          <div className="cm-summary">
            <div className="cm-payment">
              <h3>Payment Method</h3>
              <div className="cm-payment-card">
                <h1>💵 Cash on Delivery</h1>
                <p>Pay when your ice cream arrives</p>
              </div>
            </div>

            <div className="cm-summary-card">
              <h3>Your Order</h3>

              <div className="cm-items">
                {cartItems.map(item => (
                  <div key={item._id} className="cm-item">
                    <span>{item.name} × {item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="cm-pricing">
                <div><span>Items</span><span>₹{itemsPrice}</span></div>
                <div><span>Shipping</span><span>₹{shippingPrice}</span></div>
                <div><span>Tax</span><span>₹{taxPrice}</span></div>
              </div>

              <div className="cm-total">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>

              <label className={`cm-confirm ${confirmError ? "cm-confirm-error shake" : ""}`}>
                <input
                  type="checkbox"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                />
                I confirm my details are correct
              </label>

              <button
                className="cm-place-order"
                disabled={loading}
                onClick={placeOrderHandler}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p className="cm-edit" onClick={() => navigate("/cart")}>
                ← Back to Cart
              </p>

            </div>
          </div>

        </div>

        {toast.show && (
          <div className="cm-toast">{toast.message}</div>
        )}
      </div>
    </Layout>
  );   
};

export default Checkout;
