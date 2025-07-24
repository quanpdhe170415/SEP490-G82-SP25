const mongoose = require("mongoose");
const ShelfLevel = require("./ShelfLevel");

const inventoryItemCheckSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryTask",
      required: true,
    },
    goods_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goods",
      required: true,
    },
    shelf_level_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShelfLevel",
      required: true, // Thay Location bằng ShelfLevel
    },

    actual_quantity: {
      type: Number,
    },
    is_defective: {
      type: Boolean,
      default: false,
    },
    note: String,
    status: {
      type: String,
      enum: ["Chưa kiểm", "Đã kiểm"],
      default: "Chưa kiểm",
    },
  },
  {
    timestamps: true,
  }
);

// Tính lệch số lượng trước khi lưu và lấy system_quantity từ ShelfLevel
inventoryItemCheckSchema.pre("save", async function (next) {
  if (
    this.actual_quantity !== undefined &&
    this.system_quantity !== undefined
  ) {
    this.discrepancy = this.actual_quantity - this.system_quantity;
  } else if (!this.system_quantity) {
    const shelfLevel = await ShelfLevel.findById(this.shelf_level_id);
    if (shelfLevel) {
      this.system_quantity = shelfLevel.stock_quantity;
    }
  }
  next();
});

module.exports = mongoose.model("InventoryItemCheck", inventoryItemCheckSchema);
