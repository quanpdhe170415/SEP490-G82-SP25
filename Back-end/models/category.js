const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryCode: { type: String, required: true, unique: true },         
  name: { type: String, required: true },                       
  description: { type: String },                                
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }, 
  level: { type: Number, default: 1 },                          
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true }, 
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;