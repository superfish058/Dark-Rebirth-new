# Dark Rebirth 组件代码示例

## 1. 设计系统变量 (variables.scss)

```scss
// 颜色系统
$primary-color: #8B5CF6;
$primary-light: #A78BFA;
$primary-dark: #7C3AED;
$primary-gradient: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);

$bg-primary: #0F0F23;
$bg-secondary: #1A1A2E;
$bg-tertiary: #252542;
$bg-card: #1E1E38;
$bg-hover: #2A2A48;
$bg-active: #353558;

$text-primary: #FFFFFF;
$text-secondary: #A0A0B0;
$text-tertiary: #707080;
$text-disabled: #505060;

$border-primary: rgba(255, 255, 255, 0.1);
$border-secondary: rgba(255, 255, 255, 0.05);

$success-primary: #22C55E;
$warning-primary: #F59E0B;
$error-primary: #EF4444;
$info-primary: #3B82F6;

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
$glow-primary: 0 0 20px rgba(139, 92, 246, 0.3);

// 字体系统
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

// 间距系统
$spacing-1: 4px;
$spacing-2: 8px;
$spacing-3: 12px;
$spacing-4: 16px;
$spacing-5: 20px;
$spacing-6: 24px;
$spacing-8: 32px;
$spacing-10: 40px;
$spacing-12: 48px;

// 圆角系统
$radius-sm: 4px;
$radius-base: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$radius-xl: 24px;
$radius-full: 9999px;

// 断点
$breakpoint-xs: 0;
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
$breakpoint-2xl: 1400px;

// 动画
$duration-fast: 150ms;
$duration-base: 300ms;
$duration-slow: 500ms;
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 2. 全局混入 (mixins.scss)

```scss
// 响应式混入
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

// 文本溢出
@mixin text-ellipsis($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// 居中
@mixin center-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 绝对定位居中
@mixin absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// 滚动条样式
@mixin custom-scrollbar($width: 4px, $track-color: transparent, $thumb-color: rgba(255, 255, 255, 0.1)) {
  &::-webkit-scrollbar {
    width: $width;
  }

  &::-webkit-scrollbar-track {
    background: $track-color;
  }

  &::-webkit-scrollbar-thumb {
    background: $thumb-color;
    border-radius: $width / 2;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

// 玻璃态效果
@mixin glass-effect($blur: 10px, $opacity: 0.8) {
  background: rgba($bg-secondary, $opacity);
  backdrop-filter: blur($blur);
  -webkit-backdrop-filter: blur($blur);
}

// 渐变边框
@mixin gradient-border($gradient: $primary-gradient, $width: 1px) {
  position: relative;
  background: $bg-card;
  border-radius: $radius-md;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: $width;
    background: $gradient;
    border-radius: inherit;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
}
```

---

## 3. 全局样式 (global.scss)

```scss
@import './variables.scss';
@import './mixins.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: 1.6;
  color: $text-primary;
  background: $bg-primary;
  overflow-x: hidden;
}

a {
  color: $primary-color;
  text-decoration: none;
  transition: color $duration-fast $ease-out;

  &:hover {
    color: $primary-light;
  }
}

button {
  font-family: inherit;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
}

input,
textarea,
select {
  font-family: inherit;
  outline: none;
}

// 滚动条
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: $bg-secondary;
}

::-webkit-scrollbar-thumb {
  background: $bg-tertiary;
  border-radius: 4px;

  &:hover {
    background: $bg-hover;
  }
}

// 焦点样式
*:focus-visible {
  outline: 2px solid $primary-color;
  outline-offset: 2px;
}

// 跳过链接
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: $spacing-4;
  background: $primary-color;
  color: white;
  z-index: 9999;
  transition: top $duration-base $ease-out;

  &:focus {
    top: 0;
  }
}

// 屏幕阅读器
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

---

## 4. PC端组件

### 4.1 TopNavbar.vue

