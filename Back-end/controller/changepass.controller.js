// const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Account } = require('../models'); 

exports.changePassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    try {

        const account = await Account.findOne ({ username });
        if (!account) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại trong hệ thống!' });
        }
        const isMatch = await bcrypt.compare(oldPassword, account.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không khớp!' });
        }
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(newPassword, salt);
        await account.save();


        res.status(200).json({ message: 'Mật khẩu thay đổi thành công. Vui lòng đăng nhập lại với mật khẩu mới!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};