const mongoose = require('mongoose');

const billDetailSchema = new mongoose.Schema({
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
},{
    timestamps: true
});

const BillDetail = mongoose.model('BillDetail', billDetailSchema);
module.exports = BillDetail;