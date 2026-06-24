const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ error: 'Not authorized' });
    }
  } else {
    res.status(401).json({ error: 'No token' });
  }
};

// Send a message
router.post('/', protect, async (req, res) => {
  try {
    const { listing, receiver, body } = req.body;
    const message = await Message.create({
      listing,
      receiver,
      body,
      sender: req.user.id
    });
    const populated = await Message.findById(message._id)
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('listing', 'title');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get inbox (messages received by logged-in user)
router.get('/inbox', protect, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate('sender', 'name email')
      .populate('listing', 'title')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get messages for a specific listing (conversation thread)
router.get('/listing/:listingId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ listing: req.params.listingId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Mark message as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(message);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
