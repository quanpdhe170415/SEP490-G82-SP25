import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/bg.jpg';
import logo from '../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }

    // Simulate sending reset password email
    toast.success('Đã gửi liên kết đặt lại mật khẩu đến email của bạn!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });

    setTimeout(() => {
      navigate('/login');
    }, 2000); // Redirect to login after toast
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <ToastContainer />
      <div className="card p-4 shadow" style={{ width: '360px', borderRadius: '12px' }}>
        <div className="text-center mb-4 d-flex align-items-center justify-content-center gap-2">
          <img src={logo} alt="Logo" style={{ height: '42px' }} />
          <h5 className="m-0">Tạp Hóa Hải Chi</h5>
        </div>

        <h6 className="text-center mb-3">Quên Mật Khẩu</h6>
        <p className="text-center mb-4" style={{ fontSize: '14px' }}>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </p>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Địa chỉ email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger py-1">{error}</div>}

        <div className="d-grid mb-3">
          <button className="btn btn-primary w-100" onClick={handleSubmit}>
            Gửi Liên Kết
          </button>
        </div>

        <div className="text-center">
          <a href="/login" className="text-decoration-none">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;