const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

// 加载环境变量
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

function getBeijingDateTime() {
  const now = new Date();
  const beijingOffset = 8 * 60 * 60000;
  return new Date(now.getTime() + beijingOffset).toISOString().replace('T', ' ').substring(0, 19);
}

const db = new sqlite3.Database('./data/database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);


});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

app.post('/api/register', (req, res) => {
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
      const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        token, 
        user: { id: userId, username, email, avatar: null }
      });
    }
  );
});

app.post('/api/login', (req, res) => {
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
});

app.get('/api/user', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, avatar FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err || !user) {
      return res.sendStatus(404);
    }
    res.json(user);
  });
});

app.post('/api/avatar/upload', authenticateToken, upload.single('avatar'), (req, res) => {
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
});

app.get('/api/plans/today', authenticateToken, (req, res) => {
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
});

app.get('/api/incomplete-plans', authenticateToken, (req, res) => {
  db.all('SELECT * FROM plans WHERE user_id = ? AND completed = 0 ORDER BY date ASC, created_at ASC',
    [req.user.userId], (err, plans) => {
      if (err) {
        return res.status(500).json({ error: '获取未完成计划失败' });
      }
      res.json(plans);
    }
  );
});

app.get('/api/plans/date/:date', authenticateToken, (req, res) => {
  const date = req.params.date;
  
  db.all('SELECT * FROM plans WHERE user_id = ? AND date = ? ORDER BY created_at ASC',
    [req.user.userId, date], (err, plans) => {
      if (err) {
        return res.status(500).json({ error: '获取计划失败' });
      }
      res.json(plans);
    }
  );
});

app.get('/api/plans/week/:startDate', authenticateToken, (req, res) => {
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
});

app.post('/api/plans', authenticateToken, (req, res) => {
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
});

app.put('/api/plans/:id', authenticateToken, (req, res) => {
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
});

app.delete('/api/plans/:id', authenticateToken, (req, res) => {
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
});

app.patch('/api/plans/:id/complete', authenticateToken, (req, res) => {
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
});

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});