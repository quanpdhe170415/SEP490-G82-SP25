"use client";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Inventory.css";
import SidebarWH from "../../components/common/Sidebar_wh";
import HeaderWH from "../../components/common/Header_wh";
import CancelInventoryModal from "./cancel-inventory-modal";

// API service functions
const apiService = {
  getInventoryCheckBySchedule: async (scheduleId) => {
    try {
      const response = await fetch(
        `http://localhost:9999/api/inventorySchedule/${scheduleId}/check`
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return data.data;
    } catch (error) {
      throw new Error("Không thể tải phiếu kiểm kho: " + error.message);
    }
  },

  // Lấy danh sách khu vực kiểm kho
  getInventoryAreas: async (checkId, status = "all") => {
    try {
      const response = await fetch(
        `http://localhost:9999/api/inventoryCheck/checks/${checkId}/areas?status=${status}`
      );
      console.log('API Response:', response);

      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (error) {
      console.error('Error in getInventoryAreas:', error);
      throw error;
    }
  },

  // Bắt đầu kiểm kho
  startInventory: async (checkId) => {
    try {
      const response = await fetch(`http://localhost:9999/api/inventoryCheck/checks/${checkId}/start`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error('Error starting inventory:', error);
      throw error;
    }
  },

  // Hoàn tất kiểm kho
  completeInventory: async (checkId) => {
    try {
      const response = await fetch(`http://localhost:9999/api/inventoryCheck/checks/${checkId}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error('Error completing inventory:', error);
      throw error;
    }
  },

  // Hủy kiểm kho
  cancelInventory: async (checkId, reason) => {
    try {
      const response = await fetch(`http://localhost:9999/api/inventoryCheck/checks/${checkId}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error('Error canceling inventory:', error);
      throw error;
    }
  },
};

export default function WarehouseDashboard() {
  // Get inventory check ID from URL params
  const { scheduleId } = useParams();

  // State variables
  const [taskAreas, setTaskAreas] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState("not-started");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [inventoryCode, setInventoryCode] = useState("");
  const [inventoryName, setInventoryName] = useState("");
  const [priorityNotice, setPriorityNotice] = useState("");
  const [tabFilter, setTabFilter] = useState("all");
  const [totalProgress, setTotalProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkId, setCheckId] = useState(null);
  const [scheduleStartDate, setScheduleStartDate] = useState(null);
  const [scheduleStartTime, setScheduleStartTime] = useState(null);

  // Load inventory check data
  useEffect(() => {
    const loadInventoryCheck = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const check = await apiService.getInventoryCheckBySchedule(scheduleId);
        console.log("Loaded inventory check:", check);
        
        if (check) {
          setCheckId(check._id);
          setInventoryCode(check.inventory_code);
          setInventoryName(check.inventory_name);
          setInventoryStatus(check.status || "not-started");
          setPriorityNotice(check.note || "");

          if (check.schedule_id?.start_date) {
            setScheduleStartDate(new Date(check.schedule_id.start_date));
          }
          if (check.schedule_id?.time_start) {
            setScheduleStartTime(check.schedule_id.time_start);
          }

          if (check.check_start_time) {
            setStartTime(new Date(check.check_start_time));
          }

          if (check.check_end_time) {
            setEndTime(new Date(check.check_end_time));
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error loading inventory check:", err);
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      loadInventoryCheck();
    }
  }, [scheduleId]);

  // Load areas when checkId is available
  useEffect(() => {
    const loadInventoryAreas = async () => {
      if (!checkId) return;
      
      try {
        console.log('Loading areas for checkId:', checkId, 'with filter:', tabFilter);
        const response = await apiService.getInventoryAreas(checkId, tabFilter);
        console.log('Areas response:', response);
        
        setTaskAreas(response.data || []);
        setTotalProgress(response.totalProgress || 0);
      } catch (err) {
        console.error("Error loading inventory areas:", err);
        setError(err.message);
      }
    };

    loadInventoryAreas();
  }, [checkId, tabFilter]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Calculate counts for tab filters
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

  const handleStartInventory = async () => {
    try {
      if (!checkId) return;
      setLoading(true);

      const result = await apiService.startInventory(checkId);
      console.log('Start inventory result:', result);

      setInventoryStatus('in-progress');
      
      // Set start time
      let checkStartTime = null;
      if (scheduleStartDate && scheduleStartTime) {
        const [hours, minutes, seconds] = scheduleStartTime.split(":").map(Number);
        checkStartTime = new Date(scheduleStartDate);
        checkStartTime.setHours(hours, minutes, seconds || 0);
      } else {
        checkStartTime = new Date();
      }
      
      setStartTime(checkStartTime);
      
      // Reload areas to reflect status changes
      const response = await apiService.getInventoryAreas(checkId, tabFilter);
      setTaskAreas(response.data || []);
      setTotalProgress(response.totalProgress || 0);
      
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteInventory = async () => {
    try {
      if (!checkId) return;
      setLoading(true);
      
      const result = await apiService.completeInventory(checkId);
      console.log('Complete inventory result:', result);

      setInventoryStatus('completed');
      setEndTime(new Date(result.checkEndTime));

      // Reload areas
      const response = await apiService.getInventoryAreas(checkId, tabFilter);
      setTaskAreas(response.data || []);
      setTotalProgress(response.totalProgress || 0);

      alert('Kiểm kho đã được hoàn tất thành công');
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleConfirmCancel = async (data) => {
    try {
      if (!checkId) return;
      setLoading(true);
      
      const result = await apiService.cancelInventory(checkId, data.reason);
      console.log('Cancel inventory result:', result);

      setInventoryStatus('not-started');
      setStartTime(null);
      setEndTime(null);
      setIsCancelModalOpen(false);

      // Reload areas
      const response = await apiService.getInventoryAreas(checkId, tabFilter);
      setTaskAreas(response.data || []);
      setTotalProgress(response.totalProgress || 0);

      alert('Kiểm kho đã được hủy thành công');
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditResults = () => {
    console.log("Editing inventory results...");
  };

  const handleExportReport = () => {
    console.log("Exporting inventory report...");
  };

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading state
  if (loading && !checkId) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !checkId) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Lỗi!</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
                  <h1>{inventoryName}</h1>
                  <div className="header-details">
                    <span>
                      <strong>Mã kiểm kho:</strong> {inventoryCode}
                    </span>
                    <span>
                      <strong>Ngày:</strong>{" "}
                      {inventoryStatus === "not-started" && scheduleStartDate
                        ? scheduleStartDate.toLocaleDateString("vi-VN")
                        : startTime
                        ? startTime.toLocaleDateString("vi-VN")
                        : "Chưa xác định"}
                    </span>
                    <span>
                      <strong>Thời gian bắt đầu:</strong>{" "}
                      {inventoryStatus === "not-started" && scheduleStartTime
                        ? scheduleStartTime
                        : startTime
                        ? formatTime(startTime)
                        : "Chưa xác định"}
                    </span>
                  </div>
                  {priorityNotice && (
                    <div className="priority-notice">
                      <span>{priorityNotice}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="header-actions">
                    {inventoryStatus === "not-started" && (
                      <button
                        className="btn btn-primary"
                        onClick={handleStartInventory}
                        disabled={loading}
                      >
                        {loading ? "Đang xử lý..." : "Bắt đầu kiểm kê"}
                      </button>
                    )}
                    {inventoryStatus === "in-progress" && (
                      <>
                        <button
                          className="btn btn-outline"
                          onClick={handleExportReport}
                        >
                          Xuất biên bản
                        </button>
                        <button
                          className="btn btn-destructive"
                          onClick={handleOpenCancelModal}
                        >
                          Hủy kiểm kho
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={handleCompleteInventory}
                          disabled={loading}
                        >
                          {loading ? "Đang xử lý..." : "Hoàn tất kiểm kê"}
                        </button>
                      </>
                    )}
                    {inventoryStatus === "completed" && (
                      <>
                        <button
                          className="btn btn-outline"
                          onClick={handleExportReport}
                        >
                          Xuất biên bản
                        </button>
                        <button
                          className="btn btn-destructive"
                          onClick={handleOpenCancelModal}
                        >
                          Hủy kiểm kho
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleEditResults}
                        >
                          Chỉnh sửa
                        </button>
                      </>
                    )}
                  </div>
                  {(startTime || (endTime && inventoryStatus === "completed")) && (
                    <div className="time-info flex items-center gap-2">
                      {startTime && (
                        <span className="start">
                          <strong>Bắt đầu:</strong> {formatTime(startTime)}
                        </span>
                      )}
                      {endTime && inventoryStatus === "completed" && (
                        <span className="end">
                          <strong>Kết thúc:</strong> {formatTime(endTime)}
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
                    Đang kiểm: {checkingCount}
                  </span>
                </div>
                <div className="status-item">
                  <div className="status-icon green"></div>
                  <span className="status-text">
                    Hoàn thành: {completedCount}
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
                {taskAreas.map((area) => (
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
