const mongoose = require('mongoose');

const inventoryTaskSchema = new mongoose.Schema({
  inventory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryCheck',
    required: true
  },
  location_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  checked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  start_time: Date,
  end_time: Date,
  status: {
    type: String,
    enum: ['Chưa kiểm', 'Đang kiểm', 'Hoàn thành'],
    default: 'Chưa kiểm'
  },
  note: String
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryTask', inventoryTaskSchema);
