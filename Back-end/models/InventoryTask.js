const mongoose = require('mongoose');

const inventoryTaskSchema = new mongoose.Schema({
  inventory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryCheck',
    required: true,
  },
  shelf_level_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShelfLevel',
    required: true, // Thay location_id bằng shelf_level_id
  },
  checked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  start_time: Date,
  end_time: Date,
  status: {
    type: String,
    enum: ['Chưa kiểm', 'Đang kiểm', 'Hoàn thành'],
    default: 'Chưa kiểm',
  },
  note: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('InventoryTask', inventoryTaskSchema);