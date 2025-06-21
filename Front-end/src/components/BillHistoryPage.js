import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Css/BillHistory.css"; // Import your CSS file for styling

const BillHistory = ({ employeeId }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [statusSearch, setStatusSearch] = useState({
    paid: true, // Default to show paid bills
    refunded: false,
    cancelled: false,
  });
  const [paymentMethodSearch, setPaymentMethodSearch] = useState({
    cash: false,
    transfer: false,
  });
  const [showAllEmployees, setShowAllEmployees] = useState(true);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [billData, setBillData] = useState([]);
  const [billDetails, setBillDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [dateFilter, setDateFilter] = useState("today"); // Default to today

  // Fetch bills from API
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9999/api/bill/');
      const result = await response.json();

      if (result.success) {
        // Filter bills to only include those from the last 3 days
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const filteredBills = result.data.filter(bill => 
          new Date(bill.createdAt) >= threeDaysAgo
        );
        setBillData(filteredBills);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillDetails = async (billId) => {
    try {
      setLoadingDetails(prev => ({ ...prev, [billId]: true }));
      const response = await fetch(`http://localhost:9999/api/bill/${billId}`);
      const result = await response.json();

      if (result.success) {
        setBillDetails(prev => ({
          ...prev,
          [billId]: result.data
        }));
      }
    } catch (error) {
      console.error('Error fetching bill details:', error);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [billId]: false }));
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
  };

  // Helper function to normalize payment method for filtering
  const normalizePaymentMethod = (method) => {
    if (method === "Tiền mặt") return "cash";
    if (method === "Chuyển khoản ngân hàng") return "transfer";
    return method.toLowerCase();
  };

  // Helper function to normalize status for filtering
  const normalizeStatus = (status) => {
    if (status === "Đã thanh toán") return "paid";
    if (status === "Đã hoàn lại") return "refunded";
    if (status === "Đã hủy") return "cancelled";
    return status.toLowerCase();
  };

  // Filter bills based on selected filters
  const filterBills = () => {
    let filteredBills = billData;

    // Apply date filter
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(today.getDate() - 2);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    if (dateFilter === "today") {
      filteredBills = filteredBills.filter(bill => 
        new Date(bill.createdAt).toDateString() === today.toDateString()
      );
    } else if (dateFilter === "yesterday") {
      filteredBills = filteredBills.filter(bill => 
        new Date(bill.createdAt).toDateString() === yesterday.toDateString()
      );
    } else if (dateFilter === "dayBefore") {
      filteredBills = filteredBills.filter(bill => 
        new Date(bill.createdAt).toDateString() === dayBefore.toDateString()
      );
    } else if (dateFilter === "lastThreeDays") {
      filteredBills = filteredBills.filter(bill => 
        new Date(bill.createdAt) >= threeDaysAgo
      );
    }

    // Filter by employee unless showAllEmployees is true
    if (!showAllEmployees) {
      filteredBills = filteredBills.filter(bill => 
        bill.shift_id.account_id._id === employeeId
      );
    }

    // Apply custom date range if set
    if (fromDate) {
      filteredBills = filteredBills.filter(bill => new Date(bill.createdAt) >= new Date(fromDate));
    }
    if (toDate) {
      filteredBills = filteredBills.filter(bill => new Date(bill.createdAt) <= new Date(toDate));
    }

    // Apply status filter
    const activeStatuses = Object.keys(statusSearch).filter(status => statusSearch[status]);
    if (activeStatuses.length > 0) {
      filteredBills = filteredBills.filter(bill => 
        activeStatuses.includes(normalizeStatus(bill.statusId.name))
      );
    }

    // Apply payment method filter
    const activeMethods = Object.keys(paymentMethodSearch).filter(method => paymentMethodSearch[method]);
    if (activeMethods.length > 0) {
      filteredBills = filteredBills.filter(bill =>
        activeMethods.includes(normalizePaymentMethod(bill.paymentMethod))
      );
    }

    return filteredBills;
  };

  const handleStatusChange = (status) => {
    setStatusSearch({
      ...statusSearch,
      [status]: !statusSearch[status],
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethodSearch({
      ...paymentMethodSearch,
      [method]: !paymentMethodSearch[method],
    });
  };

  const toggleBillDetails = async (billId) => {
    if (selectedBillId === billId) {
      setSelectedBillId(null);
    } else {
      setSelectedBillId(billId);
      if (!billDetails[billId]) {
        await fetchBillDetails(billId);
      }
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      paid: "Đã thanh toán",
      refunded: "Đã hoàn lại",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const filteredBills = filterBills();

  if (loading) {
    return (
      <div className="bill-history-page">
        <Header />
        <Container fluid className="main-content">
          <div className="loading-text">Đang tải dữ liệu...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bill-history-page">
      <Header />
      <Container fluid className="main-content">
        <div className="page-row">
          {/* Sidebar */}
          <Sidebar
            activeItem="bill-history"
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Search Panel */}
          <div className="search-panel">
            <div className="search-panel-body">
              <h5 className="search-title">Tìm kiếm hóa đơn</h5>

              {/* Date Filter */}
              <div className="filter-section">
                <label className="form-label">Lọc theo ngày</label>
                <select
                  className="form-control"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="today">Hôm nay</option>
                  <option value="yesterday">Hôm qua</option>
                  <option value="dayBefore">Hôm kia</option>
                  <option value="lastThreeDays">3 ngày gần nhất</option>
                </select>
              </div>

              {/* Custom Date Range */}
              <div className="filter-section">
                <label className="form-label">Thời gian từ</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="filter-section">
                <label className="form-label">Đến</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Status Filter */}
              <div className="filter-section">
                <label className="form-label">Trạng thái</label>
                <div>
                  {["paid", "refunded", "cancelled"].map((status) => (
                    <div key={status} className="checkbox-wrapper">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          className="checkbox-input"
                          checked={statusSearch[status]}
                          onChange={() => handleStatusChange(status)}
                        />
                        <span>{getStatusLabel(status)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee Filter */}
              <div className="filter-section">
                <label className="form-label">Hiển thị hóa đơn</label>
                <div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={showAllEmployees}
                      onChange={() => setShowAllEmployees(!showAllEmployees)}
                    />
                    <span>Hiển thị hóa đơn của tất cả nhân viên</span>
                  </label>
                </div>
              </div>

              {/* Payment Method Filter */}
              <div className="filter-section">
                <label className="form-label">Phương thức thanh toán</label>
                <div>
                  {["cash", "transfer"].map((method) => (
                    <div key={method} className="checkbox-wrapper">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          className="checkbox-input"
                          checked={paymentMethodSearch[method]}
                          onChange={() => handlePaymentMethodChange(method)}
                        />
                        <span>{method === "cash" ? "Tiền mặt" : "Chuyển khoản"}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="content-area">
            <h2 className="page-title">Lịch sử hóa đơn (Trả hàng)</h2>

            {/* Bill Table */}
            <div className="bill-table-wrapper">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th className="table-header">Mã hóa đơn</th>
                    <th className="table-header">Thời gian</th>
                    <th className="table-header">Người bán</th>
                    <th className="table-header">Tổng tiền</th>
                    <th className="table-header">Thanh toán</th>
                    <th className="table-header">Phương thức</th>
                    <th className="table-header">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <React.Fragment key={bill._id}>
                      <tr
                        className={`table-row-clickable ${selectedBillId === bill._id ? 'table-row-selected' : ''}`}
                        onClick={() => toggleBillDetails(bill._id)}
                        onMouseEnter={(e) => {
                          if (selectedBillId !== bill._id) {
                            e.currentTarget.classList.add('table-row-hover');
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.classList.remove('table-row-hover');
                        }}
                      >
                        <td className="table-cell">{bill.billNumber}</td>
                        <td className="table-cell">{formatDate(bill.createdAt)}</td>
                        <td className="table-cell">{bill.shift_id.account_id.full_name}</td>
                        <td className="table-cell">{bill.totalAmount.toLocaleString()} VND</td>
                        <td className="table-cell">{bill.finalAmount.toLocaleString()} VND</td>
                        <td className="table-cell">{bill.paymentMethod}</td>
                        <td className="table-cell">{bill.statusId.name}</td>
                      </tr>
                      {selectedBillId === bill._id && (
                        <tr>
                          <td colSpan="7" style={{ padding: 0, border: "none" }}>
                            <div className="bill-details">
                              <h5 className="bill-details-title">Chi tiết hóa đơn</h5>
                              <div className="bill-info">
                                <div className="info-item">
                                  <span className="info-label">Mã hóa đơn:</span>
                                  <span className="info-value">{bill.billNumber}</span>
                                </div>
                                <div className="info-item">
                                  <span className="info-label">Thời gian:</span>
                                  <span className="info-value">{formatDate(bill.createdAt)}</span>
                                </div>
                                <div className="info-item">
                                  <span className="info-label">Người bán:</span>
                                  <span className="info-value">{bill.shift_id.account_id.full_name}</span>
                                </div>
                                <div className="info-item">
                                  <span className="info-label">Phương thức:</span>
                                  <span className="info-value">{bill.paymentMethod}</span>
                                </div>
                                <div className="info-item">
                                  <span className="info-label">Trạng thái:</span>
                                  <span className="info-value">{bill.statusId.name}</span>
                                </div>
                              </div>
                              {loadingDetails[bill._id] ? (
                                <div className="loading-text">Đang tải chi tiết...</div>
                              ) : billDetails[bill._id] ? (
                                <div className="bill-items-table">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th className="bill-items-header">Mã hàng</th>
                                        <th className="bill-items-header">Tên hàng</th>
                                        <th className="bill-items-header">Số lượng</th>
                                        <th className="bill-items-header">Đơn giá</th>
                                        <th className="bill-items-header">Thành tiền</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {billDetails[bill._id].map((item, index) => (
                                        <tr key={item._id} className={index % 2 === 1 ? "bill-items-row-even" : ""}>
                                          <td className="bill-items-cell">{item.goods_id.barcode || "N/A"}</td>
                                          <td className="bill-items-cell">{item.goods_name}</td>
                                          <td className="bill-items-cell">{item.quantity}</td>
                                          <td className="bill-items-cell">{item.unit_price.toLocaleString()} VND</td>
                                          <td className="bill-items-cell">{item.total_amount.toLocaleString()} VND</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : null}
                              {billDetails[bill._id] && (
                                <div className="bill-total-summary">
                                  <div className="bill-summary-item">
                                    <span>Tổng số lượng hàng:</span>
                                    <span>{billDetails[bill._id].reduce((acc, item) => acc + item.quantity, 0)}</span>
                                  </div>
                                  <div className="bill-summary-item">
                                    <span>Tổng số tiền:</span>
                                    <span>{bill.totalAmount.toLocaleString()} VND</span>
                                  </div>
                                  <div className="bill-summary-item">
                                    <span>Số tiền khách cần trả:</span>
                                    <span>{bill.totalAmount.toLocaleString()} VND</span>
                                  </div>
                                  <div className="bill-summary-item summary-item-final">
                                    <span>Số tiền khách đã trả:</span>
                                    <span>{bill.finalAmount.toLocaleString()} VND</span>
                                  </div>
                                </div>
                              )}
                              <div className="summary-button-container">
                                <Link to="/return-goods" className="btn-return">Trả hàng</Link>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BillHistory;