import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/bg.jpg';
import logo from '../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid'; // Thêm thư viện để tạo UUID

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  const fakeUsers = [
    { username: 'admin@example.com', password: 'admin123', role: 'ADMIN' },
    { username: 'staff@example.com', password: 'staff123', role: 'STAFF' },
    { username: 'user@example.com', password: 'user123', role: 'USER' }
  ];

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      newErrors.username = "Địa chỉ Email là bắt buộc";
    } else if (!emailRegex.test(username)) {
      newErrors.username = "Địa chỉ Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    return newErrors;
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Ngăn không cho form refresh trang

    // Kiểm tra input hợp lệ
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => toast.error(error));
      return;
    }

    // Kiểm tra đăng nhập với dữ liệu giả lập
    const foundUser = fakeUsers.find(user => user.username === username && user.password === password);

    if (foundUser) {
      // Tạo deviceId bằng UUID (để lưu vào localStorage)
      const deviceId = uuidv4();

      // Lưu các thông tin cần thiết vào localStorage
      localStorage.setItem('token', 'fakeToken123');
      localStorage.setItem('refreshToken', 'fakeRefreshToken123');
      localStorage.setItem('accountDetail', JSON.stringify(foundUser));
      localStorage.setItem('deviceId', deviceId); // Lưu deviceId vào localStorage

      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      // Điều hướng người dùng đến trang chính sau khi đăng nhập thành công
      setTimeout(() => {
          navigate('/home');
      }, 1000); // Chờ để toast hiển thị trước khi điều hướng
    } else {
      toast.error('Tên đăng nhập hoặc mật khẩu không đúng');
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }


  };


    const handleForgotPassword = () => {
    navigate('/forgotpassword'); // Chuyển hướng đến trang quên mật khẩu
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

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <div className="text-danger">{errors.username}</div>}
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        {error && <div className="alert alert-danger py-1">{error}</div>}

        <div className="d-flex justify-content-between mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <a href="#" className="text-decoration-none">Quên mật khẩu?</a>

          <span
            className="text-decoration-none text-primary"
            style={{ cursor: 'pointer' }}
            onClick={handleForgotPassword}
          >
            Quên mật khẩu?
          </span>
        </div>

        <div className="d-grid">
          <button className="btn btn-primary w-100" onClick={handleLogin}>
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;