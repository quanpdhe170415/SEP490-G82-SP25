const mongoose = require('mongoose');

const billDetailSchema = new mongoose.Schema({
  bill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true,
  },
  goods_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goods',
    required: true,
  },
  goods_name: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Tự động tính total_amount và cập nhật updatedAt trước khi lưu
billDetailSchema.pre('save', function(next) {
  this.total_amount = this.quantity * this.unit_price;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BillDetail', billDetailSchema);