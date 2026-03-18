# Dark Rebirth 前端设计系统

## 1. 设计系统概述

### 1.1 设计理念
- **深色主题优先**：采用现代深色设计风格，提供沉浸式体验
- **简洁优雅**：去除冗余元素，突出核心内容
- **响应式优先**：确保在所有设备上都有出色的用户体验
- **可访问性**：遵循WCAG 2.1 AA标准，确保所有用户都能使用

### 1.2 设计原则
1. **一致性**：统一的视觉语言和交互模式
2. **层次清晰**：通过大小、颜色、间距建立清晰的视觉层次
3. **反馈及时**：每个交互都有明确的视觉反馈
4. **性能优先**：轻量级设计，快速加载

---

## 2. 颜色系统

### 2.1 主色调（深色主题）

#### 主色系 - 紫色渐变
```scss
$primary-color: #8B5CF6;
$primary-light: #A78BFA;
$primary-dark: #7C3AED;
$primary-gradient: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
```

#### 背景色系
```scss
// 深色背景
$bg-primary: #0F0F23;
$bg-secondary: #1A1A2E;
$bg-tertiary: #252542;
$bg-elevated: #2D2D4A;

// 浅色背景（用于卡片等）
$bg-card: #1E1E38;
$bg-hover: #2A2A48;
$bg-active: #353558;
```

#### 文字色系
```scss
$text-primary: #FFFFFF;
$text-secondary: #A0A0B0;
$text-tertiary: #707080;
$text-disabled: #505060;
```

#### 功能色系
```scss
// 成功
$success-primary: #22C55E;
$success-light: #4ADE80;
$success-dark: #16A34A;
$success-bg: rgba(34, 197, 94, 0.1);

// 警告
$warning-primary: #F59E0B;
$warning-light: #FBBF24;
$warning-dark: #D97706;
$warning-bg: rgba(245, 158, 11, 0.1);

// 错误
$error-primary: #EF4444;
$error-light: #F87171;
$error-dark: #DC2626;
$error-bg: rgba(239, 68, 68, 0.1);

// 信息
$info-primary: #3B82F6;
$info-light: #60A5FA;
$info-dark: #2563EB;
$info-bg: rgba(59, 130, 246, 0.1);
```

#### 边框色系
```scss
$border-primary: rgba(255, 255, 255, 0.1);
$border-secondary: rgba(255, 255, 255, 0.05);
$border-focus: $primary-color;
```

#### 阴影色系
```scss
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);

// 发光效果
$glow-primary: 0 0 20px rgba(139, 92, 246, 0.3);
$glow-secondary: 0 0 30px rgba(99, 102, 241, 0.2);
```

### 2.2 颜色使用规范

| 场景 | 颜色 | 说明 |
|------|------|------|
| 主按钮 | $primary-gradient | 渐变紫色，突出显示 |
| 次要按钮 | $bg-tertiary | 深色背景，白色文字 |
| 卡片背景 | $bg-card | 深色卡片背景 |
| 输入框 | $bg-tertiary | 深色输入框 |
| 输入框聚焦 | $primary-color | 紫色边框 |
| 标题 | $text-primary | 白色 |
| 正文 | $text-secondary | 浅灰色 |
| 辅助文字 | $text-tertiary | 深灰色 |
| 分割线 | $border-primary | 半透明白色 |

---

## 3. 字体系统

### 3.1 字体家族
```scss
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
$font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### 3.2 字体大小与行高
```scss
$font-size-xs: 12px;
$line-height-xs: 1.5;

$font-size-sm: 14px;
$line-height-sm: 1.5;

$font-size-base: 16px;
$line-height-base: 1.6;

$font-size-lg: 18px;
$line-height-lg: 1.5;

$font-size-xl: 20px;
$line-height-xl: 1.4;

$font-size-2xl: 24px;
$line-height-2xl: 1.3;

$font-size-3xl: 32px;
$line-height-3xl: 1.2;

$font-size-4xl: 40px;
$line-height-4xl: 1.1;

$font-size-5xl: 48px;
$line-height-5xl: 1.1;
```

### 3.3 字重
```scss
$font-weight-light: 300;
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### 3.4 字体使用规范

