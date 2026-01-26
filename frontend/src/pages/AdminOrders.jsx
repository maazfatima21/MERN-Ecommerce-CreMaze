import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all"); 
  const [actionLoading, setActionLoading] = useState({});
  const [confirmModal, setConfirmModal] = useState({ show: false, orderId: null });
  const [toast, setToast] = useState({ show: false, message: "", orderId: null });

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
    if (token) fetchOrders();
  }, [token]);

  /* ---------------- MARK DELIVERED ---------------- */
  const markDelivered = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await API.put(
        `/orders/${id}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Deliver failed", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  /* ---------------- CANCEL ORDER ---------------- */
  const cancelOrder = async (id) => {
    setConfirmModal({ show: true, orderId: id });
  };

  const confirmCancelOrder = async () => {
    const id = confirmModal.orderId;
    setConfirmModal({ show: false, orderId: null });

    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await API.put(
        `/orders/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      setToast({ show: true, message: "Order cancelled successfully", orderId: id });
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      setTimeout(() => {
        setToast({ show: false, message: "", orderId: null });
      }, 5000);
    } catch (err) {
      console.error("Cancel failed", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  /* ---------------- UNDO CANCEL ORDER ---------------- */
  const undoCancelOrder = async () => {
    const id = toast.orderId;
    setToast({ show: false, message: "", orderId: null });
    setActionLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await API.put(
        `/orders/${id}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Restore response:", response.data);
      fetchOrders();
      setToast({ show: true, message: "Order restored successfully", orderId: null });
      setTimeout(() => {
        setToast({ show: false, message: "", orderId: null });
      }, 3000);
    } catch (err) {
      console.error("Undo failed:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Failed to restore order";
      setToast({ show: true, message: errorMsg, orderId: null });
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  /* ---------------- PDF INVOICE ---------------- */
  const downloadInvoice = async (order) => {
  try {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let startY = 20;

    const brandBrown = [139, 69, 19];
    const lightBeige = [245, 240, 235];

    /* ---------------- LOGO ---------------- */
    try {
      const logoUrl = "/logo.png";
      const img = await fetch(logoUrl).then((res) => res.blob());
      const reader = new FileReader();

      await new Promise((resolve) => {
        reader.onload = () => {
          
          doc.addImage(reader.result, "PNG", 14, 10, 25, 12);
          resolve();
        };
        reader.readAsDataURL(img);
      });

      startY = 35;
    } catch {
      startY = 20;
    }

    /* ---------------- INVOICE HEADER ---------------- */
    doc.setFontSize(16);
    doc.setTextColor(...brandBrown);
    doc.text("Invoice", 14, startY);
    doc.setDrawColor(...brandBrown);
    doc.line(14, startY + 4, 195, startY + 4);

    doc.setFontSize(11);
    doc.setTextColor(0);

    /* ---------------- ORDER INFO ---------------- */
    doc.text(`Order ID: ${order._id}`, 14, startY + 12);
    doc.text(`Customer: ${order.user?.email || "Guest"}`, 14, startY + 20);
    doc.text(`Payment: ${order.paymentMethod}`, 14, startY + 28);
    doc.text(`Total: Rs. ${order.totalPrice}`, 14, startY + 36);

  // ---------------- SHIPPING ADDRESS ----------------
    let addressText = "Not provided";

    if (order.shippingAddress) {
      if (typeof order.shippingAddress === "string") {
        addressText = order.shippingAddress;
      } else {
        const { address, city, state, pincode } = order.shippingAddress;

        addressText = [address, city, state, pincode]
          .filter(Boolean)
          .join(", ");
      }
    }

    doc.setFontSize(11);
    doc.setTextColor(...brandBrown);
    doc.text("Shipping Address:", 14, startY + 44);

    doc.setTextColor(0);
    doc.text(addressText, 14, startY + 52);

    /* ---------------- GST & TAX ---------------- */
    const taxRate = 0.05; 
    const taxAmount = order.totalPrice * taxRate;
    const totalWithTax = order.totalPrice + taxAmount;

    doc.setTextColor(...brandBrown);
    doc.text("GST & Tax:", 140, startY + 46);
    doc.setTextColor(0);
    doc.text(`Subtotal: Rs. ${order.totalPrice}`, 140, startY + 54);
    doc.text(`GST (5%): Rs. ${taxAmount.toFixed(2)}`, 140, startY + 62);
    doc.text(`Total with GST: Rs. ${totalWithTax.toFixed(2)}`, 140, startY + 70);

    /* ---------------- ITEMS TABLE ---------------- */
    autoTable(doc, {
      startY: startY + 80,
      head: [["Product", "Quantity", "Price"]],
      body: order.orderItems.map((item) => [
        item.name || "",
        item.qty?.toString() || "1",
        `Rs. ${item.price || 0}`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: brandBrown,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [60, 60, 60],
      },
      alternateRowStyles: { fillColor: lightBeige },
      styles: { fontSize: 10, cellPadding: 6 },
    });

    /* ---------------- FOOTER ---------------- */
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "Thank you for choosing CreMaze ",
      105,
      290,
      { align: "center" }
    );

    doc.save(`invoice-${order._id.slice(-6)}.pdf`);
  } catch (error) {
    console.error("Invoice error:", error);
    setToast({ show: true, message: "Failed to generate invoice" });
    setTimeout(() => {
      setToast({ show: false, message: "", orderId: null });
    }, 4000);
  }
};

  /* ---------------- FILTERED ORDERS ---------------- */
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "pending") return !order.isDelivered && !order.isCancelled;
    if (filter === "delivered") return order.isDelivered;
    if (filter === "cancelled") return order.isCancelled;
    return true;
  });

  /* ---------------- DYNAMIC STATS ---------------- */
  const totalOrders = filteredOrders.length;
  const deliveredOrders = filteredOrders.filter((o) => o.isDelivered).length;
  const cancelledOrders = filteredOrders.filter((o) => o.isCancelled).length;
  const pendingOrders = totalOrders - deliveredOrders - cancelledOrders;

  const revenue = filteredOrders.reduce(
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

      {/* ---------------- DASHBOARD STATS  ---------------- */}
      <section className="admin-stats">
        <div onClick={() => setFilter("all")}>Total Orders: <strong>{totalOrders}</strong></div>
        <div onClick={() => setFilter("pending")}>Pending: <strong>{pendingOrders}</strong></div>
        <div onClick={() => setFilter("delivered")}>Delivered: <strong>{deliveredOrders}</strong></div>
        <div onClick={() => setFilter("cancelled")}>Cancelled: <strong>{cancelledOrders}</strong></div>
        <div>Revenue: <strong>₹{revenue}</strong></div>
      </section>

      {/* ---------------- ORDER CARDS ---------------- */}
      <section className="admin-orders-grid">
        {filteredOrders.map((order) => (
          <div key={order._id} className="admin-order-card">
            <h4>Order #{order._id.slice(-6)}</h4>
            <p><strong>User:</strong> {order.user?.email || "Guest"}</p>
            <p><strong>Items:</strong> {order.orderItems?.length || 0}</p>
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
                disabled={order.isDelivered || order.isCancelled || actionLoading[order._id]}
                onClick={() => markDelivered(order._id)}
              >
                {actionLoading[order._id] ? "Loading..." : "Deliver"}
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
                disabled={order.isDelivered || order.isCancelled || actionLoading[order._id]}
                onClick={() => cancelOrder(order._id)}
              >
                {actionLoading[order._id] ? "Loading..." : "Cancel"}
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

      {/* ---------------- CANCEL CONFIRMATION MODAL ---------------- */}
      {confirmModal.show && (
        <div
          className="admin-modal-overlay"
          onClick={() => setConfirmModal({ show: false, orderId: null })}
        >
          <div
            className="admin-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Cancel this order?</h3>
            <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="admin-confirm-actions">
              <button
                className="admin-confirm-cancel-btn"
                onClick={() => setConfirmModal({ show: false, orderId: null })}
              >
                No, Keep it
              </button>
              <button
                className="admin-confirm-delete-btn"
                onClick={confirmCancelOrder}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TOAST NOTIFICATION ---------------- */}
      {toast.show && (
        <div className="admin-toast">
          <span>{toast.message}</span>
          {toast.orderId && (
            <button
              className="admin-toast-undo-btn"
              onClick={undoCancelOrder}
            >
              Undo
            </button>
          )}
          <button
            className="admin-toast-close-btn"
            onClick={() => setToast({ show: false, message: "", orderId: null })}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
