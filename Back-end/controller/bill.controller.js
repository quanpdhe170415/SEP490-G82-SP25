
const {Bill} = require('../models');

//Check bill status for Bank Transfer payment
exports.isBillPaid = async (req, res) => {
    try {
        const { bill_id } = req.body;

        if (!bill_id) {
            return res.status(400).json({
                success: false,
                message: 'Bill ID is required'
            });
        }

        const bill = await Bill.findOne({ 
            _id: bill_id,
            payment_method: 'transfer' 
        });
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found or not a Bank Transfer payment'
            });
        }

        const isPaid = bill.payment_status === 'paid';

        return res.status(200).json({
            success: true,
            bill_id: bill._id,
            is_paid: isPaid
        });

    } catch (error) {
        console.error('Error checking if bill is paid:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

