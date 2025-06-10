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
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showPasswordScreen, setShowPasswordScreen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSubmitUsername = () => {
    if (!username) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }

    const foundUser = users.find((user) => user.username === username);
    if (foundUser) {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      console.log('Mã OTP:', newOtp);
      setShowOtpScreen(true);
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

    if (otp === generatedOtp) {
      setShowOtpScreen(false);
      setShowPasswordScreen(true);
      setError('');
    } else {
      setError('Mã OTP không đúng');
    }
  };

  const handleSubmitPassword = () => {
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Simulate updating password (in real app, call API to update password)
    const userIndex = users.findIndex((user) => user.username === username);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword; // Update password in array (for demo)
    }

    toast.success('Đổi mật khẩu thành công!', {
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
    }, 2000);
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
        {!showOtpScreen && !showPasswordScreen ? (
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
        ) : showOtpScreen ? (
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
        ) : (
          <>
            <p className="text-center mb-4" style={{ fontSize: '14px' }}>
              Nhập mật khẩu mới và xác nhận mật khẩu
            </p>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger py-1">{error}</div>}
            <div className="d-grid mb-3">
              <button className="btn btn-primary w-100" onClick={handleSubmitPassword}>
                Đổi Mật Khẩu
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