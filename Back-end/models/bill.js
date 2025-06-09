const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: false
  },
  customerName: {
    type: String,
    required: false
  },
  customerPhone: {
    type: String
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'other'],
    default: 'cash'
  },
  notes: {
    type: String
  },
  createdBy: {
    type: String,
    required: true
  }
},{
    timestamps: true
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;