const InventoryTask = require('../models/InventoryTask');
const Inventory = require('../models/inventory');
const InventoryItemCheck = require('../models/InventoryItemCheck');
const ShelfLevel = require('../models/ShelfLevel');
const mongoose = require('mongoose');

// Tạo hoặc cập nhật InventoryItemChecks dựa trên InventoryTask
async function createInventoryItemChecks(task) {
  await InventoryItemCheck.deleteMany({ task_id: task._id });

  let itemsToCreate = [];

  switch (task.check_type) {
    case 'Toàn bộ':
  const allShelfLevels = await ShelfLevel.find({ inventory_id: task.inventory_id });
  itemsToCreate = await Promise.all(allShelfLevels.map(async level => {
    const inventories = await Inventory.find({ shelf_level_id: level._id });
    return inventories.map(inv => ({
      task_id: task._id,
      shelf_level_id: level._id,
      goods_id: inv.goods_id,
      system_quantity: inv.quantity_remain,
      status: 'Chưa kiểm',
    }));
  }));
  itemsToCreate = itemsToCreate.flat();
  break;

case 'Theo kệ':
  if (task.target_items.shelf) {
    const shelfLevels = await ShelfLevel.find({ shelf_id: task.target_items.shelf });
    itemsToCreate = await Promise.all(shelfLevels.map(async level => {
      const inventories = await Inventory.find({ shelf_level_id: level._id });
      return inventories.map(inv => ({
        task_id: task._id,
        shelf_level_id: level._id,
        goods_id: inv.goods_id,
        system_quantity: inv.quantity_remain,
        status: 'Chưa kiểm',
      }));
    }));
    itemsToCreate = itemsToCreate.flat();
  }
  break;

    case 'Theo tầng':
      if (task.target_items.shelf_level) {
        const shelfLevel = await ShelfLevel.findById(task.target_items.shelf_level);
        if (shelfLevel) {
          itemsToCreate = await Inventory.find({ shelf_level_id: shelfLevel._id }).map(inv => ({
            task_id: task._id,
            shelf_level_id: shelfLevel._id,
            goods_id: inv.goods_id,
            system_quantity: inv.quantity_remain,
            status: 'Chưa kiểm',
          }));
        }
      }
      break;

    case 'Theo sản phẩm':
      if (task.target_items.goods && Array.isArray(task.target_items.goods)) {
        itemsToCreate = task.target_items.goods.map(goodsId => ({
          task_id: task._id,
          shelf_level_id: null, // Cần xác định shelf_level_id từ Inventory
          goods_id: goodsId,
          system_quantity: 0, // Cần lấy từ Inventory
          status: 'Chưa kiểm',
        }));
        // Lấy shelf_level_id và system_quantity từ Inventory
        for (let item of itemsToCreate) {
          const inv = await Inventory.findOne({ goods_id: item.goods_id });
          if (inv) {
            item.shelf_level_id = inv.shelf_level_id;
            item.system_quantity = inv.quantity_remain;
          }
        }
      }
      break;

  }

  if (itemsToCreate.length > 0) {
    await InventoryItemCheck.insertMany(itemsToCreate);
  }
}

// Tạo mới InventoryTask
exports.createInventoryTask = async (req, res) => {
  try {
    const { inventory_id, shelf_level_id, check_type, target_items, note } = req.body;

    const task = new InventoryTask({
      inventory_id,
      shelf_level_id,
      check_type,
      target_items,
      note,
    });

    await task.save();
    await createInventoryItemChecks(task);

    res.status(201).json({
      success: true,
      data: task,
      message: 'Nhiệm vụ kiểm kho đã được tạo thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo nhiệm vụ kiểm kho', error: error.message });
  }
};

// Cập nhật InventoryTask
exports.updateInventoryTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { inventory_id, shelf_level_id, check_type, target_items, note } = req.body;

    const task = await InventoryTask.findByIdAndUpdate(
      id,
      { inventory_id, shelf_level_id, check_type, target_items, note },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Nhiệm vụ kiểm kho không tồn tại' });
    }

    await createInventoryItemChecks(task);

    res.status(200).json({
      success: true,
      data: task,
      message: 'Nhiệm vụ kiểm kho đã được cập nhật thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật nhiệm vụ kiểm kho', error: error.message });
  }
};

