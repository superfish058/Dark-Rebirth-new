# Dark Rebirth 全栈项目规格说明

## 1. 项目概述

### 1.1 项目名称
Dark Rebirth - 多端适配的个人应用管理平台

### 1.2 项目描述
一个支持移动端和PC端双端访问的全栈应用，通过媒体查询和路由控制实现不同设备的差异化展示。前端使用Vue3框架，后端采用Supabase服务进行数据存储和用户认证。

### 1.3 技术栈
- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **UI组件库**: 
  - PC端: Element Plus
  - 移动端: Vant 4
- **样式方案**: SCSS + 响应式设计
- **后端服务**: Supabase (PostgreSQL + Auth + Storage)
- **HTTP客户端**: Axios / Supabase Client

---

## 2. 系统架构

### 2.1 整体架构图
```
┌─────────────────────────────────────────────────────────────┐
│                        前端应用层                            │
├─────────────────────────┬───────────────────────────────────┤
│       PC端模块           │           移动端模块              │
│  ┌─────────────────┐   │   ┌─────────────────────────┐     │
│  │   顶部导航栏     │   │   │      底部TabBar          │     │
│  ├─────────────────┤   │   ├─────────────────────────┤     │
│  │   左侧菜单栏     │   │   │ 首页 │ 应用 │ 个人中心  │     │
│  │  ┌───────────┐  │   │   └─────────────────────────┘     │
│  │ │网页收藏    │  │   │                                   │
│  │ │全部应用    │  │   │                                   │
│  │ └───────────┘  │   │                                   │
│  │   主内容区域    │   │                                   │
│  └─────────────────┘   │                                   │
└─────────────────────────┴───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase 后端服务                        │
├─────────────────────────────────────────────────────────────┤
│  Authentication  │  Database (PostgreSQL)  │  Storage       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 目录结构
```
dark-rebirth/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                    # 静态资源
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       ├── variables.scss     # SCSS变量
│   │       ├── mixins.scss        # 混入样式
│   │       └── global.scss        # 全局样式
│   ├── components/                 # 公共组件
│   │   ├── common/                # 通用组件
│   │   │   ├── DeviceDetector.vue  # 设备检测组件
│   │   │   └── LoadingSpinner.vue
│   │   ├── pc/                    # PC端专用组件
│   │   │   ├── TopNavbar.vue      # 顶部导航栏
│   │   │   ├── SideMenu.vue       # 左侧菜单栏
│   │   │   └── AddWebModal.vue    # 添加网页弹窗
│   │   └── mobile/                # 移动端专用组件
│   │       ├── TabBar.vue         # 底部导航栏
│   │       ├── Carousel.vue       # 轮播图组件
│   │       ├── TodoNotify.vue     # 待办通知组件
│   │       └── AppGrid.vue        # 应用网格组件
│   ├── layouts/                    # 布局组件
│   │   ├── PCLayout.vue           # PC端布局
│   │   └── MobileLayout.vue       # 移动端布局
│   ├── views/                      # 页面视图
│   │   ├── pc/                    # PC端页面
│   │   │   ├── Home.vue           # PC端首页
│   │   │   ├── WebCollection.vue  # 网页收藏
│   │   │   └── AllApps.vue        # 全部应用
│   │   └── mobile/                # 移动端页面
│   │       ├── Home.vue           # 移动端首页
│   │       ├── AppList.vue        # 应用列表
│   │       └── Profile.vue        # 个人中心
│   ├── router/                     # 路由配置
│   │   ├── index.ts               # 路由入口
│   │   ├── pc.ts                  # PC端路由
│   │   └── mobile.ts              # 移动端路由
│   ├── stores/                     # Pinia状态管理
│   │   ├── index.ts
│   │   ├── user.ts                # 用户状态
│   │   ├── device.ts              # 设备状态
│   │   └── webCollection.ts       # 网页收藏状态
│   ├── composables/                # 组合式函数
│   │   ├── useDevice.ts           # 设备检测
│   │   ├── useAuth.ts             # 认证逻辑
│   │   └── useWebCollection.ts     # 网页收藏逻辑
│   ├── services/                   # API服务
│   │   ├── supabase.ts            # Supabase客户端
│   │   ├── auth.ts                # 认证服务
│   │   └── webCollection.ts       # 网页收藏服务
│   ├── types/                      # TypeScript类型定义
│   │   ├── user.ts
│   │   ├── webCollection.ts
│   │   └── device.ts
│   ├── utils/                      # 工具函数
│   │   ├── deviceDetect.ts        # 设备检测工具
│   │   └── iconFetcher.ts         # 图标获取工具
│   ├── App.vue                     # 根组件
│   └── main.ts                     # 入口文件
├── .env                            # 环境变量
├── .env.example                    # 环境变量示例
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 3. 功能模块详细设计

### 3.1 设备检测与路由控制

