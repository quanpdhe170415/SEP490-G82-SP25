"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import "./Inventory.css";
import SidebarWH from "../../components/common/Sidebar_wh";
import HeaderWH from "../../components/common/Header_wh";
import CancelInventoryModal from "./cancel-inventory-modal";
export default function WarehouseDashboard() {
  const [taskAreas] = useState([
    {
      id: "area-a",
      name: "Kệ A - Thực phẩm khô",
      description: "Kiểm tra Kệ thực phẩm khô",
      totalItems: 5,
      completedItems: 0,
      inProgressItems: 8,
      pendingItems: 5,
      completionPercentage: 0,
      status: "checking",
    },
    {
      id: "area-b",
      name: "Kệ B - Đồ uống",
      description: "Kiểm tra Kệ đồ uống",
      totalItems: 2,
      completedItems: 2,
      inProgressItems: 0,
      pendingItems: 0,
      completionPercentage: 100,
      status: "completed",
    },
    {
      id: "area-c1",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-c2",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-c3",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-c4",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-c5",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-b2",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-b3",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-c7",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-c9",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
    {
      id: "area-c10",
      name: "Kệ C - Hóa mỹ phẩm",
      description: "Kiểm tra Kệ hóa mỹ phẩm",
      totalItems: 20,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 20,
      completionPercentage: 0,
      status: "not-started",
    },
  ]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState("not-started"); // not-started, in-progress, completed
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const inventoryCode = "KK2025-001";

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

  const handleStartInventory = () => {
    const now = new Date();
    setStartTime(now);
    setInventoryStatus("in-progress");
  };

  const handleCompleteInventory = () => {
    const now = new Date();
    setEndTime(now);
    setInventoryStatus("completed");
  };

  const handleCancelInventory = () => {
    setInventoryStatus("not-started");
    setStartTime(null);
    setEndTime(null);
  };

  const handleOpenCancelModal = () => {
    setIsCancelModalOpen(true)
  }

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false)
  }

  const handleConfirmCancel = (data) => {
    console.log("Cancel request data:", data)
    // Here you would typically send the cancellation request to your backend
    // For now, we'll just reset the inventory status
    setInventoryStatus("not-started")
    setStartTime(null)
    setEndTime(null)
    setIsCancelModalOpen(false)

    // Show success message
    alert("Yêu cầu hủy kiểm kho đã được gửi thành công!")
  }

  const handleEditResults = () => {
    // Logic for editing results
    console.log("Editing inventory results...");
  };

  const handleExportReport = () => {
    // Logic for exporting report
    console.log("Exporting inventory report...");
  };

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

              <div className="header-content flex justify-between items-center flex-wrap gap-4">
                <div className="header-info">
                  <h1>Kiểm tra định kỳ tháng 7</h1>
                  <div className="header-details">
                    <span>
                      <strong>Mã kiểm kho:</strong> {inventoryCode}
                    </span>
                    <span>
                      <strong>Ngày:</strong> 28/06/2025
                    </span>
                    <span>
                      <strong>Thời gian bắt đầu:</strong> 9:00 AM
                    </span>
                  </div>
                  <div className="priority-notice">
                    <span>⚠️ Ưu tiên kiểm tra Kệ B - Đồ uống để nhập hàng mới</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="header-actions">
                    {inventoryStatus === "not-started" && (
                      <button className="btn btn-primary" onClick={handleStartInventory}>
                        Bắt đầu kiểm kê
                      </button>
                    )}
                    {inventoryStatus === "in-progress" && (
                      <>
                        <button className="btn btn-outline" onClick={handleExportReport}>
                          Xuất biên bản
                        </button>
                        <button className="btn btn-destructive" onClick={handleOpenCancelModal}>
                          Hủy kiểm kho
                        </button>
                        <button className="btn btn-success" onClick={handleCompleteInventory}>
                          Hoàn tất kiểm kê
                        </button>
                      </>
                    )}
                    {inventoryStatus === "completed" && (
                      <>
                        <button className="btn btn-outline" onClick={handleExportReport}>
                          Xuất biên bản
                        </button>
                        <button className="btn btn-destructive" onClick={handleOpenCancelModal}>
                          Hủy kiểm kho
                        </button>
                        <button className="btn btn-secondary" onClick={handleEditResults}>
                          Chỉnh sửa
                        </button>
                      </>
                    )}
                  </div>
                  {(startTime || (endTime && inventoryStatus === "completed")) && (
                    <div className="time-info flex items-center gap-2">
                      {startTime && (
                        <span className="start">
                          <strong >Bắt đầu:</strong> {formatTime(startTime)}    
                        </span>
                      )}
                      {endTime && inventoryStatus === "completed" && (
                        <span className="end">
                          <strong >Kết thúc:</strong> {formatTime(endTime)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
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

                      {inventoryStatus !== "not-started" && (
                        <Link
                          to={`/inventory/inventory-schedule/inventory-control/${area.id}`}
                          className={`area-action ${
                            area.status === "completed"
                              ? "secondary"
                              : "primary"
                          }`}
                        >
                          {area.status === "completed"
                            ? "Xem chi tiết"
                            : area.status === "checking"
                            ? "Tiếp tục kiểm kê"
                            : "Bắt đầu kiểm kê"}
                        </Link>
                      )}

                      {inventoryStatus === "not-started" && (
                        <div className="area-action disabled">
                          Chưa bắt đầu kiểm kê
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CancelInventoryModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        inventoryCode={inventoryCode}
      />
    </div>
  );
}
