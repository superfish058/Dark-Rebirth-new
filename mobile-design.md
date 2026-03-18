# Dark Rebirth 移动端界面设计方案

## 1. 整体布局

### 1.1 布局结构
```
┌────────────────────────────────────────┐
│  内容区域                              │
│  (可滚动)                              │
│                                        │
│                                        │
│                                        │
├────────────────────────────────────────┤
│  底部TabBar (50px)                    │
│  ┌──────┬──────┬──────┐              │
│  │ 首页 │ 应用 │ 我的 │              │
│  └──────┴──────┴──────┘              │
└────────────────────────────────────────┘
```

### 1.2 布局规格

| 元素 | 宽度 | 高度 | 背景 | 说明 |
|------|------|------|------|------|
| 内容区域 | 100% | calc(100vh - 50px) | #0F0F23 | 可滚动 |
| 底部TabBar | 100% | 50px | #1A1A2E | 固定底部 |
| 安全区域 | 100% | safe-area-inset-bottom | - | 适配刘海屏 |

---

## 2. 底部TabBar (TabBar)

### 2.1 视觉设计

#### 布局
```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│                                        │
│  内容区域                              │
│                                        │
│                                        │
├────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐  │
│  │   🏠   │  │   📱   │  │   👤   │  │
│  │  首页   │  │  应用   │  │  我的   │  │
│  └────────┘  └────────┘  └────────┘  │
└────────────────────────────────────────┘
     选中        默认        默认
```

#### 样式规格
```scss
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 1000;
}

.tab-item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #707080;

  &:active {
    background: rgba(255, 255, 255, 0.05);
  }

  &.active {
    color: #8B5CF6;
  }
}

.tab-icon {
  width: 24px;
  height: 24px;
  font-size: 22px;
  transition: transform 0.2s ease;

  .tab-item.active & {
    transform: scale(1.1);
  }
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3px;
}
```

### 2.2 Tab项配置

| Tab | 图标 | 标签 | 路由 |
|-----|------|------|------|
| 首页 | 🏠 | 首页 | /m/home |
| 应用 | 📱 | 应用 | /m/apps |
| 我的 | 👤 | 我的 | /m/profile |

---

## 3. 移动端首页 (MobileHome)

### 3.1 页面布局

#### 整体结构
```
┌────────────────────────────────────────┐
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │         轮播图区域                │  │
│  │      (Carousel Component)        │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  待办通知                              │
│  ┌──────────────────────────────────┐  │
│  │ 🔔 您有3条待办事项待处理          │  │
│  │    - 完成项目报告                │  │
│  │    - 回复客户邮件                │  │
│  │    - 准备会议材料                │  │
│  └──────────────────────────────────┘  │
│                                        │
│  常用应用                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ 📱 │ │ 💬 │ │ 📧 │ │ 📅 │          │
│  │应用│ │聊天│ │邮件│ │日历│          │
│  └────┘ └────┘ └────┘ └────┘          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ 📝 │ │ ⚡ │ │ 📊 │ │ 🎮 │          │
│  │笔记│ │任务│ │统计│ │游戏│          │
│  └────┘ └────┘ └────┘ └────┘          │
│                                        │
└────────────────────────────────────────┘
```

### 3.2 轮播图组件 (Carousel)

#### 视觉设计
```
┌────────────────────────────────────────┐
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │       Banner 1                   │  │
│  │   欢迎使用 Dark Rebirth          │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  ● ○ ○                               │
└────────────────────────────────────────┘
```

#### 样式规格
```scss
.carousel-container {
  position: relative;
  width: 100%;
  height: 180px;
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  background: #1E1E38;
}

.carousel-track {
  display: flex;
  transition: transform 0.3s ease;
  height: 100%;
}

.carousel-slide {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.carousel-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 4px;
}

.carousel-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.carousel-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.carousel-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;

  &.active {
    width: 18px;
    border-radius: 3px;
    background: #8B5CF6;
  }
}
```

