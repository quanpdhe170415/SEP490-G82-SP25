import React from 'react';
import logo from '../assets/kiotviet-logo.png'; // Thay bằng đường dẫn đúng đến logo của bạn

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="KiotViet" className="logo" />
        <div className="form-group">
          <input type="text" placeholder="Tên đăng nhập" className="input" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Mật khẩu" className="input" />
        </div>
        <div className="options">
          <label className="checkbox">
            <input type="checkbox" defaultChecked /> Duy trì đăng nhập
          </label>
          <a href="#" className="forgot">Quên mật khẩu?</a>
        </div>
        <div className="buttons">
          <button className="btn btn-blue">Quản lý</button>
          <button className="btn btn-green">Bán hàng</button>
        </div>
      </div>
      <div className="footer">
        <span>Hỗ trợ: 1900 6522</span>
        <span className="language">Tiếng Việt 🇻🇳</span>
      </div>
    </div>
  );
}

export default LoginPage;