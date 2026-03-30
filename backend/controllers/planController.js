const db = require('../models/db');

function getBeijingDateTime() {
  const now = new Date();
  const beijingOffset = 8 * 60 * 60000;
  return new Date(now.getTime() + beijingOffset).toISOString().replace('T', ' ').substring(0, 19);
}

// 获取今日计划
const getTodayPlans = (req, res) => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  
  db.all('SELECT * FROM plans WHERE user_id = ? AND date = ? ORDER BY created_at ASC',
    [req.user.userId, localDate], (err, plans) => {
      if (err) {
        return res.status(500).json({ error: '获取计划失败' });
      }
      res.json(plans);
    }
  );
};

// 获取未完成计划
const getIncompletePlans = (req, res) => {
  db.all('SELECT * FROM plans WHERE user_id = ? AND completed = 0 ORDER BY date ASC, created_at ASC',
    [req.user.userId], (err, plans) => {
      if (err) {
        return res.status(500).json({ error: '获取未完成计划失败' });
      }
      res.json(plans);
    }
  );
};

// 获取指定日期计划
const getPlansByDate = (req, res) => {
  const date = req.params.date;
  
  db.all('SELECT * FROM plans WHERE user_id = ? AND date = ? ORDER BY created_at ASC',
    [req.user.userId, date], (err, plans) => {
      if (err) {
        return res.status(500).json({ error: '获取计划失败' });
      }
      res.json(plans);
    }
  );
};

// 获取指定周计划
const getPlansByWeek = (req, res) => {
  const startDate = req.params.startDate;
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const endDate = end.toISOString().split('T')[0];
  
  db.all('SELECT * FROM plans WHERE user_id = ? AND date >= ? AND date <= ? ORDER BY date ASC, created_at ASC',
    [req.user.userId, startDate, endDate], (err, plans) => {
      if (err) {
        return res.status(500).json({ error: '获取计划失败' });
      }
      res.json(plans);
    }
  );
};

// 创建计划
const createPlan = (req, res) => {
  const { content, date } = req.body;
  const now = new Date();
  const localDate = date || new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const beijingTime = getBeijingDateTime();
  
  db.run('INSERT INTO plans (user_id, content, date, created_at) VALUES (?, ?, ?, ?)',
    [req.user.userId, content, localDate, beijingTime],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '创建计划失败' });
      }
      res.json({ id: this.lastID, content, completed: 0, date: localDate, created_at: beijingTime });
    }
  );
};

// 更新计划
const updatePlan = (req, res) => {
  const { content } = req.body;
  const planId = req.params.id;
  
  db.run('UPDATE plans SET content = ? WHERE id = ? AND user_id = ?',
    [content, planId, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '更新计划失败' });
      }
      if (this.changes === 0) {
        return res.sendStatus(404);
      }
      res.json({ id: planId, content });
    }
  );
};

// 删除计划
const deletePlan = (req, res) => {
  const planId = req.params.id;
  
  db.run('DELETE FROM plans WHERE id = ? AND user_id = ?',
    [planId, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '删除计划失败' });
      }
      if (this.changes === 0) {
        return res.sendStatus(404);
      }
      res.sendStatus(204);
    }
  );
};

// 切换计划完成状态
const toggleComplete = (req, res) => {
  const { completed } = req.body;
  const planId = req.params.id;
  
  db.run('UPDATE plans SET completed = ? WHERE id = ? AND user_id = ?',
    [completed ? 1 : 0, planId, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '更新计划状态失败' });
      }
      if (this.changes === 0) {
        return res.sendStatus(404);
      }
      res.json({ id: planId, completed: completed ? 1 : 0 });
    }
  );
};

module.exports = {
  getTodayPlans,
  getIncompletePlans,
  getPlansByDate,
  getPlansByWeek,
  createPlan,
  updatePlan,
  deletePlan,
  toggleComplete
};