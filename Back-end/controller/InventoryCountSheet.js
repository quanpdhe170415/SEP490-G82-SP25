const InventoryCheck = require('../models/inventoryCheck');

exports.createInventoryCheck = async (req, res) => {
  try {
    const inventoryCheck = new InventoryCheck(req.body);
    await inventoryCheck.save();
    res.status(201).json(inventoryCheck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllInventoryChecks = async (req, res) => {
  try {
    const inventoryChecks = await InventoryCheck.find()
      .populate('priority_area priority_levels tasks created_by');
    res.json(inventoryChecks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInventoryCheckById = async (req, res) => {
  try {
    const inventoryCheck = await InventoryCheck.findById(req.params.id)
      .populate('priority_area priority_levels tasks created_by');
    if (!inventoryCheck) return res.status(404).json({ message: 'Inventory Check not found' });
    res.json(inventoryCheck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInventoryCheck = async (req, res) => {
  try {
    const inventoryCheck = await InventoryCheck.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!inventoryCheck) return res.status(404).json({ message: 'Inventory Check not found' });
    res.json(inventoryCheck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteInventoryCheck = async (req, res) => {
  try {
    const inventoryCheck = await InventoryCheck.findByIdAndDelete(req.params.id);
    if (!inventoryCheck) return res.status(404).json({ message: 'Inventory Check not found' });
    res.json({ message: 'Inventory Check deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const InventoryItemCheck = require('../models/InventoryItemCheck');

exports.createInventoryItemCheck = async (req, res) => {
  try {
    const inventoryItemCheck = new InventoryItemCheck(req.body);
    await inventoryItemCheck.save();
    res.status(201).json(inventoryItemCheck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllInventoryItemChecks = async (req, res) => {
  try {
    const inventoryItemChecks = await InventoryItemCheck.find()
      .populate('task_id goods_id shelf_level_id');
    res.json(inventoryItemChecks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInventoryItemCheckById = async (req, res) => {
  try {
    const inventoryItemCheck = await InventoryItemCheck.findById(req.params.id)
      .populate('task_id goods_id shelf_level_id');
    if (!inventoryItemCheck) return res.status(404).json({ message: 'Inventory Item Check not found' });
    res.json(inventoryItemCheck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInventoryItemCheck = async (req, res) => {
  try {
    const inventoryItemCheck = await InventoryItemCheck.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!inventoryItemCheck) return res.status(404).json({ message: 'Inventory Item Check not found' });
    res.json(inventoryItemCheck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteInventoryItemCheck = async (req, res) => {
  try {
    const inventoryItemCheck = await InventoryItemCheck.findByIdAndDelete(req.params.id);
    if (!inventoryItemCheck) return res.status(404).json({ message: 'Inventory Item Check not found' });
    res.json({ message: 'Inventory Item Check deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const InventoryTask = require('../models/InventoryTask');

exports.createInventoryTask = async (req, res) => {
  try {
    const inventoryTask = new InventoryTask(req.body);
    await inventoryTask.save();
    res.status(201).json(inventoryTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllInventoryTasks = async (req, res) => {
  try {
    const inventoryTasks = await InventoryTask.find()
      .populate('inventory_id shelf_level_id checked_by');
    res.json(inventoryTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInventoryTaskById = async (req, res) => {
  try {
    const inventoryTask = await InventoryTask.findById(req.params.id)
      .populate('inventory_id shelf_level_id checked_by');
    if (!inventoryTask) return res.status(404).json({ message: 'Inventory Task not found' });
    res.json(inventoryTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInventoryTask = async (req, res) => {
  try {
    const inventoryTask = await InventoryTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!inventoryTask) return res.status(404).json({ message: 'Inventory Task not found' });
    res.json(inventoryTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteInventoryTask = async (req, res) => {
  try {
    const inventoryTask = await InventoryTask.findByIdAndDelete(req.params.id);
    if (!inventoryTask) return res.status(404).json({ message: 'Inventory Task not found' });
    res.json({ message: 'Inventory Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createScheduleCheckMapping = async (req, res) => {
  try {
    const scheduleCheckMapping = new ScheduleCheckMapping(req.body);
    await scheduleCheckMapping.save();
    res.status(201).json(scheduleCheckMapping);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllScheduleCheckMappings = async (req, res) => {
  try {
    const scheduleCheckMappings = await ScheduleCheckMapping.find()
      .populate('schedule_id check_id');
    res.json(scheduleCheckMappings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getScheduleCheckMappingById = async (req, res) => {
  try {
    const scheduleCheckMapping = await ScheduleCheckMapping.findById(req.params.id)
      .populate('schedule_id check_id');
    if (!scheduleCheckMapping) return res.status(404).json({ message: 'Schedule Check Mapping not found' });
    res.json(scheduleCheckMapping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateScheduleCheckMapping = async (req, res) => {
  try {
    const scheduleCheckMapping = await ScheduleCheckMapping.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!scheduleCheckMapping) return res.status(404).json({ message: 'Schedule Check Mapping not found' });
    res.json(scheduleCheckMapping);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteScheduleCheckMapping = async (req, res) => {
  try {
    const scheduleCheckMapping = await ScheduleCheckMapping.findByIdAndDelete(req.params.id);
    if (!scheduleCheckMapping) return res.status(404).json({ message: 'Schedule Check Mapping not found' });
    res.json({ message: 'Schedule Check Mapping deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};