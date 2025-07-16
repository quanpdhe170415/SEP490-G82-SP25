const mongoose = require('mongoose');
const { PurchaseOrder, Supplier, ImportBatch, ImportDetail } = require('../models');

// Get list of purchase orders assigned to the logged-in employee
exports.getAssignedPurchaseOrders = async (req, res) => {
    try {
        // Lấy userId từ body
        const { userId } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Chưa xác thực người dùng.' });
        }
        // console.log('User ID:', userId);
        
        // Bước 1: Tìm tất cả các PO được giao 
        const purchaseOrders = await PurchaseOrder.find({ assigned_to: userId })
            .populate('supplier_id', 'suplier_name')
            .sort({ createdAt: -1 })
            .lean();

        if (!purchaseOrders.length) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Bước 2: Định dạng lại dữ liệu và tính toán tiến độ cho mỗi PO
        const formattedPOsPromises = purchaseOrders.map(async (po) => {
            const totalQuantityOrdered = po.items.reduce((sum, item) => sum + item.quantity_order, 0);
            // Tìm tất cả lô nhập thuộc PO 
            const importBatches = await ImportBatch.find({ purchase_order_id: po._id }).lean();
            const batchIds = importBatches.map(b => b._id);

            let totalQuantityReceived = 0;
            if (batchIds.length > 0) {
                const result = await ImportDetail.aggregate([
                    { $match: { import_batch_id: { $in: batchIds } } },
                    { $group: { _id: null, total: { $sum: "$quantity_imported" } } }
                ]);
                totalQuantityReceived = result.length > 0 ? result[0].total : 0;
            }

            let status = 'pending_receipt'; // Trạng thái mặc định
            if (po.receiving_status === 'completed') {
                status = 'completed';
            } else if (totalQuantityReceived > 0) {
                if (totalQuantityReceived < totalQuantityOrdered) {
                    status = 'partially_received';
                } else if (totalQuantityReceived === totalQuantityOrdered) {
                    status = 'fully_received';
                } else {
                    status = 'over_received';
                }
            }
            
            return {
                _id: po._id,
                order_number: po.order_number,
                supplier_name: po.supplier_id ? po.supplier_id.suplier_name : 'N/A',
                delivery_progress: importBatches.length,
                total_quantity_ordered: totalQuantityOrdered,
                total_quantity_received: totalQuantityReceived,
                status: status,
                expected_delivery_date: po.expected_delivery_date,
                is_pinned: po.is_pinned || false,
                total_expected_delivery: po.total_expected_batches || 0,
            };
        });

        const formattedPOs = await Promise.all(formattedPOsPromises);
        res.status(200).json({ success: true, data: formattedPOs });

    } catch (error) {
        console.error('Lỗi khi lấy danh sách phiếu nhập được giao:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi lấy danh sách phiếu nhập.'
        });
    }
};


/**
 * @description Controller để lấy thông tin chi tiết của một Đơn đặt hàng (PO).
 * @route GET /api/purchase-order/:id
 * @access Private
 */
exports.getPurchaseOrderDetail = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID của đơn đặt hàng không hợp lệ." });
        }

        // Bước 1: Lấy thông tin gốc của PO và populate thêm tên hàng hóa
        const poDetail = await PurchaseOrder.findById(id)
            .populate('supplier_id')
            .populate('created_by', 'fullName email')
            .populate('assigned_to', 'fullName email')
            // THÊM POPULATE NÀY để lấy tên sản phẩm từ đơn hàng gốc
            .populate({
                path: 'items.goods_id',
                select: 'goods_name' 
            })
            .lean();

        if (!poDetail) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt hàng." });
        }

        // Bước 2: Lấy lịch sử các đợt nhập hàng
        const importBatches = await ImportBatch.find({ purchase_order_id: id })
            .populate('imported_by', 'fullName email')
            .sort({ import_date: -1 })
            .lean();
            
        // Bước 3: Lấy chi tiết hàng hóa trong mỗi đợt nhập
        const detailedImportBatchesPromises = importBatches.map(async (batch) => {
            const details = await ImportDetail.find({ import_batch_id: batch._id })
                .populate('goods_id', 'goods_name goods_code')
                .lean();
            return { ...batch, items_imported: details };
        });

        const detailedImportBatches = await Promise.all(detailedImportBatchesPromises);

        // Bước 4: Trả về kết quả cuối cùng
        res.status(200).json({
            success: true,
            data: {
                purchase_order: poDetail,
                import_history: detailedImportBatches
            }
        });

    } catch (error) {
        console.error("Lỗi khi lấy chi tiết phiếu nhập:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ khi lấy chi tiết phiếu nhập." });
    }
};
/**
 * @description Controller để lấy tất cả các lô hàng nhập (Import Batches) của một PO cụ thể.
 * @route GET /api/purchase-orders/:id/batches
 * @access Private
 */
exports.getPurchaseOrderImportBatches = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID của đơn đặt hàng không hợp lệ." });
        }

        // Kiểm tra xem PO có tồn tại không
        const purchaseOrder = await PurchaseOrder.findById(id);
        if (!purchaseOrder) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt hàng." });
        }

        // Lấy tất cả các lô nhập hàng của PO này
        const importBatches = await ImportBatch.find({ purchase_order_id: id })
            .populate('imported_by', 'fullName email')
            .sort({ import_date: -1 })
            .lean();

        if (!importBatches.length) {
            return res.status(200).json({ success: true, message: "Đơn hàng này chưa có đợt nhập hàng nào.", data: [] });
        }

        res.status(200).json({ success: true, data: importBatches });

    } catch (error) {
        console.error("Lỗi khi lấy các lô nhập hàng của PO:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ khi lấy dữ liệu các lô nhập hàng." });
    }
};

/**
 * @description Controller để ghim hoặc bỏ ghim một Đơn đặt hàng (PO).
 * @route PATCH /api/purchase-order/:id/pin
 * @access Private
 */
exports.togglePurchaseOrderPin = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log("Toggle pin for PO ID:", id);
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID của đơn đặt hàng không hợp lệ." });
        }

        const purchaseOrder = await PurchaseOrder.findById(id);
        if (!purchaseOrder) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt hàng." });
        }

        // Đảo ngược trạng thái is_pinned
        purchaseOrder.is_pinned = !purchaseOrder.is_pinned;
        await purchaseOrder.save();

        res.status(200).json({
            success: true,
            message: `Đơn hàng đã được ${purchaseOrder.is_pinned ? 'ghim' : 'bỏ ghim'}.`,
            data: { is_pinned: purchaseOrder.is_pinned }
        });

    } catch (error) {
        console.error("Lỗi khi ghim/bỏ ghim PO:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ khi cập nhật trạng thái ghim." });
    }
};
