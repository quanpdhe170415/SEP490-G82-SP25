import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Card,
  Button,
} from "react-bootstrap";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ImportHistory = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [statusSearch, setStatusSearch] = useState({
    pending: false,
    received: false,
    cancelled: false,
  });
  const [supplierSearch, setSupplierSearch] = useState({});
  const [supplierNameSearch, setSupplierNameSearch] = useState("");
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [purchaseData, setPurchaseData] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [editableItems, setEditableItems] = useState({});

  // Fetch purchase orders from API
  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:9999/api/import/");
      const result = await response.json();

      if (result.success) {
        setPurchaseData(result.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu nhập hàng:", error);
      toast.error("Lỗi khi tải dữ liệu nhập hàng!");
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseDetails = async (importId) => {
    try {
      setLoadingDetails((prev) => ({ ...prev, [importId]: true }));
      const response = await fetch(
        `http://localhost:9999/api/import/${importId}`
      );
      const result = await response.json();

      if (result.success) {
        setPurchaseDetails((prev) => ({
          ...prev,
          [importId]: result.data,
        }));
        setEditableItems((prev) => ({
          ...prev,
          [importId]: result.data.map((item) => ({
            _id: item._id,
            expiry_date: item.expiry_date || "",
            manufacturing_batch_number: item.manufacturing_batch_number || "",
            manufacturing_date: item.manufacturing_date || "",
          })),
        }));
      } else {
        toast.error("Lỗi khi tải chi tiết đơn nhập!");
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn nhập:", error);
      toast.error("Lỗi khi tải chi tiết đơn nhập!");
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [importId]: false }));
    }
  };

  const handleItemChange = (importId, itemId, field, value) => {
    setEditableItems((prev) => ({
      ...prev,
      [importId]: prev[importId].map((item) =>
        item._id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const savePurchaseDetails = async (importId) => {
    try {
      setLoadingDetails((prev) => ({ ...prev, [importId]: true }));
      const response = await fetch(
        `http://localhost:9999/api/import/${importId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: editableItems[importId],
            status: "received",
          }),
        }
      );
      const result = await response.json();

      if (result.success) {
        toast.success("Cập nhật thông tin thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setPurchaseData((prev) =>
          prev.map((purchase) =>
            purchase._id === importId
              ? { ...purchase, status: "received" }
              : purchase
          )
        );
        setPurchaseDetails((prev) => ({
          ...prev,
          [importId]: prev[importId].map((item) => {
            const updatedItem = editableItems[importId].find(
              (editable) => editable._id === item._id
            );
            return {
              ...item,
              expiry_date: updatedItem.expiry_date,
              manufacturing_batch_number:
                updatedItem.manufacturing_batch_number,
              manufacturing_date: updatedItem.manufacturing_date,
            };
          }),
        }));
        setSelectedPurchaseId(null);
      } else {
        console.error("Lỗi khi lưu chi tiết đơn nhập:", result.message);
        toast.error("Lỗi khi lưu chi tiết đơn nhập!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu chi tiết đơn nhập:", error);
      toast.error("Lỗi khi lưu chi tiết đơn nhập!");
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [importId]: false }));
    }
  };

  // Styles for the page
  const pageStyles = {
    purchaseHistoryPage: {
      fontFamily: "Inter, sans-serif",
      background: "#f5f5f5",
      minHeight: "100vh",
      color: "#0070f4",
    },
    mainContent: {
      padding: "1rem",
    },
    pageRow: {
      margin: 0,
      display: "flex",
      gap: "1rem",
      alignItems: "flex-start",
    },
    searchPanel: {
      background: "white",
      border: "none",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      position: "sticky",
      top: "20px",
      height: "fit-content",
      width: "240px",
      flexShrink: 0,
    },
    searchPanelBody: {
      padding: "1.2rem",
    },
    searchTitle: {
      color: "#0070f4",
      fontWeight: "600",
      marginBottom: "1.5rem",
      fontSize: "1.1rem",
    },
    formLabel: {
      fontWeight: "500",
      color: "#555",
      marginBottom: "0.4rem",
      fontSize: "0.9rem",
    },
    formControl: {
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "0.4rem 0.6rem",
      transition: "border-color 0.2s ease",
      width: "100%",
      marginBottom: "0.8rem",
      fontSize: "0.85rem",
    },
    batchNumberInput: {
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "0.6rem 0.8rem",
      fontSize: "0.9rem",
      transition: "border-color 0.2s ease",
      width: "100%",
      marginBottom: "0.8rem",
    },
    contentArea: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "12px",
      padding: "2.5rem",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      flex: 1,
    },
    pageTitle: {
      fontSize: "2.25rem",
      fontWeight: "600",
      color: "#0070f4",
      marginBottom: "2rem",
      textAlign: "center",
    },
    purchaseTableWrapper: {
      background: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    },
    tableHeader: {
      background: "#0070f4",
      color: "white",
      fontWeight: "600",
      padding: "0.8rem",
      border: "none",
      textTransform: "uppercase",
      fontSize: "0.8rem",
      letterSpacing: "0.4px",
    },
    tableHeaderSmall: {
      background: "#0070f4",
      color: "white",
      fontWeight: "600",
      padding: "0.8rem 0.4rem",
      border: "none",
      textTransform: "uppercase",
      fontSize: "0.8rem",
      letterSpacing: "0.4px",
      width: "80px",
    },
    tableCell: {
      padding: "0.8rem",
      borderBottom: "1px solid #f0f0f0",
      transition: "background-color 0.2s ease",
      fontSize: "0.85rem",
    },
    tableCellSmall: {
      padding: "0.6rem 0.4rem",
      borderBottom: "1px solid #f0f0f0",
      transition: "background-color 0.2s ease",
      fontSize: "0.85rem",
      width: "80px",
    },
    purchaseDetails: {
      background: "#f8f9fa",
      borderRadius: "8px",
      padding: "1.5rem",
      margin: "1rem 0",
      border: "1px solid #e9ecef",
    },
    purchaseInfo: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "1.5rem",
      padding: "1rem",
      background: "white",
      borderRadius: "6px",
    },
    infoItem: {
      display: "flex",
      flexDirection: "column",
    },
    infoLabel: {
      fontSize: "0.75rem",
      fontWeight: "600",
      color: "#666",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "0.25rem",
    },
    infoValue: {
      fontWeight: "500",
      color: "#333",
    },
    totalSummary: {
      background: "#0070f4",
      color: "white",
      padding: "1rem",
      borderRadius: "8px",
      marginTop: "1rem",
      marginLeft: "auto",
      width: "400px",
      maxWidth: "100%",
    },
    summaryItem: {
      marginBottom: "0.5rem",
      fontWeight: "500",
      display: "flex",
      justifyContent: "space-between",
      padding: "0.25rem 0",
    },
    summaryButtonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "1rem",
    },
    btnReturn: {
      background: "#f44336",
      border: "none",
      padding: "0.6rem 1.2rem",
      borderRadius: "6px",
      fontWeight: "500",
      color: "white",
      textDecoration: "none",
      display: "inline-block",
      marginTop: "1rem",
    },
    btnSave: {
      background: "#28a745",
      border: "none",
      padding: "0.6rem 1.2rem",
      borderRadius: "6px",
      fontWeight: "500",
      color: "white",
      textDecoration: "none",
      display: "inline-block",
      marginTop: "1rem",
    },
    loadingText: {
      textAlign: "center",
      color: "#666",
      fontStyle: "italic",
      padding: "2rem",
    },
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Filter purchases based on selected filters
  const filterPurchases = () => {
    let filteredPurchases = purchaseData;

    // Tính ngày cách đây 10 ngày từ ngày hiện tại
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 60);

    // Lọc các đơn nhập trong 10 ngày gần nhất
    filteredPurchases = filteredPurchases.filter(
      (purchase) => new Date(purchase.createdAt) >= tenDaysAgo
    );

    // Các bộ lọc khác (giữ nguyên để hỗ trợ lọc bổ sung nếu cần)
    if (fromDate) {
      filteredPurchases = filteredPurchases.filter(
        (purchase) => new Date(purchase.createdAt) >= new Date(fromDate)
      );
    }
    if (toDate) {
      filteredPurchases = filteredPurchases.filter(
        (purchase) => new Date(purchase.createdAt) <= new Date(toDate)
      );
    }

    const activeStatuses = Object.keys(statusSearch).filter(
      (status) => statusSearch[status]
    );
    if (activeStatuses.length > 0) {
      filteredPurchases = filteredPurchases.filter((purchase) =>
        activeStatuses.includes(purchase.status.toLowerCase())
      );
    }

    const activeSuppliers = Object.keys(supplierSearch).filter(
      (supplier) => supplierSearch[supplier]
    );
    if (activeSuppliers.length > 0) {
      filteredPurchases = filteredPurchases.filter((purchase) =>
        activeSuppliers.includes(purchase.supplierId)
      );
    }

    if (supplierNameSearch) {
      filteredPurchases = filteredPurchases.filter((purchase) =>
        purchase.supplierName
          .toLowerCase()
          .includes(supplierNameSearch.toLowerCase())
      );
    }

    return filteredPurchases;
  };

  const handleStatusChange = (status) => {
    setStatusSearch({
      ...statusSearch,
      [status]: !statusSearch[status],
    });
  };

  const handleSupplierChange = (supplierId) => {
    setSupplierSearch({
      ...supplierSearch,
      [supplierId]: !supplierSearch[supplierId],
    });
  };

  const togglePurchaseDetails = async (purchaseId) => {
    if (selectedPurchaseId === purchaseId) {
      setSelectedPurchaseId(null);
    } else {
      setSelectedPurchaseId(purchaseId);
      if (!purchaseDetails[purchaseId]) {
        await fetchPurchaseDetails(purchaseId);
      }
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Chờ nhận hàng",
      received: "Đã nhận hàng",
      cancelled: "Đã trả hàng",
    };
    return statusMap[status] || "Khác";
  };

  const filteredPurchases = filterPurchases();

  if (loading) {
    return (
      <div style={pageStyles.purchaseHistoryPage}>
        <Header />
        <Container fluid style={pageStyles.mainContent}>
          <div style={pageStyles.loadingText}>Đang tải dữ liệu...</div>
        </Container>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div style={pageStyles.purchaseHistoryPage}>
      <Header />
      <Container fluid style={pageStyles.mainContent}>
        <div style={pageStyles.pageRow}>
          {/* Sidebar */}
          <Sidebar
            activeItem="purchase-history"
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Search Panel */}
          <div style={pageStyles.searchPanel}>
            <div style={pageStyles.searchPanelBody}>
              <h5 style={pageStyles.searchTitle}>Tìm kiếm</h5>

              {/* Supplier Name Search */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={pageStyles.formLabel}>Nhà cung cấp</label>
                <input
                  type="text"
                  style={pageStyles.formControl}
                  value={supplierNameSearch}
                  onChange={(e) => setSupplierNameSearch(e.target.value)}
                  placeholder="Nhập tên nhà cung cấp..."
                />
              </div>

              {/* Time Range */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={pageStyles.formLabel}>Thời gian từ</label>
                <input
                  type="date"
                  style={pageStyles.formControl}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={pageStyles.formLabel}>Đến</label>
                <input
                  type="date"
                  style={pageStyles.formControl}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={pageStyles.formLabel}>Trạng thái</label>
                <div>
                  {["pending", "received", "cancelled"].map((status) => (
                    <div key={status} style={{ marginBottom: "0.5rem" }}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
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
            </div>
          </div>

          {/* Main Content Area */}
          <div style={pageStyles.contentArea}>
            <h2 style={pageStyles.pageTitle}>Lịch sử nhập hàng</h2>

            {/* Purchase Table */}
            <div style={pageStyles.purchaseTableWrapper}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={pageStyles.tableHeader}>Mã đơn nhập</th>
                    <th style={pageStyles.tableHeader}>Thời gian</th>
                    <th style={pageStyles.tableHeader}>Nhà cung cấp</th>
                    <th style={pageStyles.tableHeader}>Tổng tiền</th>
                    <th style={pageStyles.tableHeader}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.map((purchase) => (
                    <React.Fragment key={purchase._id}>
                      <tr
                        onClick={() => togglePurchaseDetails(purchase._id)}
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            selectedPurchaseId === purchase._id
                              ? "#e8f5e8"
                              : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedPurchaseId !== purchase._id) {
                            e.currentTarget.style.backgroundColor = "#f8f9fa";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedPurchaseId !== purchase._id) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }
                        }}
                      >
                        <td style={pageStyles.tableCell}>
                          {purchase.purchaseNumber}
                        </td>
                        <td style={pageStyles.tableCell}>
                          {formatDate(purchase.createdAt)}
                        </td>
                        <td style={pageStyles.tableCell}>
                          {purchase.supplierName}
                        </td>
                        <td style={pageStyles.tableCell}>
                          {purchase.totalAmount.toLocaleString()} VND
                        </td>
                        <td style={pageStyles.tableCell}>
                          {getStatusLabel(purchase.status)}
                        </td>
                      </tr>
                      {selectedPurchaseId === purchase._id && (
                        <tr>
                          <td
                            colSpan="5"
                            style={{ padding: 0, border: "none" }}
                          >
                            <div style={pageStyles.purchaseDetails}>
                              <h5
                                style={{
                                  color: "#0070f4",
                                  fontWeight: "600",
                                  marginBottom: "1.5rem",
                                }}
                              >
                                Chi tiết đơn nhập
                              </h5>
                              <div style={pageStyles.purchaseInfo}>
                                <div style={pageStyles.infoItem}>
                                  <span style={pageStyles.infoLabel}>
                                    Mã đơn nhập:
                                  </span>
                                  <span style={pageStyles.infoValue}>
                                    {purchase.purchaseNumber}
                                  </span>
                                </div>
                                <div style={pageStyles.infoItem}>
                                  <span style={pageStyles.infoLabel}>
                                    Thời gian:
                                  </span>
                                  <span style={pageStyles.infoValue}>
                                    {formatDate(purchase.createdAt)}
                                  </span>
                                </div>
                                <div style={pageStyles.infoItem}>
                                  <span style={pageStyles.infoLabel}>
                                    Nhà cung cấp:
                                  </span>
                                  <span style={pageStyles.infoValue}>
                                    {purchase.supplierName}
                                  </span>
                                </div>
                                <div style={pageStyles.infoItem}>
                                  <span style={pageStyles.infoLabel}>
                                    Trạng thái:
                                  </span>
                                  <span style={pageStyles.infoValue}>
                                    {getStatusLabel(purchase.status)}
                                  </span>
                                </div>
                              </div>
                              {/* Items Table */}
                              {loadingDetails[purchase._id] ? (
                                <div style={pageStyles.loadingText}>
                                  Đang tải chi tiết...
                                </div>
                              ) : purchaseDetails[purchase._id] ? (
                                <div
                                  style={{
                                    background: "white",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    marginBottom: "1rem",
                                  }}
                                >
                                  <table
                                    style={{
                                      width: "100%",
                                      borderCollapse: "collapse",
                                    }}
                                  >
                                    <thead>
                                      <tr>
                                        <th style={pageStyles.tableHeader}>
                                          Mã hàng
                                        </th>
                                        <th style={pageStyles.tableHeader}>
                                          Tên hàng
                                        </th>
                                        <th style={pageStyles.tableHeader}>
                                          Số lượng
                                        </th>
                                        <th style={pageStyles.tableHeader}>
                                          Đơn giá
                                        </th>
                                        <th style={pageStyles.tableHeader}>
                                          Thành tiền
                                        </th>
                                        <th style={pageStyles.tableHeaderSmall}>
                                          Hạn sử dụng
                                        </th>
                                        <th style={pageStyles.tableHeader}>
                                          Số lô sản xuất
                                        </th>
                                        <th style={pageStyles.tableHeaderSmall}>
                                          Ngày sản xuất
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {purchaseDetails[purchase._id].map(
                                        (item, index) => (
                                          <tr
                                            key={item._id}
                                            style={{
                                              backgroundColor:
                                                index % 2 === 1
                                                  ? "#f8f9fa"
                                                  : "white",
                                            }}
                                          >
                                            <td
                                              style={{
                                                ...pageStyles.tableCell,
                                                padding: "0.75rem",
                                              }}
                                            >
                                              {item.barcode}
                                            </td>
                                            <td
                                              style={{
                                                ...pageStyles.tableCell,
                                                padding: "0.75rem",
                                              }}
                                            >
                                              {item.goods_name}
                                            </td>
                                            <td
                                              style={{
                                                ...pageStyles.tableCell,
                                                padding: "0.75rem",
                                              }}
                                            >
                                              {item.quantity}
                                            </td>
                                            <td
                                              style={{
                                                ...pageStyles.tableCell,
                                                padding: "0.75rem",
                                              }}
                                            >
                                              {item.unit_price.toLocaleString()}{" "}
                                              VND
                                            </td>
                                            <td
                                              style={{
                                                ...pageStyles.tableCell,
                                                padding: "0.75rem",
                                              }}
                                            >
                                              {item.total_amount.toLocaleString()}{" "}
                                              VND
                                            </td>
                                            <td
                                              style={{
                                                ...pageStyles.tableCellSmall,
                                              }}
                                            >
                                              {purchase.status === "pending" ? (
                                                <input
                                                  type="date"
                                                  style={pageStyles.formControl}
                                                  value={
                                                    editableItems[
                                                      purchase._id
                                                    ]?.find(
                                                      (i) => i._id === item._id
                                                    )?.expiry_date || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleItemChange(
                                                      purchase._id,
                                                      item._id,
                                                      "expiry_date",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ) : (
                                                formatDate(item.expiry_date)
                                              )}
                                            </td>
                                            <td
                                              style={{
                                                ...pageStyles.tableCell,
                                                padding: "0.75rem",
                                              }}
                                            >
                                              {purchase.status === "pending" ? (
                                                <input
                                                  type="text"
                                                  style={
                                                    pageStyles.batchNumberInput
                                                  }
                                                  value={
                                                    editableItems[
                                                      purchase._id
                                                    ]?.find(
                                                      (i) => i._id === item._id
                                                    )
                                                      ?.manufacturing_batch_number ||
                                                    ""
                                                  }
                                                  onChange={(e) =>
                                                    handleItemChange(
                                                      purchase._id,
                                                      item._id,
                                                      "manufacturing_batch_number",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ) : (
                                                item.manufacturing_batch_number ||
                                                "N/A"
                                              )}
                                            </td>
                                            <td
                                              style={{
                                                ...pageStyles.tableCellSmall,
                                              }}
                                            >
                                              {purchase.status === "pending" ? (
                                                <input
                                                  type="date"
                                                  style={pageStyles.formControl}
                                                  value={
                                                    editableItems[
                                                      purchase._id
                                                    ]?.find(
                                                      (i) => i._id === item._id
                                                    )?.manufacturing_date || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleItemChange(
                                                      purchase._id,
                                                      item._id,
                                                      "manufacturing_date",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ) : (
                                                formatDate(
                                                  item.manufacturing_date
                                                )
                                              )}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              ) : null}
                              {/* Total Summary */}
                              {purchaseDetails[purchase._id] && (
                                <div style={pageStyles.totalSummary}>
                                  <div style={pageStyles.summaryItem}>
                                    <span>Tổng số lượng hàng:</span>
                                    <span>
                                      {purchaseDetails[purchase._id].reduce(
                                        (acc, item) => acc + item.quantity,
                                        0
                                      )}
                                    </span>
                                  </div>
                                  <div style={pageStyles.summaryItem}>
                                    <span>Tổng số tiền:</span>
                                    <span>
                                      {purchase.totalAmount.toLocaleString()}{" "}
                                      VND
                                    </span>
                                  </div>
                                </div>
                              )}
                              {purchase.status !== "cancelled" && (
                                <div style={pageStyles.summaryButtonContainer}>
                                  {purchase.status === "pending" ? (
                                    <button
                                      style={pageStyles.btnSave}
                                      onClick={() =>
                                        savePurchaseDetails(purchase._id)
                                      }
                                      disabled={loadingDetails[purchase._id]}
                                    >
                                      {loadingDetails[purchase._id]
                                        ? "Đang lưu..."
                                        : "Lưu hóa đơn"}
                                    </button>
                                  ) : (
                                    <Link
                                      to="/return-purchase"
                                      style={pageStyles.btnReturn}
                                    >
                                      Trả hàng nhập
                                    </Link>
                                  )}
                                </div>
                              )}
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
      <ToastContainer />
    </div>
  );
};

export default ImportHistory;
