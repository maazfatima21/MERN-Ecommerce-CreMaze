import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api/axios";
import "../styles/MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your orders.");
          setLoading(false);
          navigate("/login");
          return;
        }

        const { data } = await API.get("/orders/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your delicious orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  if (loading) return <h2 className="orders-loading">Loading your sweet treats...</h2>;
  if (error) return <p className="orders-error">{error}</p>;

  return (
    <Layout>
      <div className="orders-page">
      <div className="orders-header">
        <h1>Your Sweet Orders</h1>
        <p className="orders-subtitle">
          Check out your recent scoops and their delivery status
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet. Let’s add some flavor to your day!</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Delivery</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>

                <td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "—"}
                </td>

                <td>₹{order.totalPrice}</td>

                <td className={order.isPaid ? "paid" : "unpaid"}>
                  {order.isPaid ? "Paid" : "Pending"}
                </td>

                <td className={order.isDelivered ? "delivered" : "pending"}>
                  {order.isDelivered ? "Delivered" : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </Layout>
  );
}

export default MyOrders;
