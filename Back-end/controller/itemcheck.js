const InventoryItemCheck = require('../models/InventoryItemCheck');

const inventoryItemCheckController = {
  getInventoryItemChecks: async (req, res) => {
    try {
      const itemChecks = await InventoryItemCheck.find()
        .populate('task_id goods_id shelf_level_id');
      res.status(200).json(itemChecks);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi khi lấy danh sách kiểm kê', error: error.message });
    }
  },
};

module.exports = inventoryItemCheckController;