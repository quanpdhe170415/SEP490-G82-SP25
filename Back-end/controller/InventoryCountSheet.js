const InventoryCheck = require('../models/inventoryCheck');
const InventoryTask = require('../models/InventoryTask');
const InventoryItemCheck = require('../models/InventoryItemCheck');
const Area = require('../models/Area');
const DefectiveItemLog = require('../models/DefectiveItemLog'); // Nếu có
const mongoose = require('mongoose');
const ShelfLevel = require('../models/ShelfLevel');
const Inventory = require('../models/inventory');

const getGoodsListLengthAndProgress = async (task) => {
  try {
    let totalItems = 0;
    let completedItems = 0;
    let inProgressItems = 0;
    let pendingItems = 0;

    // Lấy tất cả InventoryItemCheck của task này
    const itemChecks = await InventoryItemCheck.find({ task_id: task._id });
    
    // Đếm theo status
    totalItems = itemChecks.length;
    completedItems = itemChecks.filter(ic => ic.status === 'Hoàn thành').length;
    inProgressItems = itemChecks.filter(ic => ic.status === 'Đang kiểm').length;
    pendingItems = itemChecks.filter(ic => ic.status === 'Chưa kiểm').length;

    // Nếu chưa có item checks, tạo dựa trên check_type
    if (totalItems === 0) {
      let inventories = [];
      
      switch (task.check_type) {
        case 'Toàn bộ':
          const allShelfLevels = await ShelfLevel.find({ inventory_id: task.inventory_id });
          inventories = await Inventory.find({ 
            shelf_level_id: { $in: allShelfLevels.map(sl => sl._id) } 
          });
          break;

        case 'Theo kệ':
          if (task.target_items?.shelf) {
            const shelfLevels = await ShelfLevel.find({ shelf_id: task.target_items.shelf });
            inventories = await Inventory.find({ 
              shelf_level_id: { $in: shelfLevels.map(sl => sl._id) } 
            });
          }
          break;

        case 'Theo tầng':
          if (task.target_items?.shelf_level) {
            inventories = await Inventory.find({ 
              shelf_level_id: task.target_items.shelf_level 
            });
          }
          break;

        case 'Theo sản phẩm':
          if (task.target_items?.goods && Array.isArray(task.target_items.goods)) {
            inventories = await Inventory.find({ 
              goods_id: { $in: task.target_items.goods } 
            });
          }
          break;

        default:
          if (task.shelf_level_id) {
            inventories = await Inventory.find({ 
              shelf_level_id: task.shelf_level_id 
            });
          }
      }

      totalItems = inventories.length;
      pendingItems = totalItems;
      completedItems = 0;
      inProgressItems = 0;
    }

    const completionPercentage = totalItems > 0 ? 
      Math.round((completedItems / totalItems) * 100) : 0;

    return {
      totalItems,
      completedItems,
      inProgressItems,
      pendingItems,
      completionPercentage
    };
  } catch (error) {
    console.error('Error calculating progress:', error);
    return {
      totalItems: 0,
      completedItems: 0,
      inProgressItems: 0,
      pendingItems: 0,
      completionPercentage: 0
    };
  }
};

// Sửa lại hàm getInventoryAreas
exports.getInventoryAreas = async (req, res) => {
  try {
    const { checkId } = req.params;
    const { status = 'all' } = req.query;

    console.log('Getting areas for checkId:', checkId, 'with status filter:', status);

    // Validate checkId
    if (!checkId) {
      return res.status(400).json({
        success: false,
        message: 'checkId is required',
      });
    }
    if (!mongoose.Types.ObjectId.isValid(checkId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid checkId format',
      });
    }

    // Convert checkId to ObjectId
    const objectId = new mongoose.Types.ObjectId(checkId);

    // Find tasks
    const tasks = await InventoryTask.find({ inventory_id: objectId })
      .populate('shelf_level_id')
      .populate('inventory_id');

    console.log('Found tasks:', tasks.length);

    if (tasks.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        totalProgress: 0,
        message: 'Không tìm thấy khu vực kiểm kho nào',
      });
    }

    // Rest of the function remains the same
    const areas = await Promise.all(tasks.map(async (task) => {
      const progress = await getGoodsListLengthAndProgress(task);
      return {
        id: task._id,
        name: task.name || `Khu vực ${task._id}`,
        status: task.status || 'not-started',
        ...progress,
      };
    }));

    const statusMapping = {
      'not-started': 'not-started',
      'Chưa kiểm': 'not-started',
      'checking': 'checking',
      'Đang kiểm': 'checking',
      'completed': 'completed',
      'Hoàn thành': 'completed',
    };

    let filteredAreas = areas;
    if (status !== 'all') {
      filteredAreas = areas.filter(area => {
        const mappedStatus = statusMapping[area.status] || area.status;
        return mappedStatus === status;
      });
    }

    const totalProgress = areas.length > 0
      ? Math.round(areas.reduce((sum, area) => sum + area.completionPercentage, 0) / areas.length)
      : 0;

    console.log('Returning areas:', filteredAreas.length, 'total progress:', totalProgress);

    res.status(200).json({
      success: true,
      data: filteredAreas,
      totalProgress,
      message: 'Danh sách khu vực kiểm kho được tải thành công',
    });
  } catch (error) {
    console.error('Error getting inventory areas:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách khu vực kiểm kho',
      error: error.message,
    });
  }
};