### 3.3 待办通知组件 (TodoNotify)

#### 视觉设计
```
┌────────────────────────────────────────┐
│  🔔 待办通知                          │
│  ┌──────────────────────────────────┐  │
│  │ • 完成项目报告              今天  │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ • 回复客户邮件              明天  │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ • 准备会议材料              后天  │  │
│  └──────────────────────────────────┘  │
│  [查看全部 →]                          │
└────────────────────────────────────────┘
```

#### 样式规格
```scss
.todo-notify {
  background: #1E1E38;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.todo-notify-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.todo-notify-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
}

.todo-notify-icon {
  font-size: 18px;
}

.todo-notify-count {
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.todo-notify-link {
  font-size: 13px;
  color: #8B5CF6;
  font-weight: 500;
  text-decoration: none;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:active {
    background: rgba(255, 255, 255, 0.05);
    transform: scale(0.98);
  }
}

.todo-item-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &.checked {
    background: #8B5CF6;
    border-color: #8B5CF6;
  }
}

.todo-item-content {
  flex: 1;
  min-width: 0;
}

.todo-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-item-date {
  font-size: 12px;
  color: #707080;
}

.todo-item-urgent {
  color: #F59E0B;
}

.todo-item-overdue {
  color: #EF4444;
}
```

### 3.4 常用应用组件 (AppGrid)

#### 视觉设计
```
┌────────────────────────────────────────┐
│  常用应用                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ 📱 │ │ 💬 │ │ 📧 │ │ 📅 │          │
│  │应用│ │聊天│ │邮件│ │日历│          │
│  └────┘ └────┘ └────┘ └────┘          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ 📝 │ │ ⚡ │ │ 📊 │ │ 🎮 │          │
│  │笔记│ │任务│ │统计│ │游戏│          │
│  └────┘ └────┘ └────┘ └────┘          │
└────────────────────────────────────────┘
```

#### 样式规格
```scss
.app-grid-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
}

.section-link {
  font-size: 13px;
  color: #8B5CF6;
  font-weight: 500;
  text-decoration: none;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.app-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:active {
    background: rgba(255, 255, 255, 0.05);
    transform: scale(0.95);
  }

  &:hover {
    border-color: rgba(139, 92, 246, 0.3);
  }
}

.app-grid-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: transform 0.2s ease;

  .app-grid-item:active & {
    transform: scale(0.9);
  }
}

.app-grid-label {
  font-size: 12px;
  font-weight: 500;
  color: #A0A0B0;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## 4. 应用列表页 (AppList)

### 4.1 视觉设计

#### 列表布局
```
┌────────────────────────────────────────┐
│  应用列表                              │
├────────────────────────────────────────┤
│  ┌────┐  网页收藏                     │
│  │ 📌 │  收藏管理您喜爱的网页           │
│  └────┘  [编程AI] [生活技能]          │
├────────────────────────────────────────┤
│  ┌────┐  数据统计                     │
│  │ 📊 │  查看您的使用数据             │
│  └────┘  [数据分析] [图表展示]         │
├────────────────────────────────────────┤
│  ┌────┐  任务管理                     │
│  │ ⚡ │  高效管理您的待办事项          │
│  └────┘  [待办] [已完成]              │
├────────────────────────────────────────┤
│  ┌────┐  笔记管理                     │
│  │ 📝 │  记录您的想法和灵感           │
│  └────┘  [分类] [搜索]                │
├────────────────────────────────────────┤
│  ┌────┐  日历                         │
│  │ 📅 │  管理您的日程安排             │
│  └────┘  [日程] [提醒]                │
├────────────────────────────────────────┤
│  ┌────┐  聊天                         │
│  │ 💬 │  与朋友保持联系               │
│  └────┘  [消息] [联系人]              │
└────────────────────────────────────────┘
```

#### 样式规格
```scss
.app-list-page {
  padding: 16px;
  padding-bottom: calc(50px + env(safe-area-inset-bottom, 16px));
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #A0A0B0;
  margin: 0;
}

