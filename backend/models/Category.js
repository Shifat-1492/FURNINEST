const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true }, // Emoji or SVG string
  slug: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
