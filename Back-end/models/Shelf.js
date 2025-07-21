const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({
  shelf_code: {
    type: String,
    required: true,
    unique: true, // Mã định danh kệ (ví dụ: K001, K002)
  },
  shelf_name: {
    type: String,
    required: true, // Tên kệ (ví dụ: Kệ A, Kệ Lạnh)
  },
  area: {
    type: String,
    enum: ['Trưng bày', 'Lưu trữ', 'Đông lạnh'], // Loại kệ
    required: true,
  },
  shelf_type: {
    type: String,
    enum: ['Kệ thường', 'Tủ lạnh'], // Loại kệ
    required: true,
  },
  status: {
    type: String,
    enum: ['Hoạt động', 'Ngừng hoạt động'],
    required: true,
    default: 'Hoạt động',
  },
  note: {
    type: String,
    required: false, // Ghi chú về kệ
  },
}, {
  timestamps: true,
});

const Shelf = mongoose.model('Shelf', shelfSchema);

module.exports = Shelf;