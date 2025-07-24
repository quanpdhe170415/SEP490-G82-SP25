const InventoryTask = require('../models/InventoryTask');

const inventoryTaskController = {
  getInventoryTasks: async (req, res) => {
    try {
      const tasks = await InventoryTask.find()
        .populate('inventory_id shelf_level_id');
      res.status(200).json(tasks);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi khi lấy danh sách công việc kiểm kho', error: error.message });
    }
  },

  createInventoryTask: async (req, res) => {
    try {
      const { inventory_id, shelf_level_id, note } = req.body;
      const task = new InventoryTask({
        inventory_id,
        shelf_level_id,
        status: 'Chưa kiểm',
        note,
      });
      await task.save();
      // Cập nhật tasks trong InventoryCheck
      await InventoryCheck.findByIdAndUpdate(inventory_id, { $push: { tasks: task._id } });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi khi tạo công việc kiểm kho', error: error.message });
    }
  },
};

module.exports = inventoryTaskController;