// Bắt đầu kiểm kho
exports.startInventory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const inventoryCheck = await InventoryCheck.findByIdAndUpdate(
      id,
      { 
        status: 'in-progress', 
        check_start_time: new Date(), 
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    );

    if (!inventoryCheck) {
      return res.status(404).json({ 
        success: false, 
        message: 'Phiếu kiểm kho không tồn tại' 
      });
    }

    // Cập nhật status của tất cả tasks liên quan
    await InventoryTask.updateMany(
      { inventory_id: id },
      { status: 'not-started' }
    );

    res.status(200).json({
      success: true,
      data: {
        _id: inventoryCheck._id,
        inventory_code: inventoryCheck.inventory_code,
        status: inventoryCheck.status,
        check_start_time: inventoryCheck.check_start_time
      },
      message: 'Kiểm kho đã được bắt đầu thành công'
    });
  } catch (error) {
    console.error('Error starting inventory:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi bắt đầu kiểm kho', 
      error: error.message 
    });
  }
};

// Sửa lại hàm completeInventory
exports.completeInventory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const inventoryCheck = await InventoryCheck.findById(id);
    if (!inventoryCheck) {
      return res.status(404).json({ 
        success: false, 
        message: 'Phiếu kiểm kho không tồn tại' 
      });
    }

    // Kiểm tra tất cả tasks đã hoàn thành chưa
    const tasks = await InventoryTask.find({ inventory_id: id });
    const allTasksCompleted = tasks.every(task => task.status === 'completed');

    if (!allTasksCompleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Còn nhiệm vụ chưa hoàn thành. Vui lòng hoàn thành tất cả khu vực trước khi kết thúc kiểm kho.' 
      });
    }

    const updatedCheck = await InventoryCheck.findByIdAndUpdate(
      id,
      {
        status: 'completed',
        check_end_time: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        _id: updatedCheck._id,
        inventory_code: updatedCheck.inventory_code,
        status: updatedCheck.status,
        checkEndTime: updatedCheck.check_end_time
      },
      message: 'Kiểm kho đã được hoàn tất thành công'
    });
  } catch (error) {
    console.error('Error completing inventory:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi hoàn tất kiểm kho', 
      error: error.message 
    });
  }
};

