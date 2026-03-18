# Dark Rebirth PC端界面设计方案

## 1. 整体布局

### 1.1 布局结构
```
┌─────────────────────────────────────────────────────────────────┐
│  顶部导航栏 (60px)                                              │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│  左侧    │           主内容区域                                  │
│  菜单栏  │                                                      │
│ (220px)  │                                                      │
│          │                                                      │
│          │                                                      │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

### 1.2 布局规格

| 元素 | 宽度 | 高度 | 背景 | 边框 |
|------|------|------|------|------|
| 顶部导航栏 | 100% | 60px | #1A1A2E | 底部边框 |
| 左侧菜单栏 | 220px | calc(100vh - 60px) | #1A1A2E | 右侧边框 |
| 主内容区域 | calc(100% - 220px) | calc(100vh - 60px) | #0F0F23 | 无 |

---

## 2. 顶部导航栏 (TopNavbar)

### 2.1 视觉设计

#### 布局
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌────────┐  Dark Rebirth                    ┌────┐  ┌────┐  │
│  │ Logo   │                                    │通知│  │头像│  │
│  └────────┘                                    └────┘  └────┘  │
└─────────────────────────────────────────────────────────────────┘
  24px       120px              flex: 1           40px   40px
```

#### 样式规格
```scss
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: linear-gradient(90deg, #1A1A2E 0%, #1E1E38 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 40px;
}

.navbar-logo {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.navbar-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 0.5px;
}

.navbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #A0A0B0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.navbar-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
}
```

### 2.2 交互状态

| 状态 | 效果 |
|------|------|
| 默认 | 半透明背景，浅色图标 |
| 悬停 | 背景加深，图标变白，轻微上移 |
| 激活 | 背景更深，图标变白，无位移 |
| 禁用 | 透明度0.5，不可点击 |

---

## 3. 左侧菜单栏 (SideMenu)

### 3.1 视觉设计

#### 布局
```
┌──────────────┐
│              │
│  ┌────────┐  │
│  │ Logo   │  │
│  └────────┘  │
│              │
│  📌 网页收藏  │ ← 选中状态
│  📱 全部应用  │
│              │
│  ───────────  │ ← 分割线
│              │
│  ⚙️ 设置      │
│  📋 关于      │
│              │
│              │
└──────────────┘
```

#### 样式规格
```scss
.side-menu {
  position: fixed;
  top: 60px;
  left: 0;
  width: 220px;
  height: calc(100vh - 60px);
  background: #1A1A2E;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  overflow-y: auto;
  z-index: 900;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.menu-section {
  margin-bottom: 24px;
}

.menu-section-title {
  font-size: 12px;
  font-weight: 600;
  color: #707080;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-left: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  color: #A0A0B0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #FFFFFF;
  }

  &.active {
    background: linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%);
    color: #A78BFA;
    border-left: 3px solid #8B5CF6;
    padding-left: 9px;
  }

  &:active {
    transform: scale(0.98);
  }
}

.menu-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 16px 0;
}
```

### 3.2 菜单项设计

| 菜单项 | 图标 | 路由 |
|--------|------|------|
| 网页收藏 | 📌 | /web-collection |
| 全部应用 | 📱 | /all-apps |
| 设置 | ⚙️ | /settings |
| 关于 | 📋 | /about |

---

## 4. 主内容区域

### 4.1 容器样式
```scss
.main-content {
  margin-left: 220px;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  background: #0F0F23;
  padding: 32px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #A0A0B0;
  margin: 0;
}
```

---

## 5. 网页收藏模块 (WebCollection)

### 5.1 页面布局

#### 顶部操作栏
```
┌─────────────────────────────────────────────────────────────────┐
│  网页收藏                                    [+ 添加网页]       │
│  管理您喜爱的网站                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [全部] [编程AI] [生活技能] [学习教育] [娱乐休闲] [工作效率]     │
└─────────────────────────────────────────────────────────────────┘
```

#### 收藏卡片网格
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  🌐         │  │  🤖         │  │  📚         │             │
│  │  GitHub     │  │  ChatGPT    │  │  MDN        │             │
│  │  代码托管平台 │  │  AI助手     │  │  开发文档   │             │
│  │  [编程AI]   │  │  [编程AI]   │  │  [学习教育] │             │
│  │  [删除]     │  │  [删除]     │  │  [删除]     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  ⚡         │  │  🎮         │  │  📧         │             │
│  │  Vite       │  │  Steam      │  │  Gmail      │             │
│  │  构建工具   │  │  游戏平台   │  │  邮箱服务   │             │
│  │  [工作效率] │  │  [娱乐休闲] │  │  [生活技能] │             │
│  │  [删除]     │  │  [删除]     │  │  [删除]     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 样式规格

#### 操作栏
```scss
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.action-bar-left {
  display: flex;
  flex-direction: column;
}

.action-bar-right {
  display: flex;
  gap: 12px;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}
```

#### 分类标签
```scss
.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.category-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  color: #A0A0B0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
  }

  &.active {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
    border-color: rgba(139, 92, 246, 0.5);
    color: #A78BFA;
  }
}
```

#### 收藏卡片
```scss
.web-collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.web-card {
  background: #1E1E38;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #8B5CF6 0%, #6366F1 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
  }
}

.web-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.web-card-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.web-card-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.web-card-description {
  font-size: 13px;
  color: #A0A0B0;
  line-height: 1.5;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 39px;
}

.web-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.web-card-category {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 10px;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 12px;
  color: #A78BFA;
  font-size: 12px;
  font-weight: 500;
}

.web-card-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.web-card:hover .web-card-actions {
  opacity: 1;
}

.web-card-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #A0A0B0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
  }

  &.delete:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #EF4444;
    border-color: rgba(239, 68, 68, 0.3);
  }
}
```

