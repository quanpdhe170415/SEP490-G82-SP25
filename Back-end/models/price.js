const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  importPrice: { type: Number, required: true },                // Giá nhập
  retailPrice: { type: Number, required: true },                // Giá bán lẻ
  profitMargin: { type: Number },                               // (Giá bán lẻ - Giá nhập)/ Giá nhập*100
  note: { type: String }                                        
});

const Price = mongoose.model('Price', priceSchema);

module.exports = Price;