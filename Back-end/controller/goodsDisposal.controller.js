const { GoodsDisposal } = require('../models');

// Get list of all disposal records without filters
exports.getListDisposal = async (req, res) => {
  try {
    // Fetch all disposal records with optimized population
    const disposals = await GoodsDisposal.find()
      .populate({
        path: 'created_by',
        select: 'username full_name'
      })
      .populate({
        path: 'approved_by',
        select: 'username full_name'
      })
      .populate({
        path: 'confirmed_by',
        select: 'username full_name'
      })
      .populate({
        path: 'disposal_items',
        select: 'goods_id product_name batch_number unit_of_measure quantity_disposed cost_price item_disposal_reason',
        populate: {
          path: 'goods_id',
          select: 'goods_name barcode unit_of_measure'
        }
      })
      .select('disposal_number disposal_date reason_for_disposal total_disposal_value status notes createdAt updatedAt')
      .sort({ createdAt: -1 });

    // Transform data for list view (summary information)
    const transformedDisposals = disposals.map(disposal => ({
      _id: disposal._id,
      disposal_number: disposal.disposal_number,
      disposal_date: disposal.disposal_date,
      reason_for_disposal: disposal.reason_for_disposal,
      total_disposal_value: disposal.total_disposal_value,
      status: disposal.status,
      created_by: disposal.created_by,
      approved_by: disposal.approved_by,
      confirmed_by: disposal.confirmed_by,
      total_items: disposal.disposal_items.length,
      createdAt: disposal.createdAt,
      updatedAt: disposal.updatedAt,
      // Summary of disposal items for quick overview
      items_summary: disposal.disposal_items.map(item => ({
        product_name: item.product_name,
        quantity_disposed: item.quantity_disposed,
        unit_of_measure: item.unit_of_measure
      }))
    }));

    res.status(200).json({
      success: true,
      data: transformedDisposals,
      total: transformedDisposals.length
    });
  } catch (error) {
    console.error('Error fetching disposal list:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching disposal list',
      error: error.message,
    });
  }
};

// Get details of a specific disposal record
exports.getDetailDisposal = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid disposal ID format',
      });
    }

    // Fetch disposal record with complete populated fields
    const disposal = await GoodsDisposal.findById(id)
      .populate({
        path: 'created_by',
        select: 'username full_name email phone_number'
      })
      .populate({
        path: 'approved_by',
        select: 'username full_name email phone_number'
      })
      .populate({
        path: 'confirmed_by',
        select: 'username full_name email phone_number'
      })
      .populate({
        path: 'disposal_items',
        populate: [
          {
            path: 'goods_id',
            select: 'goods_name barcode unit_of_measure selling_price image_url'
          },
          {
            path: 'import_batch_number',
            select: 'import_receipt_number import_date supplier'
          },
          {
            path: 'import_detail_id',
            select: 'expiry_date manufacturing_batch_number manufacturing_date'
          }
        ]
      });

    // Check if disposal exists
    if (!disposal) {
      return res.status(404).json({
        success: false,
        message: 'Disposal record not found',
      });
    }

    // Transform disposal items for better readability
    const transformedDisposal = {
      ...disposal.toObject(),
      disposal_items: disposal.disposal_items.map(item => ({
        disposal_item_id: item._id,
        // Consolidated product information
        product_info: {
          goods_id: item.goods_id._id,
          goods_name: item.goods_name,
          barcode: item.goods_id.barcode,
          unit_of_measure: item.goods_id.unit_of_measure,
          selling_price: item.goods_id.selling_price,
          image_url: item.goods_id.image_url,
          expiry_date: item.import_detail_id.expiry_date,
          manufacturing_batch_number: item.import_detail_id.manufacturing_batch_number,
          manufacturing_date: item.import_detail_id.manufacturing_date,
          import_receipt_number: item.import_batch_number.import_receipt_number,
          import_date: item.import_batch_number.import_date,
          supplier: item.import_batch_number.supplier
        },
        // Disposal item details
        product_name: item.product_name,
        batch_number: item.batch_number,
        unit_of_measure: item.unit_of_measure,
        quantity_disposed: item.quantity_disposed,
        cost_price: item.cost_price,
        item_disposal_reason: item.item_disposal_reason,
        item_images: item.item_images,
        // Calculated fields
        disposal_value: item.quantity_disposed * item.cost_price
      }))
    };

    res.status(200).json({
      success: true,
      data: transformedDisposal
    });
  } catch (error) {
    console.error('Error fetching disposal details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching disposal details',
      error: error.message,
    });
  }
};