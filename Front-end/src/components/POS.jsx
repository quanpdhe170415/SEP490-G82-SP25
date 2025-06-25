import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup, Tab, Tabs, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const initialProducts = [
  { id: 1, name: "Kem đánh răng Close Up", price: 20000, icon: "🧴", pinned: true, category: "Vệ sinh" },
  { id: 2, name: "Coca Cola 330ml", price: 12000, icon: "🥤", pinned: false, category: "Nước ngọt" },
  { id: 3, name: "Bánh mì sandwich", price: 15000, icon: "🍞", pinned: false, category: "Bánh kẹo" },
  { id: 4, name: "Mì tôm Hảo Hảo", price: 5000, icon: "🍜", pinned: false, category: "Đồ khô" },
  { id: 5, name: "Sữa TH True Milk", price: 25000, icon: "🥛", pinned: false, category: "Sữa & Yogurt" },
  { id: 6, name: "Kẹo Mentos", price: 8000, icon: "🍿", pinned: false, category: "Bánh kẹo" },
];

const initialCart = [
  { id: 1, name: "Kem đánh răng Close Up", price: 20000, qty: 1 },
  { id: 2, name: "Nước ngọt Coca Cola 330ml", price: 12000, qty: 2 },
  { id: 5, name: "Sữa tươi TH True Milk", price: 25000, qty: 1 },
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
  const [cart, setCart] = useState(initialCart);
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [discount, setDiscount] = useState(5000);
  const [discountType, setDiscountType] = useState("₫");
  const searchInputRef = useRef();
  const [showModal, setShowModal] = useState(false);

  // Tổng tiền tạm tính
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  // Tổng sau giảm giá
  const total = discountType === "%" ? subtotal - (subtotal * discount) / 100 : subtotal - discount;

  // Lọc sản phẩm theo search và category
  const filteredProducts = products.filter(
    (p) =>
      (activeCategory === "Tất cả" || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || search === "")
  );

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

  // Xử lý thêm sản phẩm vào cart
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setSearchOverlay(false);
  };

  // Xử lý tăng/giảm số lượng
  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  // Xử lý pin sản phẩm
  const togglePin = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p))
    );
  };

  // Xử lý chọn tab danh mục
  const handleCategory = (cat) => setActiveCategory(cat);

  // Xử lý discount
  const handleDiscountInput = (e) => {
    setDiscount(Number(e.target.value.replace(/[^0-9]/g, "")));
  };

  // Xử lý loại discount
  const handleDiscountType = (type) => setDiscountType(type);

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
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-success">{p.price.toLocaleString()}₫</span>
                          <Button
                            variant="link"
                            style={{fontSize:13, color: p.pinned ? '#ffc107' : '#888', opacity: p.pinned ? 1 : 0.4, fontWeight: p.pinned ? 'bold' : 'normal', textDecoration: 'underline', padding:0, whiteSpace:'nowrap'}}
                            onClick={() => togglePin(p.id)}
                          >{p.pinned ? 'Bỏ ghim' : 'Ghim sản phẩm'}</Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Modal.Body>
              </Modal>
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
          <div className="cart-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <div className="cart-title fw-bold fs-5">Hóa đơn 1</div>
            <Button variant="outline-primary" size="sm" style={{fontSize:14, padding:'2px 10px'}}>+</Button>
          </div>
          <div className="cart-items flex-grow-1 overflow-auto p-3">
            {cart.length === 0 ? (
              <div className="empty-cart text-center text-muted py-5">
                <div className="empty-icon mb-2" style={{fontSize:48, opacity:0.5}}>🛒</div>
                Giỏ hàng trống
              </div>
            ) : cart.map((item) => (
              <div className="cart-item d-flex align-items-center gap-2 py-2 border-bottom" key={item.id}>
                <div className="item-info flex-grow-1">
                  <div className="item-name fw-semibold">{item.name}</div>
                  <div className="item-price text-muted small">{item.price.toLocaleString()}₫</div>
                </div>
                <div className="quantity-controls d-flex align-items-center gap-1">
                  <Button variant="outline-secondary" size="sm" className="qty-btn px-2" onClick={() => changeQty(item.id, -1)}>-</Button>
                  <Form.Control type="text" className="qty-input text-center" value={item.qty} readOnly style={{width:40, height:28, padding:0}} />
                  <Button variant="outline-secondary" size="sm" className="qty-btn px-2" onClick={() => changeQty(item.id, 1)}>+</Button>
                </div>
                <div className="item-total fw-bold text-end" style={{minWidth:70}}>{(item.price * item.qty).toLocaleString()}₫</div>
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
                <Form.Control type="text" className="discount-input text-end" value={discount} onChange={handleDiscountInput} placeholder="0" style={{width:80}} />
                <Button variant={discountType === "₫" ? "primary" : "outline-secondary"} size="sm" className="discount-btn" onClick={() => handleDiscountType("₫")}>₫</Button>
                <Button variant={discountType === "%" ? "primary" : "outline-secondary"} size="sm" className="discount-btn" onClick={() => handleDiscountType("%")}>%</Button>
              </div>
            </div>
            <div className="summary-row summary-total d-flex justify-content-between fw-bold fs-5 pt-2 border-top">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
          </div>
          <div className="cart-actions p-3 border-top d-flex flex-column gap-2">
            <Button variant="success" size="lg" className="fw-bold">Thanh toán</Button>
            <Button variant="secondary" size="lg">Lưu tạm</Button>
            <Button variant="outline-danger" size="lg">Hủy đơn</Button>
          </div>
        </Col>
      </Row>
      <div className={`search-overlay position-absolute w-100 bg-white border rounded shadow ${searchOverlay ? "d-block" : "d-none"}`} style={{zIndex:100, left:0, top:'100%'}}>
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
                <ListGroup.Item key={p.id} className="search-result-item d-flex align-items-center" action onClick={() => addToCart(p)} style={{paddingTop: 12, paddingBottom: 12}}>
                  <div className="result-icon me-2" style={{fontSize:20}}>{p.icon}</div>
                  <div className="result-info flex-grow-1" style={{minWidth:0}}>
                    <div className="result-name fw-semibold" style={{fontSize:15}}>{p.name}</div>
                    <div className="result-category text-muted small" style={{fontSize:13}}>{p.category}</div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', gap:8, minWidth:180}}>
                    <div className="result-price fw-bold text-success text-end" style={{fontSize:15, minWidth:80, whiteSpace:'nowrap'}}>{p.price.toLocaleString()}₫</div>
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
                        padding: 0
                      }}
                      onClick={e => { e.stopPropagation(); togglePin(p.id); }}
                      title={p.pinned ? "Bỏ ghim" : "Ghim sản phẩm"}
                      onMouseEnter={e => { if (p.pinned) e.currentTarget.style.color = '#dc3545'; }}
                      onMouseLeave={e => { if (p.pinned) e.currentTarget.style.color = '#ffc107'; }}
                    >{p.pinned ? 'Bỏ ghim' : 'Ghim sản phẩm'}</Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </div>
    </Container>
  );
}
