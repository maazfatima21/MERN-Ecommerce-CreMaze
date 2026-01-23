import React, { useEffect, useState } from "react";
import API from "../api/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    try {
      if (!token) return;

      const { data } = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  /* ---------------- MARK DELIVERED ---------------- */
  const markDelivered = async (id) => {
    try {
      await API.put(
        `/orders/${id}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Deliver failed", err);
    }
  };

  /* ---------------- CANCEL ORDER ---------------- */
  const cancelOrder = async (id) => {
    try {
      await API.put(
        `/orders/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  /* ---------------- PDF INVOICE ---------------- */
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.text("INVOICE", 14, 15);
    doc.text(`Order ID: ${order._id}`, 14, 25);
    doc.text(`Customer: ${order.user?.email || "Guest"}`, 14, 35);
    doc.text(`Total: ₹${order.totalPrice}`, 14, 45);

    doc.autoTable({
      startY: 55,
      head: [["Product", "Qty", "Price"]],
      body: order.orderItems.map((item) => [
        item.name,
        item.qty,
        `₹${item.price}`,
      ]),
    });

    doc.save(`invoice-${order._id}.pdf`);
  };

  /* ---------------- DASHBOARD STATS ---------------- */
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.isDelivered).length;
  const cancelledOrders = orders.filter(o => o.isCancelled).length;
  const pendingOrders = totalOrders - deliveredOrders - cancelledOrders;

  const revenue = orders.reduce(
    (sum, o) => (!o.isCancelled ? sum + (o.totalPrice || 0) : sum),
    0
  );

  if (loading) return <h2 className="admin-loading">Loading orders...</h2>;

  return (
    <div className="admin-orders-container">
      {/* ---------------- HEADER ---------------- */}
      <header className="admin-header">
        <h1>Order Management</h1>
        <p>View, deliver, cancel orders and generate invoices</p>
      </header>

      {/* ---------------- DASHBOARD ---------------- */}
      <section className="admin-stats">
        <div>Total Orders: <strong>{totalOrders}</strong></div>
        <div>Pending: <strong>{pendingOrders}</strong></div>
        <div>Delivered: <strong>{deliveredOrders}</strong></div>
        <div>Cancelled: <strong>{cancelledOrders}</strong></div>
        <div>Revenue: <strong>₹{revenue}</strong></div>
      </section>

      {/* ---------------- ORDER CARDS ---------------- */}
      <section className="admin-orders-grid">
        {orders.map((order) => (
          <div key={order._id} className="admin-order-card">
            <h4>Order #{order._id.slice(-6)}</h4>

            <p><strong>User:</strong> {order.user?.email || "Guest"}</p>
            <p><strong>Total:</strong> ₹{order.totalPrice}</p>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>

            <p
              className={`admin-status ${
                order.isCancelled
                  ? "admin-cancelled"
                  : order.isDelivered
                  ? "admin-delivered"
                  : "admin-pending"
              }`}
            >
              {order.isCancelled
                ? "Cancelled"
                : order.isDelivered
                ? "Delivered"
                : "Pending"}
            </p>

            <div className="admin-card-actions">
              <button
                className="admin-view-btn"
                onClick={() => setSelectedOrder(order)}
              >
                View
              </button>

              <button
                className="admin-deliver-btn"
                disabled={order.isDelivered || order.isCancelled}
                onClick={() => markDelivered(order._id)}
              >
                Deliver
              </button>

              <button
                className="admin-invoice-btn"
                disabled={order.isCancelled}
                onClick={() => downloadInvoice(order)}
              >
                Invoice
              </button>

              <button
                className="admin-cancel-btn"
                disabled={order.isDelivered || order.isCancelled}
                onClick={() => cancelOrder(order._id)}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ---------------- ORDER DETAILS MODAL ---------------- */}
      {selectedOrder && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="admin-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Order Details</h3>

            <p><strong>User:</strong> {selectedOrder.user?.email}</p>
            <p><strong>Total:</strong> ₹{selectedOrder.totalPrice}</p>
            <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>

            <h4>Items</h4>
            <ul>
              {selectedOrder.orderItems.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.qty} — ₹{item.price}
                </li>
              ))}
            </ul>

            <button
              className="admin-close-btn"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
