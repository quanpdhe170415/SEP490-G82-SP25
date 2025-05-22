const jwt = require('jsonwebtoken');
const Account = require('../models/account');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Account.findById(decoded.accountId).populate('role_id'); // decoded._id -> decoded.accountId

    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    req.user = user;

    if (req.path === '/admin' && role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.path === '/staffOrders' && req.user.role_id.name !== 'STAFF') {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;