```vue
<template>
  <header class="top-navbar">
    <div class="navbar-brand">
      <div class="navbar-logo">DR</div>
      <h1 class="navbar-title">Dark Rebirth</h1>
    </div>
    
    <div class="navbar-actions">
      <button
        class="navbar-icon-btn"
        aria-label="通知"
        @click="handleNotifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
      </button>
      
      <div class="navbar-avatar" @click="handleProfile">
        {{ userInitial }}
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userInitial = computed(() => userStore.user?.nickname?.[0]?.toUpperCase() || 'U')
const unreadCount = computed(() => userStore.unreadCount)

const handleNotifications = () => {
  console.log('打开通知')
}

const handleProfile = () => {
  console.log('打开个人资料')
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

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
  border-bottom: 1px solid $border-primary;
  box-shadow: $shadow-sm;
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
  background: $primary-gradient;
  border-radius: $radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: $font-weight-bold;
  color: white;
}

.navbar-title {
  font-size: 20px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  letter-spacing: 0.5px;
}

.navbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: $radius-base;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid $border-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $duration-base $ease-out;
  color: $text-secondary;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: $text-primary;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: $error-primary;
  border-radius: 9px;
  font-size: 11px;
  font-weight: $font-weight-semibold;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $primary-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: white;
  cursor: pointer;
  transition: all $duration-base $ease-out;
  border: 2px solid rgba(255, 255, 255, 0.2);

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
}
</style>
```

### 4.2 SideMenu.vue

```vue
<template>
  <nav class="side-menu" aria-label="侧边导航">
    <div class="menu-section">
      <h2 class="menu-section-title">主要功能</h2>
      <router-link
        v-for="item in mainMenuItems"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-label">{{ item.label }}</span>
      </router-link>
    </div>

    <div class="menu-divider"></div>

    <div class="menu-section">
      <h2 class="menu-section-title">其他</h2>
      <router-link
        v-for="item in otherMenuItems"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-label">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const mainMenuItems = [
  { icon: '📌', label: '网页收藏', path: '/web-collection' },
  { icon: '📱', label: '全部应用', path: '/all-apps' }
]

const otherMenuItems = [
  { icon: '⚙️', label: '设置', path: '/settings' },
  { icon: '📋', label: '关于', path: '/about' }
]

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.side-menu {
  position: fixed;
  top: 60px;
  left: 0;
  width: 220px;
  height: calc(100vh - 60px);
  background: $bg-secondary;
  border-right: 1px solid $border-secondary;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  overflow-y: auto;

  @include custom-scrollbar(4px, transparent, rgba(255, 255, 255, 0.1));
}

.menu-section {
  margin-bottom: 24px;
}

.menu-section-title {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $text-tertiary;
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
  border-radius: $radius-base;
  color: $text-secondary;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $duration-base $ease-out;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: $text-primary;
  }

  &.active {
    background: linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%);
    color: $primary-light;
    border-left: 3px solid $primary-color;
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
  font-size: 18px;
}

.menu-label {
  flex: 1;
}

.menu-divider {
  height: 1px;
  background: $border-secondary;
  margin: 16px 0;
}
</style>
```

### 4.3 WebCard.vue

