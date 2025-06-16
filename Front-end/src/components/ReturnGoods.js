import React, { useState, useEffect } from "react";
import "./Css/ReturnGoods.css"; // Import the CSS file
import Header from "./Header"; // Assuming you have the Header component
import { useLocation } from "react-router-dom";

export default function ReturnGoods() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderInfo, setOrderInfo] = useState({
    employee: "",
    date: "",
    orderId: "",
    originalTotal: 0,
    returnTotal: 0,
    returnFee: 0,
    customerDebt: 0,
  });
  const [editableOrderInfo, setEditableOrderInfo] = useState({
    returnFee: 0,
    customerDebt: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get billId from URL query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const billId = queryParams.get("billId");

  // Fetch bill details from API
  useEffect(() => {
    const fetchBillDetails = async () => {
      if (!billId) {
        setError("Không tìm thấy mã hóa đơn.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:9999/api/bill/${billId}`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          // Map API data to products state
          const fetchedProducts = result.data.map((item, index) => ({
            id: item._id,
            barcode: item.goods_id.barcode,
            name: item.goods_name,
            price: item.unit_price,
            maxQuantity: item.quantity,
            returnQuantity: item.quantity, // Default to max quantity for return
            note: "",
          }));

          // Set products state
          setProducts(fetchedProducts);

          // Set order info from the first item (assuming all items share the same bill_id details)
          const bill = result.data[0].bill_id;
          setOrderInfo({
            employee: bill.seller || "Unknown", // Adjust based on API data
            date: new Date(bill.createdAt).toLocaleString("vi-VN"),
            orderId: bill.billNumber,
            originalTotal: bill.totalAmount,
            returnTotal: bill.totalAmount,
            discount: 0,
            returnFee: 0,
            customerDebt: 0,
          });
        } else {
          setError("Không tìm thấy dữ liệu hóa đơn.");
        }
      } catch (error) {
        console.error("Error fetching bill details:", error);
        setError("Lỗi khi tải dữ liệu hóa đơn.");
      } finally {
        setLoading(false);
      }
    };

    fetchBillDetails();
  }, [billId]);

  const updateQuantity = (id, change) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          const newQuantity = Math.max(0, Math.min(product.maxQuantity, product.returnQuantity + change));
          return { ...product, returnQuantity: newQuantity };
        }
        return product;
      }),
    );
  };

  const updateNote = (id, note) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, note } : product)));
  };

  const removeProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const calculateReturnTotal = () => {
    return products.reduce((total, product) => total + product.returnQuantity * product.price, 0);
  };

  if (loading) {
    return (
      <div className="return-goods-page">
        <Header />
        <div className="row h-100">
          <div className="col-10 product-area">
            <div className="text-center mt-5">Đang tải dữ liệu...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="return-goods-page">
        <Header />
        <div className="row h-100">
          <div className="col-10 product-area">
            <div className="text-center mt-5 text-danger">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="return-goods-page">
      <Header />

      <div className="row h-100">
        {/* Left Sidebar */}
        <div className="col-2 sidebar">
          <nav className="sidebar-nav">
            <a className="sidebar-nav-item active" href="#">Yêu cầu trả hàng</a>
            <a className="sidebar-nav-item" href="#">Yêu cầu xuất hàng</a>
            <a className="sidebar-nav-item" href="#">Thanh toán</a>
          </nav>
          <div className="sidebar-avatar">A</div>
        </div>

        {/* Main Content */}
        <div className="col-10 product-area">
          <div className="tab-section d-flex align-items-center justify-content-between mb-3">
            <div className="tab-button">Trả hàng +</div>
            {/* <div className="tab-button tab-add-button">+</div> */}
          </div>

          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm sản phẩm trả hàng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="product-list">
            {products
              .filter(
                (product) =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.barcode.includes(searchTerm),
              )
              .map((product) => (
                <div key={product.id} className="product-item">
                  <div className="product-main-info">
                    {/* <div className="product-status-icon">✓</div> */}
                    <div className="product-details">
                      <div className="product-barcode">{product.barcode}</div>
                      <div className="product-name">{product.name}</div>
                    </div>
                    <div className="quantity-controls">
                      <button
                        className="quantity-button decrease"
                        onClick={() => updateQuantity(product.id, -1)}
                      >
                        −
                      </button>
                      <div className="quantity-display">
                        {product.returnQuantity} / {product.maxQuantity}
                      </div>
                      <button
                        className="quantity-button increase"
                        onClick={() => updateQuantity(product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="product-price">Đơn giá: {product.price.toLocaleString()} VND</div>
                    <div className="remove-button" onClick={() => removeProduct(product.id)}>
                      🗑️
                    </div>
                  </div>
                  <div className="note-section">
                    <label className="note-label">Ghi chú trả hàng:</label>
                    <textarea
                      className="note-textarea"
                      value={product.note}
                      onChange={(e) => updateNote(product.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-3 right-sidebar">
          <div className="order-info-section">
            <div className="info-row">
              <span>Nhân viên</span>
              <span>{orderInfo.employee}</span>
            </div>
            <div className="date-info">{orderInfo.date}</div>
            <div className="info-row">
              <span>Mã hóa đơn</span>
              <input className="order-id-input" value={orderInfo.orderId} readOnly />
            </div>
          </div>

          <div className="summary-section">
            <div className="summary-title">Tổng kết trả hàng</div>
            <div className="summary-row">
              <span>Tổng giá gốc mua</span>
              <input
                className="summary-input"
                value={orderInfo.originalTotal.toLocaleString()}
                readOnly
              />
            </div>
            <div className="summary-row">
              <span>Tổng tiền phải trả</span>
              <input
                className="summary-input"
                value={calculateReturnTotal().toLocaleString()}
                readOnly
              />
            </div>
            <div className="summary-row">
              <span>Phí trả hàng</span>
              <input
                className="summary-input"
                value={editableOrderInfo.returnFee}
                onChange={(e) =>
                  setEditableOrderInfo({ ...editableOrderInfo, returnFee: Number(e.target.value) })
                }
              />
            </div>
            <div className="summary-row">
              <span>Cần trả khách</span>
              <input
                className="summary-input"
                value={editableOrderInfo.customerDebt}
                onChange={(e) =>
                  setEditableOrderInfo({ ...editableOrderInfo, customerDebt: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="return-button-section">
            <button className="return-button">TRẢ HÀNG</button>
          </div>
        </div>
      </div>
    </div>
  );
}