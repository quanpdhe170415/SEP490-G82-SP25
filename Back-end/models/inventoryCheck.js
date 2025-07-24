const mongoose = require("mongoose");

// InventoryCheck Schema - Cải thiện để hỗ trợ giao diện
const inventoryCheckSchema = new mongoose.Schema(
  {
    inventory_code: {
      type: String,
      required: true,
      unique: true,
    },
    inventory_name: {
      type: String,
      required: true,
    },
    schedule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventorySchedule",
      required: false,
    },
    area: { // Thêm trường area
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    required: false,
  },
    check_start_time: Date,
    check_end_time: Date,

    note: String, 
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "InventoryTask" }],
    status: {
      type: String,
      enum: ["Chưa kiểm", "Đang kiểm", "Đã hoàn thành", "Đã hủy"],
      default: "Chưa kiểm",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InventoryCheck", inventoryCheckSchema);
