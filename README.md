# 每日计划记录器

一个采用手绘风格设计的日常任务管理全栈 Web 应用。

## ✨ 功能特性

- 用户注册与登录
- 头像上传功能
- 当日计划记录（添加、编辑、删除、标记完成）
- 温暖治愈的手绘风格界面
- 响应式设计，适配多设备
- 温暖春日配色方案

## 🛠️ 技术栈

### 后端
- Node.js
- Express
- SQLite3
- bcryptjs（密码加密）
- jsonwebtoken（JWT 认证）
- multer（文件上传）
- cors（跨域支持）

### 前端
- Vue 3
- Vite
- Vue Router
- Pinia
- Axios

## 🚀 快速开始

### 前置要求
- Node.js 16 或更高版本
- npm 或 yarn

### 安装与运行

#### 1. 启动后端服务
```bash
cd backend
npm install
npm start
```
后端服务将在 http://localhost:3000 运行

#### 2. 启动前端开发服务器
```bash
cd frontend
npm install
npm run dev
```
前端开发服务器将在 http://localhost:5173 运行

### 构建生产版本
```bash
cd frontend
npm run build
```

## 📁 项目结构

```
Dark Rebirth/
├── backend/              # 后端项目
│   ├── server.js         # Express 服务器
│   ├── package.json
│   ├── uploads/          # 头像上传目录
│   └── database.sqlite   # SQLite 数据库（自动生成）
├── frontend/             # 前端项目
│   ├── src/
│   │   ├── views/        # 页面组件
│   │   ├── components/   # 通用组件
│   │   ├── stores/       # Pinia 状态管理
│   │   ├── router/       # 路由配置
│   │   ├── styles/       # 全局样式
│   │   ├── App.vue       # 根组件
│   │   └── main.js       # 应用入口
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── .trae/specs/          # 项目规格文档
```

## 🎨 设计特色

### 配色方案
采用**温暖春日**配色方案：
- 主色：柔和橙红 (#FF8B6A)
- 辅助色：薄荷绿 (#7DD3A4)
- 强调色：温暖黄 (#FFD97D)
- 背景：米白底 (#FFF8F0)

### 手绘风格
- 不规则圆角边框
- 纸张纹理背景
- 卡片轻微旋转效果
- 柔和的阴影

## 📝 API 接口

### 认证接口
- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录
- `GET /api/user` - 获取当前用户信息

### 头像接口
- `POST /api/avatar/upload` - 上传头像

### 计划接口
- `GET /api/plans/today` - 获取当日计划
- `POST /api/plans` - 创建计划
- `PUT /api/plans/:id` - 更新计划
- `DELETE /api/plans/:id` - 删除计划
- `PATCH /api/plans/:id/complete` - 标记完成状态

## 🔐 安全说明

- 密码使用 bcrypt 加密存储
- JWT token 认证，有效期 7 天
- 头像上传限制文件类型和大小（最大 5MB）

## 📄 许可证

MIT License
