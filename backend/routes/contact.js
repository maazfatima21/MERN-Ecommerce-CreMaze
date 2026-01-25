const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect, admin } = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

// -------------------- Helper --------------------
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ---------------- POST /api/contact/send ----------------
router.post("/send", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });

    const contact = await Contact.create({ name, email, phone, message });

    // Send confirmation email (non-blocking)
    try {
      await sendEmail(
        email,
        "Yum! CreMaze got your scoop 🍦",
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hi ${name},</h2>
          <p><strong>Yum! CreMaze got your scoop 🍨</strong><br/>Thanks for reaching out to us.</p>
          <p>Our team has received your message and it’s safely in our inbox.</p>
          <hr style="margin: 20px 0;" />
          <p><strong>Your message:</strong></p>
          <p style="background:#f7f7f7;padding:10px;border-radius:6px;">"${message}"</p>
          <p style="margin-top:20px;">🍦 <strong>CreMaze</strong><br/>Handcrafted happiness in every scoop</p>
        </div>
        `
      );
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }

    res.status(201).json({ success: true, message: "Yum! Your message is in 🍦" });
  } catch (error) {
    console.error("Contact send error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- GET /api/contact/unread-count ----------------
router.get("/unread-count", protect, admin, async (req, res) => {
  try {
    const count = await Contact.countDocuments({ isRead: false, isArchived: false });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- PUT /api/contact/:id/read ----------------
router.put("/:id/read", protect, admin, async (req, res) => {
  if (!validateObjectId(req.params.id)) return res.status(400).json({ message: "Invalid message ID" });

  try {
    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    msg.isRead = true;
    await msg.save();

    res.json({ success: true, message: "Marked as read" });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- PUT /api/contact/:id/archive ----------------
router.put("/:id/archive", protect, admin, async (req, res) => {
  if (!validateObjectId(req.params.id)) return res.status(400).json({ message: "Invalid message ID" });

  try {
    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    msg.isArchived = true;
    await msg.save();

    res.json({ success: true, message: "Message archived" });
  } catch (error) {
    console.error("Archive error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- PUT /api/contact/:id/restore ----------------
router.put("/:id/restore", protect, admin, async (req, res) => {
  if (!validateObjectId(req.params.id)) return res.status(400).json({ message: "Invalid message ID" });

  try {
    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    msg.isArchived = false;
    await msg.save();

    res.json({ success: true, message: "Message restored" });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE /api/contact/:id ----------------
router.delete("/:id", protect, admin, async (req, res) => {
  if (!validateObjectId(req.params.id)) return res.status(400).json({ message: "Invalid message ID" });

  try {
    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: "Message not found" });

    await Contact.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- GET /api/contact ----------------
router.get("/", protect, admin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ isRead: 1, createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
