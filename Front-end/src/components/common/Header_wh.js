import React, { useState } from "react";
// <<< THAY ĐỔI: Import React để dùng React.Fragment
import { useUI } from "../../contexts/UIContext";

export default function HeaderWH({
  userName = "Nguyễn Văn A",
  userRole = "Thủ kho",
  onSidebarToggle,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // <<< THAY ĐỔI: Bỏ pageTitle, chỉ giữ pageSubtitle
  const { pageSubtitle } = useUI();

  // <<< THAY ĐỔI: Logic để tạo Breadcrumb
  const renderBreadcrumb = () => {
    // Nếu không có subtitle thì không hiển thị gì cả
    if (!pageSubtitle) return null;

    // Tách chuỗi subtitle thành các phần, ví dụ: "Tồn Kho / Kiểm kê kho" -> ["Tồn Kho", "Kiểm kê kho"]
    const parts = pageSubtitle.split(' / ');

    return (
      <p className="mb-0 text-muted small d-flex align-items-center">
        {parts.map((part, index) => (
          // Dùng React.Fragment để bọc mỗi phần tử và dấu phân cách
          <React.Fragment key={index}>
            {/* Nếu là phần tử cuối cùng trong mảng, bôi đen nó */}
            {index === parts.length - 1 ? (
              <strong className="text-dark fw-semibold">{part}</strong>
            ) : (
              // Nếu không phải, hiển thị bình thường
              <span>{part}</span>
            )}

            {/* Thêm dấu ">" vào giữa các phần tử, trừ phần tử cuối */}
            {index < parts.length - 1 && <span className="mx-2">{'>'}</span>}
          </React.Fragment>
        ))}
      </p>
    );
  };

  return (
    <header className="bg-white border-bottom shadow-sm">
      <div className="d-flex align-items-center justify-content-between px-3 py-2" style={{ height: "64px" }}>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-secondary me-3"
            onClick={onSidebarToggle}
            style={{ border: "none" }}
          >
            ☰
          </button>

          {/* <<< THAY ĐỔI: Gọi hàm renderBreadcrumb để hiển thị */}
          <div>
            {renderBreadcrumb()}
          </div>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-light d-flex align-items-center border-0"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ background: "transparent" }}
          >
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: "32px", height: "32px", fontSize: "0.75rem" }}
            >
              AVT
            </div>
            <div className="text-start">
              <div className="fw-medium small">{userName}</div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                {userRole}
              </div>
            </div>
          </button>

          {dropdownOpen && (
            <ul className="dropdown-menu dropdown-menu-end show position-absolute" style={{ minWidth: "200px" }}>
              <li>
                <a className="dropdown-item" href="#profile">
                  Thông tin cá nhân
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#settings">
                  Cài đặt
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#logout">
                  Đăng xuất
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  )
}
