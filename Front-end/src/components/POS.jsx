import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup, Tab, Tabs, Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import 'bootstrap/dist/css/bootstrap.min.css';
import './POS.custom.css';

const initialProducts = [
  { id: 1, name: "Kem đánh răng Close Up", price: 20000, icon: "🧴", pinned: true, category: "Vệ sinh" },
  { id: 2, name: "Coca Cola 330ml", price: 12000, icon: "🥤", pinned: false, category: "Nước ngọt" },
  { id: 3, name: "Bánh mì sandwich", price: 15000, icon: "🍞", pinned: false, category: "Bánh kẹo" },
  { id: 4, name: "Mì tôm Hảo Hảo", price: 5000, icon: "🍜", pinned: false, category: "Đồ khô" },
  { id: 5, name: "Sữa TH True Milk", price: 25000, icon: "🥛", pinned: false, category: "Sữa & Yogurt" },
  { id: 6, name: "Kẹo Mentos", price: 8000, icon: "🍿", pinned: false, category: "Bánh kẹo" },
];

const initialCarts = [
  {
    id: 1,
    name: "Hóa đơn 1",
    cart: [
      { id: 1, name: "Kem đánh răng Close Up", price: 20000, qty: 1 },
      { id: 2, name: "Nước ngọt Coca Cola 330ml", price: 12000, qty: 2 },
      { id: 5, name: "Sữa tươi TH True Milk", price: 25000, qty: 1 },
    ],
    discount: 5000, // số tiền giảm hoặc %
    discountType: "₫" // "₫" hoặc "%"
  },
  {
    id: 2,
    name: "Hóa đơn 2",
    cart: [],
    discount: 10, // 10%
    discountType: "%"
  }
];

const initialOrders = [
  { id: "HD-2025001", time: "14:35", items: 3, amount: 45000 },
  { id: "HD-2025002", time: "14:32", items: 1, amount: 20000 },
  { id: "HD-2025003", time: "14:28", items: 5, amount: 85000 },
  { id: "HD-2025004", time: "14:15", items: 2, amount: 32000 },
  { id: "HD-2025005", time: "14:10", items: 4, amount: 67500 },
  { id: "HD-2025006", time: "14:05", items: 1, amount: 15000 },
  { id: "HD-2025007", time: "13:58", items: 3, amount: 52000 },
  { id: "HD-2025008", time: "13:45", items: 6, amount: 120000 },
];

const categories = [
  "Tất cả",
  "Nước ngọt",
  "Nước suối",
  "Sữa & Yogurt",
  "Bánh kẹo",
  "Đồ khô",
  "Gia vị",
  "Vệ sinh",
];

