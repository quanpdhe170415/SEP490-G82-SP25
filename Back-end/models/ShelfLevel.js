const mongoose = require('mongoose');
const Inventory = require('./inventory');
const Shelf = require('./Shelf');

const shelfLevelSchema = new mongoose.Schema({
  level_code: {
    type: String,
    required: true,
    unique: true, // Mã định danh tầng (ví dụ: K001-T1, K002-T2)
  },
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

// Middleware để tự động sinh level_code dựa trên shelf_id và floor
shelfLevelSchema.pre('save', async function(next) {
  if (!this.level_code) {
    const shelf = await Shelf.findById(this.shelf_id);
    if (shelf) {
      this.level_code = `${shelf.shelf_code}-T${this.floor}`;
    }
  }
  next();
});

const ShelfLevel = mongoose.model('ShelfLevel', shelfLevelSchema);

module.exports = ShelfLevel;