```vue
<template>
  <article class="web-card" @click="handleClick">
    <div class="web-card-header">
      <div class="web-card-icon">
        <img v-if="web.icon_url" :src="web.icon_url" :alt="web.title" />
        <span v-else>🌐</span>
      </div>
      <h3 class="web-card-title">{{ web.title }}</h3>
    </div>
    
    <p class="web-card-description">{{ web.description }}</p>
    
    <div class="web-card-footer">
      <span class="web-card-category">
        {{ getCategoryIcon(web.category) }} {{ web.category }}
      </span>
      
      <div class="web-card-actions">
        <button
          class="web-card-action-btn"
          aria-label="编辑"
          @click.stop="handleEdit"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        
        <button
          class="web-card-action-btn delete"
          aria-label="删除"
          @click.stop="handleDelete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
interface WebCollection {
  id: string
  title: string
  description: string
  icon_url: string
  category: string
  url: string
}

defineProps<{
  web: WebCollection
}>()

const emit = defineEmits<{
  click: [web: WebCollection]
  edit: [web: WebCollection]
  delete: [id: string]
}>()

const categoryIcons: Record<string, string> = {
  '编程AI': '🤖',
  '生活技能': '🏠',
  '学习教育': '📚',
  '娱乐休闲': '🎮',
  '工作效率': '⚡',
  '其他': '📦'
}

const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || '📦'
}

const handleClick = () => {
  emit('click', props.web)
}

const handleEdit = () => {
  emit('edit', props.web)
}

const handleDelete = () => {
  emit('delete', props.web.id)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.web-card {
  background: $bg-card;
  border: 1px solid $border-primary;
  border-radius: $radius-md;
  padding: 20px;
  transition: all $duration-base $ease-out;
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
    background: $primary-gradient;
    opacity: 0;
    transition: opacity $duration-base $ease-out;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: $shadow-lg;

    &::before {
      opacity: 1;
    }

    .web-card-actions {
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
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.web-card-title {
  flex: 1;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0;
  @include text-ellipsis(1);
}

.web-card-description {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
  margin: 0 0 12px;
  @include text-ellipsis(2);
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
  color: $primary-light;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
}

.web-card-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity $duration-base $ease-out;
}

.web-card-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid $border-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $duration-base $ease-out;
  color: $text-secondary;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: $text-primary;
  }

  &.delete:hover {
    background: rgba(239, 68, 68, 0.2);
    color: $error-primary;
    border-color: rgba(239, 68, 68, 0.3);
  }
}
</style>
```

---

## 5. 移动端组件

### 5.1 TabBar.vue

```vue
<template>
  <nav class="tab-bar" aria-label="底部导航">
    <router-link
      v-for="item in tabItems"
      :key="item.path"
      :to="item.path"
      class="tab-item"
      :class="{ active: isActive(item.path) }"
      :aria-label="item.label"
      :aria-current="isActive(item.path) ? 'page' : undefined"
    >
      <span class="tab-icon">{{ item.icon }}</span>
      <span class="tab-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabItems = [
  { icon: '🏠', label: '首页', path: '/m/home' },
  { icon: '📱', label: '应用', path: '/m/apps' },
  { icon: '👤', label: '我的', path: '/m/profile' }
]

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba($bg-secondary, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid $border-secondary;
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
  transition: all $duration-base $ease-out;
  color: $text-tertiary;
  text-decoration: none;

  &:active {
    background: rgba(255, 255, 255, 0.05);
  }

  &.active {
    color: $primary-color;
  }
}

.tab-icon {
  width: 24px;
  height: 24px;
  font-size: 22px;
  transition: transform $duration-base $ease-out;

  .tab-item.active & {
    transform: scale(1.1);
  }
}

.tab-label {
  font-size: 11px;
  font-weight: $font-weight-medium;
  letter-spacing: 0.3px;
}
</style>
```

### 5.2 Carousel.vue

```vue
<template>
  <div class="carousel-container">
    <div
      class="carousel-track"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div
        v-for="(banner, index) in banners"
        :key="index"
        class="carousel-slide"
      >
        <img
          :src="banner.image_url"
          :alt="banner.title"
          class="carousel-image"
          loading="lazy"
        />
        <div class="carousel-content">
          <h3 class="carousel-title">{{ banner.title }}</h3>
          <p v-if="banner.subtitle" class="carousel-subtitle">{{ banner.subtitle }}</p>
        </div>
      </div>
    </div>

    <div class="carousel-indicators">
      <button
        v-for="(banner, index) in banners"
        :key="index"
        class="carousel-indicator"
        :class="{ active: currentIndex === index }"
        :aria-label="`轮播图 ${index + 1}`"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Banner {
  title: string
  subtitle?: string
  image_url: string
  link_url?: string
}

defineProps<{
  banners: Banner[]
}>()

const currentIndex = ref(0)
let autoPlayTimer: number | null = null
let touchStartX = 0
let touchEndX = 0

const goToSlide = (index: number) => {
  currentIndex.value = index
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.banners.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.banners.length) % props.banners.length
}

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchMove = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX
}

const handleTouchEnd = () => {
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }
}

const startAutoPlay = () => {
  autoPlayTimer = window.setInterval(nextSlide, 3000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.carousel-container {
  position: relative;
  width: 100%;
  height: 180px;
  margin-bottom: 20px;
  border-radius: $radius-lg;
  overflow: hidden;
  background: $bg-card;
}

.carousel-track {
  display: flex;
  transition: transform $duration-base $ease-out;
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
  font-weight: $font-weight-semibold;
  color: $text-primary;
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
  border: none;
  cursor: pointer;
  transition: all $duration-base $ease-out;

  &.active {
    width: 18px;
    border-radius: 3px;
    background: $primary-color;
  }
}
</style>
```