export default function POS() {
  const [search, setSearch] = useState("");
  const [searchOverlay, setSearchOverlay] = useState(false);
  // carts: mảng các hóa đơn, activeCartIdx: index hóa đơn đang chọn
  const [carts, setCarts] = useState(initialCarts);
  const [activeCartIdx, setActiveCartIdx] = useState(0);
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const searchInputRef = useRef();
  const [showModal, setShowModal] = useState(false);

  // Lấy cart hiện tại
  const currentCart = carts[activeCartIdx]?.cart || [];
  const currentDiscount = carts[activeCartIdx]?.discount || 0;
  const currentDiscountType = carts[activeCartIdx]?.discountType || "₫";
  // Tổng tiền tạm tính
  const subtotal = currentCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  // Tổng sau giảm giá
  const total = currentDiscountType === "%" ? subtotal - (subtotal * currentDiscount) / 100 : subtotal - currentDiscount;

  // Overlay: đóng khi click ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target) &&
        !e.target.classList.contains("search-result-item")
      ) {
        setSearchOverlay(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Xử lý thêm sản phẩm vào cart hiện tại
  const addToCart = (product) => {
    setCarts((prev) => {
      const cartsCopy = [...prev];
      const cart = cartsCopy[activeCartIdx].cart;
      const exist = cart.find((item) => item.id === product.id);
      if (exist) {
        cartsCopy[activeCartIdx].cart = cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        cartsCopy[activeCartIdx].cart = [...cart, { ...product, qty: 1 }];
      }
      return cartsCopy;
    });
    setSearchOverlay(false);
  };

  // Xử lý tăng/giảm số lượng
  const changeQty = (id, delta) => {
    setCarts((prev) => {
      const cartsCopy = [...prev];
      cartsCopy[activeCartIdx].cart = cartsCopy[activeCartIdx].cart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      );
      return cartsCopy;
    });
  };

  // Xóa sản phẩm khỏi cart
  const removeFromCart = (id) => {
    setCarts((prev) => {
      const cartsCopy = [...prev];
      cartsCopy[activeCartIdx].cart = cartsCopy[activeCartIdx].cart.filter(item => item.id !== id);
      return cartsCopy;
    });
  };

  // Xử lý pin sản phẩm
  const togglePin = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p))
    );
  };

  // Xử lý chọn tab danh mục
  const handleCategory = (cat) => setActiveCategory(cat);

  // Thêm hóa đơn mới
  const addNewCart = () => {
    setCarts((prev) => [
      ...prev,
      { id: prev.length + 1, name: `Hóa đơn ${prev.length + 1}`, cart: [] }
    ]);
    setActiveCartIdx(carts.length); // chuyển sang hóa đơn mới
  };

  // Đổi tab hóa đơn
  const handleSelectCart = (idx) => setActiveCartIdx(idx);

  // Đóng tab hóa đơn
  const closeCartTab = (idx) => {
    if (carts.length === 1) return; // Không cho đóng tab cuối cùng
    setCarts(prev => {
      const newCarts = prev.filter((_, i) => i !== idx);
      // Nếu tab đang active bị đóng, chuyển sang tab bên trái hoặc tab đầu tiên
      if (activeCartIdx === idx) {
        setActiveCartIdx(idx === 0 ? 0 : idx - 1);
      } else if (activeCartIdx > idx) {
        setActiveCartIdx(activeCartIdx - 1);
      }
      return newCarts;
    });
  };

  return (
    <Container fluid className="bg-light" style={{ minHeight: "100vh", padding: 0 }}>
      {/* Header */}
      <Row className="align-items-center bg-white border-bottom" style={{ height: 60, margin: 0 }}>
        <Col xs={3} className="d-flex align-items-center gap-2">
          <div style={{width:30, height:30, background:'#333', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12}}>POS</div>
          <span className="fw-bold fs-5">Tạp hóa Hải Chi</span>
        </Col>
        <Col xs={9} className="d-flex justify-content-end align-items-center gap-4">
          <div className="d-flex align-items-center gap-2 bg-success bg-opacity-10 px-3 py-1 rounded">
            <span style={{color:'#28a745', fontSize:18}}>●</span>
            <span>Ca làm việc: 08:00 - 20:00</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{width:32, height:32, fontWeight:'bold'}}>A</div>
            <span>Thu ngân: Nguyễn Văn A</span>
          </div>
          <span style={{fontSize:22}}>🔔</span>
        </Col>
      </Row>
      <Row className="pos-container justify-content-center" style={{margin:0, height:'calc(100vh - 60px)'}}>
        {/* Sidebar */}
        <Col xs={3} style={{height:'100%', minWidth: '270px', maxWidth: '320px'}} className="sidebar bg-white border-end d-flex flex-column p-0">
          <div className="sidebar-section p-3 border-bottom">
            <div className="section-title fw-bold mb-3">Thống kê ca làm việc</div>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="flex-fill">
                  <div className="stat-value fw-bold" style={{fontSize:'1.15rem'}}>1,250,000₫</div>
                  <div className="stat-label text-muted">Doanh thu</div>
                </div>
                <div className="flex-fill">
                  <div className="stat-value fw-bold" style={{fontSize:'1.15rem'}}>47</div>
                  <div className="stat-label text-muted">Số đơn</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="flex-fill">
                  <div className="stat-value fw-bold" style={{fontSize:'1.15rem'}}>26,596₫</div>
                  <div className="stat-label text-muted">Đơn TB</div>
                </div>
                <div className="flex-fill">
                  <div className="stat-value fw-bold" style={{fontSize:'1.15rem'}}>6h 45m</div>
                  <div className="stat-label text-muted">Thời gian</div>
                </div>
              </div>
            </div>
          </div>
          <div className="sidebar-section p-3 border-bottom">
            <div className="section-title fw-bold mb-2">Hóa đơn gần nhất</div>
          </div>
          <div className="recent-orders flex-grow-1 overflow-auto" style={{padding:'0 15px'}}>
            <ListGroup variant="flush">
              {orders.map((o) => (
                <ListGroup.Item key={o.id} className="order-item d-flex justify-content-between align-items-center px-0">
                  <div className="order-info">
                    <div className="order-id fw-semibold">{o.id}</div>
                    <div className="order-time text-muted small">{o.time} • {o.items} sản phẩm</div>
                  </div>
                  <div className="order-amount fw-bold text-success">{o.amount.toLocaleString()}₫</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
        {/* Main Area */}
        <Col xs={5} style={{height:'100%', maxWidth: '100%', minWidth: 0, flex: 1}} className="main-area d-flex flex-column p-0 bg-light">
          <div className="search-section bg-white border-bottom">
            <div className="search-bar position-relative p-3 d-flex align-items-center" ref={searchInputRef}>
              <InputGroup className="flex-grow-1">
                <InputGroup.Text className="bg-white border-end-0"><span role="img" aria-label="search">🔍</span></InputGroup.Text>
                <Form.Control
                  className="search-input border-start-0"
                  placeholder="Tìm kiếm sản phẩm hoặc quét mã vạch..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchOverlay(true)}
                />
              </InputGroup>
              <Button
                variant="outline-warning"
                className="ms-2"
                style={{whiteSpace:'nowrap', fontWeight:'bold'}}
                onClick={() => setShowModal(true)}
              >
                🔥 Bán chạy
              </Button>
              {/* Modal sản phẩm bán chạy */}
              <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
                <Modal.Header closeButton>
                  <Modal.Title>Danh sách sản phẩm bán chạy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ListGroup>
                    {products.slice(0, 5).map((p, idx) => (
                      <ListGroup.Item key={p.id} className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <span style={{fontSize:20}}>{p.icon}</span>
                          <div>
                            <span className="fw-semibold">{p.name}</span>
                            <div className="text-muted small" style={{fontSize:12}}>
                              {`Đơn/tuần: ${10 + idx * 3} | SL/đơn: ${2 + idx}`}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2" style={{minWidth:180, justifyContent:'flex-end'}}>
                          <span className="fw-bold text-success text-end" style={{fontSize:15, minWidth:80, whiteSpace:'nowrap', display:'inline-block'}}>{p.price.toLocaleString()}₫</span>
                          <Button
                            variant="link"
                            style={{
                              fontSize:13,
                              color: p.pinned ? '#ffc107' : '#888',
                              opacity: p.pinned ? 1 : 0.4,
                              fontWeight: p.pinned ? 'bold' : 'normal',
                              textDecoration: 'underline',
                              padding:0,
                              whiteSpace:'nowrap',
                              minWidth: 80,
                              textAlign: 'right',
                              display:'inline-block'
                            }}
                            onClick={() => togglePin(p.id)}
                          >
                            <span style={{display:'inline-block', minWidth:60, textAlign:'right'}}>{p.pinned ? 'Bỏ ghim' : 'Ghim sản phẩm'}</span>
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Modal.Body>
              </Modal>
              {/* Overlay tìm kiếm nằm trong search-bar, chỉ hiện khi searchOverlay true và không mở modal bán chạy */}
              {searchOverlay && !showModal && (
                <div className={`search-overlay position-absolute w-100 bg-white border rounded shadow d-block`} style={{zIndex:100, left:0, top:'100%'}}>
                  <div className="search-filters border-bottom p-3">
                    <Row className="filter-row g-2 mb-2">
                      <Col><Form.Select className="filter-select"><option>Tất cả danh mục</option></Form.Select></Col>
                      <Col><Form.Select className="filter-select"><option>Danh mục con</option></Form.Select></Col>
                    </Row>
                  </div>
                  {search.trim() !== "" && (
                    <div className="search-results">
                      <ListGroup variant="flush">
                        {products.filter(
                          (p) =>
                            (activeCategory === "Tất cả" || p.category === activeCategory) &&
                            (p.name.toLowerCase().includes(search.toLowerCase()) || search === "")
                        ).map((p) => (
                          <ListGroup.Item key={p.id} as="div" className="search-result-item d-flex align-items-center" onClick={() => addToCart(p)} style={{paddingTop: 12, paddingBottom: 12, cursor:'pointer'}}>
                            <div className="result-icon me-2" style={{fontSize:20}}>{p.icon}</div>
                            <div className="result-info flex-grow-1" style={{minWidth:0}}>
                              <div className="result-name fw-semibold" style={{fontSize:15}}>{p.name}</div>
                              <div className="result-category text-muted small" style={{fontSize:13}}>{p.category}</div>
                            </div>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', gap:8, minWidth:180}}>
                              <span className="result-price fw-bold text-success text-end" style={{fontSize:15, minWidth:80, whiteSpace:'nowrap', display:'inline-block'}}>{p.price.toLocaleString()}₫</span>
                              <Button
                                variant="link"
                                className={`pin-btn ms-2 flex-shrink-0`}
                                style={{
                                  fontSize: 13,
                                  color: p.pinned ? '#ffc107' : '#888',
                                  opacity: p.pinned ? 1 : 0.4,
                                  fontWeight: p.pinned ? 'bold' : 'normal',
                                  textDecoration: 'underline',
                                  transition: 'color 0.2s, opacity 0.2s',
                                  minWidth: 80,
                                  textAlign: 'right',
                                  whiteSpace: 'nowrap',
                                  padding: 0,
                                  display:'inline-block'
                                }}
                                onClick={e => { e.stopPropagation(); togglePin(p.id); }}
                                title={p.pinned ? "Bỏ ghim" : "Ghim sản phẩm"}
                                onMouseEnter={e => { if (p.pinned) e.currentTarget.style.color = '#dc3545'; }}
                                onMouseLeave={e => { if (p.pinned) e.currentTarget.style.color = '#ffc107'; }}
                              >
                                <span style={{display:'inline-block', minWidth:60, textAlign:'right'}}>{p.pinned ? 'Bỏ ghim' : 'Ghim sản phẩm'}</span>
                              </Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="category-tabs d-flex gap-2 flex-wrap px-3 pt-2 bg-white border-bottom">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "dark" : "outline-secondary"}
                  className={`category-tab rounded-pill px-3 py-1${activeCategory === cat ? " active" : ""}`}
                  onClick={() => handleCategory(cat)}
                  size="sm"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <div className="product-grid flex-grow-1 p-3" style={{overflowY:'auto', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))', gap:10}}>
            {products.filter(p => p.pinned).length === 0 ? (
              <div className="text-center text-muted" style={{gridColumn:'1/-1', paddingTop:40}}>
                Chưa có sản phẩm nào được ghim. Hãy tìm kiếm và ghim sản phẩm để hiển thị ở đây.
              </div>
            ) : products.filter(p => p.pinned).map((p) => (
              <Card
                key={p.id}
                className="product-card h-100 position-relative border-warning bg-warning bg-opacity-10"
                style={{cursor:'pointer', minHeight: 150, maxHeight: 170, display:'flex', alignItems:'center', justifyContent:'center', padding:'8px 4px'}}
                onClick={e => { if (!e.target.classList.contains("pin-btn")) addToCart(p); }}
              >
                <Button
                  variant="link"
                  className="pin-btn position-absolute top-0 end-0"
                  style={{fontSize:13, color: p.pinned ? '#ffc107' : '#888', opacity: p.pinned ? 1 : 0.4, transition:'opacity 0.2s', fontWeight: p.pinned ? 'bold' : 'normal', textDecoration: 'underline'}}
                  onClick={e => { e.stopPropagation(); togglePin(p.id); }}
                  title={p.pinned ? "Bỏ ghim" : "Ghim sản phẩm"}
                >{p.pinned ? 'Đã ghim' : 'Ghim sản phẩm'}</Button>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1" style={{gap:4}}>
                  <div className="product-image mb-1" style={{fontSize:28}}>{p.icon}</div>
                  <div className="product-name fw-semibold text-center mb-1" style={{fontSize:12, minHeight:28, lineHeight:'14px'}}>{p.name}</div>
                  <div className="product-price fw-bold text-success" style={{fontSize:13}}>{p.price.toLocaleString()}₫</div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
        {/* Cart Area */}
        <Col xs={4} style={{height:'100%', minWidth: '350px', maxWidth: '440px', marginRight: 0, marginLeft: 'auto'}} className="cart-area bg-white border-start d-flex flex-column p-0">
          {/* Tabs hóa đơn */}
          <div className="cart-tabs d-flex align-items-center gap-2 p-2 border-bottom bg-light">
            {carts.map((c, idx) => (
              <Button
                key={c.id}
                variant={activeCartIdx === idx ? "primary" : "outline-primary"}
                size="sm"
                className="cart-tab d-flex align-items-center justify-content-between border-0"
                onClick={() => handleSelectCart(idx)}
                style={{minWidth: 90, maxWidth: 160, gap: 6, position: 'relative', padding: 0, paddingLeft: 10, paddingRight: 10, height: 32}}
              >
                <span style={{flex:1, textAlign:'left', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.name}</span>
                {carts.length > 1 && (
                  <span
                    onClick={e => { e.stopPropagation(); closeCartTab(idx); }}
                    style={{marginLeft:8, color:'#dc3545', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer'}}
                    title="Đóng hóa đơn"
                    tabIndex={-1}
                  >
                    <IoClose />
                  </span>
                )}
              </Button>
            ))}
            <Button variant="success" size="sm" style={{fontWeight:'bold', fontSize:18, padding:'0 10px'}} onClick={addNewCart}>+</Button>
          </div>
          <div className="cart-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <div className="cart-title fw-bold fs-5">{carts[activeCartIdx]?.name || "Hóa đơn"}</div>
          </div>
          <div className="cart-items flex-grow-1 overflow-auto p-3">
            {currentCart.length === 0 ? (
              <div className="empty-cart text-center text-muted py-5">
                <div className="empty-icon mb-2" style={{fontSize:48, opacity:0.5}}>🛒</div>
                Giỏ hàng trống
              </div>
            ) : currentCart.map((item) => (
              <div className="cart-item d-flex align-items-center gap-2 py-2 border-bottom" key={item.id}>
                <div className="item-info flex-grow-1">
                  <div className="item-name fw-semibold" style={{fontSize:13}}>{item.name}</div>
                  <div className="item-price text-muted small" style={{fontSize:12}}>{item.price.toLocaleString()}₫</div>
                </div>
                <div className="quantity-controls d-flex align-items-center gap-1">
                  <Button variant="outline-secondary" size="sm" className="qty-btn px-2" onClick={() => changeQty(item.id, -1)}>-</Button>
                  <Form.Control type="text" className="qty-input text-center" value={item.qty} readOnly style={{width:40, height:28, padding:0, fontSize:13}} />
                  <Button variant="outline-secondary" size="sm" className="qty-btn px-2" onClick={() => changeQty(item.id, 1)}>+</Button>
                </div>
                <div className="item-total fw-bold text-end" style={{minWidth:70, fontSize:13}}>{(item.price * item.qty).toLocaleString()}₫</div>
                {/* Nút xóa sản phẩm */}
                <Button variant="danger" size="sm" style={{fontSize:13, padding:'2px 10px'}} onClick={() => removeFromCart(item.id)} title="Xóa sản phẩm">Xóa</Button>
              </div>
            ))}
          </div>
          <div className="cart-summary p-3 border-top bg-light">
            <div className="summary-row d-flex justify-content-between mb-2">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString()}₫</span>
            </div>
            <div className="discount-row d-flex justify-content-between align-items-center mb-2">
              <span>Giảm giá:</span>
              <div className="d-flex align-items-center gap-1">
                <span className="discount-value text-end" style={{width:80, display:'inline-block'}}>
                  {currentDiscountType === "%" ? `${currentDiscount}%` : `${currentDiscount.toLocaleString()}₫`}
                </span>
              </div>
            </div>
            <div className="summary-row summary-total d-flex justify-content-between fw-bold fs-5 pt-2 border-top">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
          </div>
          <div className="cart-actions p-3 border-top d-flex flex-column gap-2">
            <Button variant="success" size="md" className="fw-bold" style={{fontSize:15, padding:'8px 0'}}>Thanh toán</Button>
            <Button variant="secondary" size="md" style={{fontSize:15, padding:'8px 0'}}>Lưu tạm</Button>
            <Button variant="outline-danger" size="md" style={{fontSize:15, padding:'8px 0'}}>Hủy đơn</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
