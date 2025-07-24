const InventoryCheck = require('../models/inventoryCheck');
const InventoryTask = require('../models/InventoryTask');
const InventoryItemCheck = require('../models/InventoryItemCheck');
const Area = require('../models/Area');
const DefectiveItemLog = require('../models/DefectiveItemLog'); // Nếu có
const mongoose = require('mongoose');

// Lấy danh sách khu vực kiểm kho
exports.getInventoryAreas = async (req, res) => {
  try {
    const { id } = req.params; // Sử dụng _id của InventoryCheck
    const { status } = req.query;

    const inventoryCheck = await InventoryCheck.findById(id)
      .populate('area')
      .populate({
        path: 'tasks',
        populate: { 
          path: 'shelf_level_id',
          populate: { path: 'area' } // Đảm bảo lấy thông tin khu vực
        }
      });

    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    // Lọc theo trạng thái nếu có
    const filteredTasks = status && status !== 'all' 
      ? inventoryCheck.tasks.filter(task => task.status === status)
      : inventoryCheck.tasks;

    const taskAreas = filteredTasks.map(task => {
      const totalItems = task.inventoryItemChecks.length || 0;
      const completedItems = task.inventoryItemChecks.filter(item => item.status === 'checked').length;
      const inProgressItems = task.inventoryItemChecks.filter(item => item.status === 'in-progress').length;
      const pendingItems = totalItems - completedItems - inProgressItems;

      return {
        id: task._id.toString(),
        name: task.shelf_level_id?.level_code || 'Khu vực không xác định',
        description: task.note || `Kiểm tra ${task.shelf_level_id?.level_code || 'khu vực'}`,
        totalItems,
        completedItems,
        inProgressItems,
        pendingItems,
        completionPercentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
        status: task.status || 'not-started'
      };
    });

    const totalProgress = Math.round(taskAreas.reduce((acc, area) => acc + area.completionPercentage, 0) / taskAreas.length);

    res.status(200).json({
      success: true,
      data: taskAreas,
      totalProgress,
      message: 'Danh sách khu vực kiểm kho được tải thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách khu vực', error: error.message });
  }
};

