const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

// các route liên quan đến authen
// router.post('/login', controller.authenController.login);
// router.post('/google-login', controller.authenController.googleLogin);
// router.post("/register", controller.authenController.register);
// router.get("/verify-email", controller.authenController.verifyEmail);
router.post('/reset-password', controller.authenController.resetPassword);
// router.post('/change-password', controller.authenController.changePassword);

// router.post('/logout', controller.authenController.logout);

// các route liên quan đến otp
// router.post('/send-otp', controller.otpController.sendOTP);
// router.post('/verify-otp', controller.otpController.verifyOTP);

module.exports = router;