#### 3.1.1 设备检测逻辑
```typescript
// 断点设置
const MOBILE_BREAKPOINT = 768; // px

// 检测方法
function detectDevice(): 'pc' | 'mobile' {
  return window.innerWidth < MOBILE_BREAKPOINT ? 'mobile' : 'pc';
}
```

#### 3.1.2 路由控制策略
- 应用启动时检测设备类型
- 根据设备类型加载对应路由配置
- 使用路由守卫进行设备适配跳转
- PC端路由前缀: 无
- 移动端路由前缀: `/m`

#### 3.1.3 路由配置表

**PC端路由:**
| 路径 | 名称 | 组件 | 说明 |
|------|------|------|------|
| `/` | PC-Home | PCLayout | PC端布局入口 |
| `/web-collection` | WebCollection | WebCollection.vue | 网页收藏模块 |
| `/all-apps` | AllApps | AllApps.vue | 全部应用模块 |

**移动端路由:**
| 路径 | 名称 | 组件 | 说明 |
|------|------|------|------|
| `/m` | Mobile-Home | MobileLayout | 移动端布局入口 |
| `/m/home` | MobileHome | Home.vue | 移动端首页 |
| `/m/apps` | AppList | AppList.vue | 应用列表 |
| `/m/profile` | Profile | Profile.vue | 个人中心 |

---

### 3.2 PC端界面设计

#### 3.2.1 顶部导航栏 (TopNavbar)
```
┌────────────────────────────────────────────────────────────┐
│  [Logo] Dark Rebirth                          [用户头像]   │
└────────────────────────────────────────────────────────────┘
```

