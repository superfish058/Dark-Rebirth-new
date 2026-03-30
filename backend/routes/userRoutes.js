const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// 注册
router.post('/register', userController.register);

// 登录
router.post('/login', userController.login);

// 获取用户信息
router.get('/user', authenticateToken, userController.getUser);

// 上传头像
router.post('/avatar/upload', authenticateToken, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;