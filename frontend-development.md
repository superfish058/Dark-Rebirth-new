# Dark Rebirth 前端开发文档

## 1. 项目概述

### 1.1 项目信息
- **项目名称**: Dark Rebirth
- **项目类型**: 多端适配的个人应用管理平台
- **技术栈**: Vue 3 + TypeScript + Vite + Supabase
- **UI框架**: Element Plus (PC端) + Vant 4 (移动端)

### 1.2 项目特点
- 深色主题设计
- 响应式布局（PC端和移动端）
- 模块化架构
- 类型安全（TypeScript）
- 状态管理（Pinia）
- 路由控制（Vue Router）

---

## 2. 技术栈

### 2.1 核心框架
- **Vue 3.4.0**: 使用Composition API
- **TypeScript 5.3.3**: 类型安全
- **Vite 5.0.0**: 构建工具
- **Vue Router 4.2.5**: 路由管理
- **Pinia 2.1.7**: 状态管理

### 2.2 UI组件库
- **Element Plus 2.5.0**: PC端UI组件
- **Vant 4.8.0**: 移动端UI组件

### 2.3 样式方案
- **SCSS**: CSS预处理器
- **响应式设计**: 媒体查询
- **CSS变量**: 主题配置

### 2.4 后端服务
- **Supabase 2.38.4**: 数据库和认证
- **@supabase/supabase-js**: 客户端SDK

---

## 3. 项目结构

```
dark-rebirth/
├── public/                     # 静态资源
├── src/
│   ├── assets/                 # 资源文件
│   │   └── styles/           # 样式文件
│   │       ├── variables.scss # SCSS变量
│   │       ├── mixins.scss    # SCSS混入
│   │       └── global.scss    # 全局样式
│   ├── components/             # 组件
│   │   ├── common/            # 通用组件
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── EmptyState.vue
│   │   ├── pc/                # PC端组件
│   │   │   ├── TopNavbar.vue
│   │   │   └── SideMenu.vue
│   │   └── mobile/            # 移动端组件
│   │       ├── TabBar.vue
│   │       └── Carousel.vue
│   ├── layouts/                # 布局组件
│   │   ├── PCLayout.vue
│   │   └── MobileLayout.vue
│   ├── router/                 # 路由配置
│   │   └── index.ts
│   ├── services/               # 服务层
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   ├── webCollection.ts
│   │   ├── todo.ts
│   │   ├── category.ts
│   │   └── banner.ts
│   ├── stores/                 # 状态管理
│   │   ├── user.ts
│   │   ├── device.ts
│   │   ├── webCollection.ts
│   │   └── todo.ts
│   ├── types/                  # 类型定义
│   │   ├── database.ts
│   │   └── index.ts
│   ├── views/                  # 页面视图
│   │   ├── auth/              # 认证页面
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── pc/                # PC端页面
│   │   │   ├── WebCollection.vue
│   │   │   └── AllApps.vue
│   │   ├── mobile/            # 移动端页面
│   │   │   ├── Home.vue
│   │   │   ├── AppList.vue
│   │   │   └── Profile.vue
│   │   ├── Home.vue
│   │   ├── Todo.vue
│   │   └── NotFound.vue
│   ├── App.vue                # 根组件
│   └── main.ts                # 入口文件
├── index.html                 # HTML模板
├── package.json               # 项目配置
├── vite.config.ts            # Vite配置
├── tsconfig.json             # TypeScript配置
├── .eslintrc.cjs            # ESLint配置
├── .prettierrc              # Prettier配置
└── .gitignore                # Git忽略文件
```

---

## 4. 设计系统

### 4.1 颜色系统

#### 主色调
```scss
$primary-color: #8B5CF6;
$primary-light: #A78BFA;
$primary-dark: #7C3AED;
$primary-gradient: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
```

#### 背景色
```scss
$bg-primary: #0F0F23;
$bg-secondary: #1A1A2E;
$bg-tertiary: #252542;
$bg-card: #1E1E38;
$bg-hover: #2A2A48;
$bg-active: #353558;
```

