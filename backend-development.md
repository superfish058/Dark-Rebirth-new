# Dark Rebirth 后端开发文档

## 1. 概述

### 1.1 技术栈
- **后端服务**: Supabase (PostgreSQL + Auth + Storage)
- **数据库**: PostgreSQL
- **认证**: Supabase Auth
- **客户端**: @supabase/supabase-js
- **类型安全**: TypeScript

### 1.2 项目结构
```
src/
├── services/                    # 服务层
│   ├── supabase.ts            # Supabase客户端配置
│   ├── auth.ts                # 认证服务
│   ├── webCollection.ts       # 网页收藏服务
│   ├── todo.ts                # 待办事项服务
│   ├── category.ts            # 分类服务
│   └── banner.ts             # 轮播图服务
├── types/                      # 类型定义
│   ├── database.ts            # 数据库类型
│   └── index.ts              # 业务类型
└── .env.example                # 环境变量示例
```

---

## 2. 数据库设计

### 2.1 表结构

#### profiles (用户表)
| 字段 | 类型 | 说明 | 约束 |
|------|------|------|--------|
| id | UUID | 用户ID (关联auth.users) | PRIMARY KEY |
| nickname | VARCHAR(50) | 昵称 | - |
| avatar_url | TEXT | 头像URL | - |
| created_at | TIMESTAMP | 创建时间 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT NOW() |

#### categories (分类表)
| 字段 | 类型 | 说明 | 约束 |
|------|------|------|--------|
| id | UUID | 分类ID | PRIMARY KEY |
| name | VARCHAR(50) | 分类名称 | NOT NULL |
| icon | VARCHAR(10) | 图标 | - |
| sort_order | INTEGER | 排序 | DEFAULT 0 |
| created_at | TIMESTAMP | 创建时间 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT NOW() |

#### web_collections (网页收藏表)
| 字段 | 类型 | 说明 | 约束 |
|------|------|------|--------|
| id | UUID | 收藏ID | PRIMARY KEY |
| user_id | UUID | 用户ID | NOT NULL, FK |
| url | TEXT | 网址 | NOT NULL |
| title | VARCHAR(255) | 标题 | - |
| description | TEXT | 描述 | - |
| icon_url | TEXT | 图标URL | - |
| category_id | UUID | 分类ID | FK |
| created_at | TIMESTAMP | 创建时间 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT NOW() |

#### todos (待办事项表)
| 字段 | 类型 | 说明 | 约束 |
|------|------|------|--------|
| id | UUID | 待办ID | PRIMARY KEY |
| user_id | UUID | 用户ID | NOT NULL, FK |
| title | VARCHAR(255) | 标题 | NOT NULL |
| description | TEXT | 描述 | - |
| status | VARCHAR(20) | 状态 | pending/in_progress/completed |
| due_date | TIMESTAMP | 截止日期 | - |
| created_at | TIMESTAMP | 创建时间 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT NOW() |

#### banners (轮播图表)
| 字段 | 类型 | 说明 | 约束 |
|------|------|------|--------|
| id | UUID | 轮播图ID | PRIMARY KEY |
| title | VARCHAR(255) | 标题 | - |
| image_url | TEXT | 图片URL | NOT NULL |
| link_url | TEXT | 链接URL | - |
| sort_order | INTEGER | 排序 | DEFAULT 0 |
| is_active | BOOLEAN | 是否激活 | DEFAULT true |
| created_at | TIMESTAMP | 创建时间 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT NOW() |

### 2.2 索引设计
```sql
-- profiles
CREATE INDEX idx_profiles_id ON profiles(id);

-- categories
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- web_collections
CREATE INDEX idx_web_collections_user_id ON web_collections(user_id);
CREATE INDEX idx_web_collections_category_id ON web_collections(category_id);
CREATE INDEX idx_web_collections_created_at ON web_collections(created_at DESC);

-- todos
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);

-- banners
CREATE INDEX idx_banners_sort_order ON banners(sort_order);
CREATE INDEX idx_banners_is_active ON banners(is_active);
```

