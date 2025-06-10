import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/bg.jpg';
import logo from '../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const users = [
  { username: 'admin', password: '123456' },
  { username: 'staff', password: 'staff123' },
  { username: 'guest', password: 'guest' },
];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSubmitUsername = () => {
    if (!username) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }

    // Kiểm tra xem tên đăng nhập có tồn tại trong mảng users
    const foundUser = users.find((user) => user.username === username);
    if (foundUser) {
      // Tạo mã OTP ngẫu nhiên (6 chữ số)
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      console.log('Mã OTP:', newOtp); // Hiển thị OTP trong console
      setShowOtpScreen(true); // Chuyển sang màn hình nhập OTP
      setError('');
    } else {
      setError('Tên đăng nhập không tồn tại');
    }
  };

  const handleSubmitOtp = () => {
    if (!otp) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    // Kiểm tra mã OTP
    if (otp === generatedOtp) {
      toast.success('Xác minh OTP thành công! Vui lòng đặt lại mật khẩu.', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      setTimeout(() => {
        navigate('/login'); // Chuyển hướng về trang đăng nhập
      }, 2000);
    } else {
      setError('Mã OTP không đúng');
    }
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
        {!showOtpScreen ? (
          <>
            <p className="text-center mb-4" style={{ fontSize: '14px' }}>
              Nhập tên đăng nhập để hệ thống gửi mã OTP về quản lý cửa hàng
            </p>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger py-1">{error}</div>}
            <div className="d-grid mb-3">
              <button className="btn btn-primary w-100" onClick={handleSubmitUsername}>
                Gửi Mã OTP
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-center mb-4" style={{ fontSize: '14px' }}>
              Nhập mã OTP đã được gửi đến quản lý cửa hàng
            </p>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger py-1">{error}</div>}
            <div className="d-grid mb-3">
              <button className="btn btn-primary w-100" onClick={handleSubmitOtp}>
                Xác Minh OTP
              </button>
            </div>
          </>
        )}

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