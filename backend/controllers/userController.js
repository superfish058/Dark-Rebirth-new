const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function getBeijingDateTime() {
  const now = new Date();
  const beijingOffset = 8 * 60 * 60000;
  return new Date(now.getTime() + beijingOffset).toISOString().replace('T', ' ').substring(0, 19);
}

// 注册
const register = (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: '所有字段都是必填的' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const beijingTime = getBeijingDateTime();
  
  db.run('INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, beijingTime],
    function(err) {
      if (err) {
        return res.status(400).json({ error: '用户名或邮箱已存在' });
      }
      
      const userId = this.lastID;
      const token = jwt.sign({ userId: userId, username: username }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        token, 
        user: { id: userId, username, email, avatar: null }
      });
    }
  );
};

// 登录
const login = (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar }
    });
  });
};

// 获取用户信息
const getUser = (req, res) => {
  db.get('SELECT id, username, email, avatar FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err || !user) {
      return res.sendStatus(404);
    }
    res.json(user);
  });
};

// 上传头像
const uploadAvatar = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择要上传的图片' });
  }
  
  const avatarPath = `/uploads/${req.file.filename}`;
  
  db.run('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, req.user.userId], (err) => {
    if (err) {
      return res.status(500).json({ error: '更新头像失败' });
    }
    res.json({ avatar: avatarPath });
  });
};

module.exports = {
  register,
  login,
  getUser,
  uploadAvatar
};