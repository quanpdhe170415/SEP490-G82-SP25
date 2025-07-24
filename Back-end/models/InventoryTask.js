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
    required: function() { return this.check_type === 'Theo tầng' || this.check_type === 'Toàn bộ'; }
  },
  check_type: {
    type: String,
    enum: ['Toàn bộ', 'Theo kệ', 'Theo tầng', 'Theo sản phẩm', 'Đột xuất'],
    required: true,
  },
  target_items: {
    shelf: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' }, // Cho 'Theo kệ'
    shelf_level: { type: mongoose.Schema.Types.ObjectId, ref: 'ShelfLevel' }, // Cho 'Theo tầng'
    goods: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }, // Cho 'Theo sản phẩm'
  },
  status: {
    type: String,
    enum: ['Chưa kiểm', 'Đang kiểm', 'Hoàn thành'],
    default: 'Chưa kiểm',
  },
  note: String,
  inventoryItemChecks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItemCheck',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('InventoryTask', inventoryTaskSchema);