import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/bg.jpg';
import logo from '../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    setError(''); // reset lỗi cũ

    try {
      const response = await fetch(`${process.env.REACT_APP_URL_SERVER}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          deviceType: 'web',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // ✅ Lưu vào localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('deviceId', data.deviceId);
        localStorage.setItem('deviceType', data.deviceType);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);

        toast.success(data.message || 'Đăng nhập thành công!', {
          position: 'top-right',
          autoClose: 2000,
        });

        setTimeout(() => {
          if (data.role === 'Admin') {
            navigate('/home');
          } else if (data.role === 'Staff') {
            navigate('/openshift');
          } else {
            setError('Không có quyền truy cập phù hợp.');
          }
        }, 1000);
      } else {
        setError(data.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi hệ thống. Vui lòng thử lại sau.');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgotpassword');
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
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
