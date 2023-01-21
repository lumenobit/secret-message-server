const express = require('express');
const { attemptLogin, forgotPassword, resetPassword } = require('../controller/auth.controller');
const router = express.Router();

router.post('/login', attemptLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