### 5.3 AppGridItem.vue

```vue
<template>
  <div class="app-grid-item" @click="handleClick">
    <div class="app-grid-icon">{{ app.icon }}</div>
    <span class="app-grid-label">{{ app.name }}</span>
  </div>
</template>

<script setup lang="ts">
interface App {
  id: string
  name: string
  icon: string
  route: string
}

defineProps<{
  app: App
}>()

const emit = defineEmits<{
  click: [app: App]
}>()

const handleClick = () => {
  emit('click', props.app)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.app-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $duration-base $ease-out;
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
  border-radius: $radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: transform $duration-base $ease-out;

  .app-grid-item:active & {
    transform: scale(0.9);
  }
}

.app-grid-label {
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  color: $text-secondary;
  text-align: center;
  width: 100%;
  @include text-ellipsis(1);
}
</style>
```

---

## 6. 通用组件

### 6.1 Button.vue

```vue
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="button-spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'button',
  `button--${props.variant}`,
  `button--${props.size}`,
  { 'button--block': props.block, 'button--loading': props.loading }
])

const handleClick = (e: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: $radius-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $duration-base $ease-out;
  text-decoration: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &--primary {
    background: $primary-gradient;
    color: white;
    box-shadow: $glow-primary;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  &--secondary {
    background: $bg-tertiary;
    border: 1px solid $border-primary;
    color: $text-primary;

    &:hover:not(:disabled) {
      background: $bg-hover;
      border-color: rgba(255, 255, 255, 0.2);
    }

    &:active:not(:disabled) {
      background: $bg-active;
    }
  }

  &--ghost {
    background: transparent;
    color: $text-secondary;

    &:hover:not(:disabled) {
      background: $bg-hover;
      color: $text-primary;
    }

    &:active:not(:disabled) {
      background: $bg-active;
    }
  }

  &--sm {
    height: 36px;
    padding: 0 16px;
    font-size: $font-size-sm;
  }

  &--md {
    height: 44px;
    padding: 0 24px;
    font-size: $font-size-base;
  }

  &--lg {
    height: 52px;
    padding: 0 32px;
    font-size: $font-size-lg;
  }

  &--block {
    width: 100%;
  }

  &--loading {
    pointer-events: none;
  }
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
```

### 6.2 Input.vue

```vue
<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    
    <div class="input-container">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <slot name="suffix"></slot>
    </div>
    
    <p v-if="error" class="input-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  id?: string
  type?: string
  modelValue: string | number
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: '',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const isFocused = ref(false)

const inputClasses = computed(() => [
  'input',
  { 'input--error': props.error, 'input--focused': isFocused.value }
])

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (e: FocusEvent) => {
  isFocused.value = false
  emit('blur', e)
}

const handleFocus = (e: FocusEvent) => {
  isFocused.value = true
  emit('focus', e)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.input-required {
  color: $error-primary;
  margin-left: 4px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  background: $bg-tertiary;
  border: 1px solid $border-primary;
  border-radius: $radius-base;
  color: $text-primary;
  font-size: $font-size-base;
  transition: all $duration-base $ease-out;

  &::placeholder {
    color: $text-tertiary;
  }

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }

  &--error {
    border-color: $error-primary;

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.input-error {
  font-size: $font-size-xs;
  color: $error-primary;
  margin: 0;
}
</style>
```

