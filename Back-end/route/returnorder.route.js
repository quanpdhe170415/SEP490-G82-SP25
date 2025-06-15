const express = require("express");
const router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.returnOrderController.createReturnOrder);

module.exports = router;