| 用途 | 字体大小 | 字重 | 行高 | 颜色 |
|------|----------|------|------|------|
| 页面标题 | $font-size-4xl | $font-weight-bold | $line-height-4xl | $text-primary |
| 区块标题 | $font-size-2xl | $font-weight-semibold | $line-height-2xl | $text-primary |
| 卡片标题 | $font-size-xl | $font-weight-semibold | $line-height-xl | $text-primary |
| 正文 | $font-size-base | $font-weight-regular | $line-height-base | $text-secondary |
| 辅助文字 | $font-size-sm | $font-weight-regular | $line-height-sm | $text-tertiary |
| 按钮 | $font-size-base | $font-weight-medium | - | $text-primary |
| 标签 | $font-size-xs | $font-weight-medium | - | $text-secondary |

---

## 4. 间距系统

### 4.1 间距规范（8px基准）
```scss
$spacing-0: 0;
$spacing-1: 4px;
$spacing-2: 8px;
$spacing-3: 12px;
$spacing-4: 16px;
$spacing-5: 20px;
$spacing-6: 24px;
$spacing-8: 32px;
$spacing-10: 40px;
$spacing-12: 48px;
$spacing-16: 64px;
$spacing-20: 80px;
$spacing-24: 96px;
```

### 4.2 间距使用场景

| 场景 | 间距值 | 说明 |
|------|--------|------|
| 元素内边距 | $spacing-4 | 卡片、按钮内部 |
| 紧密元素间距 | $spacing-2 | 相关元素之间 |
| 默认间距 | $spacing-4 | 一般元素间距 |
| 区块间距 | $spacing-6 | 区块之间 |
| 页面边距 | $spacing-6 | 页面内容边距 |
| 大区块间距 | $spacing-8 | 主要区块之间 |
| 页面顶部间距 | $spacing-8 | 页面顶部 |

---

## 5. 圆角系统

```scss
$radius-none: 0;
$radius-sm: 4px;
$radius-base: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$radius-xl: 24px;
$radius-full: 9999px;
```

### 圆角使用规范

| 元素 | 圆角值 |
|------|--------|
| 按钮 | $radius-base |
| 输入框 | $radius-base |
| 卡片 | $radius-md |
| 模态框 | $radius-lg |
| 头像 | $radius-full |
| 标签 | $radius-full |

---

## 6. 动画系统

### 6.1 动画时长
```scss
$duration-fast: 150ms;
$duration-base: 300ms;
$duration-slow: 500ms;
```

### 6.2 动画缓动函数
```scss
$ease-in: cubic-bezier(0.4, 0, 1, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 6.3 常用动画

#### 淡入淡出
```scss
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

#### 滑入滑出
```scss
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
```

#### 缩放
```scss
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
```

#### 脉冲
```scss
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

#### 发光
```scss
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
  }
}
```

---

## 7. 断点系统

### 7.1 响应式断点
```scss
$breakpoint-xs: 0;
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
$breakpoint-2xl: 1400px;
```

### 7.2 媒体查询混入
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

---

## 8. 组件设计规范

### 8.1 按钮组件

#### 主按钮
```scss
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 $spacing-6;
  background: $primary-gradient;
  border: none;
  border-radius: $radius-base;
  color: $text-primary;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $duration-base $ease-out;
  box-shadow: $glow-primary;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
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

#### 次要按钮
```scss
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 $spacing-6;
  background: $bg-tertiary;
  border: 1px solid $border-primary;
  border-radius: $radius-base;
  color: $text-primary;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $duration-base $ease-out;

  &:hover {
    background: $bg-hover;
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:active {
    background: $bg-active;
  }
}
```

#### 幽灵按钮
```scss
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 $spacing-6;
  background: transparent;
  border: none;
  border-radius: $radius-base;
  color: $text-secondary;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $duration-base $ease-out;

  &:hover {
    background: $bg-hover;
    color: $text-primary;
  }

  &:active {
    background: $bg-active;
  }
}
```

### 8.2 输入框组件

