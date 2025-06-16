const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Tiền mặt', 'Chuyển khoản ngân hàng'],
    required: true,
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
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
  shift_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: false,
  },
});

billSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;