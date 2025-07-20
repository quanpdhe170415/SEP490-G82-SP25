
const {ReceivingTask, PurchaseOrder, Supplier, Goods} = require('../models'); 

/**
 * @desc    Lấy danh sách công việc nhận hàng được giao cho người dùng hiện tại
 * @route   GET /api/receiving-tasks
 * @access  Private
 */
exports.getAssignedTasks = async (req, res) => {
    try {
        // Giả định rằng middleware xác thực đã thêm thông tin user vào req.user
        // và req.user.id chứa _id của Account đang đăng nhập.
        const { userId } = req.body; 

        if (!userId) {
            return res.status(401).json({ message: 'Không được phép, vui lòng đăng nhập lại.' });
        }

        const tasks = await ReceivingTask.find({ assigned_to: userId })
            .populate({
                path: 'purchase_order',
                select: 'po_code supplier', // Lấy mã PO và ID nhà cung cấp
                populate: {
                    path: 'supplier',
                    select: 'suplier_name' // Lấy tên nhà cung cấp từ PO
                }
            })
            .select('task_code status expected_date createdAt') // Chọn các trường cần thiết cho danh sách
            .sort({ createdAt: -1 }); // Sắp xếp công việc mới nhất lên đầu

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