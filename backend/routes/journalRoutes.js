const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { authenticateToken } = require('../middleware/auth');

// 应用认证中间件
router.use(authenticateToken);

// 分类相关路由
router.get('/categories', journalController.getJournalCategories);
router.post('/categories', journalController.createJournalCategory);
router.put('/categories/reorder', journalController.updateCategoryOrder);
router.put('/categories/:id', journalController.updateJournalCategory);
router.delete('/categories/:id', journalController.deleteJournalCategory);

// 笔记相关路由
router.get('/notes', journalController.getJournalNotes);
router.get('/notes/:id', journalController.getJournalNote);
router.post('/notes', journalController.createJournalNote);
router.put('/notes/:id', journalController.updateJournalNote);
router.delete('/notes/:id', journalController.deleteJournalNote);

module.exports = router;