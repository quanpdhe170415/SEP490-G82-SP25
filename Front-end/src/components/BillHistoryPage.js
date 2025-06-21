import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Table, Card, Button } from "react-bootstrap";
import Header from "./Header";
import Sidebar from "./Sidebar";

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
  const [showAllEmployees, setShowAllEmployees] = useState(false);
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

  // Styles for the page
  const pageStyles = {
    billHistoryPage: {
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)',
      minHeight: '100vh',
      color: '#2e7d32',
      display: 'flex',
      flexDirection: 'column',
    },
    mainContent: {
      padding: '1.5rem',
      flex: 1,
    },
    pageRow: {
      margin: 0,
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
    searchPanel: {
      background: 'white',
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: '20px',
      height: 'fit-content',
      width: '300px',
      flexShrink: 0,
    },
    searchPanelBody: {
      padding: '2rem',
    },
    searchTitle: {
      color: '#2e7d32',
      fontWeight: '600',
      marginBottom: '1.5rem',
      fontSize: '1.25rem',
    },
    formLabel: {
      fontWeight: '500',
      color: '#555',
      marginBottom: '0.5rem',
    },
    formControl: {
      border: '1px solid #ddd',
      borderRadius: '6px',
      padding: '0.6rem 0.8rem',
      transition: 'border-color 0.2s ease',
      width: '100%',
      marginBottom: '1rem',
    },
    contentArea: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      flex: 2,
      minWidth: '300px',
    },
    pageTitle: {
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#2e7d32',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    billTableWrapper: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    },
    tableHeader: {
      background: '#4caf50',
      color: 'white',
      fontWeight: '600',
      padding: '1rem',
      border: 'none',
      textTransform: 'uppercase',
      fontSize: '0.8rem',
      letterSpacing: '0.5px',
    },
    tableCell: {
      padding: '1rem',
      borderBottom: '1px solid #f0f0f0',
      transition: 'background-color 0.2s ease',
    },
    billDetails: {
      background: '#f8f9fa',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1rem 0',
      border: '1px solid #e9ecef',
    },
    billInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
      padding: '1rem',
      background: 'white',
      borderRadius: '6px',
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column',
    },
    infoLabel: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '0.25rem',
    },
    infoValue: {
      fontWeight: '500',
      color: '#333',
    },
    totalSummary: {
      background: '#4caf50',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      marginTop: '1rem',
      marginLeft: 'auto',
      width: '400px',
      maxWidth: '100%',
    },
    summaryItem: {
      marginBottom: '0.5rem',
      fontWeight: '500',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.25rem 0',
    },
    summaryButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '1rem',
    },
    btnReturn: {
      background: '#f44336',
      border: 'none',
      padding: '0.6rem 1.2rem',
      borderRadius: '6px',
      fontWeight: '500',
      color: 'white',
      textDecoration: 'none',
      display: 'inline-block',
      marginTop: '1rem',
    },
    loadingText: {
      textAlign: 'center',
      color: '#666',
      fontStyle: 'italic',
      padding: '2rem',
    },
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
      <div style={pageStyles.billHistoryPage}>
        <Header />
        <Container fluid style={pageStyles.mainContent}>
          <div style={pageStyles.loadingText}>Đang tải dữ liệu...</div>
        </Container>
      </div>
    );
  }

  return (
    <div style={pageStyles.billHistoryPage}>
      <Header />
      <Container fluid style={pageStyles.mainContent}>
        <div style={pageStyles.pageRow}>
          {/* Sidebar */}
          <Sidebar
            activeItem="bill-history"
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Search Panel */}
          <div style={pageStyles.searchPanel}>
            <div style={pageStyles.searchPanelBody}>
              <h5 style={pageStyles.searchTitle}>Tìm kiếm hóa đơn</h5>

              {/* Date Filter */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={pageStyles.formLabel}>Lọc theo ngày</label>
                <select
                  style={pageStyles.formControl}
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
              <div style={{ marginBottom: "1rem" }}>
                <label style={pageStyles.formLabel}>Thời gian từ</label>
                <input
                  type="datetime-local"
                  style={pageStyles.formControl}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={pageStyles.formLabel}>Đến</label>
                <input
                  type="datetime-local"
                  style={pageStyles.formControl}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Status Filter */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={pageStyles.formLabel}>Trạng thái</label>
                <div>
                  {["paid", "refunded", "cancelled"].map((status) => (
                    <div key={status} style={{ marginBottom: "0.5rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
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
              <div style={{ marginBottom: "1rem" }}>
                <label style={pageStyles.formLabel}>Hiển thị hóa đơn</label>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={showAllEmployees}
                      onChange={() => setShowAllEmployees(!showAllEmployees)}
                    />
                    <span>Hiển thị hóa đơn của tất cả nhân viên</span>
                  </label>
                </div>
              </div>

              {/* Payment Method Filter */}
              <div>
                <label style={pageStyles.formLabel}>Phương thức thanh toán</label>
                <div>
                  {["cash", "transfer"].map((method) => (
                    <div key={method} style={{ marginBottom: "0.5rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
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
          <div style={pageStyles.contentArea}>
            <h2 style={pageStyles.pageTitle}>Lịch sử hóa đơn (Trả hàng)</h2>

            {/* Bill Table */}
            <div style={pageStyles.billTableWrapper}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={pageStyles.tableHeader}>Mã hóa đơn</th>
                    <th style={pageStyles.tableHeader}>Thời gian</th>
                    <th style={pageStyles.tableHeader}>Người bán</th>
                    <th style={pageStyles.tableHeader}>Tổng tiền</th>
                    <th style={pageStyles.tableHeader}>Thanh toán</th>
                    <th style={pageStyles.tableHeader}>Phương thức</th>
                    <th style={pageStyles.tableHeader}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <React.Fragment key={bill._id}>
                      <tr
                        onClick={() => toggleBillDetails(bill._id)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: selectedBillId === bill._id ? "#e8f5e8" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedBillId !== bill._id) {
                            e.currentTarget.style.backgroundColor = "#f8f9fa";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedBillId !== bill._id) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        <td style={pageStyles.tableCell}>{bill.billNumber}</td>
                        <td style={pageStyles.tableCell}>{formatDate(bill.createdAt)}</td>
                        <td style={pageStyles.tableCell}>{bill.shift_id.account_id.full_name}</td>
                        <td style={pageStyles.tableCell}>{bill.totalAmount.toLocaleString()} VND</td>
                        <td style={pageStyles.tableCell}>{bill.finalAmount.toLocaleString()} VND</td>
                        <td style={pageStyles.tableCell}>{bill.paymentMethod}</td>
                        <td style={pageStyles.tableCell}>{bill.statusId.name}</td>
                      </tr>
                      {selectedBillId === bill._id && (
                        <tr>
                          <td colSpan="7" style={{ padding: 0, border: "none" }}>
                            <div style={pageStyles.billDetails}>
                              <h5 style={{ color: "#2e7d32", fontWeight: "600", marginBottom: "1.5rem" }}>
                                Chi tiết hóa đơn
                              </h5>
                              <div style={pageStyles.billInfo}>
                                <div style={pageStyles.infoItem}>
                                  <span style={pageStyles.infoLabel}>Mã hóa đơn:</span>
                                  <span style={pageStyles.infoValue}>{bill.billNumber}</span>
                                </div>
                                <div style={pageStyles.infoItem}>
                                  <span style={pageStyles.infoLabel}>Thời gian:</span>
                                  <span style={pageStyles.infoValue}>{formatDate(bill.createdAt)}</span>
                                </div>
                                <div style={pageStyles.infoItem}>
                                  <span style={pageStyles.infoLabel}>Người bán:</span>
                                  <span style={pageStyles.infoValue}>{bill.shift_id.account_id.full_name}</span>
                                </div>
                                <div style={pageStyles.infoItem}>
                                  <span style={pageStyles.infoLabel}>Phương thức:</span>
                                  <span style={pageStyles.infoValue}>{bill.paymentMethod}</span>
                                </div>
                                <div style={pageStyles.infoItem}>
                                  <span style={pageStyles.infoLabel}>Trạng thái:</span>
                                  <span style={pageStyles.infoValue}>{bill.statusId.name}</span>
                                </div>
                              </div>
                              {loadingDetails[bill._id] ? (
                                <div style={pageStyles.loadingText}>Đang tải chi tiết...</div>
                              ) : billDetails[bill._id] ? (
                                <div style={{ background: "white", borderRadius: "6px", overflow: "hidden", marginBottom: "1rem" }}>
                                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                      <tr>
                                        <th style={{ ...pageStyles.tableHeader, background: "#388e3c" }}>Mã hàng</th>
                                        <th style={{ ...pageStyles.tableHeader, background: "#388e3c" }}>Tên hàng</th>
                                        <th style={{ ...pageStyles.tableHeader, background: "#388e3c" }}>Số lượng</th>
                                        <th style={{ ...pageStyles.tableHeader, background: "#388e3c" }}>Đơn giá</th>
                                        <th style={{ ...pageStyles.tableHeader, background: "#388e3c" }}>Thành tiền</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {billDetails[bill._id].map((item, index) => (
                                        <tr key={item._id} style={{ backgroundColor: index % 2 === 1 ? "#f8f9fa" : "white" }}>
                                          <td style={{ ...pageStyles.tableCell, padding: "0.75rem" }}>{item.goods_id.barcode || "N/A"}</td>
                                          <td style={{ ...pageStyles.tableCell, padding: "0.75rem" }}>{item.goods_name}</td>
                                          <td style={{ ...pageStyles.tableCell, padding: "0.75rem" }}>{item.quantity}</td>
                                          <td style={{ ...pageStyles.tableCell, padding: "0.75rem" }}>{item.unit_price.toLocaleString()} VND</td>
                                          <td style={{ ...pageStyles.tableCell, padding: "0.75rem" }}>{item.total_amount.toLocaleString()} VND</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : null}
                              {billDetails[bill._id] && (
                                <div style={pageStyles.totalSummary}>
                                  <div style={pageStyles.summaryItem}>
                                    <span>Tổng số lượng hàng:</span>
                                    <span>{billDetails[bill._id].reduce((acc, item) => acc + item.quantity, 0)}</span>
                                  </div>
                                  <div style={pageStyles.summaryItem}>
                                    <span>Tổng số tiền:</span>
                                    <span>{bill.totalAmount.toLocaleString()} VND</span>
                                  </div>
                                  <div style={pageStyles.summaryItem}>
                                    <span>Số tiền khách cần trả:</span>
                                    <span>{bill.totalAmount.toLocaleString()} VND</span>
                                  </div>
                                  <div style={{ ...pageStyles.summaryItem, fontWeight: "600", fontSize: "1.1rem", borderTop: "1px solid rgba(255, 255, 255, 0.3)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                                    <span>Số tiền khách đã trả:</span>
                                    <span>{bill.finalAmount.toLocaleString()} VND</span>
                                  </div>
                                </div>
                              )}
                              <div style={pageStyles.summaryButtonContainer}>
                                <Link to="/return-goods" style={pageStyles.btnReturn}>Trả hàng</Link>
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