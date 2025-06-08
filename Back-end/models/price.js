const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  importPrice: { type: Number, required: true },                
  retailPrice: { type: Number, required: true },               
  profitMargin: { type: Number },                     // (Giá bán lẻ - Giá nhập)/ Giá nhập*100
  note: { type: String },
  isActive: { type: Boolean, default: true },                                         
});

const Price = mongoose.model('Price', priceSchema);

module.exports = Price;