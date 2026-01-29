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

  const handleViewOrders = () => navigate("/my-orders");
  const handleShopMore = () => navigate("/products");

  if (!state?.orderId) return null;

  return (
    <div className="op-container">
      <div className="op-card">

        {/* Logo */}
        <div className="op-logo">
          <img src={logo} alt="CreMaze Logo" />
        </div>

        {/* Success Icon */}
        <div className="op-success-icon">
          <svg
            className="op-success-svg"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <circle className="op-success-circle" cx="60" cy="60" r="55" />
            <path
              className="op-success-check"
              d="M40 60 L55 75 L85 45"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="op-title">Order Placed Successfully!</h1>

        {/* Order ID */}
        <div className="op-order-details">
          <p className="op-order-label">Order ID</p>
          <p className="op-order-value">{state.orderId}</p>
        </div>

        {/* Message */}
        <div className="op-message-box">
          <p>Thank you for shopping with CreMaze!</p>
          <p>Your order is being processed and will be delivered soon.</p>
          <p className="op-shipping-info">
            📦 Delivery within 60–90 minutes
          </p>
        </div>

        {/* Next Steps */}
        <div className="op-next-steps">
          <h3 className="op-next-title">Next Steps</h3>
          <ul className="op-steps-list">
            <li>🔄 Made fresh at our nearest CreMaze outlet</li>
            <li>📞 Delivery partner will contact you shortly</li>
            <li>❄️ Enjoy your order chilled & fresh</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="op-actions">
          <button className="op-btn op-btn-primary" onClick={handleViewOrders}>
            View My Orders
          </button>
          <button className="op-btn op-btn-secondary" onClick={handleShopMore}>
            Continue Shopping
          </button>
        </div>

        {/* Support */}
        <div className="op-support">
          <p>Need assistance?</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 hello@cremaze.com</p>
        </div>

      </div>
    </div>
  );
};

export default OrderPlaced;
