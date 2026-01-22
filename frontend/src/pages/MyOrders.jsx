import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/orders/myorders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchMyOrders();
}, []);


  if (loading) return <h2>Loading orders...</h2>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>{order.createdAt?.substring(0, 10)}</td>
                <td>₹{order.totalPrice}</td>
                <td>{order.isPaid ? "Yes" : "No"}</td>
                <td>{order.isDelivered ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyOrders;