### 2.3 Row Level Security (RLS) 策略

#### profiles 表
```sql
-- 用户只能查看和更新自己的资料
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### web_collections 表
```sql
-- 用户只能查看、插入、更新、删除自己的收藏
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

#### todos 表
```sql
-- 用户只能查看、插入、更新、删除自己的待办
CREATE POLICY "Users can view their own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);
```

#### categories 和 banners 表
```sql
-- 公开读取
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  USING (is_active = true);
```

---

## 3. 服务层设计

### 3.1 认证服务 (auth.ts)

#### 功能列表
| 方法 | 说明 | 返回类型 |
|------|------|----------|
| login | 用户登录 | ApiResponse<AuthSession> |
| register | 用户注册 | ApiResponse<AuthSession> |
| logout | 用户登出 | ApiResponse<void> |
| getCurrentUser | 获取当前用户 | User \| null |
| updateProfile | 更新用户资料 | ApiResponse<User> |
| resetPassword | 重置密码 | ApiResponse<void> |
| isAuthenticated | 检查是否登录 | boolean |

#### 使用示例
```typescript
import authService from '@/services/auth'

// 登录
const result = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})

if (result.error) {
  console.error('登录失败:', result.error)
} else {
  console.log('登录成功:', result.data)
}

// 注册
const result = await authService.register({
  email: 'user@example.com',
  password: 'password123',
  nickname: '用户名'
})

// 登出
await authService.logout()

// 更新资料
await authService.updateProfile({
  nickname: '新昵称',
  avatar_url: 'https://example.com/avatar.jpg'
})
```

### 3.2 网页收藏服务 (webCollection.ts)

#### 功能列表
| 方法 | 说明 | 返回类型 |
|------|------|----------|
| fetchAll | 获取收藏列表 | ApiResponse<PaginatedResponse<WebCollection>> |
| fetchById | 获取单个收藏 | ApiResponse<WebCollection> |
| create | 创建收藏 | ApiResponse<WebCollection> |
| update | 更新收藏 | ApiResponse<WebCollection> |
| delete | 删除收藏 | ApiResponse<void> |
| fetchIconUrl | 获取网站图标 | string |
| fetchPageTitle | 获取网页标题 | string |

#### 使用示例
```typescript
import webCollectionService from '@/services/webCollection'

// 获取收藏列表
const result = await webCollectionService.fetchAll({
  categoryId: 'category-id',
  page: 1,
  pageSize: 20,
  sortBy: 'created_at',
  sortOrder: 'desc'
})

// 创建收藏
const result = await webCollectionService.create({
  url: 'https://example.com',
  title: '示例网站',
  description: '这是一个示例网站',
  icon_url: 'https://example.com/favicon.ico',
  category_id: 'category-id'
})

// 更新收藏
await webCollectionService.update('id', {
  title: '新标题'
})

// 删除收藏
await webCollectionService.delete('id')

// 获取网站图标
const iconUrl = await webCollectionService.fetchIconUrl('https://example.com')
```

### 3.3 待办事项服务 (todo.ts)

#### 功能列表
| 方法 | 说明 | 返回类型 |
|------|------|----------|
| fetchAll | 获取待办列表 | ApiResponse<PaginatedResponse<Todo>> |
| fetchById | 获取单个待办 | ApiResponse<Todo> |
| create | 创建待办 | ApiResponse<Todo> |
| update | 更新待办 | ApiResponse<Todo> |
| delete | 删除待办 | ApiResponse<void> |
| updateStatus | 更新状态 | ApiResponse<Todo> |
| toggleComplete | 切换完成状态 | ApiResponse<Todo> |
| getOverdueTodos | 获取过期待办 | ApiResponse<Todo[]> |
| getUpcomingTodos | 获取即将到期待办 | ApiResponse<Todo[]> |
| getStats | 获取统计信息 | ApiResponse<Stats> |

