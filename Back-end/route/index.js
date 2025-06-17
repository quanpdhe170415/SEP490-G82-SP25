const express = require("express");
const router = express.Router();
const authenRouter = require('./authen.route');
const billRoute = require('./bill.route');
const productRouter = require('./product.route');
const shiftRouter = require('./shift.route');
const paymentRouter = require('./pay.route');
const returnOrderRoute = require("./returnorder.route");
const goodsDisposalRoute = require('./goodsDisposal.route');
const goodsRoute = require("./goods.route");
const importController = require("./import.route");


router.use("/product", productRouter);
router.use("/goods", goodsRoute);
router.use("/auth", authenRouter);
router.use("/shift", shiftRouter);
router.use("/payment", paymentRouter);
router.use("/invoice", require("./invoice.route"));
router.use("/bill", billRoute);
router.use("/return", returnOrderRoute);
router.use("/goods-disposal", goodsDisposalRoute);
router.use("/import", importController);

module.exports = router;
