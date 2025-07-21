const mongoose = require('mongoose');

const scheduleCheckMappingSchema = new mongoose.Schema({
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventorySchedule',
    required: true,
  },
  check_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryCheck',
    required: true,
  },
  assigned_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const ScheduleCheckMapping = mongoose.model('ScheduleCheckMapping', scheduleCheckMappingSchema);

module.exports = ScheduleCheckMapping;