#### 文字色
```scss
$text-primary: #FFFFFF;
$text-secondary: #A0A0B0;
$text-tertiary: #707080;
$text-disabled: #505060;
```

#### 功能色
```scss
$success-primary: #22C55E;
$warning-primary: #F59E0B;
$error-primary: #EF4444;
$info-primary: #3B82F6;
```

### 4.2 字体系统
```scss
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;

$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-size-2xl: 24px;
$font-size-3xl: 32px;
$font-size-4xl: 40px;

$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### 4.3 间距系统
```scss
$spacing-1: 4px;
$spacing-2: 8px;
$spacing-3: 12px;
$spacing-4: 16px;
$spacing-5: 20px;
$spacing-6: 24px;
$spacing-8: 32px;
$spacing-10: 40px;
$spacing-12: 48px;
```

### 4.4 圆角系统
```scss
$radius-sm: 4px;
$radius-base: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$radius-xl: 24px;
$radius-full: 9999px;
```

### 4.5 响应式断点
```scss
$breakpoint-xs: 0;
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
$breakpoint-2xl: 1400px;
```

### 4.6 常用混入

#### 响应式混入
```scss
@mixin mobile {
  @media (max-width: #{$breakpoint-md - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$breakpoint-md}) and (max-width: #{$breakpoint-lg - 1px}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$breakpoint-lg}) {
    @content;
  }
}
```

#### 布局混入
```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}
```

#### 卡片样式
```scss
@mixin card-style {
  background: $bg-card;
  border: 1px solid $border-primary;
  border-radius: $radius-md;
  padding: $spacing-4;
  box-shadow: $shadow-sm;
}
```

#### 按钮样式
```scss
@mixin button-primary {
  background: $primary-gradient;
  color: $text-primary;
  border: none;
  border-radius: $radius-base;
  padding: $spacing-3 $spacing-6;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $duration-base $ease-out;
  
  &:hover {
    opacity: 0.9;
    box-shadow: $glow-primary;
  }
  
  &:active {
    transform: scale(0.98);
  }
}
```

---

## 5. 路由系统

### 5.1 路由配置

#### 路由结构
```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/pc',
    component: () => import('@/layouts/PCLayout.vue'),
    children: [
      {
        path: 'web-collection',
        name: 'PCWebCollection',
        component: () => import('@/views/pc/WebCollection.vue')
      },
      {
        path: 'all-apps',
        name: 'PCAllApps',
        component: () => import('@/views/pc/AllApps.vue')
      },
      {
        path: 'todo',
        name: 'PCTodo',
        component: () => import('@/views/Todo.vue')
      }
    ]
  },
  {
    path: '/m',
    component: () => import('@/layouts/MobileLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'MobileHome',
        component: () => import('@/views/mobile/Home.vue')
      },
      {
        path: 'app-list',
        name: 'MobileAppList',
        component: () => import('@/views/mobile/AppList.vue')
      },
      {
        path: 'profile',
        name: 'MobileProfile',
        component: () => import('@/views/mobile/Profile.vue')
      },
      {
        path: 'todo',
        name: 'MobileTodo',
        component: () => import('@/views/Todo.vue')
      }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]
```

### 5.2 设备检测路由守卫

```typescript
router.beforeEach((to, from, next) => {
  const isMobile = window.innerWidth < 768

  if (to.path.startsWith('/pc') && isMobile) {
    next('/m/home')
  } else if (to.path.startsWith('/m') && !isMobile) {
    next('/pc/web-collection')
  } else {
    next()
  }
})
```

---

## 6. 状态管理

### 6.1 用户状态 (user.ts)

#### 状态定义
```typescript
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const userNickname = computed(() => user.value?.nickname || '未登录')
  const userAvatar = computed(() => user.value?.avatar_url || '')

  return {
    user,
    loading,
    isAuthenticated,
    userNickname,
    userAvatar,
    init,
    login,
    register,
    logout,
    updateProfile
  }
})
```

#### 使用示例
```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 登录
await userStore.login(email, password)

