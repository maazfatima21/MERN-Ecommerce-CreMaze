const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect, admin } = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

router.post("/send", async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await Contact.create({
      name,
      email,
      phone,
      message,
    });

    try {
      await sendEmail(
        email,
        "We received your message 🍦 | CreMaze",
        `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hi ${name},</h2>
          <p>Thanks for contacting <b>CreMaze</b> 🍨</p>
          <p>We'll reply within <b>24 hours</b>.</p>
          <hr/>
          <p><b>Your message:</b><br/>"${message}"</p>
        </div>
        `
      );
    } catch (emailErr) {
      console.error("Email failed:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get("/", protect, admin, async (req, res) => {
  const messages = await Contact.find().sort({
    isRead: 1,
    createdAt: -1,
  });
  res.json(messages);
});

router.get("/unread-count", protect, admin, async (req, res) => {
  const count = await Contact.countDocuments({ isRead: false });
  res.json({ count });
});

router.put("/:id/read", protect, admin, async (req, res) => {
  const msg = await Contact.findById(req.params.id);

  if (!msg) {
    return res.status(404).json({ message: "Message not found" });
  }

  msg.isRead = true;
  await msg.save();

  res.json({ message: "Marked as read" });
});

module.exports = router;
