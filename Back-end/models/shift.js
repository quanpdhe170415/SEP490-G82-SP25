const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  shift_start_time: {
    type: Date,
    required: true,
  },
  shift_end_time: {
    type: Date,
    default: null,
  },
  initial_cash_amount: {
    type: Number,
  },
  final_cash_amount: {
    type: Number,
    default: null,
  },
  cash_transactions: {
    type: Number,
    default: 0,
  },
  transfer_transactions: {
    type: Number,
    default: 0,
  },
  cash_change_given: {
    type: Number,
    default: 0,
  },
  total_transactions: {
    type: Number,
    default: 0,
  },
  cash_surplus: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'cancelled'],
    default: 'open',
    required: true,
  },
  notes: {
    type: String,
    default: null,
  },
  isHandoverConfirmed: { type: Boolean, default: false }

},{timestamps: true});

const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;