#### 使用示例
```typescript
import todoService from '@/services/todo'

// 获取待办列表
const result = await todoService.fetchAll({
  status: 'pending',
  page: 1,
  pageSize: 20,
  sortBy: 'due_date',
  sortOrder: 'asc'
})

// 创建待办
const result = await todoService.create({
  title: '完成项目报告',
  description: '需要在周五前完成',
  status: 'pending',
  due_date: '2026-03-20T10:00:00Z'
})

// 更新状态
await todoService.updateStatus('id', 'completed')

// 切换完成状态
await todoService.toggleComplete('id')

// 获取统计信息
const stats = await todoService.getStats()
console.log(stats.data) // { total: 10, pending: 5, inProgress: 3, completed: 2, overdue: 1 }
```

### 3.4 分类服务 (category.ts)

#### 功能列表
| 方法 | 说明 | 返回类型 |
|------|------|----------|
| fetchAll | 获取所有分类 | ApiResponse<Category[]> |
| fetchById | 获取单个分类 | ApiResponse<Category> |
| create | 创建分类 | ApiResponse<Category> |
| update | 更新分类 | ApiResponse<Category> |
| delete | 删除分类 | ApiResponse<void> |

#### 使用示例
```typescript
import categoryService from '@/services/category'

// 获取所有分类
const result = await categoryService.fetchAll()

// 创建分类
const result = await categoryService.create({
  name: '新分类',
  icon: '📦',
  sort_order: 7
})
```

### 3.5 轮播图服务 (banner.ts)

#### 功能列表
| 方法 | 说明 | 返回类型 |
|------|------|----------|
| fetchAll | 获取轮播图列表 | ApiResponse<Banner[]> |
| fetchById | 获取单个轮播图 | ApiResponse<Banner> |
| create | 创建轮播图 | ApiResponse<Banner> |
| update | 更新轮播图 | ApiResponse<Banner> |
| delete | 删除轮播图 | ApiResponse<void> |
| toggleActive | 切换激活状态 | ApiResponse<Banner> |
| updateSortOrder | 更新排序 | ApiResponse<void> |

#### 使用示例
```typescript
import bannerService from '@/services/banner'

// 获取激活的轮播图
const result = await bannerService.fetchAll(true)

// 创建轮播图
const result = await bannerService.create({
  title: '新轮播图',
  image_url: 'https://example.com/banner.jpg',
  link_url: '/m/home',
  sort_order: 4,
  is_active: true
})

// 切换激活状态
await bannerService.toggleActive('id')
```

---

## 4. 类型定义

### 4.1 数据库类型 (database.ts)
完整的Supabase数据库类型定义，包含所有表的Row、Insert、Update类型。

### 4.2 业务类型 (index.ts)
```typescript
// 用户
interface User {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// 分类
interface Category {
  id: string
  name: string
  icon: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

// 网页收藏
interface WebCollection {
  id: string
  user_id: string
  url: string
  title: string | null
  description: string | null
  icon_url: string | null
  category_id: string | null
  category?: Category
  created_at: string
  updated_at: string
}

// 待办事项
interface Todo {
  id: string
  user_id: string
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string | null
  created_at: string
  updated_at: string
}

// 轮播图
interface Banner {
  id: string
  title: string | null
  image_url: string
  link_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// API响应
interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

// 分页响应
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
```

---

## 5. 环境配置

### 5.1 环境变量
```bash
# Supabase配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5.2 Supabase客户端配置
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'dark-rebirth-auth-token'
    },
    db: {
      schema: 'public'
    }
  }
)
```

---

## 6. 数据库迁移

### 6.1 迁移脚本位置
```
supabase/migrations/001_initial_schema.sql
```

### 6.2 执行迁移
1. 在Supabase Dashboard中打开SQL Editor
2. 复制迁移脚本内容
3. 执行SQL语句

