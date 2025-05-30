const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.post('/logout', controller.authenController.logout);