const express = require('express');
const { saveUser, getUser, deleteUser, updateUser } = require('../controller/user.controller');
const { validateAuth } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', saveUser);
router.get('/', validateAuth, getUser);
router.put('/', validateAuth, updateUser);
router.delete('/', validateAuth, deleteUser);

module.exports = router;