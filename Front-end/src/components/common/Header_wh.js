import { useState } from "react"
export default function HeaderWH({
  title = "Quản lý Xuất Hủy",
  subtitle = "Xuất Kho / Phiếu Xuất Hủy",
  userName = "Nguyễn Văn A",
  userRole = "Thủ kho",
  onSidebarToggle,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

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

          <div>
            <h4 className="mb-0 fw-semibold">{title}</h4>
            {subtitle && <p className="mb-0 text-muted small">{subtitle}</p>}
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