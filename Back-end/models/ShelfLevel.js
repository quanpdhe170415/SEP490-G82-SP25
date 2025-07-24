const mongoose = require('mongoose');
const Inventory = require('./inventory');
const Shelf = require('./Shelf');

const shelfLevelSchema = new mongoose.Schema({
  
  shelf_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelf',
    required: true, // Tham chiếu đến kệ
  },
 
  floor: {
    type: String,
    required: true, // Tầng của kệ (ví dụ: Tầng 1, Tầng 2)
  },
  status: {
    type: String,
    enum: ['Có hàng', 'Hết hàng'],
    required: true,
    default: 'Có hàng',
  },
}, {
  timestamps: true,
});


const ShelfLevel = mongoose.model('ShelfLevel', shelfLevelSchema);

module.exports = ShelfLevel;