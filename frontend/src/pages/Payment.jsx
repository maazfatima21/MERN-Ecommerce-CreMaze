import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { cartItems, customer, address, totalPrice } = state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  /* ================= LOAD RAZORPAY SCRIPT ================= */
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ================= START PAYMENT ================= */
  const startPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        setError("Razorpay SDK failed to load");
        return;
      }

      /* ---------- CREATE ORDER IN DB ---------- */
      const orderRes = await API.post(
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
          paymentMethod: "Razorpay",
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderId = orderRes.data._id;

      /* ---------- CREATE RAZORPAY ORDER ---------- */
      const paymentRes = await API.post(
        "/payment/create-order",
        { amount: totalPrice, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpayOrder } = paymentRes.data;

      /* ---------- RAZORPAY OPTIONS ---------- */
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "CreMaze Ice Creams",
        description: "Premium Ice Cream Order",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            await API.post(
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            localStorage.removeItem("cart");
            navigate("/order-success", { state: { orderId } });
          } catch (err) {
            console.error(err);
            setError("Payment verification failed");
          }
        },

        modal: {
          ondismiss: async () => {
            await API.post(
              "/payment/failed",
              { razorpay_order_id: razorpayOrder.id },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate("/checkout");
          },
        },

        prefill: {
          name: customer.name,
          email: customer.email || "",
          contact: customer.phone,
        },

        theme: {
          color: "#5c2d91",
        },

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      setError("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Secure Payment</h2>

      <p>Total Amount: ₹{totalPrice}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={startPayment} disabled={loading}>
        {loading ? "Processing..." : "Pay with Razorpay"}
      </button>
    </div>
  );
};

export default Payment;
