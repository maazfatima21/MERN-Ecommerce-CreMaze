import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      const res = await API.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>All Orders (Admin)</h2>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Delivered</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.user?.email}</td>
              <td>₹{order.totalPrice}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.isDelivered ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