// Lấy thông tin chi tiết của một InventoryTask và danh sách sản phẩm
exports.getInventoryTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await InventoryTask.findById(taskId)
      .populate('shelf_level_id');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Nhiệm vụ kiểm kho không tồn tại' });
    }

    let goodsList = [];

    switch (task.check_type) {
      case 'Toàn bộ':
        const allShelfLevels = await ShelfLevel.find({ inventory_id: task.inventory_id });
        const allInventories = await Inventory.find({ shelf_level_id: { $in: allShelfLevels.map(sl => sl._id) } })
          .populate('goods_id');
        const allItemChecks = await InventoryItemCheck.find({ task_id: taskId, shelf_level_id: { $in: allShelfLevels.map(sl => sl._id) } })
          .populate('goods_id');
        goodsList = allInventories.map(inv => {
          const itemCheck = allItemChecks.find(ic => ic.goods_id.toString() === inv.goods_id._id.toString());
          return {
            id: inv._id,
            goods_id: inv.goods_id._id,
            name: inv.goods_id.name,
            code: inv.goods_id.code,
            expectedQuantity: inv.quantity_remain,
            actualQuantity: itemCheck ? itemCheck.actual_quantity : null,
            status: itemCheck ? itemCheck.status : 'Chưa kiểm',
            location: inv.shelf_level_id?.level_code,
            is_checked: inv.is_checked,
          };
        });
        break;

      case 'Theo kệ':
        if (task.target_items.shelf) {
          const shelfLevels = await ShelfLevel.find({ shelf_id: task.target_items.shelf });
          const inventories = await Inventory.find({ shelf_level_id: { $in: shelfLevels.map(sl => sl._id) } })
            .populate('goods_id');
          const itemChecks = await InventoryItemCheck.find({ task_id: taskId, shelf_level_id: { $in: shelfLevels.map(sl => sl._id) } })
            .populate('goods_id');
          goodsList = inventories.map(inv => {
            const itemCheck = itemChecks.find(ic => ic.goods_id.toString() === inv.goods_id._id.toString());
            return {
              id: inv._id,
              goods_id: inv.goods_id._id,
              name: inv.goods_id.name,
              code: inv.goods_id.code,
              expectedQuantity: inv.quantity_remain,
              actualQuantity: itemCheck ? itemCheck.actual_quantity : null,
              status: itemCheck ? itemCheck.status : 'Chưa kiểm',
              location: inv.shelf_level_id?.level_code,
              is_checked: inv.is_checked,
            };
          });
        }
        break;

      case 'Theo tầng':
        if (task.target_items.shelf_level) {
          const inventories = await Inventory.find({ shelf_level_id: task.target_items.shelf_level })
            .populate('goods_id');
          const itemChecks = await InventoryItemCheck.find({ task_id: taskId, shelf_level_id: task.target_items.shelf_level })
            .populate('goods_id');
          goodsList = inventories.map(inv => {
            const itemCheck = itemChecks.find(ic => ic.goods_id.toString() === inv.goods_id._id.toString());
            return {
              id: inv._id,
              goods_id: inv.goods_id._id,
              name: inv.goods_id.name,
              code: inv.goods_id.code,
              expectedQuantity: inv.quantity_remain,
              actualQuantity: itemCheck ? itemCheck.actual_quantity : null,
              status: itemCheck ? itemCheck.status : 'Chưa kiểm',
              location: inv.shelf_level_id?.level_code,
              is_checked: inv.is_checked,
            };
          });
        }
        break;

      case 'Theo sản phẩm':
        if (task.target_items.goods && Array.isArray(task.target_items.goods)) {
          const inventories = await Inventory.find({ goods_id: { $in: task.target_items.goods } })
            .populate('goods_id');
          const itemChecks = await InventoryItemCheck.find({ task_id: taskId, goods_id: { $in: task.target_items.goods } })
            .populate('goods_id');
          goodsList = inventories.map(inv => {
            const itemCheck = itemChecks.find(ic => ic.goods_id.toString() === inv.goods_id._id.toString());
            return {
              id: inv._id,
              goods_id: inv.goods_id._id,
              name: inv.goods_id.name,
              code: inv.goods_id.code,
              expectedQuantity: inv.quantity_remain,
              actualQuantity: itemCheck ? itemCheck.actual_quantity : null,
              status: itemCheck ? itemCheck.status : 'Chưa kiểm',
              location: inv.shelf_level_id?.level_code,
              is_checked: inv.is_checked,
            };
          });
        }
        break;

      default:
        const inventories = await Inventory.find({ shelf_level_id: task.shelf_level_id })
          .populate('goods_id');
        const itemChecks = await InventoryItemCheck.find({ task_id: taskId, shelf_level_id: task.shelf_level_id })
          .populate('goods_id');
        goodsList = inventories.map(inv => {
          const itemCheck = itemChecks.find(ic => ic.goods_id.toString() === inv.goods_id._id.toString());
          return {
            id: inv._id,
            goods_id: inv.goods_id._id,
            name: inv.goods_id.name,
            code: inv.goods_id.code,
            expectedQuantity: inv.quantity_remain,
            actualQuantity: itemCheck ? itemCheck.actual_quantity : null,
            status: itemCheck ? itemCheck.status : 'Chưa kiểm',
            location: inv.shelf_level_id?.level_code,
            is_checked: inv.is_checked,
          };
        });
    }

    res.status(200).json({
      success: true,
      data: {
        taskId: task._id,
        check_type: task.check_type,
        status: task.status,
        note: task.note,
        goodsList,
      },
      message: 'Danh sách sản phẩm của nhiệm vụ kiểm kho được tải thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách sản phẩm của nhiệm vụ kiểm kho', error: error.message });
  }
};