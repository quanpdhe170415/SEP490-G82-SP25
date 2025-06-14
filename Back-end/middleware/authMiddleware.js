const jwt = require('jsonwebtoken');
const Account = require('../models/account.model'); // Đảm bảo đường dẫn đúng

const authMiddleware = async (req, res, next) => {
  // Lấy token từ header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Account.findById(decoded.userId).populate('role_id'); // Sử dụng userId

    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    // Gán user vào request để sử dụng ở các route khác
    req.user = user;

    // Hàm kiểm tra vai trò
    const userRole = user.role_id?.name; // Lấy tên vai trò từ role_id

    // Định nghĩa các hàm kiểm tra vai trò
    req.isOwner = () => userRole === 'Chủ cửa hàng';
    req.isWarehouse = () => userRole === 'Thủ kho';
    req.isCashier = () => userRole === 'Thu ngân';

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;