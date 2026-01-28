import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const PaymentStatus = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // state should contain:
  // { success: true, order }
  // OR
  // { success: false }

  const success = state?.success;
  const order = state?.order;

  // If user refreshes page or comes directly
  if (success === undefined) {
    navigate("/");
    return null;
  }

  return (
    <div>
      {success ? (
        <>
          <h2>🎉 Payment Successful!</h2>

          <p><strong>Order ID:</strong> {order?._id}</p>
          <p><strong>Total Paid:</strong> ₹{order?.totalPrice}</p>

          <br />

          <Link to="/myorders">View My Orders</Link>
          <br />
          <Link to="/">Continue Shopping</Link>
        </>
      ) : (
        <>
          <h2>❌ Payment Cancelled</h2>

          <p>Your payment was not completed.</p>

          <br />

          <Link to="/checkout">Retry Payment</Link>
          <br />
          <Link to="/">Go Home</Link>
        </>
      )}
    </div>
  );
};

export default PaymentStatus;
