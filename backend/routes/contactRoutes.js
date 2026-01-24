const express = require("express");
const router = express.Router();
const Contact = require("../models/ContactMessage");
const { protect, admin } = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

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
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color:#8B4513;">Hi ${name},</h2>

          <p>Thank you for contacting <strong>CreMaze</strong> 🍨</p>

          <p>
            We've received your message and our team will get back to you
            within <strong>24 hours</strong>.
          </p>

          <hr />

          <p style="font-size:14px;color:#555;">
            <strong>Your message:</strong><br/>
            "${message}"
          </p>

          <br />

          <p>
            Warm regards,<br/>
            <strong>Team CreMaze</strong><br/>
            <span style="color:#8B4513;">Spreading sweetness everywhere 🍦</span>
          </p>
        </div>
      `
    );

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

router.get("/", protect, admin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

router.get("/unread-count", protect, admin, async (req, res) => {
  try {
    const count = await Contact.countDocuments({ isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

router.put("/:id/read", protect, admin, async (req, res) => {
  try {
    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Not found" });

    msg.isRead = true;
    await msg.save();

    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to update message" });
  }
});

module.exports = router;
