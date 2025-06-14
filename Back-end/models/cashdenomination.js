const mongoose = require('mongoose');

const cashDenominationSchema = new mongoose.Schema({
  shift_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: true,
    unique: true,
  },
  denominations: {
    type: [
      {
        denomination_value: { type: Number, required: true },
        count: { type: Number, default: 0, required: true },
      },
    ],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const CashDenomination = mongoose.model('CashDenomination', cashDenominationSchema);
module.exports = CashDenomination;