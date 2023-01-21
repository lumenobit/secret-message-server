const express = require('express');
const router = express.Router();

const userRoute = require('./route/user.route');
const messageRoute = require('./route/message.route');
const authRoute = require('./route/auth.route');

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/message', messageRoute);

module.exports = router;
