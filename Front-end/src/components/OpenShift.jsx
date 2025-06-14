import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const denominations = [
  { value: 1000, label: "1.000" },
  { value: 2000, label: "2.000" },
  { value: 5000, label: "5.000" },
  { value: 10000, label: "10.000" },
  { value: 20000, label: "20.000" },
  { value: 50000, label: "50.000" },
  { value: 100000, label: "100.000" },
  { value: 200000, label: "200.000" },
  { value: 500000, label: "500.000" },
];

// Giả lập dữ liệu ca làm việc
const shiftData = {
  employeeName: "Mạnh Beo",
  receivedCash: 2000000,
  openTime: "2025-06-14 08:00",
  expectedCloseTime: "2025-06-14 17:00",
  note: "Kiểm tra tiền mặt trước khi nhận ca.",
  status: "Chưa mở ca",
};

export default function OpenShift() {
  const [cashDetail, setCashDetail] = useState(
    denominations.reduce((acc, d) => ({ ...acc, [d.value]: 0 }), {})
  );

  const totalCash = Object.entries(cashDetail).reduce(
    (sum, [denom, qty]) => sum + Number(denom) * Number(qty),
    0
  );

  const handleChange = (value, input) => {
    let qty = input;
    if (qty === "" || qty === null) qty = 0;
    if (!/^[0-9]*$/.test(qty)) return; // chỉ cho phép số
    setCashDetail((prev) => ({ ...prev, [value]: Number(qty) }));
  };

  const handleReset = () => {
    setCashDetail(denominations.reduce((acc, d) => ({ ...acc, [d.value]: 0 }), {}));
  };

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
              <li className="list-group-item bg-white">
                <div className="mb-2 text-secondary">Số lượng tiền mặt từng mệnh giá:</div>
                <div className="row g-2">
                  {denominations.map((d) => (
                    <div className="col-6" key={d.value}>
                      <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text bg-primary text-white" style={{ minWidth: 80 }}>{d.label} đ</span>
                        <input
                          type="number"
                          min="0"
                          className="form-control text-end"
                          value={cashDetail[d.value] === 0 ? "" : cashDetail[d.value]}
                          onChange={e => handleChange(d.value, e.target.value)}
                          onBlur={e => { if (e.target.value === "") handleChange(d.value, 0); }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 fw-bold text-black">Tổng tiền: {totalCash.toLocaleString()} đ</div>
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
            <div className="d-flex gap-2">
              <button className="btn w-100 text-white fw-bold py-2" style={{ background: '#0070f4' }}>
                Xác nhận mở ca
              </button>
              <button className="btn w-100 btn-secondary fw-bold py-2" type="button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
