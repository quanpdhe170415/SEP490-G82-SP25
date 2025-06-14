const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { OAuth2Client } = require("google-auth-library");
// const nodemailer = require("nodemailer");
const { Account } = require("../models");
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm tài khoản dựa trên email
    const account = await Account.findOne({ email }).populate('role_id'); // Lấy thông tin role
    if (!account) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    console.log('Input password:', password); // Log mật khẩu nhập
    console.log('Stored hash:', account.password); // Log hash trong DB
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    // Tạo token JWT
    const payload = {
      userId: account._id,
      role: account.role_id.name, // Lấy tên vai trò (Chủ cửa hàng, Thủ kho, Thu ngân)
      email: account.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token hết hạn sau 1 giờ

    // Trả về token và thông tin vai trò
    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      role: account.role_id.name,
      userId: account._id
    });
  } catch (err) {
    console.error('Reset Password Error:', err.message);
    res.status(500).send("Server error");
  }
};

// Sửa lại resetPassword như sau:
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    account.password = password; // Gán plain password
    const savedAccount = await account.save(); // pre('save') sẽ tự động hash

    res.status(200).json({
      message: "Đổi mật khẩu thành công.",
      password: savedAccount.password
    });
  } catch (err) {
    console.error('Reset Password Error:', err.message);
    res.status(500).send("Server error");
  }
};


exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token không được để trống' });
  }

  try {
    // Xoá token này khỏi DB để ngăn không cho dùng lại
    // model RefreshToken để lưu trữ token
    // await RefreshToken.findOneAndDelete({ refreshToken });

    return res.json({ message: 'Đăng xuất thành công' });
  } catch (err) {
    console.error('Logout Error:', err);
    return res.status(500).json({ message: 'Lỗi server khi đăng xuất' });
  }
};