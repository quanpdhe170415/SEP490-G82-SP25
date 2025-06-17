const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Account, Session } = require("../models");

exports.login = async (req, res) => {
  const { username, password, deviceType } = req.body;

  try {
    // Tìm tài khoản dựa trên username
    const account = await Account.findOne({ username }).populate('role_id');
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại trong hệ thống!" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    // Tạo access token
    const payload = {
      userId: account._id,
      role: account.role_id.name,
      email: account.email
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Tạo refresh token
    const refreshToken = jwt.sign({ userId: account._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Sinh deviceId (UUID)
    const deviceId = uuidv4();

    // Lưu session vào DB
    await Session.create({
      userId: account._id,
      deviceId,
      deviceType: deviceType || "web",
      refreshToken,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      refreshToken,
      deviceId,
      deviceType: deviceType || "web",
      role: account.role_id.name,
      userId: account._id,
      username: account.username,
    });
  } catch (err) {
    console.error('Login Error:', err.message);
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