// 获取用户信息
console.log(userStore.user)

// 检查登录状态
if (userStore.isAuthenticated) {
  // 已登录
}

// 登出
await userStore.logout()
```

### 6.2 设备状态 (device.ts)

#### 状态定义
```typescript
export const useDeviceStore = defineStore('device', () => {
  const width = ref(window.innerWidth)
  const isMobile = computed(() => width.value < 768)
  const isTablet = computed(() => width.value >= 768 && width.value < 992)
  const isDesktop = computed(() => width.value >= 992)

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    updateWidth,
    onMounted,
    onUnmounted
  }
})
```

#### 使用示例
```typescript
import { useDeviceStore } from '@/stores/device'

const deviceStore = useDeviceStore()

// 检查设备类型
if (deviceStore.isMobile) {
  // 移动端
} else if (deviceStore.isDesktop) {
  // PC端
}

// 监听窗口大小变化
onMounted(() => {
  deviceStore.onMounted()
})

onUnmounted(() => {
  deviceStore.onUnmounted()
})
```

### 6.3 网页收藏状态 (webCollection.ts)

#### 状态定义
```typescript
export const useWebCollectionStore = defineStore('webCollection', () => {
  const collections = ref<WebCollection[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  const hasMore = computed(() => currentPage.value * pageSize.value < total.value)

  const collectionsByCategory = computed(() => {
    const grouped: Record<string, WebCollection[]> = {}
    collections.value.forEach(item => {
      const categoryId = item.category_id || 'uncategorized'
      if (!grouped[categoryId]) {
        grouped[categoryId] = []
      }
      grouped[categoryId].push(item)
    })
    return grouped
  })

  return {
    collections,
    loading,
    currentPage,
    pageSize,
    total,
    hasMore,
    collectionsByCategory,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    fetchIconUrl,
    fetchPageTitle,
    reset
  }
})
```

#### 使用示例
```typescript
import { useWebCollectionStore } from '@/stores/webCollection'

const webCollectionStore = useWebCollectionStore()

// 获取所有收藏
await webCollectionStore.fetchAll()

// 创建收藏
await webCollectionStore.create({
  url: 'https://example.com',
  title: '示例网站',
  description: '这是一个示例网站',
  category_id: 'category-id'
})

// 更新收藏
await webCollectionStore.update('id', {
  title: '新标题'
})

// 删除收藏
await webCollectionStore.remove('id')
```

### 6.4 待办事项状态 (todo.ts)

#### 状态定义
```typescript
export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  const hasMore = computed(() => currentPage.value * pageSize.value < total.value)

  const pendingTodos = computed(() => 
    todos.value.filter(todo => todo.status === 'pending')
  )
  
  const inProgressTodos = computed(() => 
    todos.value.filter(todo => todo.status === 'in_progress')
  )
  
  const completedTodos = computed(() => 
    todos.value.filter(todo => todo.status === 'completed')
  )

  return {
    todos,
    loading,
    currentPage,
    pageSize,
    total,
    hasMore,
    pendingTodos,
    inProgressTodos,
    completedTodos,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    updateStatus,
    toggleComplete,
    getOverdueTodos,
    getUpcomingTodos,
    getStats,
    reset
  }
})
```

#### 使用示例
```typescript
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

// 获取所有待办
await todoStore.fetchAll()

// 创建待办
await todoStore.create({
  title: '完成项目报告',
  description: '需要在周五前完成',
  status: 'pending',
  due_date: '2026-03-20T10:00:00Z'
})

// 切换完成状态
await todoStore.toggleComplete('id')

// 更新状态
await todoStore.updateStatus('id', 'completed')

// 获取统计信息
const stats = await todoStore.getStats()
console.log(stats.data)
```

---

## 7. 组件开发规范

### 7.1 组件命名
- 使用PascalCase命名
- 组件文件名与组件名一致
- 通用组件放在`components/common/`
- PC端组件放在`components/pc/`
- 移动端组件放在`components/mobile/`

### 7.2 组件结构
```vue
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props定义
interface Props {
  title: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: ''
})