### 6.3 迁移内容
- 创建所有表
- 创建索引
- 插入默认数据
- 配置RLS策略
- 创建触发器
- 创建视图

---

## 7. 安全考虑

### 7.1 认证安全
- 使用Supabase Auth进行用户认证
- JWT Token自动刷新
- Token存储在localStorage
- Session持久化

### 7.2 数据安全
- RLS策略确保用户只能访问自己的数据
- 所有写操作都需要认证
- SQL注入防护（使用参数化查询）

### 7.3 错误处理
- 所有服务方法返回统一的ApiResponse格式
- 错误信息不暴露敏感数据
- 客户端友好的错误提示

---

## 8. 性能优化

### 8.1 数据库优化
- 合理的索引设计
- 查询优化（使用索引字段）
- 分页查询避免大数据量

### 8.2 客户端优化
- 请求缓存
- 防抖和节流
- 懒加载

---

## 9. 测试

### 9.1 单元测试
```typescript
import { describe, it, expect } from 'vitest'
import authService from '@/services/auth'

describe('AuthService', () => {
  it('should login successfully', async () => {
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    })
    expect(result.error).toBeNull()
    expect(result.data).not.toBeNull()
  })
})
```

### 9.2 集成测试
```typescript
import { describe, it, expect } from 'vitest'
import webCollectionService from '@/services/webCollection'

describe('WebCollectionService', () => {
  it('should create and fetch web collection', async () => {
    const createResult = await webCollectionService.create({
      url: 'https://example.com',
      title: 'Test'
    })
    expect(createResult.error).toBeNull()

    const fetchResult = await webCollectionService.fetchById(createResult.data!.id)
    expect(fetchResult.data?.title).toBe('Test')
  })
})
```

---

## 10. 部署

### 10.1 Supabase配置
1. 创建Supabase项目
2. 执行数据库迁移
3. 配置认证设置
4. 获取项目URL和anon key
5. 配置环境变量

### 10.2 环境变量配置
```bash
# 开发环境
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-anon-key

# 生产环境
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key
```

---

## 11. 开发规范

### 11.1 代码规范
- 使用TypeScript进行类型检查
- 所有服务方法返回ApiResponse类型
- 错误处理统一格式
- 使用async/await处理异步

### 11.2 命名规范
- 文件名：kebab-case
- 类名：PascalCase
- 方法名：camelCase
- 接口名：PascalCase

### 11.3 注释规范
- 所有公共方法添加JSDoc注释
- 复杂逻辑添加行内注释
- 使用中文注释

---

## 12. 常见问题

### 12.1 认证问题
**Q: 用户登录后刷新页面丢失登录状态？**
A: 检查localStorage是否正常工作，确保persistSession设置为true。

### 12.2 RLS问题
**Q: 用户无法访问自己的数据？**
A: 检查RLS策略是否正确配置，确保auth.uid()与user_id匹配。

### 12.3 性能问题
**Q: 查询速度慢？**
A: 检查是否使用了索引，避免全表扫描。

---

## 13. 后续优化

### 13.1 功能增强
- 添加全文搜索
- 实现数据导出
- 添加批量操作
- 实现数据备份

### 13.2 性能优化
- 实现查询缓存
- 优化大数据量查询
- 添加CDN支持

### 13.3 安全增强
- 添加请求限流
- 实现审计日志
- 加强数据加密

---

## 14. 附录

### 14.1 相关文档
- [Supabase官方文档](https://supabase.com/docs)
- [PostgreSQL文档](https://www.postgresql.org/docs/)
- [TypeScript文档](https://www.typescriptlang.org/docs/)

### 14.2 工具推荐
- Supabase Dashboard - 数据库管理
- TablePlus - 数据库客户端
- Postman - API测试

---

## 15. 更新日志

### v1.0.0 (2026-03-17)
- 初始版本
- 完成所有基础服务
- 实现RLS策略
- 完成类型定义