import { useState } from "react"
import "./cancel-inventory-modal.css"
const CancelInventoryModal = ({ isOpen, onClose, onConfirm, inventoryCode }) => {
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [attachments, setAttachments] = useState([])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!reason) {
      alert("Vui lòng chọn lý do hủy kiểm kho")
      return
    }
    onConfirm({ reason, note, attachments })
    // Reset form
    setReason("")
    setNote("")
    setAttachments([])
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const handleCameraCapture = () => {
    // Logic for camera capture
    console.log("Opening camera...")
  }

  return (
    <div className="cancel-modal-overlay">
      <div className="cancel-modal-container">
        <div className="cancel-modal-header">
          <div className="cancel-modal-title">
            <span className="cancel-icon">🚫</span>
            <h2>Hủy kiểm kho</h2>
          </div>
          <button className="cancel-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cancel-modal-body">
          <div className="form-group">
            <label className="form-label required">
              Lý do hủy kiểm kho <span className="required-star">*</span>
            </label>
            <select className="form-select" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">-- Chọn lý do hủy --</option>
              <option value="technical-issue">Sự cố kỹ thuật</option>
              <option value="staff-shortage">Thiếu nhân sự</option>
              <option value="urgent-business">Công việc khẩn cấp</option>
              <option value="data-error">Lỗi dữ liệu</option>
              <option value="other">Lý do khác</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">
              Ghi chú chi tiết <span className="required-star">*</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Mô tả chi tiết tình huống và lý do cần hủy kiểm kho..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Đính kèm hình ảnh (tùy chọn)</label>
            <div className="attachment-section">
              <div className="attachment-buttons">
                <button type="button" className="btn-attachment btn-camera" onClick={handleCameraCapture}>
                  📷 Chụp ảnh
                </button>
                <label className="btn-attachment btn-file">
                  📁 Chọn file
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <div className="attachment-info">
                <p>Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</p>
                <p>VD: Ảnh khu vực bị khóa, hàng bị lộn xộn, thiết bị hỏng...</p>
              </div>
              {attachments.length > 0 && (
                <div className="attachment-list">
                  {attachments.map((file, index) => (
                    <div key={index} className="attachment-item">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="cancel-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            📤 Gửi yêu cầu hủy
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelInventoryModal
