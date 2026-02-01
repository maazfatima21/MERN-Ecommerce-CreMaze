import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";
import { FaSearch } from "react-icons/fa";
import "../styles/AdminMessages.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("inbox");
  const [toast, setToast] = useState("");
  const [toastUndo, setToastUndo] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState([]);
  const [deletedBackup, setDeletedBackup] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [contactSearch, setContactSearch] = useState("");

  const token = localStorage.getItem("token");

  // ---------------- TOAST ----------------
  const showToast = (msg, undoData = null) => {
    setToast(msg);
    setToastUndo(undoData);
    setTimeout(() => {
      setToast("");
      setToastUndo(null);
    }, 4000);
  };

  // ---------------- ESC KEY ----------------
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        setShowDeleteModal(false);
        setToast("");
        setToastUndo(null);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  // ---------------- FETCH ----------------
  const fetchMessages = async () => {
    try {
      const { data } = await API.get("/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data);
    } catch {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const i = setInterval(fetchMessages, 20000);
    return () => clearInterval(i);
  }, []);

  // ---------------- ACTIONS ----------------
  const handleAction = async (id, action) => {
    try {
      switch (action) {
        case "read":
          await API.put(`/contact/${id}/read`, {}, auth());
          setMessages(p =>
            p.map(m => (m._id === id ? { ...m, isRead: true } : m))
          );
          break;

        case "archive":
          await API.put(`/contact/${id}/archive`, {}, auth());
          setMessages(p =>
            p.map(m => (m._id === id ? { ...m, isArchived: true } : m))
          );
          break;

        case "restore":
          await API.put(`/contact/${id}/restore`, {}, auth());
          setMessages(p =>
            p.map(m => (m._id === id ? { ...m, isArchived: false } : m))
          );
          break;

        case "delete":
          setDeleteTarget([id]);
          setShowDeleteModal(true);
          return;

        default:
          return;
      }

      showToast("Action successful");
    } catch {
      showToast("Action failed");
    }
  };

  const auth = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // ---------------- CONFIRM DELETE ----------------
  const confirmDelete = async () => {
    const targets = deleteTarget;
    const backup = messages.filter(m => targets.includes(m._id));

    setDeletedBackup(backup);

    setMessages(prev =>
      prev.map(m =>
        targets.includes(m._id) ? { ...m, deleting: true } : m
      )
    );

    setTimeout(async () => {
      for (let id of targets) {
        await API.delete(`/contact/${id}`, auth());
      }
      setMessages(prev => prev.filter(m => !targets.includes(m._id)));
      showToast("Message deleted", backup);
    }, 300);

    setSelectedIds([]);
    setShowDeleteModal(false);
  };

  // ---------------- UNDO ----------------
  const undoDelete = () => {
    setMessages(prev => [...deletedBackup, ...prev]);
    setDeletedBackup([]);
    setToast("");
  };

  // ---------------- FILTER ----------------
  const unreadCount = messages.filter(m => !m.isRead && !m.isArchived).length;

  const filteredMessages = messages.filter(m => {
    if (filter === "unread" && (m.isRead || m.isArchived)) return false;
    if (filter === "archived" && !m.isArchived) return false;
    if (filter === "inbox" && m.isArchived) return false;

    const q = contactSearch.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  if (loading) return <p className="loading">Loading messages...</p>;

  return (
    <Layout>
    <div className="admin-messages-page">
      <div className="admin-messages">
        <h1>Contact Messages</h1>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <div className="filter-buttons">
            <button className={filter === "inbox" ? "active" : ""} onClick={() => setFilter("inbox")}>
              Inbox
            </button>

            <button className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>
              Unread {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            <button className={filter === "archived" ? "active" : ""} onClick={() => setFilter("archived")}>
              Archived
            </button>
          </div>

          <div className="contact-search-wrapper">
            <span className="contact-search-icon"><FaSearch /></span>
            <input
              className="contact-search-input"
              placeholder="Search contacts..."
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
            />
          </div>
        </div>

        {/* BULK DELETE */}
        {selectedIds.length > 0 && (
          <button
            className="bulk-delete"
            onClick={() => {
              setDeleteTarget(selectedIds);
              setShowDeleteModal(true);
            }}
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}

        {/* MESSAGE LIST */}
        {filteredMessages.map(msg => (
          <div
            key={msg._id}
            className={`message-card ${msg.isRead ? "read" : "unread"} ${msg.deleting ? "deleting" : ""}`}
          >
            {/* Checkbox — does NOT affect layout */}
            <input
              type="checkbox"
              className="bulk-checkbox"
              checked={selectedIds.includes(msg._id)}
              onChange={(e) =>
                setSelectedIds(p =>
                  e.target.checked
                    ? [...p, msg._id]
                    : p.filter(id => id !== msg._id)
                )
              }
            />

            {/* ORIGINAL STRUCTURE PRESERVED */}
            <div className="message-header">
              <div>
                <h4 className="sender-name">{msg.name}</h4>
                <p className="sender-email">{msg.email}</p>
              </div>

              {!msg.isRead && !msg.isArchived && <span className="status-dot" />}
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

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h3>Confirm Delete</h3>
            <p>This action cannot be undone.</p>
            <div className="admin-modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          {toast}
          {toastUndo && <button onClick={undoDelete}>Undo</button>}
        </div>
      )}
    </div>
  </Layout>
  );
};

export default AdminMessages;
