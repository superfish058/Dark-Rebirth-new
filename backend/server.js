const express = require('express');
const cors = require('cors');
const path = require('path');

// 加载环境变量
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// 导入路由
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const journalRoutes = require('./routes/journalRoutes');

// 注册路由
app.use('/api', userRoutes);
app.use('/api', planRoutes);
app.use('/api', favoritesRoutes);
app.use('/api/journal', journalRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});