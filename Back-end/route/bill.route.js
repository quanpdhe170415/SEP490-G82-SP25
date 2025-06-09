const Router = require('express').Router();
const { billController } = require('../controller');

Router.get('/checkStatus', billController.isBillPaid);

module.exports = Router;