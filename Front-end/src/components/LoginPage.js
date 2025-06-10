import React from 'react';
import background from '../assets/background.jpg';
import logo from '../assets/logo.png';

const LoginPage = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="card p-4 shadow" style={{ width: '360px', borderRadius: '12px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ height: '42px' }} />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tên đăng nhập"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Mật khẩu"
          />
        </div>

        <div className="d-flex justify-content-between mb-3">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <a href="#" className="text-decoration-none">Quên mật khẩu?</a>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary w-50">Đăng nhập</button>
          <button className="btn btn-success w-50">Đăng ký</button>
        </div>
      </div>

      <div className="text-white mt-4 d-flex gap-3 small">
        <span>© 2025 KiotViet</span>
        <span>Tiếng Việt</span>
      </div>
    </div>
  );
};

export default LoginPage;
