const mongoose = require('mongoose');

const inventoryCheckSchema = new mongoose.Schema({
  inventory_code: {
    type: String,
    required: true,
    unique: true,
  },
  inventory_name: {
    type: String,
    required: true,
  },
  check_type: {
    type: String,
    enum: ['Toàn bộ', 'Theo kệ', 'Theo tầng', 'Theo sản phẩm', 'Đột xuất'], // Thêm 'Theo tầng', 'Theo kệ'
    default: 'Toàn bộ',
  },
  expected_date: {
    type: Date,
    required: false,
  },
  check_start_time: Date,
  check_end_time: Date,
  note: String,
  priority_area: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' }], // Kệ ưu tiên
  priority_levels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShelfLevel' }], // Tầng ưu tiên
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryTask' }], // Thêm mảng tasks
  status: {
    type: String,
    enum: ['Chưa kiểm', 'Đang kiểm', 'Đã hoàn thành'],
    default: 'Chưa kiểm',
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
}, {
  timestamps: true,
});

// Tự sinh mã phiếu kiểm và tạo tasks cho kiểm toàn kho
inventoryCheckSchema.pre('save', async function(next) {
  if (!this.inventory_code) {
    const now = new Date();
    const code = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) },
    }) + 1;
    this.inventory_code = `KK${code}-${String(count).padStart(3, '0')}`;
  }

  // Tự động tạo tasks cho kiểm toàn kho
  if (this.check_type === 'Toàn bộ' && this.tasks.length === 0) {
    const ShelfLevel = mongoose.model('ShelfLevel');
    const allLevels = await ShelfLevel.find({});
    const tasks = allLevels.map(level => ({
      inventory_id: this._id,
      shelf_level_id: level._id,
      status: 'Chưa kiểm',
    }));
    const InventoryTask = mongoose.model('InventoryTask');
    const createdTasks = await InventoryTask.insertMany(tasks);
    this.tasks = createdTasks.map(task => task._id);
  }

  next();
});

module.exports = mongoose.model('InventoryCheck', inventoryCheckSchema);