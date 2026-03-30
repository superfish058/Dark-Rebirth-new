const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticateToken } = require('../middleware/auth');

// 获取今日计划
router.get('/plans/today', authenticateToken, planController.getTodayPlans);

// 获取未完成计划
router.get('/incomplete-plans', authenticateToken, planController.getIncompletePlans);

// 获取指定日期计划
router.get('/plans/date/:date', authenticateToken, planController.getPlansByDate);

// 获取指定周计划
router.get('/plans/week/:startDate', authenticateToken, planController.getPlansByWeek);

// 创建计划
router.post('/plans', authenticateToken, planController.createPlan);

// 更新计划
router.put('/plans/:id', authenticateToken, planController.updatePlan);

// 删除计划
router.delete('/plans/:id', authenticateToken, planController.deletePlan);

// 切换计划完成状态
router.patch('/plans/:id/complete', authenticateToken, planController.toggleComplete);

module.exports = router;