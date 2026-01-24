const express = require("express");
const router = express.Router();
const Contact = require("../models/ContactMessage");
const { protect, admin } = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

/* ---------------- SEND CONTACT MESSAGE ---------------- */
router.post("/send", async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    await Contact.create({
      name,
      email,
      message,
      phone,
    });

    await sendEmail(
      email,
      "We received your message 🍦 | CreMaze",
      `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color:#8B4513;">Hi ${name},</h2>
          <p>Thanks for contacting <strong>CreMaze</strong> 🍨</p>
          <p>We'll reply within <strong>24 hours</strong>.</p>
          <hr/>
          <p><strong>Your message:</strong><br/>"${message}"</p>
        </div>
      `
    );

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* ---------------- ADMIN: ALL MESSAGES ---------------- */
router.get("/", protect, admin, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

/* ---------------- ADMIN: UNREAD COUNT ---------------- */
router.get("/unread-count", protect, admin, async (req, res) => {
  const count = await Contact.countDocuments({ isRead: false });
  res.json({ count });
});

/* ---------------- ADMIN: MARK AS READ ---------------- */
router.put("/:id/read", protect, admin, async (req, res) => {
  const msg = await Contact.findById(req.params.id);
  msg.isRead = true;
  await msg.save();
  res.json(msg);
});

module.exports = router; 
