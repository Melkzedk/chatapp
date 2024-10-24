const express = require('express');
const router = express.Router();

// In-memory store for messages (could be replaced with a database)
let messages = [];

// POST endpoint to send a new message
router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Message content is required' });
  }
  
  messages.push({ message });
  res.status(201).json({ message: 'Message sent', messages });
});

// GET endpoint to fetch all messages
router.get('/', (req, res) => {
  res.status(200).json(messages);
});

module.exports = router;
