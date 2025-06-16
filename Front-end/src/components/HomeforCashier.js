import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/bg.jpg';
import logo from '../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_URL_SERVER || 'http://localhost:9999/api/';

const HomeForCashier = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [invoices, setInvoices] = useState([{ id: 1, cart: [], total: 0 }]);
  const [selectedInvoice, setSelectedInvoice] = useState(1);

  // Fetch products from API
  useEffect(() => {
    fetch(`${API_URL}product/products-for-retail`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setOriginalProducts(data);
      })
      .catch(() => {
        toast.error('Không thể tải sản phẩm từ server!', {
          position: 'top-right',
          autoClose: 2000,
        });
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterProducts(e.target.value, selectedType);
  };

  const filterProducts = (searchTerm, type) => {
    let filtered = [...originalProducts];
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (type) {
      filtered = filtered.filter(product => product.type === type);
    }
    setProducts(filtered);
  };

  const handleTypeFilter = (type) => {
    const newSelectedType = type === selectedType ? null : type;
    setSelectedType(newSelectedType);
    filterProducts(searchTerm, newSelectedType);
  };

  const addToCart = (product, invoiceId) => {
    setInvoices(invoices.map(invoice => {
      if (invoice.id === invoiceId) {
        const existingProduct = invoice.cart.find(item => item.id === product.id);
        if (existingProduct) {
          return {
            ...invoice,
            cart: invoice.cart.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
            total: invoice.total + product.price
          };
        } else {
          return {
            ...invoice,
            cart: [...invoice.cart, { ...product, quantity: 1 }],
            total: invoice.total + product.price
          };
        }
      }
      return invoice;
    }));
    toast.success(`${product.name} đã được thêm vào hóa đơn ${invoiceId}!`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  const removeFromCart = (product, invoiceId) => {
    setInvoices(invoices.map(invoice => {
      if (invoice.id === invoiceId) {
        const existingProduct = invoice.cart.find(item => item.id === product.id);
        if (existingProduct.quantity > 1) {
          return {
            ...invoice,
            cart: invoice.cart.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
            ),
            total: invoice.total - product.price
          };
        } else {
          return {
            ...invoice,
            cart: invoice.cart.filter(item => item.id !== product.id),
            total: invoice.total - product.price
          };
        }
      }
      return invoice;
    }));
    toast.info(`${product.name} đã được giảm số lượng trong hóa đơn ${invoiceId}!`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  const handleCheckout = (invoiceId) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    toast.success(`Thanh toán thành công cho hóa đơn ${invoiceId}! Tổng tiền: ${invoice.total.toLocaleString()} VNĐ`, {
      position: 'top-right',
      autoClose: 2000,
    });
    setInvoices(prevInvoices => {
      const updatedInvoices = prevInvoices.filter(i => i.id !== invoiceId);
      if (updatedInvoices.length === 0) {
        return [{ id: 1, cart: [], total: 0 }];
      }
      return updatedInvoices.map((inv, index) => ({ ...inv, id: index + 1 }));
    });
    setSelectedInvoice(prev => {
      const newInvoices = invoices.filter(i => i.id !== invoiceId).sort((a, b) => a.id - b.id);
      const nextInvoiceId = newInvoices.find(i => i.id > invoiceId)?.id - 1 || newInvoices[0]?.id - 1 || 1;
      return nextInvoiceId;
    });
    setTimeout(() => navigate('/homecashier'), 2000);
  };

  const closeInvoice = (invoiceId) => {
    setInvoices(prevInvoices => {
      const updatedInvoices = prevInvoices.filter(i => i.id !== invoiceId);
      if (updatedInvoices.length === 0) {
        return [{ id: 1, cart: [], total: 0 }];
      }
      return updatedInvoices.map((inv, index) => ({ ...inv, id: index + 1 }));
    });
    setSelectedInvoice(prev => {
      const newInvoices = invoices.filter(i => i.id !== invoiceId).sort((a, b) => a.id - b.id);
      const nextInvoiceId = newInvoices.find(i => i.id > invoiceId)?.id - 1 || newInvoices[0]?.id - 1 || 1;
      return nextInvoiceId;
    });
  };

  const addNewInvoice = () => {
    const newInvoiceId = invoices.length + 1;
    setInvoices([...invoices, { id: newInvoiceId, cart: [], total: 0 }]);
    setSelectedInvoice(newInvoiceId);
  };

  const navigateToSection = (path) => {
    navigate(path);
  };

  // Lấy danh sách loại sản phẩm duy nhất từ dữ liệu API
  const productTypes = Array.from(new Set(originalProducts.map(p => p.type)));

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

        {/* Products (4.5/10) with Search Bar */}
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
          </div>
          <div className="mb-3">
            {productTypes.map(type => (
              <button
                key={type}
                className={`btn btn-sm me-2 ${selectedType === type ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => handleTypeFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="d-flex flex-wrap gap-2">
            {products.map((product) => (
              <div key={product.id} className="card" style={{ width: '150px', border: '1px solid #ccc' }}>
                <img src={product.image} className="card-img-top" alt={product.name} style={{ height: '100px', objectFit: 'cover' }} />
                <div className="card-body p-2 text-center">
                  <h6 className="card-title mb-1">{product.name}</h6>
                  <p className="card-text mb-1">Giá: {product.price.toLocaleString()} VNĐ</p>
                  <button className="btn btn-primary btn-sm w-100" onClick={() => addToCart(product, selectedInvoice)}>Thêm</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice (4.5/10) */}
        <div className="bg-white shadow-sm" style={{ width: '45%', padding: '10px', overflowY: 'auto' }}>
          <div className="d-flex mb-2" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {invoices.map((invoice) => (
              <div key={invoice.id} className="d-inline-flex align-items-center me-2">
                <button
                  className={`btn btn-sm ${selectedInvoice === invoice.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedInvoice(invoice.id)}
                >
                  Hóa đơn {invoice.id} <span className="ms-1" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); closeInvoice(invoice.id); }}>x</span>
                </button>
              </div>
            ))}
            <button className="btn btn-sm btn-outline-secondary" onClick={addNewInvoice}>+</button>
          </div>
          {invoices.map((invoice) => (
            invoice.id === selectedInvoice && (
              <div key={invoice.id}>
                <table className="table table-bordered mt-2">
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.cart.length > 0 ? (
                      invoice.cart.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>
                            <button className="btn btn-sm btn-secondary" onClick={() => removeFromCart(item, invoice.id)}>-</button>
                            <span className="mx-2">{item.quantity}</span>
                            <button className="btn btn-sm btn-secondary" onClick={() => addToCart(item, invoice.id)}>+</button>
                          </td>
                          <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">Chưa có sản phẩm</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="mt-3">
                  <div className="d-flex justify-content-end">
                    <strong>Thanh tiền: </strong>
                    <span>{invoice.total.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="d-flex justify-content-end mt-1">
                    <button className="btn btn-success btn-sm" onClick={() => handleCheckout(invoice.id)}>Thanh toán</button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeForCashier;