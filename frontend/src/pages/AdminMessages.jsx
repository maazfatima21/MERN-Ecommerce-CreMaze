import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {FaSearch } from "react-icons/fa";
import "../styles/AdminMessages.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("inbox");
  const [toast, setToast] = useState("");

  // 🔹 RENAMED SEARCH STATE
  const [contactSearch, setContactSearch] = useState("");

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
      console.error(err);
      setError("Failed to load messages.");
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
          res = await API.put(
            `/contact/${id}/read`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages((prev) =>
            prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
          );
          break;

        case "archive":
          res = await API.put(
            `/contact/${id}/archive`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages((prev) =>
            prev.map((m) => (m._id === id ? { ...m, isArchived: true } : m))
          );
          break;

        case "restore":
          res = await API.put(
            `/contact/${id}/restore`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages((prev) =>
            prev.map((m) => (m._id === id ? { ...m, isArchived: false } : m))
          );
          break;

        case "delete":
          if (!window.confirm("Delete this message permanently?")) return;
          res = await API.delete(`/contact/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages((prev) => prev.filter((m) => m._id !== id));
          break;

        default:
          return;
      }

      showToast(res?.data?.message || "Action successful");
    } catch (err) {
      console.error(err);
      showToast("Action failed");
    }
  };

  // ---------------- AUTO REFRESH ----------------
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 20000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- COUNTS ----------------
  const unreadCount = messages.filter(
    (m) => !m.isRead && !m.isArchived
  ).length;

  // ---------------- FILTER + CONTACT SEARCH ----------------
  const filteredMessages = messages.filter((m) => {
    if (filter === "unread" && (m.isRead || m.isArchived)) return false;
    if (filter === "archived" && !m.isArchived) return false;
    if (filter === "inbox" && m.isArchived) return false;

    const q = contactSearch.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q) ||
      m.phone?.toLowerCase().includes(q)
    );
  });

  if (loading) return <p className="loading">Loading messages...</p>;

  return (
    <div className="admin-messages-page">
      <div className="admin-messages">
      <h1>Contact Messages</h1>
    
      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-buttons">
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
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>

          <button
            className={filter === "archived" ? "active" : ""}
            onClick={() => setFilter("archived")}
          >
            Archived
          </button>
        </div>

        {/* 🔍 CONTACT SEARCH (ISOLATED) */}
        <div className="contact-search-wrapper">
          <span className="contact-search-icon"><FaSearch /></span>
          <input
            type="text"
            placeholder="Search contacts..."
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
            className="contact-search-input"
          />
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
      {error && <div className="error">{error}</div>}
      {filteredMessages.length === 0 && (
        <p className="empty">No messages found</p>
      )}

      {/* MESSAGE LIST */}
      {filteredMessages.map((msg) => (
        <div
          key={msg._id}
          className={`message-card ${msg.isRead ? "read" : "unread"}`}
        >
          <div className="message-header">
            <div>
              <h4 className="sender-name">{msg.name}</h4>
              <p className="sender-email">{msg.email}</p>
            </div>

            {!msg.isRead && !msg.isArchived && (
              <span className="status-dot" />
            )}
          </div>

          <p className="message-text">{msg.message}</p>

          <div className="message-footer">
            <span className="time">
              {new Date(msg.createdAt).toLocaleString()}
            </span>

            <div className="actions">
              {!msg.isRead && !msg.isArchived && (
                <button onClick={() => handleAction(msg._id, "read")}>
                  Mark Read
                </button>
              )}

              {!msg.isArchived && (
                <button onClick={() => handleAction(msg._id, "archive")}>
                  Archive
                </button>
              )}

              {msg.isArchived && (
                <button onClick={() => handleAction(msg._id, "restore")}>
                  Restore
                </button>
              )}

              <button
                className="danger"
                onClick={() => handleAction(msg._id, "delete")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default AdminMessages;
