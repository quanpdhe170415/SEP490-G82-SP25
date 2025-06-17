const mongoose = require("mongoose");

const statusWarehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure status names are unique
    enum: [
      "Chờ nhập hàng",
      "Đã nhập hàng",
      "Đã xuất hàng",
      "Đã trả hàng",
      "Đã hủy hàng",
    ], // Restrict to these specific statuses
  },
  description: {
    type: String,
    default: null,
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

// Pre-save hook to update the updated_at timestamp
statusWarehouseSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const StatusWarehouse = mongoose.model(
  "StatusWarehouse",
  statusWarehouseSchema
);

// Seed initial statuses if none exist
StatusWarehouse.countDocuments().then((count) => {
  if (count === 0) {
    StatusWarehouse.insertMany([
      {
        name: "Chờ nhập hàng",
        description: "Hàng hóa đang chờ được nhập vào kho",
      },
      {
        name: "Đã nhập hàng",
        description: "Hàng hóa đã được nhập vào kho",
      },
      {
        name: "Đã xuất hàng",
        description: "Hàng hóa đã được xuất khỏi kho",
      },
      {
        name: "Đã trả hàng",
        description: "Hàng hóa đã được trả lại kho",
      },
      {
        name: "Đã hủy hàng",
        description: "Hàng hóa đã bị hủy",
      },
    ])
      .then(() => {
        console.log("Seeded initial warehouse statuses");
      })
      .catch((err) => {
        console.error("Error seeding warehouse statuses:", err);
      });
  }
});

module.exports = StatusWarehouse;
