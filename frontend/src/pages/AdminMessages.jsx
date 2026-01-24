import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/AdminMessages.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    const { data } = await API.get("/contact", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(data);
  };

  const markRead = async (id) => {
    await API.put(
      `/contact/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="admin-messages">
      <h1>Contact Messages</h1>

      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`message-card ${msg.isRead ? "read" : "unread"}`}
        >
          <h4>{msg.name}</h4>
          <p>{msg.message}</p>
          <small>{msg.email} • {msg.phone}</small>

          {!msg.isRead && (
            <button onClick={() => markRead(msg._id)}>Mark Read</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