// Emits定义
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: string): void
}>()

// 响应式数据
const data = ref('')

// 计算属性
const computedValue = computed(() => {
  return props.title.toUpperCase()
})

// 方法
function handleClick() {
  emit('update', data.value)
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>

<style scoped lang="scss">
.component-name {
  // 样式内容
}
</style>
```

### 7.3 组件通信
#### Props传递
```vue
<!-- 父组件 -->
<ChildComponent :title="parentTitle" :description="parentDescription" />

<!-- 子组件 -->
<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

const props = defineProps<Props>()
</script>
```

#### Events触发
```vue
<!-- 子组件 -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: string): void
}>()

function handleUpdate() {
  emit('update', 'new value')
}
</script>

<!-- 父组件 -->
<ChildComponent @update="handleUpdate" @delete="handleDelete" />

<script setup lang="ts">
function handleUpdate(value: string) {
  console.log('更新:', value)
}

function handleDelete(id: string) {
  console.log('删除:', id)
}
</script>
```

#### Slots使用
```vue
<!-- 父组件 -->
<ChildComponent>
  <template #header>
    <h2>自定义标题</h2>
  </template>
  <template #default>
    <p>默认内容</p>
  </template>
  <template #footer>
    <button>确定</button>
  </template>
</ChildComponent>

<!-- 子组件 -->
<template>
  <div class="child">
    <div class="child__header">
      <slot name="header" />
    </div>
    <div class="child__content">
      <slot />
    </div>
    <div class="child__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

---

## 8. 页面开发规范

### 8.1 页面结构
```vue
<template>
  <div class="page-name">
    <div class="page-name__header">
      <h2 class="page-name__title">页面标题</h2>
      <el-button type="primary" @click="handleAction">
        操作按钮
      </el-button>
    </div>

    <div class="page-name__content">
      <!-- 页面内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const data = ref<any[]>([])

// 计算属性
const filteredData = computed(() => {
  return data.value.filter(item => item.active)
})

// 方法
async function loadData() {
  loading.value = true
  try {
    // 加载数据
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

function handleAction() {
  // 处理操作
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page-name {
  padding: $spacing-6;

  &__header {
    @include flex-between;
    margin-bottom: $spacing-6;
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
  }

  &__content {
    min-height: 400px;
  }
}
</style>
```

### 8.2 页面路由
```typescript
// 在router/index.ts中添加路由
{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('@/views/NewPage.vue')
}
```

---

## 9. 响应式设计

### 9.1 媒体查询
```scss
// 移动端样式
@include mobile {
  .component {
    // 移动端特定样式
  }
}

// 平板端样式
@include tablet {
  .component {
    // 平板端特定样式
  }
}

// PC端样式
@include desktop {
  .component {
    // PC端特定样式
  }
}
```

### 9.2 设备检测
```typescript
import { useDeviceStore } from '@/stores/device'

const deviceStore = useDeviceStore()

if (deviceStore.isMobile) {
  // 移动端逻辑
} else if (deviceStore.isDesktop) {
  // PC端逻辑
}
```

---

## 10. API调用

### 10.1 服务层封装
```typescript
import supabase from './supabase'
import type { ApiResponse } from '@/types'

class ExampleService {
  async fetchData(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .select('*')
      
      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }
}

export default new ExampleService()
```

### 10.2 在组件中使用
```typescript
import exampleService from '@/services/example'

async function loadData() {
  loading.value = true
  try {
    const result = await exampleService.fetchData()
    
    if (result.error) {
      ElMessage.error(result.error)
      return
    }

    data.value = result.data
  } finally {
    loading.value = false
  }
}
```

---

## 11. 错误处理

### 11.1 全局错误处理
```typescript
// 在main.ts中
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误:', err, info)
  // 可以在这里添加错误上报逻辑
}
```

