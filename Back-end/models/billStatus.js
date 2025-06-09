
const mongoose = require('mongoose');
const billStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  color: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
},{
    timestamps: true
});
const BillStatus = mongoose.model('BillStatus', billStatusSchema);
module.exports = BillStatus;