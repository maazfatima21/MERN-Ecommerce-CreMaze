import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/AdminMessages.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("inbox");
  const [toast, setToast] = useState("");

  const token = localStorage.getItem("token");

  // ---------------- TOAST ----------------
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ---------------- FETCH MESSAGES ----------------
  const fetchMessages = async () => {
    try {
      setError("");
      const { data } = await API.get("/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data);
    } catch (err) {
      console.error("Fetch messages error:", err.response?.data || err.message);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HANDLE ACTION ----------------
  const handleAction = async (id, action) => {
    try {
      let res;
      switch (action) {
        case "read":
          res = await API.put(`/contact/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
          setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
          break;
        case "archive":
          res = await API.put(`/contact/${id}/archive`, {}, { headers: { Authorization: `Bearer ${token}` } });
          setMessages(prev => prev.map(m => m._id === id ? { ...m, isArchived: true } : m));
          break;
        case "restore":
          res = await API.put(`/contact/${id}/restore`, {}, { headers: { Authorization: `Bearer ${token}` } });
          setMessages(prev => prev.map(m => m._id === id ? { ...m, isArchived: false } : m));
          break;
        case "delete":
          if (!window.confirm("Delete this message permanently?")) return;
          res = await API.delete(`/contact/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          setMessages(prev => prev.filter(m => m._id !== id));
          break;
        default:
          return;
      }
      showToast(res?.data?.message || "Action successful");
    } catch (err) {
      console.error(`${action} error:`, err.response?.data || err.message);
      showToast(err.response?.data?.message || "Action failed");
    }
  };

  // ---------------- AUTO REFRESH ----------------
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 20000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- FILTER ----------------
  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.isRead && !m.isArchived;
    if (filter === "archived") return m.isArchived;
    return !m.isArchived;
  });

  if (loading) return <p className="loading">Loading messages…</p>;

  return (
    <div className="admin-messages">
      <h1>📬 Contact Messages</h1>

      {/* FILTER */}
      <div className="filter-bar">
        <button className={filter === "inbox" ? "active" : ""} onClick={() => setFilter("inbox")}>Inbox</button>
        <button className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>Unread</button>
        <button className={filter === "archived" ? "active" : ""} onClick={() => setFilter("archived")}>Archived</button>
      </div>

      {toast && <p className="toast">{toast}</p>}
      {error && <p className="error">{error}</p>}
      {filteredMessages.length === 0 && <p className="empty">No messages found</p>}

      {/* MESSAGES */}
      {filteredMessages.map((msg) => (
        <div key={msg._id} className={`message-card ${msg.isRead ? "read" : "unread"}`}>
          <div className="message-header">
            <h4>{msg.name}</h4>
            {!msg.isRead && !msg.isArchived && <span className="dot" />}
          </div>

          <p className="message-text">{msg.message}</p>
          <small className="meta">
            📧 {msg.email}{msg.phone && <> • 📞 {msg.phone}</>}
          </small>
          <small className="time">🕒 {new Date(msg.createdAt).toLocaleString()}</small>

          <div className="actions">
            {!msg.isRead && !msg.isArchived && <button onClick={() => handleAction(msg._id, "read")}>Mark as Read</button>}
            {!msg.isArchived && <button onClick={() => handleAction(msg._id, "archive")}>Archive</button>}
            {msg.isArchived && <button onClick={() => handleAction(msg._id, "restore")}>Restore</button>}
            <button className="danger" onClick={() => handleAction(msg._id, "delete")}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
