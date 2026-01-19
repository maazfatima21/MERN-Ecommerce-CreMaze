const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact/send
router.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return res.status(200).json({ success: true, message: 'Message received!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