// Bắt đầu kiểm kho
exports.startInventory = async (req, res) => {
  try {
    const {  inventory_code } = req.params;
    const { employeeId } = req.user; // Giả sử lấy từ token JWT

    const inventoryCheck = await InventoryCheck.findOneAndUpdate(
      {  inventory_code },
      { status: 'in-progress', check_start_time: new Date(), updatedAt: new Date(), created_by: employeeId },
      { new: true, runValidators: true }
    );

    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    res.status(200).json({
      success: true,
      data: {
         inventory_code: inventoryCheck.inventory_code,
        status: inventoryCheck.status,
        checkStartTime: inventoryCheck.check_start_time,
        message: 'Kiểm kho đã được bắt đầu'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi bắt đầu kiểm kho', error: error.message });
  }
};

// Hoàn tất kiểm kho
exports.completeInventory = async (req, res) => {
  try {
    const {  inventory_code } = req.params;
    const { employeeId } = req.user;

    const inventoryCheck = await InventoryCheck.findOne({  inventory_code }).populate('tasks');

    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    const allTasksCompleted = inventoryCheck.tasks.every(task => {
      return task.inventoryItemChecks.every(item => item.status === 'checked');
    });

    if (!allTasksCompleted) {
      return res.status(400).json({ success: false, message: 'Còn nhiệm vụ chưa hoàn thành' });
    }

    inventoryCheck.status = 'completed';
    inventoryCheck.check_end_time = new Date();
    inventoryCheck.updatedAt = new Date();
    await inventoryCheck.save();

    res.status(200).json({
      success: true,
      data: {
         inventory_code: inventoryCheck.inventory_code,
        status: inventoryCheck.status,
        checkEndTime: inventoryCheck.check_end_time,
        message: 'Kiểm kho đã được hoàn tất'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi hoàn tất kiểm kho', error: error.message });
  }
};

// Hủy kiểm kho
exports.cancelInventory = async (req, res) => {
  try {
    const {  inventory_code } = req.params;
    const { reason, employeeId } = req.body;

    const inventoryCheck = await InventoryCheck.findOneAndUpdate(
      {  inventory_code },
      {
        status: 'not-started',
        check_start_time: null,
        check_end_time: null,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    // Ghi log hủy (nếu có)
    if (reason) {
      await DefectiveItemLog.create({
        inventoryCheckId: inventoryCheck._id,
        reason,
        created_by: employeeId,
        createdAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      data: {
         inventory_code: inventoryCheck. inventory_code,
        status: inventoryCheck.status,
        checkStartTime: null,
        checkEndTime: null,
        message: 'Yêu cầu hủy kiểm kho đã được gửi thành công'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi hủy kiểm kho', error: error.message });
  }
};

// Lấy chi tiết khu vực kiểm kho
exports.getInventoryAreaDetails = async (req, res) => {
  try {
    const {  inventory_code, areaId } = req.params;
    const { status, search } = req.query;

    const inventoryCheck = await InventoryCheck.findOne({  inventory_code })
      .populate({
        path: 'tasks',
        populate: {
          path: 'inventoryItemChecks',
          populate: { path: 'goods_id shelf_level_id' }
        }
      });

    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    const area = await Area.findById(areaId);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Khu vực không tồn tại' });
    }

    const items = inventoryCheck.tasks
      .filter(task => task.shelf_level_id.area.toString() === areaId)
      .flatMap(task => task.inventoryItemChecks)
      .filter(item => {
        const matchesStatus = !status || status === 'all' || item.status === status;
        const matchesSearch = !search || 
          item.goods_id?.name.toLowerCase().includes(search.toLowerCase()) ||
          item.goods_id?.code.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .map(item => ({
        id: item._id.toString(),
        code: item.goods_id?.code || 'N/A',
        name: item.goods_id?.name || 'N/A',
        unit: item.goods_id?.unit_of_measure || 'N/A',
        location: item.shelf_level_id?.level_code || 'N/A',
        expectedQuantity: item.system_quantity,
        actualQuantity: item.actual_quantity,
        status: item.status,
        hasDefect: !!item.defectInfo
      }));

    const completedItems = items.filter(item => item.status === 'checked').length;
    const totalItems = items.length;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        id: areaId,
        name: area.name,
        description: area.description,
        items,
        completionPercentage
      },
      message: 'Danh sách hàng hóa được tải thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tải chi tiết khu vực', error: error.message });
  }
};

// Cập nhật số lượng thực tế
exports.updateItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { actualQuantity, employeeId } = req.body;

    const itemCheck = await InventoryItemCheck.findByIdAndUpdate(
      itemId,
      {
        actual_quantity: actualQuantity,
        status: 'checked',
        updatedAt: new Date(),
        updated_by: employeeId
      },
      { new: true, runValidators: true }
    );

    if (!itemCheck) {
      return res.status(404).json({ success: false, message: 'Mục kiểm kho không tồn tại' });
    }

    const discrepancy = itemCheck.system_quantity - actualQuantity;

    res.status(200).json({
      success: true,
      data: {
        id: itemCheck._id,
        actualQuantity: itemCheck.actual_quantity,
        status: itemCheck.status,
        discrepancy,
        message: 'Số lượng thực tế đã được cập nhật'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật số lượng', error: error.message });
  }
};

// Ghi nhận hàng lỗi
exports.updateItemDefect = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { hasDefect, defectInfo, employeeId } = req.body;

    const itemCheck = await InventoryItemCheck.findByIdAndUpdate(
      itemId,
      {
        hasDefect,
        defectInfo,
        updatedAt: new Date(),
        updated_by: employeeId
      },
      { new: true, runValidators: true }
    );

    if (!itemCheck) {
      return res.status(404).json({ success: false, message: 'Mục kiểm kho không tồn tại' });
    }

    if (hasDefect && defectInfo) {
      await DefectiveItemLog.create({
        inventoryItemCheckId: itemCheck._id,
        ...defectInfo,
        created_by: employeeId,
        createdAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: itemCheck._id,
        hasDefect: itemCheck.hasDefect,
        defectInfo: itemCheck.defectInfo,
        message: 'Thông tin hàng lỗi đã được ghi nhận'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi ghi nhận hàng lỗi', error: error.message });
  }
};

// Xuất biên bản kiểm kho (Placeholder)
exports.exportInventoryReport = async (req, res) => {
  try {
    const {  inventory_code } = req.params;
    const { format = 'pdf' } = req.query;

    const inventoryCheck = await InventoryCheck.findOne({  inventory_code }).populate('tasks');

    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    // Logic tạo file PDF/Excel (sử dụng pdfkit hoặc exceljs)
    // Placeholder: Trả về JSON thay vì file để demo
    res.status(200).json({
      success: true,
      data: {
         inventory_code: inventoryCheck. inventory_code,
        reportData: 'Dữ liệu báo cáo (cần tích hợp thư viện tạo file)',
        message: 'Biên bản kiểm kho đã được tạo'
      }
    });

    // Để tạo file thật:
    // const reportBuffer = generateReport(inventoryCheck);
    // res.setHeader('Content-Disposition', `attachment; filename=report_${ inventory_code}.${format}`);
    // res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.send(reportBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xuất biên bản', error: error.message });
  }
};

// Lấy thông tin chi tiết phiếu kiểm kho
exports.getInventoryCheckDetails = async (req, res) => {
  try {
    const { checkId } = req.params;

    const inventoryCheck = await InventoryCheck.findById(checkId);
    console.log(`Fetching inventory check details for ID: ${checkId}`);
    
    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    res.status(200).json({
      success: true,
      data: {
         inventory_code: inventoryCheck.inventory_code,
        inventoryName: inventoryCheck.inventory_name,
        checkStartTime: inventoryCheck.check_start_time,
        checkEndTime: inventoryCheck.check_end_time,
        status: inventoryCheck.status,
        priorityNotice: '⚠️ Ưu tiên kiểm tra Kệ B - Đồ uống để nhập hàng mới'
      },
      message: 'Thông tin phiếu kiểm kho được tải thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tải thông tin phiếu kiểm kho', error: error.message });
  }
};