### 6.3 Modal.vue

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal" @click.stop>
          <div v-if="$slots.header" class="modal-header">
            <slot name="header"></slot>
            <button class="modal-close" @click="handleClose" aria-label="关闭">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

interface Props {
  show: boolean
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlay: true,
  closeOnEsc: true
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  close: []
}>()

const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}

const handleEsc = (e: KeyboardEvent) => {
  if (props.closeOnEsc && e.key === 'Escape') {
    handleClose()
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

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
  padding: 16px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity $duration-base $ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform $duration-base $ease-out;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.9) translateY(20px);
}

.modal {
  background: $bg-card;
  border: 1px solid $border-primary;
  border-radius: $radius-lg;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid $border-secondary;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: $radius-base;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $duration-base $ease-out;
  color: $text-secondary;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: $text-primary;
  }
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;

  @include custom-scrollbar(4px, transparent, rgba(255, 255, 255, 0.1));
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px;
  border-top: 1px solid $border-secondary;
}
</style>
```

---

## 7. 使用示例

### 7.1 PC端布局使用

```vue
<template>
  <div class="pc-layout">
    <TopNavbar />
    <SideMenu />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import TopNavbar from '@/components/pc/TopNavbar.vue'
import SideMenu from '@/components/pc/SideMenu.vue'
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.pc-layout {
  min-height: 100vh;
  background: $bg-primary;
}

.main-content {
  margin-left: 220px;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  background: $bg-primary;
  padding: 32px;
}
</style>
```

### 7.2 移动端布局使用

```vue
<template>
  <div class="mobile-layout">
    <main class="main-content">
      <router-view />
    </main>
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import TabBar from '@/components/mobile/TabBar.vue'
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.mobile-layout {
  min-height: 100vh;
  background: $bg-primary;
}

.main-content {
  min-height: calc(100vh - 50px);
  background: $bg-primary;
  padding: 16px;
  padding-bottom: calc(50px + env(safe-area-inset-bottom, 16px));
}
</style>
```

### 7.3 组件组合使用

```vue
<template>
  <div class="page">
    <h1 class="page-title">网页收藏</h1>
    
    <div class="action-bar">
      <Button variant="primary" @click="showAddModal = true">
        + 添加网页
      </Button>
    </div>
    
    <div class="web-collection-grid">
      <WebCard
        v-for="web in webCollections"
        :key="web.id"
        :web="web"
        @click="handleWebClick"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
    
    <Modal v-model:show="showAddModal">
      <template #header>
        <h2>添加网页收藏</h2>
      </template>
      
      <form @submit.prevent="handleSubmit">
        <Input
          v-model="formData.url"
          label="网址"
          placeholder="https://example.com"
          required
        />
        
        <Input
          v-model="formData.title"
          label="标题"
          placeholder="网站标题"
        />
        
        <Input
          v-model="formData.description"
          label="简介"
          placeholder="网站简介"
          type="textarea"
        />
      </form>
      
      <template #footer>
        <Button variant="ghost" @click="showAddModal = false">取消</Button>
        <Button variant="primary" @click="handleSubmit">保存</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Modal from '@/components/common/Modal.vue'
import WebCard from '@/components/pc/WebCard.vue'

const showAddModal = ref(false)
const formData = ref({
  url: '',
  title: '',
  description: ''
})

const webCollections = ref([
  {
    id: '1',
    title: 'GitHub',
    description: '代码托管平台',
    icon_url: '',
    category: '编程AI',
    url: 'https://github.com'
  }
])

const handleWebClick = (web: any) => {
  console.log('点击网页:', web)
}

const handleEdit = (web: any) => {
  console.log('编辑网页:', web)
}

const handleDelete = (id: string) => {
  console.log('删除网页:', id)
}

const handleSubmit = () => {
  console.log('提交表单:', formData.value)
  showAddModal.value = false
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: $font-size-4xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin: 0 0 8px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.web-collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
</style>
```