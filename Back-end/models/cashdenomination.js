const mongoose = require('mongoose');

const cashDenominationSchema = new mongoose.Schema({
  shift_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: true,
  },
  denomination_value: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
    required: true,
  },
 
},{timestamps: true});

const CashDenomination = mongoose.model('CashDenomination', cashDenominationSchema);
module.exports = CashDenomination;