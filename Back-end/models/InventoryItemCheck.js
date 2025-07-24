const mongoose = require('mongoose');

const inventoryItemCheckSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryTask',
    required: true,
  },
  goods_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goods',
  },
  shelf_level_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShelfLevel',
    required: true,
  },
  system_quantity: {
    type: Number,
    required: true,
  },
  actual_quantity: {
    type: Number,
  },
  is_defective: {
    type: Boolean,
    default: false,
  },
  discrepancy: {
    type: Number,
    default: 0,
  },
  note: String,
  status: {
    type: String,
    enum: ['Chưa kiểm', 'Đã kiểm'],
    default: 'Chưa kiểm',
  },
}, {
  timestamps: true,
});

// Tính lệch số lượng trước khi lưu
inventoryItemCheckSchema.pre('save', async function(next) {
  if (this.isModified('actual_quantity')) {
    this.discrepancy = this.actual_quantity - this.system_quantity;
  }
  next();
});

module.exports = mongoose.model('InventoryItemCheck', inventoryItemCheckSchema);