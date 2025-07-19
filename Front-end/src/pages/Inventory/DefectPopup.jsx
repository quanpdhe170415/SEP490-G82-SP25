"use client"

import { useState } from "react"
import "./DefectPopup.css"

export function DefectPopup({ item, onSave, onCancel, onImageUpload }) {
  const [defectQuantity, setDefectQuantity] = useState(item.defectInfo?.quantity || 1)
  const [defectReason, setDefectReason] = useState(item.defectInfo?.reason || "")
  const [defectNotes, setDefectNotes] = useState(item.defectInfo?.notes || "")

  const defectReasons = ["Hỏng", "Hết hạn", "Móp méo", "Bao bì rách", "Ẩm mốc", "Bẩn", "Thiếu phụ kiện", "Khác"]

  const handleSave = () => {
    if (!defectReason) {
      alert("Vui lòng chọn lý do lỗi!")
      return
    }

    onSave({
      quantity: defectQuantity,
      reason: defectReason,
      notes: defectNotes,
      image: item.defectInfo?.image,
    })
  }

  return (
    <div className="defect-popup">
      <div className="popup-header">
        <div>
          <h3 className="popup-title">Ghi nhận hàng lỗi</h3>
          <p className="popup-subtitle">
            {item.name} ({item.code})
          </p>
        </div>
        <button className="close-button" onClick={onCancel}>
          ✕
        </button>
      </div>

      <div className="popup-content">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Số lượng lỗi <span className="required">*</span>
            </label>
            <input
              type="number"
              min="0"
              max={item.actualQuantity || item.expectedQuantity}
              value={defectQuantity}
              onChange={(e) => setDefectQuantity(Number(e.target.value))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Lý do lỗi <span className="required">*</span>
            </label>
            <select value={defectReason} onChange={(e) => setDefectReason(e.target.value)} className="form-select">
              <option value="">-- Chọn lý do --</option>
              {defectReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group image-upload">
          <label className="form-label">Đính kèm ảnh</label>
          <div className="upload-buttons">
            <button
              type="button"
              className="upload-button"
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.capture = "camera"
                input.onchange = (e) => {
                  const file = e.target.files?.[0]
                  if (file) onImageUpload(item.id, file)
                }
                input.click()
              }}
            >
              <span className="upload-icon">📷</span>
              Chụp ảnh
            </button>
            <button
              type="button"
              className="upload-button"
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.onchange = (e) => {
                  const file = e.target.files?.[0]
                  if (file) onImageUpload(item.id, file)
                }
                input.click()
              }}
            >
              <span className="upload-icon">📁</span>
              Tải lên
            </button>
          </div>
          {item.defectInfo?.image && (
            <img src={item.defectInfo.image || "/placeholder.svg"} alt="Ảnh lỗi" className="image-preview" />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú thêm</label>
          <textarea
            value={defectNotes}
            onChange={(e) => setDefectNotes(e.target.value)}
            placeholder="Mô tả chi tiết về lỗi..."
            className="form-textarea"
            rows={3}
          />
        </div>
      </div>

      <div className="popup-footer">
        <button className="footer-button cancel" onClick={onCancel}>
          Hủy
        </button>
        <button className="footer-button save" onClick={handleSave}>
          Lưu thông tin lỗi
        </button>
      </div>
    </div>
  )
}