```scss
.input {
  width: 100%;
  height: 44px;
  padding: 0 $spacing-4;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.error {
    border-color: $error-primary;

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
  }
}
```

### 8.3 卡片组件

```scss
.card {
  background: $bg-card;
  border: 1px solid $border-primary;
  border-radius: $radius-md;
  overflow: hidden;
  transition: all $duration-base $ease-out;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: $shadow-lg;
  }

  &.elevated {
    box-shadow: $shadow-md;
  }

  &.clickable {
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.card-header {
  padding: $spacing-6;
  border-bottom: 1px solid $border-secondary;
}

.card-body {
  padding: $spacing-6;
}

.card-footer {
  padding: $spacing-6;
  border-top: 1px solid $border-secondary;
}
```

### 8.4 标签组件

```scss
.tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 $spacing-3;
  background: $bg-tertiary;
  border-radius: $radius-full;
  color: $text-secondary;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  transition: all $duration-base $ease-out;

  &.primary {
    background: rgba(139, 92, 246, 0.2);
    color: $primary-light;
  }

  &.success {
    background: $success-bg;
    color: $success-light;
  }

  &.warning {
    background: $warning-bg;
    color: $warning-light;
  }

  &.error {
    background: $error-bg;
    color: $error-light;
  }
}
```

---

## 9. 布局系统

### 9.1 容器
```scss
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-6;

  @include mobile {
    padding: 0 $spacing-4;
  }
}
```

### 9.2 网格系统
```scss
.grid {
  display: grid;
  gap: $spacing-6;

  &-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  &-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  @include mobile {
    &-2,
    &-3,
    &-4 {
      grid-template-columns: 1fr;
    }
  }
}
```

### 9.3 Flex布局
```scss
.flex {
  display: flex;

  &-center {
    align-items: center;
    justify-content: center;
  }

  &-between {
    justify-content: space-between;
  }

  &-column {
    flex-direction: column;
  }

  &-wrap {
    flex-wrap: wrap;
  }
}
```

---

## 10. 可访问性

### 10.1 焦点状态
```scss
*:focus-visible {
  outline: 2px solid $primary-color;
  outline-offset: 2px;
}
```

### 10.2 跳过链接
```scss
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
```

### 10.3 屏幕阅读器
```scss
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
```

---

## 11. 设计Token导出

### 11.1 CSS变量
```scss
:root {
  // 颜色
  --color-primary: #8B5CF6;
  --color-primary-light: #A78BFA;
  --color-primary-dark: #7C3AED;
  
  --bg-primary: #0F0F23;
  --bg-secondary: #1A1A2E;
  --bg-tertiary: #252542;
  --bg-card: #1E1E38;
  
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0B0;
  --text-tertiary: #707080;
  
  --border-primary: rgba(255, 255, 255, 0.1);
  
  // 字体
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-base: 16px;
  
  // 间距
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  
  // 圆角
  --radius-base: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  
  // 阴影
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  
  // 动画
  --duration-base: 300ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

---

## 12. 设计资源

### 12.1 图标系统
- 使用图标库：Heroicons、Lucide Icons
- 图标大小：16px、20px、24px、32px
- 图标颜色：继承文字颜色或使用主色调

### 12.2 图片规范
- 格式：WebP（优先）、PNG、JPG
- 压缩：保持视觉质量的同时最小化文件大小
- 响应式：提供多种尺寸的图片
- 懒加载：所有非首屏图片都应懒加载

### 12.3 占位图
- 使用渐变背景或图案作为占位
- 加载状态显示骨架屏
- 错误状态显示占位图标

---

## 13. 设计检查清单

在完成任何设计前，请确保：

- [ ] 颜色对比度符合WCAG AA标准
- [ ] 所有交互元素都有明确的视觉反馈
- [ ] 触摸目标最小尺寸为44×44px
- [ ] 文字大小不小于14px
- [ ] 间距遵循8px网格系统
- [ ] 动画时长不超过500ms
- [ ] 所有状态（默认、悬停、激活、禁用）都已设计
- [ ] 设计在不同设备上都能正常显示
- [ ] 空状态和错误状态都已考虑
- [ ] 设计符合整体设计系统规范