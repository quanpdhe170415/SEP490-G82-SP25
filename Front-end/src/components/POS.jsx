import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Thêm dòng này

// Sửa lỗi ảnh sản phẩm mẫu không load được
const mockProducts = [
  { id: 1, code: "8930001234", name: "Nước suối", price: 5000, type: "Nước", img: "https://dummyimage.com/40x40/cccccc/000000&text=SP" },
  { id: 2, code: "8930005678", name: "Kem đánh răng", price: 20000, type: "Chăm sóc cá nhân", img: "https://dummyimage.com/40x40/cccccc/000000&text=SP" },
  { id: 3, code: "8930009999", name: "Bánh quy", price: 15000, type: "Bánh kẹo", img: "https://dummyimage.com/40x40/cccccc/000000&text=SP" },
  // ...có thể thêm sản phẩm mẫu
];

const mockCart = [
  { id: 2, code: "8930005678", name: "Kem đánh răng", price: 20000, qty: 1, discount: 5000, discountType: "VND" },
];

const denominations = [
  { value: 1000, label: "1.000" },
  { value: 2000, label: "2.000" },
  { value: 5000, label: "5.000" },
  { value: 10000, label: "10.000" },
  { value: 20000, label: "20.000" },
  { value: 50000, label: "50.000" },
  { value: 100000, label: "100.000" },
  { value: 200000, label: "200.000" },
  { value: 500000, label: "500.000" },
];

const initialCashInDrawer = {
  1000: 10,
  2000: 10,
  5000: 10,
  10000: 10,
  20000: 10,
  50000: 10,
  100000: 10,
  200000: 10,
  500000: 10,
};

