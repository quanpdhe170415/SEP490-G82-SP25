// Đề xuất schema: DefectiveItemLog
const mongoose = require('mongoose');
const defectiveItemLogSchema = new mongoose.Schema({
  // Liên kết với phiên kiểm tra mặt hàng cụ thể
  item_check_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItemCheck',
    required: true,
  },
  // Số lượng hàng bị lỗi trong lần ghi nhận này
  defective_quantity: {
    type: Number,
    required: true,
  },
  // Lý do lỗi (nên được quản lý ở một collection khác để dễ dàng thêm/sửa)
  reason: {
    type: String, // Hoặc ObjectId nếu bạn tạo collection riêng cho lý do
    required: true,
  },
  // Ghi chú chi tiết từ thủ kho
  note: {
    type: String,
  },
  // Mảng chứa URL của các hình ảnh bằng chứng
  images: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('DefectiveItemLog', defectiveItemLogSchema);