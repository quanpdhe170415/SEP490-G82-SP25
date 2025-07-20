const mongoose = require('mongoose');

const inventoryCheckSchema = new mongoose.Schema({
  inventory_code: {
    type: String,
    required: true,
    unique: true
  },
  inventory_name: {
    type: String,
    required: true
  },
  check_type: {
    type: String,
    enum: ['Toàn bộ', 'Theo khu vực', 'Theo sản phẩm', 'Đột xuất'],
    default: 'Toàn bộ'
  },
  expected_date: {
    type: Date,
    required: false
  },
  check_start_time: Date,
  check_end_time: Date,
  note: String,
  priority_area: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' }], // Kệ/khu vực cần ưu tiên
  status: {
    type: String,
    enum: ['Chưa kiểm', 'Đang kiểm', 'Đã hoàn thành'],
    default: 'Chưa kiểm'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
}, {
  timestamps: true
});

// Tự sinh mã phiếu kiểm
inventoryCheckSchema.pre('save', async function(next) {
  if (!this.inventory_code) {
    const now = new Date();
    const code = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(now.setHours(0, 0, 0, 0))
      }
    }) + 1;
    this.inventory_code = `KK${code}-${String(count).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('InventoryCheck', inventoryCheckSchema);
