// models/ReturnDetail.js
const mongoose = require("mongoose");

const ReturnDetailSchema = new mongoose.Schema(
  {
    return_order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReturnOrder",
      required: true,
    },
    goods_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goods",
      required: true,
    },
    goods_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    total_refund: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReturnDetail", ReturnDetailSchema);
