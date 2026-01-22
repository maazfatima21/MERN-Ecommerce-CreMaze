import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  if (loading) return <h2 className="orders-loading">Loading orders...</h2>;

  if (error) return <p className="orders-error">{error}</p>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
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
              <tr
                key={order._id}
                className="order-row"
                onClick={() => navigate(`/order/${order._id}`)}
              >
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
  );
}

export default MyOrders;
