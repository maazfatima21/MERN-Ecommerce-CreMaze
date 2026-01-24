import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/AdminMessages.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  /* ---------------- FETCH MESSAGES ---------------- */
  const fetchMessages = async () => {
    try {
      const { data } = await API.get("/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data);
    } catch (err) {
      console.error("Fetch messages failed", err);
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

      // Optimistic UI update (no flicker)
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

  /* ---------------- AUTO REFRESH ---------------- */
  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 20000); // every 20 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="loading">Loading messages...</p>;

  return (
    <div className="admin-messages">
      <h1>📬 Contact Messages</h1>

      {messages.length === 0 && (
        <p className="empty">No messages yet</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`message-card ${msg.isRead ? "read" : "unread"}`}
        >
          <div className="message-header">
            <h4>{msg.name}</h4>
            {!msg.isRead && <span className="dot" />}
          </div>

          <p className="message-text">{msg.message}</p>

          <small>
            📧 {msg.email}
            {msg.phone && <> • 📞 {msg.phone}</>}
          </small>

          {!msg.isRead && (
            <button onClick={() => markRead(msg._id)}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
