const ExportRequest = require('../models/exportRequest');

exports.createExportRequest = async (req, res) => {
  try {
        const { goods, created_by, note } = req.body;
        // goods: [{ goods_id, quantity, unit_of_measure }]
        if (!goods || !Array.isArray(goods) || goods.length === 0) {
            return res.status(400).json({ error: "Danh sách hàng hóa không hợp lệ" });
        }
        for (const item of goods) {
            if (!item.goods_id || !item.quantity || !item.unit_of_measure) {
                return res.status(400).json({ error: "Thiếu thông tin hàng hóa" });
            }
        }
        const request = await ExportRequest.create({ goods, created_by, note });
        res.status(201).json(request);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}