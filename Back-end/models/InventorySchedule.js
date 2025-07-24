const mongoose = require('mongoose');

const inventoryScheduleSchema = new mongoose.Schema({
  schedule_name: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: false,
  },
  time_start: Date,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  assigned_employees: {
    type: [{
      employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    }],
    required: true,
  },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  inventory_type: {
    type: String,
    enum: ['Toàn Kho', 'Cuối ngày', 'Định kỳ', 'Đột xuất', 'Khác'],
    required: true,
  },
  manager_note: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['Đang kiểm', 'Đã hoàn thành', 'Đã hủy', 'Quá hạn', 'Sắp tới'],
    required: true,
    default: 'Sắp tới',
  },
}, {
  timestamps: true,
});

// Middleware để cập nhật trạng thái khi tất cả phiếu liên quan hoàn thành
inventoryScheduleSchema.post('save', async function(doc, next) {
  const ScheduleCheckMapping = require('./ScheduleCheckMapping.js');
  const InventoryCheck = require('./inventoryCheck.js');
  const mappings = await ScheduleCheckMapping.find({ schedule_id: doc._id }).populate('check_id');
  const checks = mappings.map(mapping => mapping.check_id);
  const allCompleted = checks.every(check => check.status === 'Đã hoàn thành');
  if (allCompleted && checks.length > 0) {
    await InventorySchedule.findByIdAndUpdate(doc._id, { status: 'Đã hoàn thành' });
  }
  next();
});

const InventorySchedule = mongoose.model('InventorySchedule', inventoryScheduleSchema);

module.exports = InventorySchedule;