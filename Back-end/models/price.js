// models/Price.js
const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  importPrice: { type: Number, required: true },                
  retailPrice: { type: Number, required: true },                
  profitMargin: { type: Number },                               
  discountThreshold: { type: Number },                          
  discountPercent: { type: Number },                            
  note: { type: String }                                        
});

const Price = mongoose.model('Price', priceSchema);

module.exports = Price;
