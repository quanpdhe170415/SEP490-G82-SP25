import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const defaultShiftData = {
  employeeName: "",
  receivedCash: 0,
  openTime: "",
  expectedCloseTime: "",
  note: "",
  status: "Chưa mở ca",
};

function formatCurrency(value) {
  if (!value && value !== 0) return "";
  return value.toLocaleString("vi-VN");
}

export default function OpenShift() {
  // Lấy thông tin từ localStorage
  const userId = localStorage.getItem('userId') || "";
  const username = localStorage.getItem('username') || "";

  // Lấy thời gian hiện tại (giờ mở ca)
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('vi-VN', { hour12: false });
  };

  const [totalCash, setTotalCash] = useState(0);
  const [shiftData, setShiftData] = useState({
    ...defaultShiftData,
    employeeName: username,
    openTime: getCurrentTime(),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [shiftsStatus, setShiftsStatus] = useState([]);
  const [currentShiftType, setCurrentShiftType] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const fetchShiftToday = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_URL_SERVER}/shift/checkShiftToday`);
      if (!res.ok) throw new Error("Không thể lấy thông tin ca hôm nay");
      const data = await res.json();
      setShiftsStatus(data.shiftsStatus || []);

      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      let foundShift = null;

      for (const shift of data.shiftsStatus) {
        const [startH, startM] = shift.start_time.split(":").map(Number);
        const [endH, endM] = shift.end_time.split(":").map(Number);
        const startMin = startH * 60 + startM;
        const endMin = endH * 60 + endM;

        // Xử lý ca qua đêm
        if (endMin < startMin) {
          if (nowMinutes >= startMin || nowMinutes < endMin) {
            foundShift = shift;
            break;
          }
        } else {
          if (nowMinutes >= startMin && nowMinutes < endMin) {
            foundShift = shift;
            break;
          }
        }
      }

      setCurrentShiftType(foundShift);
      console.log("Ca hiện tại:", foundShift);

      // Xác định ca sáng/chiều mặc định
      let caMacDinh = "";
      if (nowMinutes <= 14 * 60 + 55) {
        caMacDinh = "Ca sáng";
      } else {
        caMacDinh = "Ca chiều";
      }
      console.log("Ca mặc định:", caMacDinh);

      // Check nếu ca mặc định đã mở thì điều hướng tới /POS
      const defaultShift = data.shiftsStatus.find(s => s.shiftType === caMacDinh);
      if (defaultShift?.opened) {
        navigate("/POS");
      }

    } catch (err) {
      setError("Không thể tải dữ liệu ca hôm nay");
    }
  };
  fetchShiftToday();
  // eslint-disable-next-line
}, [navigate]);


  // Khi component mount, set lại thông tin nhân viên và thời gian mở ca
  useEffect(() => {
    setShiftData(sd => ({
      ...sd,
      employeeName: username,
      openTime: getCurrentTime(),
    }));
    // eslint-disable-next-line
  }, []);

  const handleOpenShift = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      if (!userId) {
        setError("Không tìm thấy thông tin tài khoản.");
        setLoading(false);
        return;
      }
      if (!totalCash || isNaN(totalCash) || totalCash < 0) {
        setError("Vui lòng nhập tổng số tiền mặt hợp lệ");
        setLoading(false);
        return;
      }
      const payload = {
        account_id: userId,
        initial_cash_amount: totalCash,
        notes,
      };
      const res = await fetch(`${process.env.REACT_APP_URL_SERVER}/shift/openshift`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Mở ca thất bại");
      }
      setMessage("Mở ca thành công!");
      // Sau khi mở ca thành công, có thể chuyển hướng luôn nếu muốn
      setTimeout(() => navigate("/POS"), 1000);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi mở ca");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column align-items-center py-5">
      <div className="w-100" style={{ maxWidth: 500 }}>
        <div className="card shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-3 fw-bold text-black">Mở ca bán hàng</h2>
            <div className="mb-4" style={{ height: 4, width: 96, background: '#0070f4', borderRadius: 4 }}></div>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Hiển thị loại ca hiện tại khi mở ca */}
            {currentShiftType && (
  <div className="alert alert-info mb-3 d-flex justify-content-between align-items-center">
    <div>
      Đang ở <b>{currentShiftType.shiftType}</b> ({currentShiftType.start_time} - {currentShiftType.end_time})
    </div>
    <span className={currentShiftType.opened ? "text-success fw-bold ms-3" : "text-danger ms-3"}>
      {currentShiftType.opened ? "Đã mở" : "Chưa mở"}
    </span>
  </div>
)}

            {/* Hiển thị trạng thái các ca trong ngày */}
            {shiftsStatus.length > 0 && (
          <div className="mb-3">
            <h6 className="fw-bold">Trạng thái các ca hôm nay:</h6>
            <ul className="list-group">
              {shiftsStatus.map((shift, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {shift.shiftType} ({shift.start_time} - {shift.end_time})
                  </span>
                  <span className={shift.opened ? "text-success fw-bold" : "text-danger"}>
                    {shift.opened ? "Đã mở" : "Chưa mở"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item bg-white">
                <div className="mb-2 text-secondary d-flex justify-content-between align-items-center">
                  <span>Account ID:</span>
                  <input
                    type="text"
                    className="form-control form-control-sm ms-2"
                    style={{ maxWidth: 200 }}
                    value={userId}
                    readOnly
                  />
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Nhân viên mở ca:</span>
                <span className="fw-semibold text-black">{username}</span>
              </li>
              <li className="list-group-item bg-white">
                <div className="mb-2 text-secondary d-flex justify-content-between align-items-center">
                  <span>Tổng số tiền mặt nhận ca:</span>
                  <div style={{ position: 'relative', maxWidth: 220, width: '100%' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      className="form-control form-control-sm text-end fw-bold pe-5"
                      style={{ fontSize: 18, letterSpacing: 1, paddingRight: 48 }}
                      value={formatCurrency(totalCash)}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setTotalCash(raw ? Number(raw) : 0);
                      }}
                      placeholder="Nhập tổng tiền mặt"
                    />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#0070f4', fontWeight: 700, pointerEvents: 'none' }}>đ</span>
                  </div>
                </div>
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
                <span className="text-secondary">Thời gian mở ca:</span>
                <span className="fw-semibold text-black">{shiftData.openTime}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Dự kiến đóng ca:</span>
                <span className="fw-semibold text-black"></span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center bg-white">
                <span className="text-secondary">Trạng thái:</span>
                <span className="fw-semibold text-black">{shiftData.status}</span>
              </li>
            </ul>
            <div className="d-flex gap-2">
              <button className="btn w-100 text-white fw-bold py-2" style={{ background: '#0070f4' }}
                onClick={handleOpenShift} disabled={loading}>
                {loading ? "Đang mở ca..." : "Xác nhận mở ca"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}