**功能要求:**
- 展示网站Logo和名称
- 固定在页面顶部
- 高度: 60px
- 背景: 深色主题 (#1a1a2e)

#### 3.2.2 左侧菜单栏 (SideMenu)
```
┌──────────────┐
│  📌 网页收藏  │
│  📱 全部应用  │
│              │
│              │
│              │
└──────────────┘
```

**功能要求:**
- 固定在页面左侧
- 宽度: 220px
- 支持菜单项选中高亮
- 可折叠(可选)

#### 3.2.3 网页收藏模块 (WebCollection)

**数据模型:**
```typescript
interface WebCollection {
  id: string;
  user_id: string;
  url: string;
  title: string;
  description: string;
  icon_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
}
```

**预设分类:**
| 分类名称 | 图标 | 说明 |
|----------|------|------|
| 编程AI | 🤖 | AI相关工具 |
| 生活技能 | 🏠 | 生活类应用 |
| 学习教育 | 📚 | 教育学习类 |
| 娱乐休闲 | 🎮 | 娱乐类应用 |
| 工作效率 | ⚡ | 效率工具 |
| 其他 | 📦 | 其他分类 |

**添加网页弹窗功能:**
```
┌─────────────────────────────────────────┐
│  添加网页收藏                      [×]  │
├─────────────────────────────────────────┤
│                                         │
│  网址 *                                 │
│  ┌─────────────────────────────────┐   │
│  │ https://example.com             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  简介                                   │
│  ┌─────────────────────────────────┐   │
│  │ 这是一个示例网站                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  图标预览                               │
│  ┌────┐                                │
│  │ 🌐 │  (自动获取)                    │
│  └────┘                                │
│                                         │
│  分类 *                                 │
│  ┌─────────────────────────────────┐   │
│  │ 请选择分类              ▼       │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [取消]        [保存]            │
└─────────────────────────────────────────┘
```

**图标获取策略:**
1. 尝试获取 `{domain}/favicon.ico`
2. 尝试获取 `{domain}/apple-touch-icon.png`
3. 解析HTML获取 `<link rel="icon">` 或 `<link rel="apple-touch-icon">`
4. 使用Google Favicon服务作为备选: `https://www.google.com/s2/favicons?domain={domain}`

---

### 3.3 移动端界面设计

#### 3.3.1 底部TabBar (TabBar)
```
┌────────────────────────────────────────┐
│   🏠      📱      👤                   │
│  首页    应用    我的                   │
└────────────────────────────────────────┘
```

**功能要求:**
- 固定在页面底部
- 高度: 50px
- 三个Tab: 首页、应用列表、个人中心
- 当前选中Tab高亮显示

#### 3.3.2 移动端首页 (MobileHome)

**布局结构:**
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
│  │    - 任务1                        │  │
│  │    - 任务2                        │  │
│  │    - 任务3                        │  │
│  └──────────────────────────────────┘  │
│                                        │
│  常用应用                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ 📱 │ │ 💬 │ │ 📧 │ │ 📅 │          │
│  │应用│ │聊天│ │邮件│ │日历│          │
│  └────┘ └────┘ └────┘ └────┘          │
│                                        │
└────────────────────────────────────────┘
```

**轮播图组件:**
- 自动轮播间隔: 3秒
- 支持手势滑动
- 指示器显示

**待办通知区域:**
- 显示最近待办事项
- 支持点击查看详情
- 未登录时显示登录提示

**常用应用区域:**
- 网格布局展示
- 4列排列
- 显示应用图标和名称

#### 3.3.3 应用列表 (AppList)

**布局结构:**
```
┌────────────────────────────────────────┐
│  应用列表                              │
├────────────────────────────────────────┤
│  ┌────┐  应用名称                      │
│  │ 🎯 │  网页收藏                      │
│  └────┘  收藏管理您喜爱的网页          │
├────────────────────────────────────────┤
│  ┌────┐  应用名称                      │
│  │ 📊 │  数据统计                      │
│  └────┘  查看您的使用数据              │
├────────────────────────────────────────┤
│  ┌────┐  应用名称                      │
│  │ ⚙️ │  系统设置                      │
│  └────┘  个性化您的应用体验            │
└────────────────────────────────────────┘
```

**功能要求:**
- 列表项高度: 72px
- 左侧图标: 48x48px
- 支持点击跳转

#### 3.3.4 个人中心 (Profile)

**布局结构:**
```
┌────────────────────────────────────────┐
│                                        │
│            ┌────────┐                  │
│            │  头像  │                  │
│            │  (可点击更换)              │
│            └────────┘                  │
│           用户昵称                      │
│                                        │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │ 👤 个人信息                       │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ⚙️ 设置                          │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ 📋 关于                          │  │
│  └──────────────────────────────────┘  │
│                                        │
│         [退出登录]                     │
│                                        │
└────────────────────────────────────────┘
```

**未登录状态:**
```
┌────────────────────────────────────────┐
│                                        │
│            ┌────────┐                  │
│            │  👤   │                  │
│            │ (默认头像)                │
│            └────────┘                  │
│           未登录                        │
│                                        │
│         [登录 / 注册]                   │
│                                        │
└────────────────────────────────────────┘
```

---

## 4. 数据库设计

### 4.1 Supabase 表结构

#### 4.1.1 用户表 (profiles)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nickname VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.1.2 网页收藏表 (web_collections)
```sql
CREATE TABLE web_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  icon_url TEXT,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.1.3 分类表 (categories)
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.1.4 待办事项表 (todos)
```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.1.5 轮播图表 (banners)
```sql
CREATE TABLE banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 Row Level Security (RLS) 策略

```sql
-- 网页收藏表RLS
ALTER TABLE web_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own web collections"
  ON web_collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own web collections"
  ON web_collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own web collections"
  ON web_collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own web collections"
  ON web_collections FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 5. API 接口设计

### 5.1 认证相关

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/signup | 用户注册 |
| POST | /auth/signin | 用户登录 |
| POST | /auth/signout | 用户登出 |
| GET | /auth/session | 获取当前会话 |

### 5.2 网页收藏相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/web-collections | 获取用户收藏列表 |
| POST | /api/web-collections | 添加网页收藏 |
| PUT | /api/web-collections/:id | 更新网页收藏 |
| DELETE | /api/web-collections/:id | 删除网页收藏 |

### 5.3 分类相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/categories | 获取所有分类 |

### 5.4 待办事项相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/todos | 获取用户待办列表 |
| POST | /api/todos | 创建待办事项 |
| PUT | /api/todos/:id | 更新待办事项 |
| DELETE | /api/todos/:id | 删除待办事项 |

---

## 6. 响应式设计规范

### 6.1 断点设置
```scss
$breakpoints: (
  'mobile': 0,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px
);
```

### 6.2 媒体查询混入
```scss
@mixin mobile {
  @media (max-width: 767px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 768px) and (max-width: 1023px) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: 1024px) {
    @content;
  }
}
```

### 6.3 设备适配策略
- **移动端 (< 768px)**: 使用移动端布局和路由
- **PC端 (>= 768px)**: 使用PC端布局和路由

---

## 7. 安全考虑

### 7.1 认证安全
- 使用Supabase Auth进行用户认证
- 支持邮箱密码登录
- JWT Token自动刷新
- 安全的密码存储

### 7.2 数据安全
- RLS策略确保用户只能访问自己的数据
- 输入验证和XSS防护
- CSRF保护

### 7.3 API安全
- 所有API请求需要认证
- 请求频率限制
- 错误信息不暴露敏感信息

---

## 8. 性能优化

### 8.1 前端优化
- 路由懒加载
- 组件按需加载
- 图片懒加载
- 虚拟列表(长列表)
- 缓存策略

### 8.2 后端优化
- 数据库索引优化
- 查询优化
- 连接池管理

---

## 9. 开发规范

### 9.1 代码规范
- 使用TypeScript进行类型检查
- ESLint + Prettier代码格式化
- Vue 3 Composition API风格
- 组件命名: PascalCase
- 文件命名: kebab-case

### 9.2 Git提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

### 9.3 分支管理
- main: 生产分支
- develop: 开发分支
- feature/*: 功能分支
- bugfix/*: 修复分支