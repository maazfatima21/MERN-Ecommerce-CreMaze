const express = require("express");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { protect } = require("../middleware/auth");

const router = express.Router();

/* ================= PAYMENT STATUS ================= */
router.post("/status", protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "OrderId missing" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ 
      orderId: order._id,
      paymentMethod: order.paymentMethod,
      isPaid: order.isPaid,
      totalPrice: order.totalPrice
    });
  } catch (error) {
    console.error("❌ Payment Status Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