---

## 6. 添加网页弹窗 (AddWebModal)

### 6.1 视觉设计

#### 弹窗布局
```
┌─────────────────────────────────────────────────────────────────┐
│  添加网页收藏                                          [×]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  网址 *                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ https://github.com                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  标题                                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GitHub - Where the world builds software                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  简介                                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GitHub is where over 100 million developers shape...   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  图标预览                                                       │
│  ┌────┐                                                         │
│  │ 🌐 │  (自动获取)                                            │
│  └────┘                                                         │
│                                                                 │
│  分类 *                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 请选择分类                                      ▼       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🤖 编程AI  🏠 生活技能  📚 学习教育  🎮 娱乐休闲        │   │
│  │ ⚡ 工作效率  📦 其他                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│              [取消]                    [保存]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 样式规格
```scss
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: #1E1E38;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 90%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideInUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #A0A0B0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
  }
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 8px;

  .required {
    color: #EF4444;
    margin-left: 4px;
  }
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  background: #252542;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 14px;
  transition: all 0.2s ease;

  &::placeholder {
    color: #707080;
  }

  &:focus {
    outline: none;
    border-color: #8B5CF6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }

  &.error {
    border-color: #EF4444;

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
  }
}

.form-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px 16px;
  background: #252542;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 14px;
  resize: vertical;
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

.icon-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-top: 8px;
}

.icon-preview-box {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.icon-preview-text {
  flex: 1;
  font-size: 13px;
  color: #707080;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.category-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 72px;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &.selected {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
    border-color: rgba(139, 92, 246, 0.5);
  }

  .category-icon {
    font-size: 20px;
  }

  .category-name {
    font-size: 12px;
    font-weight: 500;
    color: #A0A0B0;
  }

  &.selected .category-name {
    color: #A78BFA;
  }
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-cancel {
  height: 40px;
  padding: 0 24px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.btn-save {
  height: 40px;
  padding: 0 24px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}
```

---

## 7. 全部应用模块 (AllApps)

### 7.1 视觉设计

#### 应用卡片网格
```
┌─────────────────────────────────────────────────────────────────┐
│  全部应用                                                        │
│  探索所有可用应用                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  📌         │  │  📊         │  │  📝         │             │
│  │  网页收藏   │  │  数据统计   │  │  笔记管理   │             │
│  │  收藏管理您  │  │  查看您的   │  │  记录您的   │             │
│  │  喜爱的网页  │  │  使用数据   │  │  想法和灵感 │             │
│  │             │  │             │  │             │             │
│  │  [进入应用 →]│  │  [进入应用 →]│  │  [进入应用 →]│             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  ⚡         │  │  📅         │  │  💬         │             │
│  │  任务管理   │  │  日历       │  │  聊天       │             │
│  │  高效管理您  │  │  管理您的   │  │  与朋友保持 │             │
│  │  的待办事项 │  │  日程安排   │  │  联系       │             │
│  │             │  │             │  │             │             │
│  │  [进入应用 →]│  │  [进入应用 →]│  │  [进入应用 →]│             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 样式规格
```scss
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.app-card {
  background: #1E1E38;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #8B5CF6 0%, #6366F1 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-3px);
  }
}

.app-card-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 16px;
}

.app-card-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 8px;
}

.app-card-description {
  font-size: 14px;
  color: #A0A0B0;
  line-height: 1.6;
  margin: 0 0 20px;
  min-height: 45px;
}

.app-card-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8B5CF6;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;

  .app-card:hover & {
    color: #A78BFA;
    gap: 12px;
  }
}
```

---

## 8. 响应式适配

### 8.1 平板适配 (768px - 1023px)
```scss
@media (max-width: 1023px) {
  .side-menu {
    width: 180px;
  }

  .main-content {
    margin-left: 180px;
  }

  .web-collection-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .app-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}
```

### 8.2 移动端适配 (< 768px)
```scss
@media (max-width: 767px) {
  .side-menu {
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    &.open {
      transform: translateX(0);
    }
  }

  .main-content {
    margin-left: 0;
    padding: 16px;
  }

  .web-collection-grid {
    grid-template-columns: 1fr;
  }

  .app-grid {
    grid-template-columns: 1fr;
  }

  .modal {
    width: 95%;
    margin: 16px;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 9. 动画效果

### 9.1 页面过渡
```scss
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
```

### 9.2 卡片进入动画
```scss
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.web-card,
.app-card {
  animation: cardEnter 0.4s ease backwards;

  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.15s; }
  &:nth-child(4) { animation-delay: 0.2s; }
  &:nth-child(5) { animation-delay: 0.25s; }
  &:nth-child(6) { animation-delay: 0.3s; }
}
```

---

## 10. 可访问性

### 10.1 键盘导航
- Tab键：在可交互元素间导航
- Enter/Space：激活按钮和链接
- Esc：关闭弹窗

### 10.2 ARIA标签
```vue
<nav aria-label="主导航">
  <ul role="menubar">
    <li role="none">
      <a role="menuitem" aria-current="page">网页收藏</a>
    </li>
  </ul>
</nav>

<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <h2 id="modal-title">添加网页收藏</h2>
</div>
```

### 10.3 焦点可见性
```scss
*:focus-visible {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}
```