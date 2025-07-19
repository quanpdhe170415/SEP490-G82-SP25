"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import "./Inventory.css";
import SidebarWH from "../../components/common/Sidebar_wh";
import HeaderWH from "../../components/common/Header_wh";
export default function WarehouseDashboard() {
  const [taskAreas] = useState([
    {
      id: "area-a",
      name: "Khu vực A - Thực phẩm khô",
      description: "Kiểm tra khu vực thực phẩm khô",
      totalItems: 5,
      completedItems: 3,
      inProgressItems: 8,
      pendingItems: 2,
      completionPercentage: 60,
      status: "checking",
    },
    {
      id: "area-b",
      name: "Khu vực B - Đồ uống",
      description: "Kiểm tra khu vực đồ uống",
      totalItems: 2,
      completedItems: 2,
      inProgressItems: 0,
      pendingItems: 0,
      completionPercentage: 100,
      status: "completed",
    },
    {
      id: "area-c1",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-c2",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },{
      id: "area-c3",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },{
      id: "area-c4",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },{
      id: "area-c5",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },{
      id: "area-b2",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },{
      id: "area-b3",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },{
      id: "area-c7",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },{
      id: "area-c9",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },{
      id: "area-c10",
      name: "Khu vực C - Hóa mỹ phẩm",
      description: "Kiểm tra khu vực hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
  ]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [tabFilter, setTabFilter] = useState("all");

  const totalProgress = Math.round(
    taskAreas.reduce((acc, area) => acc + area.completionPercentage, 0) /
      taskAreas.length
  );

  const allCount = taskAreas.length;
  const notStartedCount = taskAreas.filter(
    (area) => area.status === "not-started"
  ).length;
  const checkingCount = taskAreas.filter(
    (area) => area.status === "checking"
  ).length;
  const completedCount = taskAreas.filter(
    (area) => area.status === "completed"
  ).length;

  const filteredAreas = taskAreas.filter((area) => {
    if (tabFilter === "all") return true;
    return area.status === tabFilter;
  });

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <SidebarWH isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: isCollapsed ? "70px" : "280px",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {/* Header */}
        <HeaderWH onSidebarToggle={toggleSidebar} />
        <div className="dashboard-container">
          <div className="dashboard-wrapper">
            {/* Header */}
            <div className="dashboard-header">
              <div className="header-content">
                <div className="header-info">
                  <h1>Kiểm Kê Kho</h1>
                  <div className="header-details">
                    <span>
                      <strong>Mã kiểm kho:</strong> KK2025-001
                    </span>
                    <span>
                      <strong>Ngày:</strong> 28/06/2025
                    </span>
                    <span>
                      <strong>Bắt đầu:</strong> 9:00 AM
                    </span>
                  </div>
                </div>
                <div className="header-actions">
                  <button className="btn btn-outline"> Xuất biên bản</button>
                  <button className="btn btn-destructive"> Hủy kiểm kho</button>
                  <button className="btn btn-success">
                    {" "}
                    Hoàn tất và gửi quản lý
                  </button>
                </div>
              </div>

              <div className="priority-notice">
                <span>
                  ⚠️ Ưu tiên kiểm tra Khu vực B - Đồ uống để nhập hàng mới
                </span>
              </div>

              {/* Status Bar */}
              <div className="status-bar">
                <div className="status-item">
                  <div className="status-icon gray"></div>
                  <span className="status-text">
                    Tiến độ hoàn thành: {totalProgress}%
                  </span>
                </div>
                <div className="status-item">
                  <div className="status-icon blue"></div>
                  <span className="status-text">
                    Đang kiểm:{" "}
                    {taskAreas.filter((a) => a.status === "checking").length}
                  </span>
                </div>
                <div className="status-item">
                  <div className="status-icon green"></div>
                  <span className="status-text">
                    Hoàn thành:{" "}
                    {taskAreas.filter((a) => a.status === "completed").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Task Areas Grid */}
            <div className="task-areas">
              <h2>Danh sách công việc</h2>

              {/* Tab-style Status Filters */}
              <div className="tab-container">
                <div className="tab-filters">
                  <button
                    onClick={() => setTabFilter("all")}
                    className={`tab-button ${
                      tabFilter === "all" ? "active" : "inactive"
                    }`}
                  >
                    Tất cả ({allCount})
                  </button>
                  <button
                    onClick={() => setTabFilter("not-started")}
                    className={`tab-button ${
                      tabFilter === "not-started" ? "active" : "inactive"
                    }`}
                  >
                    Chưa bắt đầu ({notStartedCount})
                  </button>
                  <button
                    onClick={() => setTabFilter("checking")}
                    className={`tab-button ${
                      tabFilter === "checking" ? "active" : "inactive"
                    }`}
                  >
                    Đang kiểm ({checkingCount})
                  </button>
                  <button
                    onClick={() => setTabFilter("completed")}
                    className={`tab-button ${
                      tabFilter === "completed" ? "active" : "inactive"
                    }`}
                  >
                    Hoàn thành ({completedCount})
                  </button>
                </div>
              </div>

              <div className="areas-grid">
                {filteredAreas.map((area) => (
                  <div key={area.id} className="area-card">
                    <div className="area-card-content">
                      <div className="area-header">
                        <h3 className="area-title">{area.name}</h3>
                        <div className="area-progress">
                          <div className="progress-percentage">
                            {area.completionPercentage}%
                          </div>
                          <div className="progress-label">Tiến độ</div>
                        </div>
                      </div>

                      <div className="area-stats">
                        <div className="stat-row">
                          <span className="stat-label">Tổng số:</span>
                          <span className="stat-value">
                            {area.totalItems} mục
                          </span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Hoàn thành:</span>
                          <span className="stat-value success">
                            {area.completedItems} mục
                          </span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Chưa kiểm:</span>
                          <span className="stat-value">
                            {area.pendingItems} mục
                          </span>
                        </div>
                      </div>

                      <div className="progress-section">
                        <div className="progress-info">
                          <span>Tiến độ hoàn thành</span>
                          <span>
                            {area.completedItems}/{area.totalItems}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${area.completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <Link
                        to={`/inventory/inventory-schedule/inventory-control/${area.id}`}
                        className={`area-action ${
                          area.status === "completed" ? "secondary" : "primary"
                        }`}
                      >
                        {area.status === "completed"
                          ? "Xem chi tiết"
                          : area.status === "checking"
                          ? "Tiếp tục kiểm kê"
                          : "Bắt đầu kiểm kê"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
