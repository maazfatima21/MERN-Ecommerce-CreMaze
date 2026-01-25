import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/AdminMessages.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUnread, setShowUnread] = useState(false);

  const token = localStorage.getItem("token");

  /* ---------------- FETCH MESSAGES ---------------- */
  const fetchMessages = async () => {
    try {
      setError("");
      const { data } = await API.get("/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data);
    } catch (err) {
      console.error("Fetch messages failed", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MARK AS READ ---------------- */
  const markRead = async (id) => {
    try {
      await API.put(
        `/contact/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistic UI update
      setMessages((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, isRead: true } : m
        )
      );

      // Update navbar badge
      window.dispatchEvent(new Event("messagesUpdated"));
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  /* ---------------- DELETE MESSAGE ---------------- */
  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;

    try {
      await API.delete(`/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete message");
    }
  };

  /* ---------------- AUTO REFRESH ---------------- */
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 20000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredMessages = showUnread
    ? messages.filter((m) => !m.isRead)
    : messages;

  if (loading) return <p className="loading">Loading messages...</p>;

  return (
    <div className="admin-messages">
      <h1>📬 Contact Messages</h1>

      <button
        className="filter-btn"
        onClick={() => setShowUnread(!showUnread)}
      >
        {showUnread ? "Show All" : "Show Unread"}
      </button>

      {error && <p className="error">{error}</p>}

      {filteredMessages.length === 0 && (
        <p className="empty">No messages found</p>
      )}

      {filteredMessages.map((msg) => (
        <div
          key={msg._id}
          className={`message-card ${msg.isRead ? "read" : "unread"}`}
        >
          <div className="message-header">
            <h4>{msg.name}</h4>
            {!msg.isRead && <span className="dot" />}
          </div>

          <p className="message-text">{msg.message}</p>

          <small className="meta">
            📧 {msg.email}
            {msg.phone && <> • 📞 {msg.phone}</>}
          </small>

          <small className="time">
            🕒 {new Date(msg.createdAt).toLocaleString()}
          </small>

          <div className="actions">
            {!msg.isRead && (
              <button onClick={() => markRead(msg._id)}>
                Mark as Read
              </button>
            )}

            <button
              className="danger"
              onClick={() => deleteMessage(msg._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
