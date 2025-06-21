import React, { useState } from "react";

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

const defaultCash = denominations.reduce((acc, d) => ({ ...acc, [d.value]: 0 }), {});

const shiftData = {
  employeeName: "Nguyễn Văn A",
  closeCash: 2500000,
  openTime: "2025-06-14 08:00",
  closeTime: "2025-06-14 17:00",
  note: "Đếm kỹ tiền mặt trước khi bàn giao.",
  status: "Chưa đóng ca",
};

export default function CloseShift() {
  const [cashDetail, setCashDetail] = useState({ ...defaultCash });
  const [shiftId, setShiftId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notes, setNotes] = useState(shiftData.note);

  const totalCash = Object.entries(cashDetail).reduce(
    (sum, [denom, qty]) => sum + Number(denom) * Number(qty),
    0
  );

  // Chuyển cashDetail object thành mảng denominations đúng định dạng backend yêu cầu
  const getDenominationsArray = () => {
    return denominations
      .map((d) => ({
        denomination_value: d.value,
        count: Number(cashDetail[d.value]) || 0,
      }))
      .filter((item) => item.count > 0);
  };

  const handleChange = (value, input) => {
    let qty = input;
    if (qty === "" || qty === null) qty = 0;
    if (!/^[0-9]*$/.test(qty)) return;
    setCashDetail((prev) => ({ ...prev, [value]: Number(qty) }));
  };

  const handleReset = () => {
    setCashDetail({ ...defaultCash });
  };

  const handleCloseShift = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const denominationsArr = getDenominationsArray();
      if (!shiftId) {
        setError("Vui lòng nhập Shift ID");
        setLoading(false);
        return;
      }
      if (denominationsArr.length === 0) {
        setError("Vui lòng nhập số lượng mệnh giá tiền mặt");
        setLoading(false);
        return;
      }
      const res = await fetch(
        `http://localhost:9999/api/shift/closeshift/${shiftId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ denominations: denominationsArr }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Đóng ca thất bại");
      }
      setMessage("Đóng ca thành công!");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi đóng ca");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column align-items-center py-5">
      <div className="w-100" style={{ maxWidth: 500 }}>
        <div className="card shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-3 fw-bold text-black">
              Đóng ca bán hàng
            </h2>
            <div
              className="mb-4"
              style={{
                height: 4,
                width: 96,
                background: "#0070f4",
                borderRadius: 4,
              }}
            ></div>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item bg-white">
                <div className="mb-2 text-secondary d-flex justify-content-between align-items-center">
                  <span>Shift ID:</span>
                  <input
                    type="text"
                    className="form-control form-control-sm ms-2"
                    style={{ maxWidth: 200 }}
                    value={shiftId}
                    onChange={(e) => setShiftId(e.target.value)}
                    placeholder="Nhập Shift ID"
                  />
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Nhân viên đóng ca:</span>
                <span className="fw-semibold text-black">
                  {shiftData.employeeName}
                </span>
              </li>
              <li className="list-group-item bg-white">
                <div className="mb-2 text-secondary d-flex justify-content-between align-items-center">
                  <span>Số lượng tiền mặt từng mệnh giá:</span>
                  <button
                    className="btn btn-sm btn-outline-secondary fw-bold px-3 py-1"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
                <div className="row g-2">
                  {denominations.map((d) => (
                    <div className="col-6" key={d.value}>
                      <div className="input-group input-group-sm mb-1">
                        <span
                          className="input-group-text bg-primary text-white"
                          style={{ minWidth: 80 }}
                        >
                          {d.label} đ
                        </span>
                        <input
                          type="number"
                          min="0"
                          className="form-control text-end"
                          value={
                            cashDetail[d.value] === 0
                              ? ""
                              : cashDetail[d.value]
                          }
                          onChange={(e) => handleChange(d.value, e.target.value)}
                          onBlur={(e) => {
                            if (e.target.value === "") handleChange(d.value, 0);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 fw-bold text-black">
                  Tổng tiền: {totalCash.toLocaleString()} đ
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Thời gian mở ca:</span>
                <span className="fw-semibold text-black">
                  {shiftData.openTime}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Thời gian đóng ca:</span>
                <span className="fw-semibold text-black">
                  {shiftData.closeTime}
                </span>
              </li>
              <li className="list-group-item bg-white">
                <div className="mb-2 text-secondary d-flex justify-content-between align-items-center">
                  <span>Ghi chú:</span>
                  <textarea
                    className="form-control form-control-sm ms-2"
                    style={{ maxWidth: 350, minHeight: 60, resize: 'vertical' }}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Ghi chú (nếu có)"
                    maxLength={200}
                  />
                </div>
                <div className="text-end text-secondary small">{notes.length}/200 ký tự</div>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Trạng thái:</span>
                <span className="fw-semibold text-black">{shiftData.status}</span>
              </li>
            </ul>
            <button
              className="btn w-100 text-white fw-bold py-2"
              style={{ background: "#0070f4" }}
              onClick={handleCloseShift}
              disabled={loading}
            >
              {loading ? "Đang đóng ca..." : "Xác nhận đóng ca"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}