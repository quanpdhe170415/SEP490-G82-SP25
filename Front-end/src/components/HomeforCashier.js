import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/bg.jpg';
import logo from '../assets/logo.png';
import waterImg from '../assets/bg.jpg';
import breadImg from '../assets/bg.jpg';
import candyImg from '../assets/bg.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeForCashier = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([
    { id: 1, name: 'Nước', price: 20000, image: waterImg, type: 'Drink' },
    { id: 2, name: 'Bánh', price: 15000, image: breadImg, type: 'Snack' },
    { id: 3, name: 'Kẹo', price: 10000, image: candyImg, type: 'Snack' },
  ]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setTotal(total + product.price);
    toast.success(`${product.name} đã được thêm vào hóa đơn!`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  };

  const removeFromCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct.quantity > 1) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      ));
      setTotal(total - product.price);
    } else {
      setCart(cart.filter(item => item.id !== product.id));
      setTotal(total - product.price);
    }
    toast.info(`${product.name} đã được giảm số lượng!`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  };

  const handleCheckout = () => {
    toast.success('Thanh toán thành công! Tổng tiền: ' + total.toLocaleString() + ' VNĐ', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    setCart([]);
    setTotal(0);
    setTimeout(() => navigate('/'), 2000);
  };

  const navigateToSection = (path) => {
    navigate(path); // Điều hướng đến các section tương ứng (cần định nghĩa route)
  };

  return (
    <div
      className="d-flex flex-column vh-100"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm w-100">
        <div className="d-flex align-items-center gap-2">
          <img src={logo} alt="Logo" style={{ height: '42px' }} />
          <h5 className="m-0">Tạp Hóa Hải Chi</h5>
        </div>
        <button className="btn btn-warning">Thông báo</button>
      </div>

      <div className="d-flex flex-grow-1" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Navigator (1/10) */}
        <div className="bg-white shadow-sm" style={{ width: '10%', padding: '10px' }}>
          <ul className="list-unstyled">
            <li className="mb-2"><a href="#" onClick={() => navigateToSection('/return')} className="text-decoration-none text-dark">Yêu cầu trả hàng</a></li>
            <li className="mb-2"><a href="#" onClick={() => navigateToSection('/export')} className="text-decoration-none text-dark">Yêu cầu xuất hàng</a></li>
            <li className="mb-2"><a href="#" onClick={() => navigateToSection('/payment')} className="text-decoration-none text-dark">Thanh toán</a></li>
            <li className="mb-2"><a href="#" onClick={() => navigateToSection('/shift-end')} className="text-decoration-none text-dark">Kết ca</a></li>
          </ul>
        </div>

        {/* Products (4/10) with Search Bar */}
        <div className="bg-white shadow-sm" style={{ width: '45%', padding: '10px', overflowY: 'auto' }}>
          <div className="mb-3 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: '100%' }}
            />
            <span className="position-absolute top-50 end-0 translate-middle-y pe-2">893001234</span>
          </div>
          <h6 className="text-center mb-3">Sản phẩm đang search</h6>
          <div className="d-flex flex-wrap gap-2">
            {products.map((product) => (
              <div key={product.id} className="card" style={{ width: '150px', border: '1px solid #ccc' }}>
                <img src={product.image} className="card-img-top" alt={product.name} style={{ height: '100px', objectFit: 'cover' }} />
                <div className="card-body p-2 text-center">
                  <h6 className="card-title mb-1">{product.name}</h6>
                  <p className="card-text mb-1">Giá: {product.price.toLocaleString()} VNĐ</p>
                  <button className="btn btn-primary btn-sm w-100" onClick={() => addToCart(product)}>Thêm</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice (4/10) */}
        <div className="bg-white shadow-sm" style={{ width: '45%', padding: '10px', overflowY: 'auto' }}>
          <h6 className="text-center mb-3">Hóa đơn 1 +</h6>
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="d-flex justify-content-between mb-2 align-items-center">
                <span>{item.name}</span>
                <div>
                  <button className="btn btn-sm btn-secondary" onClick={() => removeFromCart(item)}>-</button>
                  <span className="mx-2">{item.quantity}</span>
                  <button className="btn btn-sm btn-secondary" onClick={() => addToCart(item)}>+</button>
                  <span className="ms-2">{(item.price * item.quantity).toLocaleString()} VNĐ</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Chưa có sản phẩm</p>
          )}
          <hr />
          <div className="d-flex justify-content-between">
            <span>Giá gốc</span>
            <span>{total.toLocaleString()} VNĐ</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Giảm giá</span>
            <span>5000 VNĐ <input type="checkbox" /> 0%</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Giá cuối</span>
            <span>{(total - 5000).toLocaleString()} VNĐ</span>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <span>Thanh tiền</span>
            <span>{(total - 5000).toLocaleString()} VNĐ</span>
          </div>
          <button className="btn btn-success w-100 mt-3" onClick={handleCheckout}>Thanh toán</button>
        </div>
      </div>
    </div>
  );
};

export default HomeForCashier;