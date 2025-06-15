exports.createReturnOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bill_id, return_reason, items, created_by } = req.body;

    const total_refund = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    const returnOrder = await ReturnOrder.create(
      [{ bill_id, return_reason, total_refund, created_by }],
      { session }
    );

    const returnDetails = items.map((item) => ({
      return_order_id: returnOrder[0]._id,
      goods_id: item.goods_id,
      goods_name: item.goods_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_refund: item.quantity * item.unit_price,
    }));

    await ReturnDetail.insertMany(returnDetails, { session });

    for (const item of items) {
      await Goods.findByIdAndUpdate(
        item.goods_id,
        {
          $inc: { stock_quantity: item.quantity },
        },
        { session }
      );
    }

    await Bill.findByIdAndUpdate(
      bill_id,
      {
        statusId:
          "684e681169eef140a496f7cb" /* ID của trạng thái "Đã trả hàng" */,
      },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ message: "Trả hàng thành công" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Lỗi khi trả hàng", error: err });
  } finally {
    session.endSession();
  }
};
