const Account = require('../models/account');
const Role = require('../models/role');

const adminMiddleware = async (req, res, next) => {
  try {
    const account = await Account.findById(req.user._id).populate('role_id');
    if (!account) {
      return res.status(404).json({ message: 'admin not found' });
    }
    if (!account.role_id) {
      return res.status(500).json({ message: 'Role not found for account' });
    }
    if (account.role_id.name !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin role', error });
  }
};

module.exports = adminMiddleware;