import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginBanner2 from "../assets/auth4.png";
import "bootstrap/dist/css/bootstrap.min.css";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [errors, setErrors] = useState({}); // lưu lỗi hiển thị dưới input

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userName.trim()) {
      newErrors.userName = "Địa chỉ Email là bắt buộc";
    } else if (!emailRegex.test(userName)) {
      newErrors.userName = "Địa chỉ Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => toast.error(error));
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_URL_API_BACKEND}/authen/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_name: userName,
            password,
            recaptchaToken,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem(
          "accountDetail",
          JSON.stringify(data.accountDetail)
        );

        const role = data.accountDetail.role;
        if (role === "ADMIN") {
          window.location.href = "/admin"; // Navigate to admin dashboard
        } else if (role === "STAFF") {
          window.location.href = "/staff-order"; // Navigate to staff order page
        } else {
          window.location.href = "/"; // Navigate to the home page for regular users
        }
      } else {
        // Xử lý lỗi từ backend
        const msg = data.message || "Đăng nhập thất bại";
        toast.error(msg);

        if (msg.includes("Mật khẩu")) {
          setErrors({ password: msg });
        } else if (msg.includes("không tồn tại")) {
          setErrors({ userName: msg });
        } else if (msg.includes("xác minh") || msg.includes("khóa")) {
          setErrors({ userName: msg }); // Có thể để bên email cho dễ hiểu
        } else {
          setErrors({});
        }
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    const res = await fetch(
      `${process.env.REACT_APP_URL_API_BACKEND}/authen/google-login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: credential }),
      }
    );
    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("accountDetail", JSON.stringify(data.accountDetail));
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("accountDetail", JSON.stringify(data.accountDetail));

    const role = data.accountDetail.role;
    if (role === "ADMIN") {
      window.location.href = "/admin"; // Navigate to admin dashboard
    } else if (role === "STAFF") {
      window.location.href = "/staff-order"; // Navigate to staff order page
    } else {
      window.location.href = "/"; // Navigate to the home page for regular users
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed", error);
    toast.error("Google login failed");
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="row shadow-lg rounded overflow-hidden border bg-white mx-auto"
          style={{ maxWidth: "100%", width: "950px" }}
        >
          <div className="d-none d-lg-block col-lg-7 p-0">
            <img
              src={loginBanner2}
              alt="Login Banner"
              className="img-fluid w-100 h-100"
            />
          </div>

          <div className="col-12 col-lg-5 p-4 d-flex flex-column justify-content-center">
            <p className="text-center text-muted fs-5 mt-3">
              Chào mừng trở lại!
            </p>

            {/* Email Field */}
            <div className="mt-3">
              <label className="form-label fw-bold">Địa chỉ Email</label>
              <input
                type="email"
                className={`form-control ${
                  errors.userName ? "is-invalid" : ""
                }`}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              {errors.userName && (
                <div className="invalid-feedback">{errors.userName}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="mt-3">
              <label className="form-label fw-bold">Mật khẩu</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="input-group-text bg-white border"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? (
                    <IconEye size={18} />
                  ) : (
                    <IconEyeOff size={18} />
                  )}
                </span>
              </div>
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password}
                </div>
              )}
              <a
                href="/forgetpassword"
                className="d-block text-end text-muted small mt-2"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Login Button */}
            <div className="mt-4">
              <button
                className="btn btn-danger w-100 fw-bold"
                onClick={handleLogin}
              >
                Đăng nhập
              </button>
            </div>

            {/* Google Login Button */}
            <div className="mt-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                className="btn btn-outline-dark w-100 fw-bold d-flex align-items-center justify-content-center"
              />
            </div>

            {/* Register Link */}
            <div className="mt-3 text-center">
              <a href="/register" className="text-muted small">
                Chưa có tài khoản?{" "}
                <span className="text-primary">Đăng ký ngay</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </GoogleOAuthProvider>
  );
};

export default Login;