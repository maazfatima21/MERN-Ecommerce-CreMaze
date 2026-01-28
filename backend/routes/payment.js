const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { protect } = require("../middleware/auth");

const router = express.Router();

/* ================= RAZORPAY INSTANCE ================= */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= CREATE PAYMENT ORDER ================= */
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: "Amount and Order ID required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const options = {
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: `cremaze_${orderId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save payment record (CREATED)
    await Payment.create({
      user: req.user._id,
      order: order._id,
      razorpay_order_id: razorpayOrder.id,
      amount: order.totalPrice,
      currency: "INR",
      status: "created",
    });

    res.status(201).json({
      success: true,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

/* ================= VERIFY PAYMENT ================= */
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    /* ===== Update Order ===== */
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = "Razorpay";
    order.paymentResult = {
      id: razorpay_payment_id,
      status: "SUCCESS",
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    await order.save();

    /* ===== Update Payment ===== */
    await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "paid",
      }
    );

    res.json({
      success: true,
      message: "Payment verified & order placed successfully",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

/* ================= PAYMENT FAILED / CANCELLED ================= */
router.post("/failed", protect, async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    await Payment.findOneAndUpdate(
      { razorpay_order_id },
      { status: "failed" }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed payment update error" });
  }
});

module.exports = router;
