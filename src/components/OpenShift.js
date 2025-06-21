import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OpenShift = () => {
  const [shiftsStatus, setShiftsStatus] = useState([]);
  const [currentShiftType, setCurrentShiftType] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShiftToday = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_URL_SERVER}/shift/checkShiftToday`);
        if (!res.ok) throw new Error("Không thể lấy thông tin ca hôm nay");
        const data = await res.json();
        setShiftsStatus(data.shiftsStatus || []);

        // Xác định ca hiện tại dựa vào giờ hệ thống (theo yêu cầu mới)
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        let foundShift = null;

        // Ca sáng: 00:00 - 14:55 (0 - 895 phút)
        // Ca chiều: 14:56 - 23:59 (896 - 1439 phút)
        if (nowMinutes >= 0 && nowMinutes <= 895) {
          foundShift = { shiftType: "Ca sáng", start_time: "00:00", end_time: "14:55" };
        } else if (nowMinutes >= 896 && nowMinutes <= 1439) {
          foundShift = { shiftType: "Ca chiều", start_time: "14:56", end_time: "23:59" };
        }

        setCurrentShiftType(foundShift);

        // Nếu ca hiện tại đã mở thì chuyển sang /homecashier (nếu có trạng thái opened từ API)
        if (
          foundShift &&
          data.shiftsStatus &&
          Array.isArray(data.shiftsStatus)
        ) {
          const matched = data.shiftsStatus.find(
            s => s.shiftType === foundShift.shiftType
          );
          if (matched && matched.opened) {
            navigate("/POS");
          }
        }
      } catch (err) {
        setError("Không thể tải dữ liệu ca hôm nay");
      }
    };
    fetchShiftToday();
  }, [navigate]);

  return (
    <div>
      {/* Render nội dung component ở đây */}
      {error && <div className="error">{error}</div>}
      <div>
        <h2>Thông tin ca làm việc</h2>
        {currentShiftType ? (
          <div>
            <p>Ca hiện tại: {currentShiftType.shiftType}</p>
            <p>Thời gian: {currentShiftType.start_time} - {currentShiftType.end_time}</p>
          </div>
        ) : (
          <p>Đang xác định ca làm việc...</p>
        )}
      </div>
    </div>
  );
};

export default OpenShift;