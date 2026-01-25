import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/AdminMessages.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("inbox"); // inbox | unread | archived

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

      setMessages((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, isRead: true } : m
        )
      );

      window.dispatchEvent(new Event("messagesUpdated"));
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  /* ---------------- ARCHIVE ---------------- */
  const archiveMessage = async (id) => {
    try {
      await API.put(
        `/contact/${id}/archive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, isArchived: true } : m
        )
      );
    } catch (err) {
      console.error("Archive failed", err);
    }
  };

  /* ---------------- RESTORE ---------------- */
  const restoreMessage = async (id) => {
    try {
      await API.put(
        `/contact/${id}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, isArchived: false } : m
        )
      );
    } catch (err) {
      console.error("Restore failed", err);
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;

    try {
      await API.delete(`/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
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
  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.isRead && !m.isArchived;
    if (filter === "archived") return m.isArchived;
    return !m.isArchived; // inbox
  });

  if (loading) return <p className="loading">Loading messages…</p>;

  return (
    <div className="admin-messages">
      <h1>📬 Contact Messages</h1>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <button
          className={filter === "inbox" ? "active" : ""}
          onClick={() => setFilter("inbox")}
        >
          Inbox
        </button>
        <button
          className={filter === "unread" ? "active" : ""}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
        <button
          className={filter === "archived" ? "active" : ""}
          onClick={() => setFilter("archived")}
        >
          Archived
        </button>
      </div>

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
            {!msg.isRead && !msg.isArchived && <span className="dot" />}
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
            {!msg.isRead && !msg.isArchived && (
              <button onClick={() => markRead(msg._id)}>
                Mark as Read
              </button>
            )}

            {!msg.isArchived && (
              <button onClick={() => archiveMessage(msg._id)}>
                Archive
              </button>
            )}

            {msg.isArchived && (
              <button onClick={() => restoreMessage(msg._id)}>
                Restore
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
