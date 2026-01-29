import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/OrderPlaced.css";

const OrderPlaced = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state?.orderId) {
      navigate("/");
    }
  }, [state, navigate]);

  const handleViewOrders = () => {
    navigate("/my-orders");
  };

  const handleShopMore = () => {
    navigate("/products");
  };

  if (!state?.orderId) {
    return null;
  }

  return (
    <div className="order-placed-container">
      <div className="order-placed-card">
        {/* Success Icon */}
        <div className="success-icon">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="55" fill="#4CAF50" />
            <path
              d="M40 60 L55 75 L85 45"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Content */}
        <h1>🎉 Order Placed Successfully!</h1>
        
        <div className="order-details">
          <p className="order-id-label">Order ID:</p>
          <p className="order-id-value">{state.orderId}</p>
        </div>

        <div className="message-box">
          <p>Thank you for your order!</p>
          <p>Your delicious ice creams are on their way.</p>
          <p className="shipping-info">📦 We'll deliver it to your address soon.</p>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>✅ Order has been confirmed</li>
            <li>🔄 We're preparing your order</li>
            <li>🚚 Delivery partner will contact you</li>
            <li>🏠 You'll receive your order within 2-3 business days</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="action-buttons">
          <button className="btn-primary" onClick={handleViewOrders}>
            📋 View My Orders
          </button>
          <button className="btn-secondary" onClick={handleShopMore}>
            🛒 Continue Shopping
          </button>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <p>Need help? Contact us:</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 support@cremaze.com</p>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;
