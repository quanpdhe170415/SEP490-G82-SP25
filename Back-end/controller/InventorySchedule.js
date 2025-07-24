const InventorySchedule = require('../models/InventorySchedule');
const InventoryCheck = require('../models/inventoryCheck');
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
exports.getInventoryCheckBySchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    
    // Populate schedule_id để lấy thông tin từ InventorySchedule
    const inventoryCheck = await InventoryCheck.findOne({ schedule_id: scheduleId })
      .populate('schedule_id', 'start_date time_start schedule_name'); // Chỉ lấy các trường cần thiết
    
    if (!inventoryCheck) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy phiếu kiểm kho cho lịch này' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...inventoryCheck._doc, // Lấy toàn bộ dữ liệu từ inventoryCheck
        start_date: inventoryCheck.schedule_id?.start_date, // Thêm start_date
        time_start: inventoryCheck.schedule_id?.time_start, // Thêm time_start
        schedule_name: inventoryCheck.schedule_id?.schedule_name // Thêm schedule_name nếu cần
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi lấy phiếu kiểm kho', 
      error: error.message 
    });
  }
};