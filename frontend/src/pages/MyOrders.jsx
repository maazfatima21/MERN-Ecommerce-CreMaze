import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api/axios";
import "../styles/MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(data);
      } catch (err) {
        setError("Unable to load your orders right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleReorder = (order) => {
    localStorage.setItem("reorderItems", JSON.stringify(order.orderItems));
    navigate("/cart");
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <Layout>
      <div className="orders-page">
        {/* HERO */}
        <div className="orders-hero">
          <span className="orders-tag">Your CreMaze Journey</span>
          <h1>Order History</h1>
          <p>
            A thoughtfully curated record of every flavor, moment, and
            indulgence you’ve shared with us.
          </p>
        </div>

        {loading && <p className="orders-loading">Loading your orders…</p>}
        {error && <p className="orders-error">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <h3>No orders yet</h3>
            <p>Your first scoop is waiting.</p>
            <button onClick={() => navigate("/products")}>
              Explore Flavors
            </button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-row">
                
                {/* LEFT — PRODUCT IMAGES */}
                <div className="order-row-image">
                  {order.orderItems.slice(0, 2).map((item, i) => (
                    item.image && (
                      <img
                        key={i}
                        src={item.image}
                        alt={item.name}
                      />
                    )
                  ))}

                  {order.orderItems.length > 2 && (
                    <span className="more-items">
                      +{order.orderItems.length - 2}
                    </span>
                  )}
                </div>

                {/* CENTER — PRODUCT INFO */}
                <div className="order-row-info">
                  <h3>
                    {order.orderItems[0]?.name}
                    {order.orderItems.length > 1 &&
                      ` & ${order.orderItems.length - 1} more`}
                  </h3>

                  <span className="order-meta">
                    ORDER #{order._id.slice(-8).toUpperCase()} ·{" "}
                    {formatDate(order.createdAt)}
                  </span>

                  <button
                    className="view-details"
                    aria-label="View order details"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>

                {/* RIGHT — STATUS & ACTIONS */}
                <div className="order-row-status">
                  <span
                    className={`delivery-status ${
                      order.isDelivered ? "delivered" : "progress"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "In Progress"}
                  </span>

                  <span className="order-total">
                    Total Paid: ₹{order.totalPrice}
                  </span>

                  <div className="order-actions">
                    <button
                      className="reorder-btn"
                      aria-label="Reorder items"
                      onClick={() => handleReorder(order)}
                    >
                      Reorder
                    </button>

                    <button
                      className="help-btn"
                      aria-label="Get help with order"
                      onClick={() => setShowHelp(true)}
                    >
                      Help
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Order Details</h3>

              <div className="modal-items">
                {selectedOrder.orderItems.map((item, i) => (
                  <div key={i} className="modal-item">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="modal-item-image"
                      />
                    )}

                    <div className="modal-item-info">
                      <h4>{item.name}</h4>
                      <span>Qty: {item.qty}</span>
                      <span>₹{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="modal-total">
                Total Paid: ₹{selectedOrder.totalPrice}
              </p>

              <button onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* HELP MODAL */}
        {showHelp && (
          <div
            className="modal-overlay"
            onClick={() => setShowHelp(false)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Need Help?</h3>
              <p>
                Reach us anytime at{" "}
                <strong>hello@cremaze.com</strong>
              </p>
              <strong>or</strong>
              <p>
                Connect us at{" "}
                <strong>98765 43210</strong>
              </p>
              <button onClick={() => setShowHelp(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MyOrders;
