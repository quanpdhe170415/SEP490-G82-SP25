const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  },
  paymentMethod: {
    type: String,
  },
  notes: {
    type: String,
    default: null,
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
    required: true,
  },
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;