// Sửa lại hàm cancelInventory
exports.cancelInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const inventoryCheck = await InventoryCheck.findByIdAndUpdate(
      id,
      {
        status: 'not-started',
        check_start_time: null,
        check_end_time: null,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!inventoryCheck) {
      return res.status(404).json({ 
        success: false, 
        message: 'Phiếu kiểm kho không tồn tại' 
      });
    }

    // Reset tất cả tasks về trạng thái ban đầu
    await InventoryTask.updateMany(
      { inventory_id: id },
      { status: 'not-started' }
    );

    // Reset tất cả item checks
    const tasks = await InventoryTask.find({ inventory_id: id });
    const taskIds = tasks.map(task => task._id);
    await InventoryItemCheck.updateMany(
      { task_id: { $in: taskIds } },
      { status: 'Chưa kiểm' }
    );

    res.status(200).json({
      success: true,
      data: {
        _id: inventoryCheck._id,
        inventory_code: inventoryCheck.inventory_code,
        status: inventoryCheck.status
      },
      message: 'Kiểm kho đã được hủy thành công'
    });
  } catch (error) {
    console.error('Error canceling inventory:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi hủy kiểm kho', 
      error: error.message 
    });
  }
};
// Lấy chi tiết khu vực kiểm kho
exports.getInventoryAreaDetails = async (req, res) => {
  try {
    const { id, areaId } = req.params; // Sử dụng _id thay vì inventoryCode
    const { status, search } = req.query;

    // Lấy thông tin phiếu kiểm kho
    const inventoryCheck = await InventoryCheck.findById(id);

    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    // Lấy danh sách task thuộc phiếu kiểm kho
    const tasks = await InventoryTask.find({ inventory_id: id })
      .populate('shelf_level_id');

    // Lọc task thuộc khu vực cụ thể
    const areaTasks = tasks.filter(task => task.shelf_level_id?.area?.toString() === areaId);

    if (areaTasks.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khu vực trong phiếu kiểm kho' });
    }

    // Lấy danh sách inventoryItemChecks cho các task
    const itemCheckIds = areaTasks.flatMap(task => task._id);
    const items = await InventoryItemCheck.find({ task_id: { $in: itemCheckIds } })
      .populate('goods_id shelf_level_id');

    // Lọc và xử lý dữ liệu
    const filteredItems = items.filter(item => {
      const matchesStatus = !status || status === 'all' || item.status === status;
      const matchesSearch = !search || 
        item.goods_id?.name.toLowerCase().includes(search.toLowerCase()) ||
        item.goods_id?.code.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    }).map(item => ({
      id: item._id.toString(),
      code: item.goods_id?.code || 'N/A',
      name: item.goods_id?.name || 'N/A',
      unit: item.goods_id?.unit_of_measure || 'N/A',
      location: item.shelf_level_id?.level_code || 'N/A',
      expectedQuantity: item.system_quantity,
      actualQuantity: item.actual_quantity,
      status: item.status,
      hasDefect: item.is_defective,
      discrepancy: item.discrepancy
    }));

    const area = await Area.findById(areaId);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Khu vực không tồn tại' });
    }

    const completedItems = filteredItems.filter(item => item.status === 'Đã kiểm').length;
    const totalItems = filteredItems.length;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        id: areaId,
        name: area.name,
        description: area.description,
        items: filteredItems,
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
    const { actualQuantity } = req.body;

    const itemCheck = await InventoryItemCheck.findByIdAndUpdate(
      itemId,
      {
        actual_quantity: actualQuantity,
        status: 'Đã kiểm',
        updatedAt: new Date()
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
    const { is_defective, note } = req.body;

    const itemCheck = await InventoryItemCheck.findByIdAndUpdate(
      itemId,
      {
        is_defective,
        note,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!itemCheck) {
      return res.status(404).json({ success: false, message: 'Mục kiểm kho không tồn tại' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: itemCheck._id,
        hasDefect: itemCheck.is_defective,
        note: itemCheck.note,
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
    const { id } = req.params; // Sử dụng _id thay vì inventoryCode
    const { format = 'pdf' } = req.query;

    const inventoryCheck = await InventoryCheck.findById(id).populate('tasks');

    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    // Placeholder: Trả về JSON thay vì file để demo
    res.status(200).json({
      success: true,
      data: {
        inventoryCode: inventoryCheck.inventoryCode,
        reportData: 'Dữ liệu báo cáo (cần tích hợp thư viện tạo file)',
        message: 'Biên bản kiểm kho đã được tạo'
      }
    });

    // Để tạo file thật:
    // const reportBuffer = generateReport(inventoryCheck);
    // res.setHeader('Content-Disposition', `attachment; filename=report_${inventoryCheck.inventoryCode}.${format}`);
    // res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.send(reportBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xuất biên bản', error: error.message });
  }
};

// Lấy thông tin chi tiết phiếu kiểm kho
exports.getInventoryCheckDetails = async (req, res) => {
  try {
    const { id } = req.params; // Sử dụng _id thay vì inventoryCode

    const inventoryCheck = await InventoryCheck.findById(id);

    if (!inventoryCheck) {
      return res.status(404).json({ success: false, message: 'Phiếu kiểm kho không tồn tại' });
    }

    res.status(200).json({
      success: true,
      data: {
        inventoryCode: inventoryCheck.inventory_code,
        inventoryName: inventoryCheck.inventory_name,
        checkStartTime: inventoryCheck.check_start_time,
        checkEndTime: inventoryCheck.check_end_time,
        status: inventoryCheck.status,
        priorityNotice: inventoryCheck.note
      },
      message: 'Thông tin phiếu kiểm kho được tải thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tải thông tin phiếu kiểm kho', error: error.message });
  }
};