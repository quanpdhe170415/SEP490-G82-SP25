const mongoose = require('mongoose');

const billDetailSchema = new mongoose.Schema({
  bill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',

  },
  goods_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goods',

  },
  quantity: {
    type: Number,
  },
  unit_price: {
    type: Number,

  },
  total_amount: {
    type: Number,

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

// Tự động tính total_amount trước khi lưu
billDetailSchema.pre('save', function(next) {
  this.total_amount = this.quantity * this.unit_price;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BillDetail', billDetailSchema);