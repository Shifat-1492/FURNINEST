const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  condition: { type: String, enum: ['new', 'used'], required: true },
  location: { type: String, required: true },
  dimensions: { type: String, default: null },
  material: { type: String, default: null },
  images: [{ type: String }], // Array of image URLs/paths
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isSold: { type: Boolean, default: false },
  soldAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);