export default function POS() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Nếu muốn thu gọn sidebar
  const [search, setSearch] = useState("");
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [products, setProducts] = useState([]); // lấy từ API
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState("cash");
  const [customerPay, setCustomerPay] = useState("");
  const [cashInput, setCashInput] = useState(
    denominations.reduce((acc, d) => ({ ...acc, [d.value]: 0 }), {})
  );
  const [useCashInput, setUseCashInput] = useState(false);
  const [cashInDrawer, setCashInDrawer] = useState({ ...initialCashInDrawer });

  // Lấy cart của tab hiện tại
  const cart = tabs.find(t => t.id === activeTab)?.cart || [];

  // Tính toán giá cuối cùng cho từng sản phẩm trong giỏ
  const getFinalPrice = (item) => {
    if (item.discountType === "%") {
      return item.price - (item.price * (item.discount || 0)) / 100;
    }
    return item.price - (item.discount || 0);
  };

  // Cập nhật cart cho tab hiện tại
  const updateCart = (newCart) => {
    setTabs(tabs => tabs.map(tab => tab.id === activeTab ? { ...tab, cart: newCart } : tab));
  };

  const handleQtyChange = (id, delta) => {
    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const handleDiscountChange = (id, value, type) => {
    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, discount: value, discountType: type } : item
      )
    );
  };

  const handleRemoveFromCart = (id) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const handleAddToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      updateCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      updateCart([
        ...cart,
        { ...product, qty: 1, discount: 0, discountType: "VND" },
      ]);
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  // Thêm tab mới
  const handleAddTab = () => {
    const newId = tabs.length ? Math.max(...tabs.map(t => t.id)) + 1 : 1;
    setTabs([...tabs, { id: newId, name: `Hóa đơn ${newId}`, cart: [] }]);
    setActiveTab(newId);
  };

  // Đổi tab
  const handleSelectTab = (id) => setActiveTab(id);
  // Đóng tab (cho phép đóng cả tab đầu tiên nếu còn nhiều hơn 1 tab)
  const handleCloseTab = (id) => {
    if (tabs.length === 1) return; // Không cho xóa tab cuối cùng
    const idx = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    // Đánh lại số thứ tự hóa đơn
    const renamedTabs = newTabs.map((tab, i) => ({ ...tab, id: i + 1, name: `Hóa đơn ${i + 1}` }));
    // Cập nhật activeTab
    let newActiveTab = activeTab;
    if (activeTab === id) {
      if (idx > 0) newActiveTab = renamedTabs[idx - 1]?.id || 1;
      else newActiveTab = renamedTabs[0]?.id || 1;
    } else {
      // Nếu activeTab lớn hơn số tab mới thì giảm về cuối
      if (activeTab > renamedTabs.length) newActiveTab = renamedTabs.length;
    }
    setTabs(renamedTabs);
    setActiveTab(newActiveTab);
  };

  // Lấy sản phẩm từ API khi load trang
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setErrorProducts("");
      try {
        const res = await fetch(`${process.env.REACT_APP_URL_SERVER}product/products-for-retail`);
        if (!res.ok) throw new Error("Không thể lấy danh sách sản phẩm");
        const data = await res.json();
        // Giả sử API trả về mảng sản phẩm, map lại cho đúng định dạng
        setProducts(
          (Array.isArray(data) ? data : data.products || []).map((p, idx) => ({
            id: p._id || p.id || idx + 1,
            code: p.code || p.barcode || "",
            name: p.name || p.productName || "Sản phẩm",
            price: p.price || p.retailPrice || 0,
            type: p.type || p.category || "Khác",
            img: p.img || p.image || "https://dummyimage.com/40x40/cccccc/000000&text=SP",
          }))
        );
      } catch (err) {
        setErrorProducts(err.message || "Lỗi khi tải sản phẩm");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Khởi tạo tab đầu tiên nếu chưa có tab nào
  useEffect(() => {
    if (tabs.length === 0) {
      setTabs([{ id: 1, name: "Hóa đơn 1", cart: [] }]);
      setActiveTab(1);
    }
    // eslint-disable-next-line
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.includes(search)
  );

  // Tổng tiền phải trả (sau giảm giá)
  const total = cart.reduce(
    (sum, item) => sum + getFinalPrice(item) * item.qty,
    0
  );

  // Số tiền khách cần trả (có thể thêm giảm giá sau này)
  const customerNeedPay = total;

  // Tổng tiền khách thanh toán (từ input mệnh giá)
  const totalCustomerCash = Object.entries(cashInput).reduce(
    (sum, [denom, qty]) => sum + Number(denom) * Number(qty),
    0
  );

  // Số tiền khách thanh toán (ưu tiên input mệnh giá nếu có, nếu không thì input thủ công)
  const customerPaid = useCashInput && totalCustomerCash > 0 ? totalCustomerCash : Number(customerPay) || 0;
  const change = customerPaid - customerNeedPay;

  // Xử lý khi chọn mệnh giá
  const handleCashInputChange = (value, qty) => {
    if (qty === "" || qty === null) qty = 0;
    if (!/^[0-9]*$/.test(qty)) return;
    setCashInput((prev) => ({ ...prev, [value]: Number(qty) }));
    setUseCashInput(true);
    setCustomerPay(""); // reset input thủ công nếu chọn mệnh giá
  };

  // Xử lý nhập thủ công
  const handleCustomerPayChange = (e) => {
    setCustomerPay(e.target.value);
    setUseCashInput(false);
    setCashInput(denominations.reduce((acc, d) => ({ ...acc, [d.value]: 0 }), {})); // reset mệnh giá nếu nhập thủ công
  };

  // Khi nhấn thanh toán
  const handleOpenPayment = async () => {
    try {
      // Lấy shiftId từ localStorage hoặc hardcode
      const shift_id = localStorage.getItem('shift_id') || "684ffe133092125dd21c8a1a";
      if (!shift_id) {
        alert('Vui lòng mở ca và đảm bảo shiftId hợp lệ trước khi tạo hóa đơn!');
        return;
      }
      // Lấy billId nếu tab hiện tại đã có
      const billId = tabs.find(tab => tab.id === activeTab)?.billId;
      // Lấy note từ input hoặc state nếu có, ở đây tạm để rỗng
      const note = '';
      // Chuẩn bị items từ cart
      const items = cart.map(item => ({
        goodsId: item.id || item._id,
        quantity: item.qty
      }));
      if (items.length === 0) {
        alert('Giỏ hàng trống!');
        return;
      }
      const payload = { shift_id, note, items };
      if (billId) payload.billId = billId;
      const res = await fetch('http://localhost:9999/api/payment/createbill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Không thể tạo/cập nhật hóa đơn');
      const bill = await res.json();
      setTabs(tabs => tabs.map(tab => tab.id === activeTab ? { ...tab, billId: bill._id } : tab));
      setShowPayment(true);
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo/cập nhật hóa đơn');
    }
  };

  // Đóng sidebar
  const handleClosePayment = () => {
    setShowPayment(false);
    setCustomerPay("");
    setCashInput(denominations.reduce((acc, d) => ({ ...acc, [d.value]: 0 }), {}));
  };

  // Xác nhận thanh toán
  const handleConfirmPayment = async () => {
    try {
      const billId = tabs.find(tab => tab.id === activeTab)?.billId;
      if (!billId) {
        toast.error('Không tìm thấy hóa đơn để thanh toán!');
        return;
      }
      const cashPaid = useCashInput && totalCustomerCash > 0 ? totalCustomerCash : Number(customerPay) || 0;
      const paymentMethod = paymentType;
      const res = await fetch(`${process.env.REACT_APP_URL_SERVER}/payment/${billId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod, cashPaid })
      });
      if (!res.ok) throw new Error('Thanh toán thất bại');
      await res.json();
      toast.success('Thanh toán thành công!');
      setTabs(tabs => tabs.map(tab => tab.id === activeTab ? { ...tab, cart: [], billId: undefined } : tab));
      setShowPayment(false);
      setCustomerPay("");
      setCashInput(denominations.reduce((acc, d) => ({ ...acc, [d.value]: 0 }), {}));
    } catch (err) {
      toast.error(err.message || 'Lỗi khi xác nhận thanh toán');
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-row" style={{ fontFamily: 'Arial', position: 'relative' }}>
      {/* Sidebar */}
      <div className="bg-white border-end p-3 d-flex flex-column" style={{ width: 180 }}>
        <div className="mb-4 text-center">
          <img src="https://via.placeholder.com/40" alt="logo" className="mb-2" />
          <div className="fw-bold">Tạp hóa Hải Chi</div>
        </div>
        <div className="nav flex-column gap-2">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => navigate("/history")}
      >
        Lịch sử hóa đơn
      </button>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => navigate("/request-export")}
      >
        Yêu cầu xuất hàng
      </button>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => navigate("/POS")}
      >
        Thanh toán
      </button>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => navigate("/closeshift")}
      >Đóng ca
      </button>
    </div>
        <div className="mt-auto text-center">
          <img src="https://via.placeholder.com/32" alt="avatar" className="rounded-circle" />
        </div>
      </div>
      {/* Main POS */}
      <div className="flex-grow-1 p-0" style={{ paddingBottom: 90 }}>
        {/* Header POS mới */}
        <div className="d-flex align-items-center gap-3 px-3 py-2" style={{ background: '#0070f4', borderRadius: '12px 12px 0 0', minHeight: 56 }}>
          {/* Tìm kiếm hàng hóa */}
          <div className="d-flex align-items-center gap-2" style={{ minWidth: 340 }}>
            <input
              className="form-control form-control-sm"
              style={{ maxWidth: 320, background: '#f5f6fa', border: 'none', borderRadius: 8, fontSize: 16, minWidth: 220 }}
              placeholder="Tìm hàng hóa (F3)"
              value={search}
              onChange={handleSearch}
            />
            <button className="btn btn-light btn-sm d-flex align-items-center justify-content-center" style={{ borderRadius: 8, width: 36, height: 36 }}>
              <span role="img" aria-label="scan">📷</span>
            </button>
          </div>
          {/* Tabs hóa đơn */}
          <div className="d-flex align-items-center flex-grow-1 gap-2" style={{ minWidth: 0 }}>
            {tabs.map(tab => (
              <div key={tab.id} className="position-relative d-flex align-items-center" style={{ minWidth: 0 }}>
                <div className="d-flex align-items-center" style={{ minWidth: 0, gap: 6 }}>
                  <button
                    className={`btn btn-${activeTab === tab.id ? '' : 'outline-'}light btn-sm px-3 fw-bold me-0`}
                    style={{ background: activeTab === tab.id ? '#fff' : 'transparent', color: activeTab === tab.id ? '#0070f4' : '#fff', borderRadius: 8, border: 'none', minWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    onClick={() => handleSelectTab(tab.id)}
                  >
                    <span style={{ flex: 1, textAlign: 'left', fontWeight: 600, marginRight:'5px' }}>{tab.name}</span>

                    {tabs.length > 1 && (
                    <button
                      className="btn btn-sm position-relative"
                      style={{ fontSize: 12, color: '#fff', background: '#dc3545', borderRadius: '50%', width: 8, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', marginLeft: 2 }}
                      onClick={(e) => { e.stopPropagation(); handleCloseTab(tab.id); }}
                      tabIndex={-1}
                      title="Đóng tab"
                    >
                      ×
                    </button>
                  )}
                  </button>
                </div>
              </div>
            ))}
            <button className="btn btn-light btn-sm px-2 d-flex align-items-center justify-content-center" style={{ borderRadius: 8, width: 32, height: 32, fontSize: 20 }} onClick={handleAddTab}>+</button>
          </div>
        </div>
        <div className="row">
          {/* Danh sách sản phẩm */}
          <div className="col-5">
            <div className="mb-2">
              <button className="btn btn-outline-primary btn-sm me-2">Nước</button>
              {/* Có thể thêm các tab loại sản phẩm khác */}
            </div>
            {loadingProducts ? (
              <div className="text-center py-4">Đang tải sản phẩm...</div>
            ) : errorProducts ? (
              <div className="alert alert-danger">{errorProducts}</div>
            ) : (
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
                {filteredProducts.length === 0 && (
                  <div className="col-12 text-center text-secondary py-3">Không có sản phẩm phù hợp</div>
                )}
              </div>
            )}
          </div>
          {/* Hóa đơn */}
          <div className="col-7">
            <div className="card shadow-sm mb-2" style={{marginTop: 38}}>
              <div className="card-body p-2">
                <table className="table table-bordered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th style={{ width: 180 }}>Tên sản phẩm</th>
                      <th style={{ width: 80 }}>Số lượng</th>
                      <th style={{ width: 100 }}>Giá</th>
                      <th style={{ width: 180 }}>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td className="text-center align-middle">
                          <button className="btn btn-danger btn-sm" title="Xóa" onClick={() => handleRemoveFromCart(item.id)}>
                            &times;
                          </button>
                        </td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Thanh toán cố định góc dưới phải */}
        <div style={{ position: 'fixed', right: 30, bottom: 30, zIndex: 1000, minWidth: 320 }}>
          <div className="card shadow p-3 d-flex flex-row align-items-center justify-content-between gap-3">
            <span className="fw-bold fs-5 mb-0">Tổng cộng: {total.toLocaleString()} đ</span>
            <button className="btn btn-success fw-bold" onClick={handleOpenPayment}>Thanh toán</button>
          </div>
        </div>
      </div>
      {/* Sidebar xác nhận thanh toán */}
      {showPayment && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: 370, height: '100vh', maxWidth: '100vw', background: '#fff', boxShadow: '-2px 0 8px rgba(0,0,0,0.1)', zIndex: 2000, transition: 'all 0.3s', borderLeft: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ minHeight: 56 }}>
            <div className="fw-bold">Xác nhận thanh toán</div>
            <button className="btn btn-sm btn-close" onClick={handleClosePayment}></button>
          </div>
          <div className="p-3 flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
            <div className="mb-2">Nhân viên: <span className="fw-bold">Nguyễn Văn A</span></div>
            <div className="mb-2">{new Date().toLocaleString()}</div>
            <div className="mb-2">Số tiền khách phải trả</div>
            <input className="form-control mb-2" value={total.toLocaleString()} disabled />
            <div className="mb-2">Giảm giá</div>
            <input className="form-control mb-2" value={0} disabled />
            <div className="mb-2">Khách cần trả</div>
            <input className="form-control mb-2" value={customerNeedPay.toLocaleString()} disabled />
            <div className="mb-2">Khách thanh toán</div>
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Nhập số tiền khách đưa"
              value={customerPay}
              onChange={handleCustomerPayChange}
            />
            <div className="mb-2">Hoặc chọn mệnh giá:</div>
            <div className="row g-1 mb-2">
              {denominations.map((d, idx) => (
                <div className="col-4 mb-1" key={d.value}>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-primary text-white" style={{ minWidth: 60 }}>{d.label}</span>
                    <input
                      type="number"
                      min="0"
                      className="form-control text-end"
                      value={cashInput[d.value] === 0 ? "" : cashInput[d.value]}
                      onChange={e => handleCashInputChange(d.value, e.target.value)}
                    />
                  </div>
                  <div className="small text-secondary">Còn lại: {cashInDrawer[d.value]}</div>
                </div>
              ))}
            </div>
            {/* Radio chọn phương thức thanh toán */}
            <div className="mb-3">
              <label className="fw-bold mb-1">Phương thức thanh toán:</label>
              <br></br>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="paymentCash"
                  value="Tiền mặt"
                  checked={paymentType === "Tiền mặt"}
                  onChange={() => setPaymentType("Tiền mặt")}
                />
                <label className="form-check-label" htmlFor="paymentCash">Tiền mặt</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="paymentTransfer"
                  value="QR"
                  checked={paymentType === "QR"}
                  onChange={() => setPaymentType("QR")}
                />
                <label className="form-check-label" htmlFor="paymentTransfer">QR</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="paymentTransfer"
                  value="Chuyển khoản"
                  checked={paymentType === "Kết hợp"}
                  onChange={() => setPaymentType("Kết hợp")}
                />
                <label className="form-check-label" htmlFor="paymentTransfer">Kết hợp</label>
              </div>
            </div>
            <div className="mb-2">Tiền thừa</div>
            <input className="form-control mb-3" value={change >= 0 ? change.toLocaleString() : ""} disabled />
            <button className="btn btn-success w-100 fw-bold" onClick={handleConfirmPayment}>
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
