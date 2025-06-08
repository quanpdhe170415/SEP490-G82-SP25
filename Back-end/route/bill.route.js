const Router = require('express').Router();
const { billController } = require('../controller');

Router.get('/bills/status', billController.isBillPaid);

module.exports = Router;