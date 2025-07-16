import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlay,
  FaCashRegister,
  FaUndo,
  FaStop,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";
import "./CashierLayout.css";

const CashierLayout = ({
  children,
  pageTitle = "Tổng quan",
  breadcrumb = "",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentPageTitle, setCurrentPageTitle] = useState(pageTitle);
  const location = useLocation();
  const navigate = useNavigate();

  // Cập nhật pageTitle dựa trên đường dẫn hiện tại
  useEffect(() => {
    const path = location.pathname;
    let title = "Tổng quan";

    switch (path) {
      case "/layout":
      case "/cashier":
      case "/cashier/overview":
        title = "Tổng quan";
        break;
      case "/openshift":
      case "/cashier/openshift":
        title = "Mở ca";
        break;
      case "/POS":
      case "/cashier/pos":
        title = "Bán hàng";
        break;
      case "/return-goods":
      case "/cashier/return":
        title = "Trả hàng";
        break;
      case "/closeshift":
      case "/cashier/closeshift":
        title = "Kết ca";
        break;
      default:
        title = pageTitle;
    }

    setCurrentPageTitle(title);
  }, [location.pathname, pageTitle]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7l8 4.5 8-4.5M12 12l8 4.5"
                />
              </svg>
            </div>
            <h1 className="sidebar-title">Tạp hóa Hải Chi</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {/* Tổng quan */}
            {/* <li>
              <button className="nav-link">
                <FaHome />
                <span className="sidebar-text">Tổng quan</span>
              </button>
            </li> */}

            {/* Nhập Kho */}
            <li className="nav-section">
              {/* <h3 className="nav-section-title">
                <span className="sidebar-text">Bán hàng</span>
              </h3> */}
              <ul className="nav-submenu">
                <li>
                  <button
                    className="nav-link"
                    onClick={() => handleNavigation("/layout")}
                  >
                    <FaHome />
                    <span className="sidebar-text">Tổng quan</span>
                  </button>
                </li>
                <li>
                  <button
                    className="nav-link"
                    onClick={() => handleNavigation("/openshift")}
                  >
                    <FaPlay />
                    <span className="sidebar-text">Mở ca</span>
                  </button>
                </li>
                <li>
                  <button
                    className="nav-link"
                    onClick={() => handleNavigation("/POS")}
                  >
                    <FaCashRegister />
                    <span className="sidebar-text">Bán hàng</span>
                  </button>
                </li>
                <li>
                  <button
                    className="nav-link"
                    onClick={() => handleNavigation("/return-goods")}
                  >
                    <FaUndo />
                    <span className="sidebar-text">Trả hàng</span>
                  </button>
                </li>
                <li>
                  <button
                    className="nav-link"
                    onClick={() => handleNavigation("/closeshift")}
                  >
                    <FaStop />
                    <span className="sidebar-text">Kết ca</span>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Profile sidebar tạm comment*/}
        {/* <div className="sidebar-profile">
          <button className="profile-link">
            <img
              className="profile-avatar"
              src="https://placehold.co/100x100/E2E8F0/4A5568?text=AVT"
              alt="Avatar người dùng"
            />
            <div className="profile-info">
              <p className="profile-name">Nguyễn Văn A</p>
              <p className="profile-email">thukho@example.com</p>
            </div>
          </button>
        </div> */}
      </aside>

      {/* Main Content */}
      <div className={`main-wrapper ${isCollapsed ? "collapsed" : ""}`}>
        {/* Header */}
        <header className="top-header">
          <div className="header-content">
            <div className="header-left">
              <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                {isCollapsed ? <FaChevronRight /> : <FaBars />}
              </button>
              <div className="page-info">
                <h1 className="page-title">{currentPageTitle}</h1>
                <p className="breadcrumb">{breadcrumb}</p>
              </div>
            </div>
            <div className="header-right">
              <div className="user-menu-container">
                <button className="user-menu-button" onClick={toggleUserMenu}>
                  <img
                    className="user-avatar"
                    src="https://placehold.co/100x100/E2E8F0/4A5568?text=AVT"
                    alt="Avatar người dùng"
                  />
                  <div className="user-info">
                    <p className="user-name">Nguyễn Văn A</p>
                    <p className="user-role">Thủ kho</p>
                  </div>
                </button>
                {showUserMenu && (
                  <div className="user-menu-dropdown">
                    <button className="dropdown-item">Tài khoản</button>
                    <button className="dropdown-item">Cài đặt</button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout">Đăng xuất</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export default CashierLayout;
