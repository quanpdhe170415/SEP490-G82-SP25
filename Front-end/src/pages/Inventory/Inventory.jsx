import { useState } from "react";
import {
  Search,
  FileDown,
  X,
  Camera,
  Upload,
  Save,
  Play,
  Eye,
} from "lucide-react";
import "./Inventory.css";
import SidebarWH from "../../components/common/Sidebar_wh"
import HeaderWH from "../../components/common/Header_wh"

const Inventory = () => {
  const [totalItems] = useState(10);
  const [completedItems, setCompletedItems] = useState(3);
  const [checkingItems, setCheckingItems] = useState(2);
  const [pendingItems, setPendingItems] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNotes, setCancelNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }
  const [sections, setSections] = useState([
    {
      id: "1",
      title: "Kiểm tra số lượng gạo",
      status: "checking",
      totalItems: 5,
      completedItems: 1,
      isExpanded: true,
      items: [
        {
          code: "G-0001",
          name: "Gạo tám thơm",
          unit: "Bao",
          location: "Kệ A - 4",
          quantity: 9,
        },
        {
          code: "G-0002",
          name: "Gạo ST25",
          unit: "Bao",
          location: "Kệ A - 3",
          quantity: 0,
        },
        {
          code: "G-0003",
          name: "Gạo nếp",
          unit: "Bao",
          location: "Kệ A - 4",
          quantity: 5,
        },
        {
          code: "G-0004",
          name: "Gạo tẻ",
          unit: "Bao",
          location: "Kệ A - 2",
          quantity: 2,
        },
        {
          code: "G-0005",
          name: "Gạo jasmine",
          unit: "Bao",
          location: "Kệ A - 1",
          quantity: 15,
        },
      ],
    },
    {
      id: "2",
      title: "Kiểm tra kệ B",
      status: "not-checked",
      totalItems: 25,
      completedItems: 0,
      isExpanded: false,
      items: [],
    },
    {
      id: "3",
      title: "Kiểm tra Coca 1.5L",
      status: "completed",
      totalItems: 1,
      completedItems: 1,
      isExpanded: false,
      items: [
        {
          code: "C-0001",
          name: "Coca Cola 1.5L",
          unit: "Chai",
          location: "Kệ C - 1",
          quantity: 24,
        },
      ],
    },
  ]);

  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  const toggleSection = (sectionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const updateQuantity = (sectionId, itemCode, newQuantity) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.code === itemCode
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            }
          : section
      )
    );
  };

  const saveResults = (sectionId) => {
    alert("Đã lưu kết quả kiểm kho!");
    setCompletedItems((prev) => prev + 1);
    setCheckingItems((prev) => prev - 1);
  };

  const startChecking = (sectionId) => {
    alert("Bắt đầu kiểm tra!");
    setCheckingItems((prev) => prev + 1);
    setPendingItems((prev) => prev - 1);
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, status: "checking" } : section
      )
    );
  };

  const exportReport = () => {
    const reportData = generateReportData();
    downloadCSV(
      reportData,
      `BaoCaoKiemKho_KK2025-001_${new Date().toISOString().split("T")[0]}.csv`
    );
    alert("✅ Báo cáo đã được xuất thành công!");
  };

  const generateReportData = () => {
    const currentDate = new Date().toLocaleDateString("vi-VN");
    const currentTime = new Date().toLocaleTimeString("vi-VN");

    const headerData = [
      ["BÁO CÁO KIỂM KHO"],
      [""],
      ["Mã kiểm kho:", "KK2025-001"],
      ["Ngày thực hiện:", "28/06/2025"],
      ["Thời gian bắt đầu:", "9:00 AM"],
      ["Thời gian xuất báo cáo:", `${currentDate} ${currentTime}`],
      ["Người thực hiện:", "Nhân viên kiểm kho"],
      [""],
      ["TỔNG QUAN TIẾN ĐỘ"],
      ["Tổng số mục:", totalItems],
      ["Đã hoàn thành:", completedItems],
      ["Đang kiểm tra:", checkingItems],
      ["Chưa kiểm tra:", pendingItems],
      ["Tỷ lệ hoàn thành:", `${completionPercentage}%`],
      [""],
      ["CHI TIẾT KIỂM KHO"],
      [
        "Mã hàng",
        "Tên hàng",
        "Đơn vị tính",
        "Vị trí",
        "Số lượng thực tế",
        "Trạng thái",
        "Ghi chú",
      ],
    ];

    const inventoryData = [];
    sections.forEach((section) => {
      section.items.forEach((item) => {
        inventoryData.push([
          item.code,
          item.name,
          item.unit,
          item.location,
          item.quantity.toString(),
          section.status === "completed"
            ? "Hoàn thành"
            : section.status === "checking"
            ? "Đã kiểm"
            : "Chưa kiểm",
          item.quantity === 0
            ? "Hết hàng"
            : item.quantity < 5
            ? "Số lượng thấp"
            : "Bình thường",
        ]);
      });
    });

    return [...headerData, ...inventoryData];
  };

  const downloadCSV = (data, filename) => {
    const csvContent = data
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const submitFinalReport = () => {
    if (completedItems < totalItems) {
      alert(
        "Vui lòng hoàn thành tất cả các mục kiểm tra trước khi gửi báo cáo!"
      );
      return;
    }
    setShowConfirmModal(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitCancelRequest = () => {
    if (!cancelReason || cancelNotes.length < 10) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setTimeout(() => {
      alert("✅ Yêu cầu hủy kiểm kho đã được gửi thành công!");
      setCancelModalOpen(false);
      setCancelReason("");
      setCancelNotes("");
      setSelectedImage(null);
      setImagePreview(null);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "checking":
        return <span className="status-badge status-checking">Đang kiểm</span>;
      case "not-checked":
        return (
          <span className="status-badge status-not-checked">Chưa kiểm</span>
        );
      case "completed":
        return (
          <span className="status-badge status-completed">Hoàn thành</span>
        );
      default:
        return <span className="status-badge">Không xác định</span>;
    }
  };

  const filteredSections = sections.filter((section) => {
    if (filterStatus === "all") return true;
    return section.status === filterStatus;
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
        <div className="warehouse-container">
          <div className="warehouse-content">
            {/* Header */}
            <div className="warehouse-header">
              
              <div className="header-top">
                <div className="header-left">
                  <h1 className="header-title">Thực Thi Kiểm Kho </h1>
                  <div className="header-info">
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
                <div className="header-right">
                  <button onClick={exportReport} className="btn btn-outline">
                    <FileDown size={16} />
                    Xuất báo cáo
                  </button>
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="btn btn-danger"
                  >
                    <X size={16} />
                    Hủy kiểm kho
                  </button>
                  <button
                    onClick={submitFinalReport}
                    disabled={completedItems < totalItems}
                    className="btn btn-primary"
                  >
                    📋{" "}
                    {completedItems === totalItems
                      ? "Hoàn tất và gửi quản lý"
                      : `Hoàn tất (${completionPercentage}%)`}
                  </button>
                </div>
              </div>

              <div className="status-bar">
                <div className="status-item">
                  <div className="status-icon status-total">⊙</div>
                  <span>
                    Tiến độ: {completedItems}/{totalItems}
                  </span>
                </div>
                <div className="status-item">
                  <div className="status-icon status-progress">↻</div>
                  <span>Đang kiểm: {checkingItems}</span>
                </div>
                <div className="status-item">
                  <div className="status-icon status-pending">✗</div>
                  <span>Chưa kiểm: {pendingItems}</span>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="search-section">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Nhập mã hàng hoặc tên hàng hóa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="checking">Đang kiểm</option>
                <option value="not-checked">Chưa kiểm</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>

            {/* Inventory Sections */}
            <div>
              {filteredSections.map((section) => (
                <div key={section.id} className="inventory-section">
                  <div
                    className="section-header"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="section-header-content">
                      <div>
                        <h3 className="section-title">{section.title}</h3>
                        <div className="section-meta">
                          {getStatusBadge(section.status)}
                          <span>{section.totalItems} mặt hàng</span>
                          {section.status === "checking" && (
                            <span className="progress-badge-small">
                              {section.completedItems}/{section.totalItems}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {section.isExpanded && (
                    <div>
                      {section.items.length > 0 ? (
                        <>
                          <div style={{ overflowX: "auto" }}>
                            <table className="inventory-table">
                              <thead>
                                <tr>
                                  <th>Mã hàng</th>
                                  <th>Tên hàng</th>
                                  <th>ĐVT</th>
                                  <th>Vị trí</th>
                                  <th>SL thực tế</th>
                                </tr>
                              </thead>
                              <tbody>
                                {section.items
                                  .filter(
                                    (item) =>
                                      searchTerm === "" ||
                                      item.code
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase()) ||
                                      item.name
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase())
                                  )
                                  .map((item) => (
                                    <tr key={item.code}>
                                      <td>{item.code}</td>
                                      <td>{item.name}</td>
                                      <td>{item.unit}</td>
                                      <td>{item.location}</td>
                                      <td>
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.quantity}
                                          onChange={(e) =>
                                            updateQuantity(
                                              section.id,
                                              item.code,
                                              Number.parseInt(e.target.value) ||
                                                0
                                            )
                                          }
                                          className="quantity-input"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="section-actions section-actions-right">
                            <button
                              onClick={() => saveResults(section.id)}
                              className="btn btn-primary"
                            >
                              <Save size={16} />
                              Lưu kết quả
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="section-actions">
                          {section.status === "not-checked" ? (
                            <button
                              onClick={() => startChecking(section.id)}
                              className="btn btn-success"
                            >
                              <Play size={16} />
                              Bắt đầu kiểm tra
                            </button>
                          ) : (
                            <button className="btn btn-secondary">
                              <Eye size={16} />
                              Xem chi tiết
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button className="page-btn">‹‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">››</button>
            </div>

            {/* Cancel Modal */}
            {cancelModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3 className="modal-title">
                      <X size={20} />
                      Hủy kiểm kho
                    </h3>
                    <button
                      className="modal-close"
                      onClick={() => setCancelModalOpen(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <div>
                    <div className="form-group">
                      <label className="form-label">Lý do hủy kiểm kho *</label>
                      <select
                        className="form-select"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      >
                        <option value="">-- Chọn lý do hủy --</option>
                        <option value="locked_area">
                          Khu vực bị khóa/không thể tiếp cận
                        </option>
                        <option value="messy_goods">
                          Hàng hóa bị lộn xộn, không thể kiểm đếm
                        </option>
                        <option value="missing_tools">
                          Thiếu dụng cụ kiểm kho
                        </option>
                        <option value="system_error">Lỗi hệ thống</option>
                        <option value="safety_issue">
                          Vấn đề an toàn lao động
                        </option>
                        <option value="time_constraint">
                          Không đủ thời gian hoàn thành
                        </option>
                        <option value="staff_shortage">Thiếu nhân lực</option>
                        <option value="other">Lý do khác</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ghi chú chi tiết *</label>
                      <textarea
                        className="form-textarea"
                        value={cancelNotes}
                        onChange={(e) => setCancelNotes(e.target.value)}
                        placeholder="Mô tả chi tiết tình huống và lý do cần hủy kiểm kho..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Đính kèm hình ảnh (tùy chọn)
                      </label>
                      <div className="image-upload-section">
                        <div className="image-upload-buttons">
                          <button
                            type="button"
                            className="upload-btn"
                            onClick={() =>
                              document.getElementById("camera-input")?.click()
                            }
                          >
                            <Camera size={16} />
                            Chụp ảnh
                          </button>
                          <button
                            type="button"
                            className="upload-btn"
                            onClick={() =>
                              document.getElementById("file-input")?.click()
                            }
                          >
                            <Upload size={16} />
                            Chọn file
                          </button>
                        </div>
                        <input
                          id="camera-input"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageUpload}
                          className="file-input"
                        />
                        <input
                          id="file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file-input"
                        />
                        <p className="upload-hint">
                          Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                        </p>
                        {imagePreview && (
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="image-preview"
                            style={{ display: "block", margin: "1rem auto 0" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-outline"
                      onClick={() => setCancelModalOpen(false)}
                    >
                      Đóng
                    </button>
                    <button
                      onClick={submitCancelRequest}
                      disabled={!cancelReason || cancelNotes.length < 10}
                      className="btn btn-danger"
                    >
                      Gửi yêu cầu hủy
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showConfirmModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3 className="modal-title">
                      Xác nhận gửi báo cáo kiểm kho cho quản lý?
                    </h3>
                    <button
                      className="modal-close"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-outline"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Hủy
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setShowConfirmModal(false);
                        setTimeout(() => {
                          alert(
                            "✅ Báo cáo kiểm kho đã được gửi thành công cho quản lý!"
                          );
                        }, 1000);
                      }}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
