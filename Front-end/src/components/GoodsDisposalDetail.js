import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Bell, User, Package, FileText, Trash2, ArrowLeft } from "lucide-react";
import axios from "axios";
import "./Css/GoodsDisposalDetail.css";

export default function GoodsDisposalDetail() {
  const { id } = useParams(); // Get the ID from URL parameters
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [disposalData, setDisposalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Phiếu tạm");

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchDisposalDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:9999/api/goods-disposal/detail/${id}`);
        
        if (response.data.success) {
          const data = response.data.data;
          setDisposalData(data);
          setNotes(data.notes || "");
          
          // Map status from API to display format
          const statusMap = {
            "approved": "Đã hoàn thành",
            "pending": "Phiếu tạm",
            "cancelled": "Đã hủy"
          };
          setStatus(statusMap[data.status] || "Phiếu tạm");
        }
      } catch (err) {
        console.error("Error fetching disposal detail:", err);
        setError("Không thể tải dữ liệu phiếu xuất hủy");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDisposalDetail();
    }
  }, [id]);

  // Handle save draft
  const handleSaveDraft = async () => {
    try {
      // Add API call to save draft
      console.log("Saving draft...");
    } catch (err) {
      console.error("Error saving draft:", err);
    }
  };

  // Handle complete disposal
  const handleComplete = async () => {
    try {
      // Add API call to complete disposal
      console.log("Completing disposal...");
    } catch (err) {
      console.error("Error completing disposal:", err);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!disposalData) {
    return (
      <div className="inventory-container">
        <div className="error">Không tìm thấy dữ liệu</div>
      </div>
    );
  }

  const totalDisposalQuantity = disposalData.disposal_items.reduce(
    (sum, item) => sum + item.quantity_disposed, 0
  );
  const totalDisposalValue = disposalData.total_disposal_value;

  return (
    <div className="inventory-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <Package size={24} />
          </div>
          <h1 className="company-name">Tạp hóa Hải Chi</h1>
        </div>
        <div className="header-right">
          <Bell size={20} />
        </div>
      </header>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <div className="nav-item">
              <Package size={16} />
              <span>Nhập hàng</span>
            </div>
            <div className="nav-item">
              <ArrowLeft size={16} />
              <span>Xuất trả hàng</span>
            </div>
            <div className="nav-item active">
              <Trash2 size={16} />
              <span>Xuất hủy</span>
            </div>
            <div className="nav-item">
              <FileText size={16} />
              <span>Xuất hàng</span>
            </div>
          </nav>

          <div className="user-section">
            <User size={20} />
          </div>
        </aside>

        {/* Content Area */}
        <main className="content">
          <div className="content-header">
            <div className="header-left-section">
              <button onClick={handleBack} className="back-btn">
                <ArrowLeft size={16} />
                Quay lại
              </button>
              <h2>Xuất hủy - {disposalData.disposal_number}</h2>
            </div>
            <button className="save-draft-btn" onClick={handleSaveDraft}>
              Lưu tạm
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <Search size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Main Content Split */}
          <div className="content-split">
            {/* Left Side - Table */}
            <div className="table-section">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã hàng</th>
                      <th>Tên hàng</th>
                      <th>ĐVT</th>
                      <th>SL hủy</th>
                      <th>Giá vốn</th>
                      <th>Giá trị hủy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disposalData.disposal_items
                      .filter((item) =>
                        searchTerm === "" ||
                        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.product_info.barcode.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item, index) => (
                        <tr key={item.disposal_item_id}>
                          <td>{index + 1}</td>
                          <td>{item.product_info.barcode}</td>
                          <td>{item.product_name}</td>
                          <td>{item.unit_of_measure}</td>
                          <td>{item.quantity_disposed}</td>
                          <td>{item.cost_price.toLocaleString()}</td>
                          <td>{item.disposal_value.toLocaleString()}</td>
                        </tr>
                      ))}
                    {/* Empty rows for visual spacing */}
                    {Array.from({ length: Math.max(0, 8 - disposalData.disposal_items.length) }).map((_, index) => (
                      <tr key={`empty-${index}`}>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination">
                <span>Trang</span>
              </div>
            </div>

            {/* Right Side - Info Panel */}
            <div className="info-panel">
              <div className="info-header">
                <div className="info-row">
                  <span className="info-label">
                    Người tạo: {disposalData.created_by.username}
                  </span>
                  <span className="info-date">
                    {new Date(disposalData.disposal_date).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="info-content">
                <div className="info-item">
                  <span className="info-label">
                    Mã xuất hủy: {disposalData.disposal_number}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">
                    Trạng thái: {status.toLowerCase()}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">
                    Tổng giá trị hủy (₫): {totalDisposalValue.toLocaleString()}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">
                    Tổng số lượng hủy: {totalDisposalQuantity}
                  </span>
                </div>

                {disposalData.approved_by && (
                  <div className="info-item">
                    <span className="info-label">
                      Người phê duyệt: {disposalData.approved_by.username}
                    </span>
                  </div>
                )}

                {disposalData.confirmed_by && (
                  <div className="info-item">
                    <span className="info-label">
                      Người xác nhận: {disposalData.confirmed_by.username}
                    </span>
                  </div>
                )}

                <div className="info-item notes-section">
                  <label className="info-label">Ghi chú:</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập ghi chú..."
                    rows={4}
                    className="notes-textarea"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="panel-actions">
                <button className="btn-secondary" onClick={handleSaveDraft}>
                  Lưu tạm
                </button>
                <button className="btn-primary" onClick={handleComplete}>
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>

          {/* Additional Item Details Section */}
          <div className="item-details-section">
            <h3>Chi tiết sản phẩm hủy</h3>
            <div className="item-details-grid">
              {disposalData.disposal_items.map((item, index) => (
                <div key={item.disposal_item_id} className="item-detail-card">
                  <div className="item-card-header">
                    <h4>{item.product_name}</h4>
                    <span className="item-barcode">{item.product_info.barcode}</span>
                  </div>
                  
                  <div className="item-card-content">
                    <div className="item-info-row">
                      <span>Lô sản xuất:</span>
                      <span>{item.batch_number}</span>
                    </div>
                    <div className="item-info-row">
                      <span>Ngày sản xuất:</span>
                      <span>
                        {new Date(item.product_info.manufacturing_date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="item-info-row">
                      <span>Ngày hết hạn:</span>
                      <span>
                        {new Date(item.product_info.expiry_date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="item-info-row">
                      <span>Nhà cung cấp:</span>
                      <span>{item.product_info.supplier}</span>
                    </div>
                    <div className="item-info-row">
                      <span>Lý do hủy:</span>
                      <span>{item.item_disposal_reason}</span>
                    </div>
                    <div className="item-info-row">
                      <span>Số lượng hủy:</span>
                      <span>{item.quantity_disposed} {item.unit_of_measure}</span>
                    </div>
                    <div className="item-info-row">
                      <span>Giá trị hủy:</span>
                      <span>{item.disposal_value.toLocaleString()} ₫</span>
                    </div>
                  </div>

                  {item.item_images && item.item_images.length > 0 && (
                    <div className="item-images">
                      <h5>Hình ảnh:</h5>
                      <div className="image-gallery">
                        {item.item_images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`${item.product_name} - ${imgIndex + 1}`}
                            className="item-image"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}