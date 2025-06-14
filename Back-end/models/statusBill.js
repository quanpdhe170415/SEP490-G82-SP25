const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Đảm bảo không trùng tên trạng thái
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

const Status = mongoose.model('Status', statusSchema);
module.exports = Status;