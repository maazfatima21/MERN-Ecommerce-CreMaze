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

/* ================= CREATE RAZORPAY ORDER ================= */
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: "Amount or OrderId missing" });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${orderId}`,
    };

    console.log("🧾 Creating Razorpay order:", options);

    const razorpayOrder = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", razorpayOrder.id);

    res.status(200).json({ razorpayOrder });
  } catch (error) {
    console.error("❌ Razorpay Order Error:", error.message);
    res.status(500).json({
      message: "Failed to create Razorpay order",
      error: error.message,
    });
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

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch");
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update order as paid
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        paidAt: Date.now(),
        paymentMethod: "Razorpay",
        paymentResult: {
          id: razorpay_payment_id,
          status: "SUCCESS",
          update_time: new Date().toISOString(),
        },
      },
      { new: true }
    );

    // Save payment record
    await Payment.create({
      order: orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "SUCCESS",
      amount: order.totalPrice,
    });

    console.log("✅ Payment verified and order updated");
    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("❌ Verification Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/* ================= PAYMENT FAILED ================= */
router.post("/failed", protect, async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    await Payment.create({
      razorpay_order_id,
      status: "FAILED",
    });

    console.log("❌ Payment marked as failed");
    res.status(200).json({ message: "Payment marked as failed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
