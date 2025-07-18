const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  originalAmount: {
    type: Number,
    required: false, // Số tiền gốc trước khi return
  },
  paymentMethod: {
    type: String,
    enum: ["Tiền mặt", "Chuyển khoản ngân hàng"],
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
    required: true,
  },
  has_been_returned: {
    type: Boolean,
    default: false, // Đánh dấu bill đã được return hay chưa
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
    ref: "Shift",
    required: false,
  },
});

billSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