.app-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.app-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #1E1E38;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;

  &:active {
    background: #252542;
    transform: scale(0.98);
  }
}

.app-list-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.app-list-content {
  flex: 1;
  min-width: 0;
}

.app-list-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 4px;
}

.app-list-description {
  font-size: 13px;
  color: #A0A0B0;
  margin: 0 0 8px;
  line-height: 1.4;
}

.app-list-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.app-list-tag {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 11px;
  color: #A78BFA;
  font-size: 11px;
  font-weight: 500;
}

.app-list-arrow {
  width: 24px;
  height: 24px;
  color: #707080;
  flex-shrink: 0;
}
```

---

## 5. 个人中心页 (Profile)

### 5.1 已登录状态

#### 视觉设计
```
┌────────────────────────────────────────┐
│                                        │
│         ┌────────┐                     │
│         │  头像  │                     │
│         │  (可点击更换)                │
│         └────────┘                     │
│        用户昵称                        │
│     user@example.com                   │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 👤 个人信息                       │  │
│  │                    →             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ⚙️ 设置                          │  │
│  │                    →             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ 📋 关于                          │  │
│  │                    →             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ 🌐 官方网站                      │  │
│  │                    →             │  │
│  └──────────────────────────────────┘  │
│                                        │
│         [退出登录]                     │
│                                        │
└────────────────────────────────────────┘
```

#### 样式规格
```scss
.profile-page {
  padding: 16px;
  padding-bottom: calc(50px + env(safe-area-inset-bottom, 16px));
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%);
  border-radius: 20px;
  margin-bottom: 24px;
}

.profile-avatar-container {
  position: relative;
  margin-bottom: 16px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: white;
  border: 3px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}

.profile-avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #8B5CF6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  border: 2px solid #0F0F23;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 4px;
}

.profile-email {
  font-size: 14px;
  color: #A0A0B0;
  margin: 0;
}

.profile-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #1E1E38;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background: #252542;
    transform: scale(0.98);
  }
}

.profile-menu-icon {
  width: 40px;
  height: 40px;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #A78BFA;
  flex-shrink: 0;
}

.profile-menu-content {
  flex: 1;
}

.profile-menu-title {
  font-size: 15px;
  font-weight: 500;
  color: #FFFFFF;
  margin: 0;
}

.profile-menu-arrow {
  width: 20px;
  height: 20px;
  color: #707080;
  flex-shrink: 0;
}

.profile-logout {
  margin-top: 24px;
  width: 100%;
  height: 48px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #EF4444;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background: rgba(239, 68, 68, 0.25);
    transform: scale(0.98);
  }
}
```

### 5.2 未登录状态

#### 视觉设计
```
┌────────────────────────────────────────┐
│                                        │
│         ┌────────┐                     │
│         │  👤   │                     │
│         │ (默认头像)                   │
│         └────────┘                     │
│         未登录                         │
│     登录后可使用更多功能               │
│                                        │
│         [登录 / 注册]                  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 📋 关于                          │  │
│  │                    →             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ 🌐 官方网站                      │  │
│  │                    →             │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

#### 样式规格
```scss
.profile-guest {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px;
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%);
  border-radius: 20px;
  margin-bottom: 24px;
}

.profile-guest-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #707080;
  margin-bottom: 16px;
}

.profile-guest-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 4px;
}

.profile-guest-subtitle {
  font-size: 14px;
  color: #A0A0B0;
  margin: 0 0 24px;
  text-align: center;
}

.profile-login-btn {
  width: 100%;
  max-width: 200px;
  height: 48px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);

  &:active {
    transform: scale(0.95);
  }
}
```

---

## 6. 登录/注册弹窗

### 6.1 视觉设计

