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
  check_type: {
      type: String,
      enum: ['Toàn bộ', 'Theo kệ', 'Theo tầng', 'Theo sản phẩm', 'Đột xuất'],
    },
    target_items: {
      shelves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' }],
      shelf_levels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShelfLevel' }],
      inventories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }],
    },
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