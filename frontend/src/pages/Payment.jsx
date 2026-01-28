import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";
import "../styles/Payment.css";

const Payment = () => {
  const location = useLocation();
  const orderData = location.state;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!orderData) {
    return (
      <div className="payment-page">
        <p>
          No order data found. <a href="/checkout">Go back to checkout</a>
        </p>
      </div>
    );
  }

  const { totalPrice, customer } = orderData;

  const handlePayment = async (method = "card") => {
    setLoading(true);
    setError("");
    try {
      // 1️⃣ Create order in backend
      const { data: order } = await API.post("/payment/create-order", {
        amount: totalPrice,
      });

      // 2️⃣ Razorpay options
      const options = {
        key: process.env.REACT_APP_PAYMENT_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "CreMaze Ice Cream",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3️⃣ Verify payment
            const verify = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verify.data.success) {
              setSuccess(true);
            } else {
              setError("Payment verification failed.");
            }
          } catch (err) {
            setError("Payment verification failed.");
          }
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: "#6a11cb" },
        method: {
          card: true,
          upi: true,
          netbanking: false,
          wallet: false,
        },
      };

      // If user clicks card, Razorpay automatically shows card input fields
      const paymentObject = new window.Razorpay(options);

      // For UPI payment, open modal
      paymentObject.open();
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h2>Secure Payment</h2>

      <div className="payment-summary">
        <span>Total Amount:</span>
        <strong>₹{totalPrice}</strong>
      </div>

      {success ? (
        <div className="payment-success">
          <h3>✅ Payment Successful!</h3>
          <p>Thank you for your order. You can stay on this page.</p>
        </div>
      ) : (
        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          <button
            className="payment-btn upi"
            onClick={() => handlePayment("upi")}
            disabled={loading}
          >
            Pay via UPI (Google Pay / PhonePe)
          </button>
          <button
            className="payment-btn card"
            onClick={() => handlePayment("card")}
            disabled={loading}
          >
            Pay via Card
          </button>

          {error && <p className="payment-error">{error}</p>}
          {loading && <p className="payment-loading">Processing...</p>}
        </div>
      )}
    </div>
  );
};

export default Payment;
