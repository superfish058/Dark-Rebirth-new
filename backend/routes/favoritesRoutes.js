const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { authenticateToken } = require('../middleware/auth');

// 获取所有收藏分类和网站
router.get('/favorites', authenticateToken, favoritesController.getFavorites);

// 创建分类
router.post('/favorites/categories', authenticateToken, favoritesController.createCategory);

// 创建网站
router.post('/favorites/websites', authenticateToken, favoritesController.createWebsite);

// 更新网站
router.put('/favorites/websites/:id', authenticateToken, favoritesController.updateWebsite);

// 删除网站
router.delete('/favorites/websites/:id', authenticateToken, favoritesController.deleteWebsite);

// 更新分类
router.put('/favorites/categories/:id', authenticateToken, favoritesController.updateCategory);

// 删除分类
router.delete('/favorites/categories/:id', authenticateToken, favoritesController.deleteCategory);

module.exports = router;