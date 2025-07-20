const mongoose = require('mongoose');

const inventoryItemCheckSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryTask',
    required: true
  },
  goods_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goods',
    required: true
  },
  system_quantity: {
    type: Number,
    required: true
  },
  actual_quantity: {
    type: Number
  },
  discrepancy: {
    type: Number
  },
  is_defective: {
    type: Boolean,
    default: false
  },
  note: String,
  status: {
    type: String,
    enum: ['Chưa kiểm', 'Đã kiểm'],
    default: 'Chưa kiểm'
  }
}, {
  timestamps: true
});

// Tính lệch số lượng trước khi lưu
inventoryItemCheckSchema.pre('save', function(next) {
  if (this.actual_quantity !== undefined && this.system_quantity !== undefined) {
    this.discrepancy = this.actual_quantity - this.system_quantity;
  }
  next();
});

module.exports = mongoose.model('InventoryItemCheck', inventoryItemCheckSchema);

