const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;