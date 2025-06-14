const mongoose = require('mongoose');
require('dotenv').config();

const db = require('../models');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: process.env.DB_NAME
        });
        console.log('MongoDB connected successfully');

        // Đảm bảo các collection được tạo ra
        await Promise.all([
            db.Account.createCollection(),
            db.Role.createCollection(),
            db.Good.createCollection(),
            db.ImportBatch.createCollection(),
            db.ImportDetail.createCollection(),
            db.Permission.createCollection(),
            db.Category.createCollection(),
            db.Stockmovement.createCollection(),
            db.Shift.createCollection(),
            db.CashDenomination.createCollection(),
            db.Bill.createCollection(),
            db.Status.createCollection(),
            db.BillDetail.createCollection(),
        ]);
        console.log('All collections ensured!');

        // Seed dữ liệu cho Category nếu chưa có
        const categoryCount = await db.Category.countDocuments();
        let categories = [];
        if (categoryCount === 0) {
            categories = await db.Category.insertMany([
                { category_name: 'Đồ uống', description: 'Các loại nước giải khát' },
                { category_name: 'Thực phẩm', description: 'Đồ ăn nhanh, snack' }
            ]);
            console.log('Seeded categories!');
        } else {
            categories = await db.Category.find();
        }

        // Seed dữ liệu cho Goods nếu chưa có
        const goodsCount = await db.Good.countDocuments();
        if (goodsCount === 0 && categories.length > 0) {
            await db.Good.insertMany([
                {
                    goods_name: 'Coca Cola',
                    barcode: '8931234567890',
                    unit_of_measure: 'chai',
                    description: 'Nước ngọt có ga',
                    category_id: categories[0]._id,
                    selling_price: 10000,
                    average_import_price: 8000,
                    last_import_price: 8500,
                    last_import_date: new Date(),
                    stock_quantity: 100,
                    display_quantity: 20,
                    minimum_stock_quantity: 10,
                    is_active: true,
                    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Coca_Cola_Flasche_-_Original_Taste.jpg/1200px-Coca_Cola_Flasche_-_Original_Taste.jpg'
                },
                {
                    goods_name: 'Snack Oishi',
                    barcode: '8930987654321',
                    unit_of_measure: 'gói',
                    description: 'Snack vị tôm cay',
                    category_id: categories[1]._id,
                    selling_price: 12000,
                    average_import_price: 9000,
                    last_import_price: 9500,
                    last_import_date: new Date(),
                    stock_quantity: 50,
                    display_quantity: 10,
                    minimum_stock_quantity: 5,
                    is_active: true,
                    image_url: 'https://product.hstatic.net/200000495609/product/snack-tom-cay-oishi-du-vi-goi-lon-68g-banh-keo-an-vat-imnuts_d3ff6a241a9e4bb28aea097f9eca7166.jpg'
                }
            ]);
            console.log('Seeded goods!');
        }

    } catch (error) {
        console.error("MongoDB connection failed: ", error);
        process.exit(1);
    }
};

module.exports = connectDB;