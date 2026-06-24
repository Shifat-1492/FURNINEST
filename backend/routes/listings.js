const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Listing = require('../models/Listing');

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

const adminProtect = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (user && user.isAdmin) {
      req.user.isAdmin = true;
      next();
    } else {
      res.status(403).json({ error: 'Access denied: Admin only' });
    }
  } catch (err) {
    res.status(403).json({ error: 'Access denied: Admin only' });
  }
};

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Get all listings
router.get('/', async (req, res) => {
  try {
    const { category, keyword, condition, min_price, max_price, sort } = req.query;
    let query = { status: 'approved' };
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = Number(min_price);
      if (max_price) query.price.$lte = Number(max_price);
    }
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_low') sortOptions = { price: 1 };
    if (sort === 'price_high') sortOptions = { price: -1 };
    const listings = await Listing.find(query).populate('category').sort(sortOptions);
    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get recent listings (homepage)
router.get('/recent', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'approved' }).populate('category').sort({ createdAt: -1 }).limit(6);
    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get user's own listings
router.get('/my', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user.id }).populate('category').sort({ createdAt: -1 });
    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('category')
      .populate('user', 'name email phone');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // If not approved, check if requester is the owner or an admin
    if (listing.status !== 'approved') {
      let isAllowed = false;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          
          if (listing.user._id.toString() === decoded.id) {
            isAllowed = true;
          } else {
            const User = require('../models/User');
            const reqUser = await User.findById(decoded.id);
            if (reqUser && reqUser.isAdmin) {
              isAllowed = true;
            }
          }
        } catch (e) {
          // invalid token
        }
      }
      if (!isAllowed) {
        return res.status(403).json({ error: 'Access denied: Listing is pending approval' });
      }
    }

    res.json(listing);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Create listing with images
router.post('/', protect, upload.array('images', 6), async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => f.filename) : [];
    const listing = await Listing.create({
      ...req.body,
      user: req.user.id,
      images
    });
    const populated = await Listing.findById(listing._id).populate('category');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update listing
router.put('/:id', protect, upload.array('images', 6), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Not found' });
    if (listing.user.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const newImages = req.files ? req.files.map(f => f.filename) : [];
    const images = [...(listing.images || []), ...newImages];
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images },
      { new: true }
    ).populate('category');
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete listing
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Not found' });
    
    // Check if requester is owner or admin
    const User = require('../models/User');
    const reqUser = await User.findById(req.user.id);
    const isAdmin = reqUser && reqUser.isAdmin;

    if (listing.user.toString() !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Mark or unmark listing as sold (owner or admin)
router.patch('/:id/mark-sold', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const User = require('../models/User');
    const reqUser = await User.findById(req.user.id);
    const isAdmin = reqUser && reqUser.isAdmin;

    if (listing.user.toString() !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { unmark } = req.body;
    if (unmark) {
      listing.isSold = false;
      listing.soldAt = null;
    } else {
      listing.isSold = true;
      listing.soldAt = new Date();
    }

    await listing.save();
    const populated = await Listing.findById(listing._id).populate('category').populate('user', 'name email phone');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Admin: Get all listings
router.get('/admin/all', protect, adminProtect, async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('category')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Admin: Update status of a listing
router.patch('/:id/status', protect, adminProtect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('category').populate('user', 'name email phone');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
