const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '927060133228-pfokfshmct5s3nkufc4r7krqm50oknb4.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isAdmin = email === 'ahmmedshifat64649@gmail.com';
    const user = await User.create({ name, email, password: hashedPassword, isAdmin });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id, user.isAdmin)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (email === 'ahmmedshifat64649@gmail.com' && !user.isAdmin) {
        user.isAdmin = true;
        await user.save();
      }
      res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id, user.isAdmin) });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Google Login/Register
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'No credential provided' });
    }

    // Verify the token using the initialized client with our Client ID
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    const isAdmin = email === 'ahmmedshifat64649@gmail.com';

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, isAdmin });
    } else {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (isAdmin && !user.isAdmin) {
        user.isAdmin = true;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id, user.isAdmin) });
  } catch (err) {
    console.error('Google Auth Error:', err.message);
    res.status(500).json({ error: 'Google authentication failed: ' + err.message });
  }
});

module.exports = router;