#### 登录弹窗
```
┌────────────────────────────────────────┐
│  登录                                  │
├────────────────────────────────────────┤
│                                        │
│  邮箱                                  │
│  ┌──────────────────────────────────┐  │
│  │ user@example.com                 │  │
│  └──────────────────────────────────┘  │
│                                        │
│  密码                                  │
│  ┌──────────────────────────────────┐  │
│  │ ••••••••                        │  │
│  └──────────────────────────────────┘  │
│  [忘记密码?]                           │
│                                        │
│         [登录]                         │
│                                        │
│  还没有账号？[立即注册]                 │
│                                        │
└────────────────────────────────────────┘
```

#### 样式规格
```scss
.auth-modal {
  background: #1E1E38;
  border-radius: 20px;
  width: 90%;
  max-width: 360px;
  padding: 24px;
  animation: slideInUp 0.3s ease;
}

.auth-modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 8px;
}

.auth-modal-subtitle {
  font-size: 14px;
  color: #A0A0B0;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: #252542;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 15px;
  transition: all 0.2s ease;

  &::placeholder {
    color: #707080;
  }

  &:focus {
    outline: none;
    border-color: #8B5CF6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }
}

.auth-forgot {
  text-align: right;
  margin-top: -8px;
}

.auth-forgot-link {
  font-size: 13px;
  color: #8B5CF6;
  font-weight: 500;
  text-decoration: none;
}

.auth-submit {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.auth-switch {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #A0A0B0;
}

.auth-switch-link {
  color: #8B5CF6;
  font-weight: 600;
  text-decoration: none;
}
```

---

## 7. 页面过渡动画

### 7.1 页面切换动画
```scss
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateX(0);
}
```

### 7.2 列表项进入动画
```scss
@keyframes listItemEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-list-item,
.todo-item {
  animation: listItemEnter 0.3s ease backwards;

  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.15s; }
  &:nth-child(4) { animation-delay: 0.2s; }
  &:nth-child(5) { animation-delay: 0.25s; }
}
```

---

## 8. 手势交互

### 8.1 下拉刷新
```scss
.pull-refresh {
  position: relative;
  overflow: hidden;
}

.pull-refresh-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1E1E38;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.pull-refresh-indicator.pulling {
  transform: translateY(0);
}

.pull-refresh-indicator.refreshing {
  transform: translateY(0);
}
```

### 8.2 上拉加载
```scss
.load-more {
  padding: 16px;
  text-align: center;
  color: #707080;
  font-size: 14px;
}

.load-more-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #8B5CF6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## 9. 安全区域适配

### 9.1 刘海屏适配
```scss
.safe-area-top {
  padding-top: env(safe-area-inset-top, 0);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.safe-area-left {
  padding-left: env(safe-area-inset-left, 0);
}

.safe-area-right {
  padding-right: env(safe-area-inset-right, 0);
}
```

### 9.2 底部TabBar适配
```scss
.tab-bar {
  padding-bottom: env(safe-area-inset-bottom, 0);
  height: calc(50px + env(safe-area-inset-bottom, 0));
}
```

---

## 10. 可访问性

### 10.1 触摸目标
- 最小触摸目标：44×44px
- 按钮高度：48px
- 列表项高度：72px

### 10.2 焦点状态
```scss
*:focus-visible {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}
```

### 10.3 ARIA标签
```vue
<nav aria-label="主导航">
  <button
    aria-label="首页"
    aria-current="page"
  >
    <span aria-hidden="true">🏠</span>
    <span>首页</span>
  </button>
</nav>
```

---

## 11. 性能优化

### 11.1 图片优化
- 使用WebP格式
- 提供多种尺寸
- 懒加载非首屏图片

### 11.2 动画优化
- 使用transform和opacity
- 避免触发布局重排
- 使用will-change提示

```scss
.optimized-animation {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

### 11.3 虚拟列表
对于长列表使用虚拟滚动，只渲染可见区域的元素。