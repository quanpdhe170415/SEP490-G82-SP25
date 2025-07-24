const InventorySchedule = require('../models/InventorySchedule');

exports.createInventorySchedule = async (req, res) => {
  try {
    const { schedule_name, start_date, end_date, created_by, assigned_employees, area, inventory_type, manager_note } = req.body;
    const inventorySchedule = new InventorySchedule({
      schedule_name,
      start_date,
      end_date,
      created_by,
      assigned_employees,
      area,
      inventory_type,
      manager_note,
      status: 'Sắp tới',
    });
    await inventorySchedule.save();
    res.status(201).json(inventorySchedule);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo lịch kiểm kho', error: error.message });
  }
};

exports.getInventorySchedules = async (req, res) => {
  try {
    const schedules = await InventorySchedule.find().populate('created_by assigned_employees.employee_id area');
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi lấy danh sách lịch kiểm kho', error: error.message });
  }
};

exports.getInventoryScheduleById = async (req, res) => {
  try {
    const schedule = await InventorySchedule.findById(req.params.id).populate('created_by assigned_employees.employee_id area');
    if (!schedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch kiểm kho' });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi lấy chi tiết lịch kiểm kho', error: error.message });
  }
};