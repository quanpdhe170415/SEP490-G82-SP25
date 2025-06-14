import React, { useState } from "react";
import "./Css/ReturnGoods.css";  // Import the CSS file
import Header from "./Header"; // Assuming you have the Header component

export default function ReturnGoods() {
  const [products, setProducts] = useState([
    {
      id: "1",
      barcode: "8930001234",
      name: "Kem đánh răng",
      price: 20000,
      maxQuantity: 2,
      returnQuantity: 1,
      note: "",
    },
    {
      id: "2",
      barcode: "8930001235",
      name: "Coca",
      price: 20000,
      maxQuantity: 1,
      returnQuantity: 0,
      note: "",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderInfo] = useState({
    employee: "Phạm Văn Thành",
    date: "24/5/2025 9:59",
    orderId: "HD001",
    originalTotal: 20000,
    returnTotal: 20000,
    discount: 0,
    returnFee: 0,
    customerDebt: 0,
  });

  const [editableOrderInfo, setEditableOrderInfo] = useState({
    discount: 0,
    returnFee: 0,
    customerDebt: 0,
  });

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

  return (
    <div className="return-goods-page">
      <Header /> {/* Move Header to the top */}

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
          {/* Adjust the "Trả hàng" section to be horizontal */}
          <div className="tab-section d-flex align-items-center justify-content-between mb-3">
            <div className="tab-button">Trả hàng</div>
            <div className="tab-button tab-add-button">+</div>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm sản phẩm trả hàng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Product List */}
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-main-info">
                  <div className="product-status-icon">✓</div>
                  <div className="product-details">
                    <div className="product-barcode">{product.barcode}</div>
                    <div className="product-name">{product.name}</div>
                  </div>

                  <div className="quantity-controls">
                    <button className="quantity-button decrease" onClick={() => updateQuantity(product.id, -1)}>
                      −
                    </button>
                    <div className="quantity-display">{product.returnQuantity} / {product.maxQuantity}</div>
                    <button className="quantity-button increase" onClick={() => updateQuantity(product.id, 1)}>
                      +
                    </button>
                  </div>

                  <div className="product-price">{product.price.toLocaleString()}</div>

                  <div className="remove-button" onClick={() => removeProduct(product.id)}>🗑️</div>
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
              <input className="summary-input" value={orderInfo.originalTotal.toLocaleString()} readOnly />
            </div>

            <div className="summary-row">
              <span>Tổng tiền phải trả</span>
              <input className="summary-input" value={calculateReturnTotal().toLocaleString()} readOnly />
            </div>

            <div className="summary-row">
              <span>Giảm giá</span>
              <input
                className="summary-input"
                value={editableOrderInfo.discount}
                onChange={(e) => setEditableOrderInfo({ ...editableOrderInfo, discount: Number(e.target.value) })}
              />
            </div>

            <div className="summary-row">
              <span>Phí trả hàng</span>
              <input
                className="summary-input"
                value={editableOrderInfo.returnFee}
                onChange={(e) => setEditableOrderInfo({ ...editableOrderInfo, returnFee: Number(e.target.value) })}
              />
            </div>

            <div className="summary-row">
              <span>Cần trả khách</span>
              <input
                className="summary-input"
                value={editableOrderInfo.customerDebt}
                onChange={(e) => setEditableOrderInfo({ ...editableOrderInfo, customerDebt: Number(e.target.value) })}
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
