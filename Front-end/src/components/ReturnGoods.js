import React, { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import ReturnOrderService from "../services/returnOrderService";
import CashierLayout from "./cashier/CashierLayout";

// Add this new function
const formatDateTime = (dateString) => {
  // Return original string if it's invalid or doesn't match the expected format
  if (!dateString || !dateString.includes(" ")) return dateString;

  // Split the string into date and time parts
  const [datePart, timePart] = dateString.split(" ");

  // Split the date part into year, month, and day
  const [year, month, day] = datePart.split("-");

  // Reassemble in the desired DD-MM-YYYY format and append the time
  return `${day}-${month}-${year} ${timePart}`;
};

export default function ReturnGoods() {
  // State management
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Remove sidebar navigation states as they're now handled by CashierLayout
  // const [activeNav, setActiveNav] = useState("Trả hàng");
  // const navigationItems = [
  //   "Dashboard",
  //   "Mở ca",
  //   "Bán hàng",
  //   "Trả hàng",
  //   "Kết ca",
  // ];

  // Filter and pagination states
  const [searchOrderId, setSearchOrderId] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [selectedShift, setSelectedShift] = useState("Ca sáng");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Tất cả");

  // Return states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [filteredReturnItems, setFilteredReturnItems] = useState([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Load bills from API
  const loadBills = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        date_filter: "24h",
        ...filters,
      };

      const response = await ReturnOrderService.getBillsForReturn(params);

      if (response.success) {
        setAllOrders(response.data);
        setFilteredOrders(response.data);
      } else {
        setError("Không thể tải danh sách hóa đơn");
      }
    } catch (error) {
      console.error("Error loading bills:", error);
      setError("Lỗi khi tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  // Load bills on component mount
  useEffect(() => {
    loadBills();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Check if order time is in selected shift
  const isOrderInShift = (orderDate, shift) => {
    return ReturnOrderService.isOrderInShift(orderDate, shift);
  };

  // Check if order time is in selected time slot
  const isOrderInTimeSlot = (orderDate, timeSlot) => {
    if (timeSlot === "Tất cả") return true;
    return ReturnOrderService.isOrderInTimeSlot(orderDate, timeSlot);
  };

  // Filter orders based on search, shift and time slot
  const handleSearch = () => {
    let filtered = allOrders;

    // Filter by shift first
    filtered = filtered.filter((order) =>
      isOrderInShift(order.date, selectedShift)
    );

    // Then filter by time slot (if not "Tất cả")
    if (selectedTimeSlot !== "Tất cả") {
      filtered = filtered.filter((order) =>
        isOrderInTimeSlot(order.date, selectedTimeSlot)
      );
    }

    // Finally filter by search query if provided
    if (searchOrderId.trim() !== "") {
      filtered = filtered.filter((order) =>
        order.id.toLowerCase().includes(searchOrderId.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Handle order selection for return
  const handleSelectOrder = async (order) => {
    try {
      setLoadingOrderDetails(true);
      setError(null);

      const response = await ReturnOrderService.getBillDetailsForReturn(
        order._id
      );

      if (response.success) {
        const orderData = response.data;
        setSelectedOrder(orderData);

        const items = orderData.items.map((item) => ({
          ...item,
          returnQuantity: 0,
          selected: false,
        }));

        setReturnItems(items);
        setFilteredReturnItems(items);
        setProductSearchQuery("");
      } else {
        setError("Không thể tải chi tiết hóa đơn");
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      setError("Lỗi khi tải chi tiết hóa đơn");
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  // Handle product search within selected order
  const handleProductSearch = (searchTerm) => {
    setProductSearchQuery(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredReturnItems(returnItems);
    } else {
      const filtered = returnItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReturnItems(filtered);
    }
  };

  // Handle return item selection
  const handleReturnItemChange = (filteredIndex, field, value) => {
    // Find the actual item in returnItems array
    const filteredItem = filteredReturnItems[filteredIndex];
    const actualIndex = returnItems.findIndex(
      (item) =>
        item.name === filteredItem.name && item.price === filteredItem.price
    );

    if (actualIndex !== -1) {
      const updated = [...returnItems];
      updated[actualIndex][field] = value;
      setReturnItems(updated);

      // Update filtered items as well
      const updatedFiltered = [...filteredReturnItems];
      updatedFiltered[filteredIndex][field] = value;
      setFilteredReturnItems(updatedFiltered);
    }
  };

  // Calculate total return amount
  const calculateReturnTotal = () => {
    return returnItems.reduce((total, item) => {
      if (item.selected) {
        return total + item.price * item.returnQuantity;
      }
      return total;
    }, 0);
  };

  // Handle return submission
  const handleReturnSubmit = () => {
    const selectedItems = returnItems.filter(
      (item) => item.selected && item.returnQuantity > 0
    );
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để trả hàng");
      return;
    }
    if (!returnReason.trim()) {
      alert("Vui lòng nhập lý do trả hàng");
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  // Handle confirmed return
  const handleConfirmedReturn = async () => {
    try {
      setSubmittingReturn(true);
      setError(null);

      const selectedItems = returnItems.filter(
        (item) => item.selected && item.returnQuantity > 0
      );

      const returnData = {
        bill_id: selectedOrder._id,
        return_reason: returnReason,
        items: selectedItems.map((item) => ({
          goods_id: item.goods_id,
          goods_name: item.name,
          quantity: item.returnQuantity,
          unit_price: item.price,
        })),
        created_by: localStorage.getItem("userId") || "unknown",
      };

      const response = await ReturnOrderService.createReturnOrder(returnData);

      if (response.success) {
        alert("Đã gửi yêu cầu trả hàng thành công!");
        setSelectedOrder(null);
        setReturnItems([]);
        setFilteredReturnItems([]);
        setProductSearchQuery("");
        setReturnReason("");
        setShowConfirmDialog(false);

        // Reload bills list
        loadBills();
      } else {
        alert("Lỗi khi tạo yêu cầu trả hàng: " + response.message);
      }
    } catch (error) {
      console.error("Error creating return order:", error);
      alert("Lỗi khi tạo yêu cầu trả hàng");
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Handle cancel confirmation
  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 3;

    // Previous button
    pages.push(
      <li
        key="prev"
        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Trang trước"
        >
          ‹
        </button>
      </li>
    );

    // First page
    if (currentPage > 2) {
      pages.push(
        <li key={1} className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>
      );

      if (currentPage > 3) {
        pages.push(
          <li key="dots1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    // Current page and neighbors
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(
          <li key="dots2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }

      pages.push(
        <li key={totalPages} className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    // Next button
    pages.push(
      <li
        key="next"
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Trang sau"
        >
          ›
        </button>
      </li>
    );

    return pages;
  };

  // Auto filter when shift changes
  useEffect(() => {
    handleSearch();
    // Reset time slot to "Tất cả" when shift changes
    setSelectedTimeSlot("Tất cả");
  }, [selectedShift, allOrders]);

  // Auto filter when time slot changes
  useEffect(() => {
    handleSearch();
  }, [selectedTimeSlot, allOrders]);

  return (
    <CashierLayout pageTitle="Trả hàng" breadcrumb="Quản lý trả hàng">
      {/* Error Display */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="row g-4">
        {/* Left Panel - Order History */}
        <div className="col-md-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title mb-0">Lịch sử đơn hàng (24 giờ)</h6>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary small">
                    {selectedShift}
                  </span>
                  <span className="badge bg-secondary small">
                    {selectedTimeSlot === "Tất cả"
                      ? selectedShift === "Ca sáng"
                        ? "8h-15h"
                        : "15h-22h"
                      : selectedTimeSlot}
                  </span>
                </div>
              </div>

              {/* Search */}
              <div
                className="d-grid mb-3"
                style={{
                  gridTemplateColumns: "1fr auto",
                  gap: "0",
                  maxWidth: "100%",
                }}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập mã đơn hàng hoặc tên sản phẩm"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    margin: 0,
                    // Thêm các thuộc tính sau để thu nhỏ
                    height: "28px",
                    fontSize: "0.8rem",
                    padding: "0.2rem 0.5rem",
                  }}
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleSearch}
                  type="button"
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    margin: 0,
                    // Thêm các thuộc tính sau để đồng bộ kích thước
                    height: "28px",
                    fontSize: "0.8rem",
                    padding: "0.2rem 0.5rem",
                  }}
                  disabled={loading}
                >
                  {loading ? "Đang tìm..." : "Tìm kiếm"}
                </button>
              </div>

              {/* Shift Selection */}
              <div className="mb-3">
                <label className="form-label text-muted small">Chọn ca:</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="shift"
                      id="morning"
                      checked={selectedShift === "Ca sáng"}
                      onChange={() => setSelectedShift("Ca sáng")}
                    />
                    <label className="form-check-label" htmlFor="morning">
                      Ca sáng
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="shift"
                      id="afternoon"
                      checked={selectedShift === "Ca chiều"}
                      onChange={() => setSelectedShift("Ca chiều")}
                    />
                    <label className="form-check-label" htmlFor="afternoon">
                      Ca chiều
                    </label>
                  </div>
                </div>
              </div>

              {/* Time Slot */}
              <div className="mb-3">
                <label className="form-label text-muted small">
                  Khung giờ:
                </label>
                <select
                  className="form-select"
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                >
                  <option value="Tất cả">Tất cả</option>
                  {selectedShift === "Ca sáng" ? (
                    <>
                      <option value="8h-9h">8h-9h</option>
                      <option value="9h-10h">9h-10h</option>
                      <option value="10h-11h">10h-11h</option>
                      <option value="11h-12h">11h-12h</option>
                      <option value="12h-13h">12h-13h</option>
                      <option value="13h-14h">13h-14h</option>
                      <option value="14h-15h">14h-15h</option>
                    </>
                  ) : (
                    <>
                      <option value="15h-16h">15h-16h</option>
                      <option value="16h-17h">16h-17h</option>
                      <option value="17h-18h">17h-18h</option>
                      <option value="18h-19h">18h-19h</option>
                      <option value="19h-20h">19h-20h</option>
                      <option value="20h-21h">20h-21h</option>
                      <option value="21h-22h">21h-22h</option>
                    </>
                  )}
                </select>
              </div>

              {/* Orders Table */}
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="py-4 text-center text-muted">
                          <div className="spinner-border spinner-border-sm me-2"></div>{" "}
                          Đang tải danh sách hóa đơn...
                        </td>
                      </tr>
                    ) : currentOrders.length > 0 ? (
                      currentOrders.map((order) => (
                        <tr key={order.id} className="border-bottom">
                          <td className="py-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="text-primary fw-bold small">
                                  {" "}
                                  {order.id}{" "}
                                </div>
                                {/* Use the new formatting function here */}
                                <div className="text-muted small">
                                  {" "}
                                  {formatDateTime(order.date)}{" "}
                                </div>
                              </div>
                              <div className="text-end">
                                <div className="text-danger fw-bold small">
                                  {" "}
                                  {formatCurrency(order.totalAmount)}{" "}
                                </div>
                              </div>
                              <button
                                className="btn btn-sm btn-outline-primary ms-2"
                                onClick={() => handleSelectOrder(order)}
                                disabled={loadingOrderDetails}
                              >
                                {" "}
                                {loadingOrderDetails
                                  ? "Đang tải..."
                                  : "Chọn"}{" "}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-4 text-center text-muted">
                          <i className="fas fa-search me-2"></i> Không tìm thấy
                          đơn hàng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredOrders.length > 0 && (
                <div className="mt-3 pt-3 border-top">
                  {/* Items per page selector */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted small">Hiển thị:</span>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: "auto", minWidth: "70px" }}
                        value={itemsPerPage}
                        onChange={(e) =>
                          handleItemsPerPageChange(parseInt(e.target.value))
                        }
                      >
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </select>
                      <span className="text-muted small">đơn/trang</span>
                    </div>
                    <div className="text-muted small">
                      Tổng: {filteredOrders.length} đơn hàng
                    </div>
                  </div>

                  {totalPages > 1 ? (
                    <>
                      <nav aria-label="Phân trang đơn hàng">
                        <ul className="pagination pagination-sm justify-content-center mb-2">
                          {renderPagination()}
                        </ul>
                      </nav>
                      <div className="text-center text-muted small">
                        Trang {currentPage} / {totalPages} - Hiển thị{" "}
                        {indexOfFirstItem + 1}-
                        {Math.min(indexOfLastItem, filteredOrders.length)}
                        trong tổng {filteredOrders.length} đơn hàng
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted small">
                      Hiển thị tất cả {filteredOrders.length} đơn hàng
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Return Request */}
        <div className="col-md-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title mb-3">Tạo yêu cầu trả hàng</h6>

              {!selectedOrder ? (
                <div className="text-center text-muted py-5">
                  <i className="fas fa-box fa-3x mb-3 opacity-50"></i>
                  <p>Vui lòng chọn đơn hàng để tạo yêu cầu trả hàng</p>
                </div>
              ) : (
                <div>
                  {/* Order Info */}
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label text-muted small">
                        Mã đơn hàng trả:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedOrder.id}
                        readOnly
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">
                        Ngày trả hàng:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={new Date().toLocaleDateString("vi-VN")}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label text-muted small mb-0">
                        Các sản phẩm trong đơn hàng:
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark small">
                          {filteredReturnItems.length}/{returnItems.length} sản
                          phẩm
                        </span>
                      </div>
                    </div>

                    {/* Product Search */}
                    <div className="mb-4">
                      <div
                        className="d-grid"
                        style={{
                          gridTemplateColumns: "1fr auto",
                          gap: 0,
                          maxWidth: "100%",
                        }}
                      >
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Tìm kiếm sản phẩm trong đơn hàng..."
                          value={productSearchQuery}
                          onChange={(e) => handleProductSearch(e.target.value)}
                          style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            margin: 0,
                            // Thêm các thuộc tính sau để thu nhỏ
                            height: "28px", // Chiều cao tùy chỉnh
                            fontSize: "0.8rem", // Cỡ chữ nhỏ hơn
                            padding: "0.2rem 0.5rem", // Giảm padding
                          }}
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() =>
                            handleProductSearch(productSearchQuery)
                          }
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            margin: 0,
                            // Thêm các thuộc tính sau để đồng bộ kích thước
                            height: "28px", // Chiều cao giống input
                            fontSize: "0.8rem", // Cỡ chữ giống input
                            padding: "0.2rem 0.5rem", // Padding giống input
                          }}
                        >
                          Tìm kiếm
                        </button>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead className="table-light">
                          <tr className="align-middle text-center">
                            <th className="text-muted small">SẢN PHẨM</th>
                            <th className="text-muted small">SL ĐÃ MUA</th>
                            <th className="text-muted small">SL TRẢ</th>
                            <th className="text-muted small">ĐƠN GIÁ</th>
                            <th className="text-muted small">THÀNH TIỀN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReturnItems.length > 0 ? (
                            filteredReturnItems.map((item, index) => (
                              <tr key={index} className="align-middle">
                                <td>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={item.selected}
                                      onChange={(e) =>
                                        handleReturnItemChange(
                                          index,
                                          "selected",
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <label className="form-check-label small">
                                      {item.name}
                                    </label>
                                  </div>
                                </td>
                                <td className="small text-center">
                                  {item.quantity}
                                </td>
                                <td className="text-center">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm text-center"
                                    style={{
                                      width: "60px",
                                      margin: "0 auto",
                                    }}
                                    min="0"
                                    max={item.quantity}
                                    value={item.returnQuantity}
                                    onChange={(e) =>
                                      handleReturnItemChange(
                                        index,
                                        "returnQuantity",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    disabled={!item.selected}
                                  />
                                </td>
                                <td className="small text-center">
                                  {formatCurrency(item.price)}
                                </td>
                                <td className="text-danger fw-bold small text-center">
                                  {item.selected
                                    ? formatCurrency(
                                        item.price * item.returnQuantity
                                      )
                                    : "0 đ"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="text-center text-muted py-3"
                              >
                                <i className="fas fa-search me-2"></i>
                                Không tìm thấy sản phẩm nào phù hợp với "
                                {productSearchQuery}"
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Return Reason */}
                  <div className="mb-3">
                    <label className="form-label text-muted small">
                      Lý do trả hàng:
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Mô tả lý do trả hàng"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                    />
                  </div>

                  {/* Total */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
                      <span className="fw-bold">Tổng tiền hoàn lại:</span>
                      <span className="text-primary fs-5 fw-bold">
                        {formatCurrency(calculateReturnTotal())}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedOrder(null);
                        setReturnItems([]);
                        setFilteredReturnItems([]);
                        setProductSearchQuery("");
                        setReturnReason("");
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={handleReturnSubmit}
                      disabled={submittingReturn}
                    >
                      {submittingReturn ? "Đang xử lý..." : "Xác nhận trả hàng"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={handleCancelConfirm}
            style={{ zIndex: 1040 }}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancelConfirm();
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                    Xác nhận trả hàng
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCancelConfirm}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <p className="mb-3">
                      Bạn có chắc chắn muốn thực hiện trả hàng không?
                    </p>

                    <div className="bg-light p-3 rounded mb-3">
                      <div className="row">
                        <div className="col-6">
                          <strong>Mã đơn hàng:</strong>
                          <br />
                          <span className="text-primary">
                            {selectedOrder?.id}
                          </span>
                        </div>
                        <div className="col-6">
                          <strong>Tổng tiền hoàn lại:</strong>
                          <br />
                          <span className="text-success fw-bold">
                            {formatCurrency(calculateReturnTotal())}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <strong>Sản phẩm trả:</strong>
                        <ul className="mb-0 mt-1">
                          {returnItems
                            .filter(
                              (item) => item.selected && item.returnQuantity > 0
                            )
                            .map((item, index) => (
                              <li key={index} className="small">
                                {item.name} - SL: {item.returnQuantity}
                              </li>
                            ))}
                        </ul>
                      </div>

                      {returnReason && (
                        <div className="mt-2">
                          <strong>Lý do:</strong>
                          <p className="small mb-0 mt-1">{returnReason}</p>
                        </div>
                      )}
                    </div>

                    <div className="alert alert-warning small mb-0">
                      <i className="fas fa-info-circle me-1"></i>
                      Sau khi xác nhận, bạn không thể hoàn tác thao tác này.
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelConfirm}
                    disabled={submittingReturn}
                  >
                    <i className="fas fa-times me-1"></i>
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleConfirmedReturn}
                    disabled={submittingReturn}
                  >
                    <i className="fas fa-check me-1"></i>
                    {submittingReturn ? "Đang xử lý..." : "Xác nhận trả hàng"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </CashierLayout>
  );
}
