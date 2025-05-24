// filepath: /C:/Users/i-quanpd/Desktop/wdp/WDP301_Group1_SE1761-NJ/back-end/controller/authen.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");
const { Account, AccountDetail, Role } = require("../models");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 1 * 60 * 1000; // 1 minute

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.login = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const account = await Account.findOne({ user_name });
    if (!account) {
      return res
        .status(404)
        .json({ message: "Tài khoản của bạn không tồn tại trong hệ thống!" });
    }

    if (!account.isVerified) {
      return res
        .status(403)
        .json({ message: "Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để xác minh tài khoản." });
    }
    
    if (account.isLocked) {
      return res
        .status(403)
        .json({
          message: "Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau.",
        });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      account.loginAttempts += 1;
      if (account.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        account.lockUntil = Date.now() + LOCK_TIME;
        account.loginAttempts = 0;
      }
      await account.save();
      return res.status(403).json({ message: "Mật khẩu không chính xác!" });
    }

    account.loginAttempts = 0;
    account.lockUntil = undefined;
    await account.save();

    const payload = { accountId: account._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "1d",
    });

    await AccountDetail.findOneAndUpdate(
      { account_id: account._id },
      { refresh_token: refreshToken }
    );
    let accountDetail;
    accountDetail = await AccountDetail.findOne({ account_id: account._id });
    const role = await Role.findById(account.role_id);

    res.json({
      token,
      refreshToken,
      accountDetail: { full_name: accountDetail.full_name, role: role.name },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let account = await Account.findOne({ user_name: email });
    let accountDetail;
    if (!account) {
      // Tìm role USER
      const userRole = await Role.findOne({ name: "USER" });
      if (!userRole) {
        return res.status(500).json({ message: "Role USER not found" });
      }

      // Tạo mật khẩu ngẫu nhiên
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      account = new Account({
        email,
        user_name: email,
        password: hashedPassword,
        role_id: userRole._id,
        start_working: new Date(),
        isVerified: true, // Đặt isVerified thành true
      });
      await account.save();

      // Tạo AccountDetail cho tài khoản mới
      accountDetail = new AccountDetail({
        account_id: account._id,
        full_name: name,
        phone_number: "",
        birth_of_date: new Date(),
        id_number: "",
        gender: "",
        address: "",
        profile_picture: "",
        refresh_token: "", // Khởi tạo refresh_token rỗng
      });
      await accountDetail.save();
    } else {
      // Nếu tài khoản đã tồn tại, lấy AccountDetail
      accountDetail = await AccountDetail.findOne({ account_id: account._id });
    }

    const jwtPayload = { accountId: account._id };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    const refreshToken = jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "1d",
    });

    await AccountDetail.findOneAndUpdate(
      { account_id: account._id },
      { refresh_token: refreshToken }
    );

    // Lấy thông tin role của tài khoản
    const role = await Role.findById(account.role_id);

    res.json({
      token,
      refreshToken,
      accountDetail: { full_name: accountDetail.full_name, role: role.name },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.register = async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;

  try {
    // Check if the email is already used
    let account = await Account.findOne({ user_name: email });
    if (account) {
      if (!account.isVerified) {
        // If the account exists but is not verified, delete it
        await Account.deleteOne({ _id: account._id });
        await AccountDetail.deleteOne({ account_id: account._id });
      } else {
        // If the account is verified, return an error
        return res.status(400).json({ message: "Email đã tồn tại trong hệ thống!" });
      }
    }

    // Find the USER role
    const userRole = await Role.findOne({ name: "USER" });
    if (!userRole) {
      return res.status(500).json({ message: "Role USER not found" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new account
    account = new Account({
      user_name: email,
      email,
      password: hashedPassword,
      role_id: userRole._id,
      start_working: new Date(),
      isVerified: false // Set isVerified to false
    });
    await account.save();

    // Create AccountDetail for the new account
    const accountDetail = new AccountDetail({
      account_id: account._id,
      full_name: fullName,
      phone_number: phoneNumber,
      birth_of_date: new Date(),
      id_number: "",
      gender: "",
      address: "",
      profile_picture: "",
      refresh_token: "", // Initialize refresh_token as empty
    });
    await accountDetail.save();

    // Generate a verification token
    const token = jwt.sign({ accountId: account._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

    // Send a verification email
    const mailOptions = {
      from: `"Chăm sóc khách hàng OrderingSystem" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Xác nhận tài khoản',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #dc3545; text-align: center;">Xác nhận tài khoản</h2>
          <p>Xin chào ${fullName},</p>
          <p>Vui lòng nhấp vào liên kết sau để xác nhận tài khoản của bạn:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:3000/verify-email?token=${token}" style="background-color: #dc3545; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Xác nhận tài khoản</a>
          </div>
          <p>Nếu bạn không yêu cầu tạo tài khoản này, vui lòng bỏ qua email này.</p>
          <p style="color: #dc3545; font-weight: bold;">Đường link này sẽ hết hạn sau 3 ngày. Nếu bạn có câu hỏi, vui lòng phản hồi lại email này!</p>
          <p>Trân trọng,</p>
          <p>Chăm sóc khách hàng OrderingSystem</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send("Server error");
      }
      res.status(200).json({ message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản." });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findById(decoded.accountId);

    if (!account) {
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });
    }

    account.isVerified = true;
    await account.save();

    res.status(200).json({ message: "Tài khoản đã được xác nhận thành công!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

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

exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // Kiểm tra mật khẩu mới có ít nhất 8 ký tự, bao gồm cả chữ và số
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm cả chữ và số."
      });
    }

    // Tìm tài khoản dựa trên email (user_name)
    const account = await Account.findOne({ user_name: email });
    if (!account) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(newPassword, salt);
    await account.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (err) {
    console.error("Lỗi khi đổi mật khẩu:", err.message);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau!" });
  }
};