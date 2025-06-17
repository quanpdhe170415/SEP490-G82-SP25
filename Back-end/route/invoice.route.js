const express = require('express');
const router = express.Router();
const controller = require('../controller');

router.post('/export-invoice', controller.invoiceController.exportInvoice);

module.exports = router;

