const mongoose = require("mongoose");

const returnOrderSchema = new mongoose.Schema({
  bill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill",
    required: true,
  },
  return_date: {
    type: Date,
    default: Date.now,
  },
  return_reason: {
    type: String,
  },
  total_refund: {
    type: Number,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // nhân viên thực hiện
  },
});

const ReturnOrder = mongoose.model("ReturnOrder", returnOrderSchema);

module.exports = ReturnOrder;
