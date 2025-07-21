
const {ReceivingTask, PurchaseOrder, Supplier, Goods} = require('../models'); 
const mongoose = require('mongoose');
/**
 * @desc     Lấy danh sách công việc nhận hàng được giao cho người dùng hiện tại, bao gồm tổng số lượng dự kiến và đã nhận.
 * @route    POST /api/receive (Dựa theo code React của bạn)
 * @access   Private
 */
exports.getAssignedTasks = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(`Yêu cầu lấy công việc nhận hàng cho người dùng: ${userId}`);
        
        if (!userId) {
            return res.status(401).json({ message: 'Không được phép, vui lòng đăng nhập lại.' });
        }

        // Chuyển đổi userId string thành ObjectId để query trong aggregation
        let userObjectId;
        try {
            userObjectId = new mongoose.Types.ObjectId(userId);
            console.log(`Đang lấy công việc cho người dùng: ${userObjectId}`);
            
        } catch (e) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
        }

        const tasks = await ReceivingTask.aggregate([
            // Bước 1: Lọc các công việc được giao cho user hiện tại
            {
                $match: { assigned_to: userObjectId }
            },
            // Bước 2: Join với collection 'purchaseorders' để lấy thông tin đơn hàng
            {
                $lookup: {
                    from: 'purchaseorders',
                    localField: 'purchase_order',
                    foreignField: '_id',
                    as: 'purchase_order_info'
                }
            },
            {
                $unwind: {
                    path: '$purchase_order_info',
                    preserveNullAndEmptyArrays: true // Giữ lại task nếu PO bị xóa
                }
            },
            // Bước 3: Join với collection 'suppliers' để lấy tên nhà cung cấp
            {
                $lookup: {
                    from: 'suppliers',
                    localField: 'purchase_order_info.supplier',
                    foreignField: '_id',
                    as: 'supplier_info'
                }
            },
            {
                $unwind: {
                    path: '$supplier_info',
                    preserveNullAndEmptyArrays: true // Giữ lại task nếu supplier bị xóa
                }
            },
            // Bước 4: Join với 'importbatches' để tìm lô hàng tương ứng
            {
                $lookup: {
                    from: 'importbatches',
                    localField: '_id', // _id của ReceivingTask
                    foreignField: 'receiving_task_id',
                    as: 'import_batch_info'
                }
            },
            {
                // Một task chỉ có 0 hoặc 1 batch, unwind để dễ truy cập
                $unwind: {
                    path: '$import_batch_info',
                    preserveNullAndEmptyArrays: true // Quan trọng: Giữ lại task chưa bắt đầu nhận hàng
                }
            },
            // Bước 5: Join với 'importdetails' để lấy chi tiết số lượng đã nhận
            {
                $lookup: {
                    from: 'importdetails',
                    localField: 'import_batch_info._id', // _id của ImportBatch
                    foreignField: 'import_batch_id',
                    as: 'import_details'
                }
            },
            // Bước 6: Tính toán và định dạng lại dữ liệu đầu ra
            {
                $project: {
                    _id: 1,
                    task_name: 1,
                    task_code: 1,
                    status: 1,
                    expected_date: 1,
                    createdAt: 1,
                    // Giữ cấu trúc lồng nhau để tương thích với frontend hiện tại
                    purchase_order: {
                        _id: '$purchase_order_info._id',
                        po_code: '$purchase_order_info.po_code',
                        supplier: {
                            _id: '$supplier_info._id',
                            suplier_name: '$supplier_info.suplier_name'
                        }
                    },
                    // Tính tổng số lượng dự kiến từ mảng expected_items
                    total_quantity_expected: { $sum: '$expected_items.quantity_expected' },
                    // Tính tổng số lượng đã nhận, nếu chưa có thì là 0
                    total_quantity_received: { $ifNull: [{ $sum: '$import_details.quantity_received' }, 0] }
                }
            },
            // Bước 7: Sắp xếp theo ngày tạo mới nhất
            {
                $sort: { createdAt: -1 }
            }
        ]);

        if (!tasks || tasks.length === 0) {
            return res.status(200).json({ message: 'Bạn không có công việc nhận hàng nào được giao.', data: [] });
        }

        res.status(200).json({
            message: `Tìm thấy ${tasks.length} công việc.`,
            data: tasks
        });

    } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * @desc    Lấy chi tiết một công việc nhận hàng
 * @route   GET /api/receiving-tasks/:id
 * @access  Private
 */
exports.getTaskDetails = async (req, res) => {
    try {
        const taskId = req.params.id;

         const task = await ReceivingTask.findById(taskId)
            .populate({
                path: 'purchase_order',
                select: 'po_code',
                populate: {
                    path: 'supplier',
                    select: 'suplier_name contact_person phone_number address'
                }
            })
            
            .populate({
                path: 'expected_items.product', 
                select: 'goods_name unit_of_measure barcode' 
            })
            .populate('assigned_to', 'email'); 

        if (!task) {
            return res.status(404).json({ message: 'Không tìm thấy công việc này.' });
        }

        // Kiểm tra xem người dùng có quyền xem task này không (tùy chọn)
        // Ví dụ: chỉ người được giao hoặc admin mới được xem
        // if (task.assigned_to._id.toString() !== req.user.id && req.user.role !== 'Admin') {
        //     return res.status(403).json({ message: 'Bạn không có quyền xem công việc này.' });
        // }

        res.status(200).json({
            message: 'Lấy chi tiết công việc thành công.',
            data: task
        });

    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết công việc ${req.params.id}:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};