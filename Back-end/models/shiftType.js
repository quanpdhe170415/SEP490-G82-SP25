const mongoose = require('mongoose');

const shiftTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ví dụ: "Ca sáng", "Ca chiều"
  },
  start_time: {
    type: String, // Định dạng "HH:mm", ví dụ "07:00"
    required: true,
  },
  end_time: {
    type: String, // Định dạng "HH:mm", ví dụ "15:00"
    required: true,
  },
  notes: {
    type: String,
    default: null,
  }
}, { timestamps: true });

const ShiftType = mongoose.model('ShiftType', shiftTypeSchema);
module.exports = ShiftType;