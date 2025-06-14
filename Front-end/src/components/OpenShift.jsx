import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


// Giả lập dữ liệu ca làm việc
const shiftData = {
  employeeName: "Nguyễn Văn A",
  receivedCash: 2000000,
  openTime: "2025-06-14 08:00",
  expectedCloseTime: "2025-06-14 17:00",
  note: "Kiểm tra tiền mặt trước khi nhận ca.",
  status: "Chưa mở ca",
};

export default function OpenShift() {
  return (
    <div className="min-vh-100 bg-light d-flex flex-column align-items-center py-5">
      <div className="w-100" style={{ maxWidth: 500 }}>
        <div className="card shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-3 fw-bold text-black">Mở ca bán hàng</h2>
            <div className="mb-4" style={{ height: 4, width: 96, background: '#0070f4', borderRadius: 4 }}></div>
            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Nhân viên mở ca:</span>
                <span className="fw-semibold text-black">{shiftData.employeeName}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Số tiền mặt nhận:</span>
                <span className="fw-semibold text-black">{shiftData.receivedCash.toLocaleString()} đ</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Thời gian mở ca:</span>
                <span className="fw-semibold text-black">{shiftData.openTime}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Dự kiến đóng ca:</span>
                <span className="fw-semibold text-black">{shiftData.expectedCloseTime}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Ghi chú:</span>
                <span className="fw-semibold text-black">{shiftData.note}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Trạng thái:</span>
                <span className="fw-semibold text-black">{shiftData.status}</span>
              </li>
            </ul>
            <button className="btn w-100 text-white fw-bold py-2" style={{ background: '#0070f4' }}>
              Xác nhận mở ca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
