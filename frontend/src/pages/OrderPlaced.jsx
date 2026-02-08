// OrderPlaced.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/OrderPlaced.css";

const CreMazeOrderPlaced = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const orderId = state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  return (
    <Layout minimal>
      <div className="cmop-page">
        <div className="cmop-card">

          {/* SUCCESS ICON */}
          <div className="cmop-success-circle">✓</div>

          <h1 className="cmop-title">Order Successful</h1>

          {/* ORDER ID */}
          <div className="cmop-order-info">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>

          <p className="cmop-thank-you">
            Thank you for choosing <strong>CreMaze</strong>
          </p>

          {/* IMAGE + MESSAGE SIDE BY SIDE */}
          <div className="cmop-content-row">
            <div className="cmop-image-wrapper">
              <img
                src="/images/OS-pg.png"
                alt="Order confirmed"
                className="cmop-order-image"
              />
            </div>

            <div className="cmop-message-wrapper">
              <p className="cmop-message-title">
                An experience worth savoring
              </p>
              <p className="cmop-message-text">
                Where indulgence meets perfection.
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="cmop-actions">
            <button
              className="cmop-primary-btn"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>

            <button
              className="cmop-secondary-btn"
              onClick={() => navigate("/my-orders")}
            >
              View My Orders
            </button>
          </div>

          {/* FOOTER NOTE */}
          <div className="cmop-footer-note">
            <p>Need help? Reach us at{" "}
              <a href="mailto:hello@cremaze.com">hello@cremaze.com</a>
            </p>
            <p>Or reach us at{" "}
              <a href="tel:+919876543210">+91 98765 43210</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreMazeOrderPlaced;
