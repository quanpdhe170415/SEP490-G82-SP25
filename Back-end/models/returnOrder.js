const mongoose = require("mongoose");

const ReturnOrderSchema = new mongoose.Schema(
  {
    bill_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      required: true,
    },
    return_reason: { type: String },
    total_refund: { type: Number, required: true },
    created_by: { type: String },
  },
  { timestamps: true }
);


module.exports = mongoose.model("ReturnOrder", ReturnOrderSchema);
