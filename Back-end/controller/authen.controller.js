const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { OAuth2Client } = require("google-auth-library");
// const nodemailer = require("nodemailer");
const { Account } = require("../models");
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Account.findOne({ user_name: email });
    if (!account) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(password, salt);
    await account.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (err) {
    console.error(err.message);
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