### 11.2 组件错误处理
```typescript
try {
  await someAsyncOperation()
} catch (error) {
  console.error('操作失败:', error)
  ElMessage.error('操作失败，请重试')
}
```

### 11.3 API错误处理
```typescript
const result = await someService.getData()
if (result.error) {
  ElMessage.error(result.error)
  return
}
// 处理成功数据
```

---

## 12. 性能优化

### 12.1 懒加载
```typescript
// 路由懒加载
component: () => import('@/views/Page.vue')

// 组件懒加载
const LazyComponent = defineAsyncComponent(() => import('./HeavyComponent.vue'))
```

### 12.2 计算属性缓存
```typescript
// 使用computed缓存计算结果
const filteredData = computed(() => {
  return data.value.filter(item => item.active)
})
```

### 12.3 列表虚拟滚动
```vue
<!-- 对于大数据量列表，使用虚拟滚动 -->
<el-table
  :data="largeData"
  height="600"
  :row-key="id"
>
  <!-- 列定义 -->
</el-table>
```

---

## 13. 开发规范

### 13.1 命名规范
- **文件名**: kebab-case (例: user-profile.vue)
- **组件名**: PascalCase (例: UserProfile)
- **变量名**: camelCase (例: userName)
- **常量名**: UPPER_SNAKE_CASE (例: MAX_COUNT)
- **函数名**: camelCase (例: getUserData)

### 13.2 代码风格
- 使用2空格缩进
- 使用单引号
- 行尾不加分号
- 每行最大100字符

### 13.3 注释规范
```typescript
// 单行注释

/**
 * 多行注释
 * @param {string} name 参数说明
 * @returns {string} 返回值说明
 */
function example(name: string): string {
  return `Hello, ${name}`
}
```

---

## 14. 测试

### 14.1 单元测试
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from '@/components/Component.vue'

describe('Component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Component, {
      props: {
        title: 'Test'
      }
    })
    expect(wrapper.text()).toContain('Test')
  })
})
```

### 14.2 运行测试
```bash
# 运行所有测试
npm run test

# 运行测试并生成覆盖率报告
npm run test -- --coverage

# 运行测试UI
npm run test:ui
```

---

## 15. 构建部署

### 15.1 开发环境
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 15.2 生产构建
```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 15.3 环境变量
```bash
# .env.development
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-anon-key

# .env.production
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key
```

---

## 16. 常见问题

### 16.1 路由跳转问题
**Q**: 路由跳转后页面不更新？  
**A**: 使用`router.replace()`而不是`router.push()`，或者使用`key`属性强制更新。

### 16.2 状态不更新
**Q**: 修改了store中的数据，但视图没有更新？  
**A**: 确保使用的是ref或reactive，并且正确地修改了数据。

### 16.3 样式不生效
**Q**: 修改了样式但没有生效？  
**A**: 检查scoped样式是否正确，或者使用`:deep()`穿透样式。

### 16.4 类型错误
**Q**: TypeScript报类型错误？  
**A**: 检查类型定义是否正确，或者使用`as`进行类型断言。

---

## 17. 附录

### 17.1 相关文档
- [Vue 3官方文档](https://vuejs.org/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [Vite官方文档](https://vitejs.dev/)
- [Pinia官方文档](https://pinia.vuejs.org/)
- [Vue Router官方文档](https://router.vuejs.org/)
- [Element Plus官方文档](https://element-plus.org/)
- [Vant官方文档](https://vant-ui.github.io/)
- [Supabase官方文档](https://supabase.com/docs)

### 17.2 工具推荐
- **VS Code**: 推荐的IDE
- **Vue DevTools**: Vue开发者工具
- **Pinia DevTools**: Pinia状态管理工具
- **Volar**: Vue语言支持插件

---

## 18. 更新日志

### v1.0.0 (2026-03-17)
- 初始版本
- 完成基础架构搭建
- 实现PC端和移动端布局
- 实现用户认证功能
- 实现网页收藏功能
- 实现待办事项功能
- 实现首页轮播图和应用列表
- 完成响应式设计
- 配置代码规范工具