import React, { useState } from "react";

const mockProducts = [
  { id: 1, code: "8930001234", name: "Nước suối", price: 5000, type: "Nước", img: "https://via.placeholder.com/40" },
  { id: 2, code: "8930005678", name: "Kem đánh răng", price: 20000, type: "Chăm sóc cá nhân", img: "https://via.placeholder.com/40" },
  { id: 3, code: "8930009999", name: "Bánh quy", price: 15000, type: "Bánh kẹo", img: "https://via.placeholder.com/40" },
  // ...có thể thêm sản phẩm mẫu
];

const mockCart = [
  { id: 2, code: "8930005678", name: "Kem đánh răng", price: 20000, qty: 1, discount: 5000, discountType: "VND" },
];

export default function POS() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(mockCart);
  const [products] = useState(mockProducts);

  // Tính toán giá cuối cùng cho từng sản phẩm trong giỏ
  const getFinalPrice = (item) => {
    if (item.discountType === "%") {
      return item.price - (item.price * (item.discount || 0)) / 100;
    }
    return item.price - (item.discount || 0);
  };

  const handleQtyChange = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const handleDiscountChange = (id, value, type) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, discount: value, discountType: type } : item
      )
    );
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.includes(search)
  );

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        { ...product, qty: 1, discount: 0, discountType: "VND" },
      ];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + getFinalPrice(item) * item.qty,
    0
  );

  return (
    <div className="min-vh-100 bg-light d-flex flex-row" style={{ fontFamily: 'Arial', position: 'relative' }}>
      {/* Sidebar */}
      <div className="bg-white border-end p-3 d-flex flex-column" style={{ width: 180 }}>
        <div className="mb-4 text-center">
          <img src="https://via.placeholder.com/40" alt="logo" className="mb-2" />
          <div className="fw-bold">Tạp hóa Hải Chi</div>
        </div>
        <div className="nav flex-column gap-2">
          <button className="btn btn-outline-primary btn-sm">Yêu cầu trả hàng</button>
          <button className="btn btn-outline-primary btn-sm">Yêu cầu xuất hàng</button>
          <button className="btn btn-outline-primary btn-sm">Thanh toán</button>
          <button className="btn btn-outline-primary btn-sm">Đóng ca</button>
        </div>
        <div className="mt-auto text-center">
          <img src="https://via.placeholder.com/32" alt="avatar" className="rounded-circle" />
        </div>
      </div>
      {/* Main POS */}
      <div className="flex-grow-1 p-3" style={{ paddingBottom: 90 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <input
              className="form-control form-control-sm"
              style={{ width: 220 }}
              placeholder="Tìm kiếm"
              value={search}
              onChange={handleSearch}
            />
            <span className="fw-bold">Sản phẩm đang search</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-primary btn-sm">Hóa đơn 1</button>
            <button className="btn btn-outline-secondary btn-sm">+</button>
          </div>
          <div>
            <button className="btn btn-light btn-sm rounded-circle border">🔔</button>
          </div>
        </div>
        <div className="row">
          {/* Danh sách sản phẩm */}
          <div className="col-5">
            <div className="mb-2">
              <button className="btn btn-outline-primary btn-sm me-2">Nước</button>
              {/* Có thể thêm các tab loại sản phẩm khác */}
            </div>
            <div className="row g-2">
              {filteredProducts.map((p) => (
                <div className="col-6" key={p.id}>
                  <div className="card h-100" onClick={() => handleAddToCart(p)} style={{ cursor: 'pointer' }}>
                    <div className="card-body p-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={p.img} alt="Ảnh" width={40} height={40} />
                        <div>
                          <div className="fw-bold">{p.name}</div>
                          <div className="text-secondary small">{p.type}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="fw-bold text-primary">{p.price.toLocaleString()} đ</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Hóa đơn */}
          <div className="col-7">
            <table className="table table-bordered mb-2">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 180 }}>Tên sản phẩm</th>
                  <th style={{ width: 80 }}>Số lượng</th>
                  <th style={{ width: 100 }}>Giá</th>
                  <th style={{ width: 180 }}>Chi tiết</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="fw-bold">{item.name}</div>
                      <div className="small text-secondary">{item.code}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <button className="btn btn-outline-secondary btn-sm px-2" onClick={() => handleQtyChange(item.id, -1)}>-</button>
                        <span className="mx-1">{item.qty}</span>
                        <button className="btn btn-outline-secondary btn-sm px-2" onClick={() => handleQtyChange(item.id, 1)}>+</button>
                      </div>
                    </td>
                    <td>
                      <div>{item.price.toLocaleString()} đ</div>
                    </td>
                    <td>
                      <div className="mb-1">Giá gốc: {item.price.toLocaleString()} đ</div>
                      <div className="mb-1 d-flex align-items-center gap-1">
                        <span>Giảm giá</span>
                        <input
                          type="number"
                          min="0"
                          className="form-control form-control-sm"
                          style={{ width: 70 }}
                          value={item.discount}
                          onChange={e => handleDiscountChange(item.id, Number(e.target.value), item.discountType)}
                        />
                        <div className="form-check form-check-inline mb-0">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`discountType${item.id}`}
                            id={`vnd${item.id}`}
                            checked={item.discountType === "VND"}
                            onChange={() => handleDiscountChange(item.id, item.discount, "VND")}
                          />
                          <label className="form-check-label" htmlFor={`vnd${item.id}`}>VND</label>
                        </div>
                        <div className="form-check form-check-inline mb-0">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`discountType${item.id}`}
                            id={`percent${item.id}`}
                            checked={item.discountType === "%"}
                            onChange={() => handleDiscountChange(item.id, item.discount, "%")}
                          />
                          <label className="form-check-label" htmlFor={`percent${item.id}`}>%</label>
                        </div>
                      </div>
                      <div className="mb-1">Giá cuối: {getFinalPrice(item).toLocaleString()} đ</div>
                      <div className="fw-bold">Thành tiền: {(getFinalPrice(item) * item.qty).toLocaleString()} đ</div>
                    </td>
                    <td className="text-center align-middle">
                      <button className="btn btn-danger btn-sm" title="Xóa" onClick={() => handleRemoveFromCart(item.id)}>
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Xóa phần tổng tiền và thanh toán ở đây, chuyển xuống dưới */}
          </div>
        </div>
        {/* Thanh toán cố định góc dưới phải */}
        <div style={{ position: 'fixed', right: 30, bottom: 30, zIndex: 1000, minWidth: 320 }}>
          <div className="card shadow p-3 d-flex flex-row align-items-center justify-content-between gap-3">
            <span className="fw-bold fs-5 mb-0">Tổng cộng: {total.toLocaleString()} đ</span>
            <button className="btn btn-success fw-bold">Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  );
}
