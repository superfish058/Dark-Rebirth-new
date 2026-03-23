# 每日计划记录器 - UI/UX 设计方案

## 设计理念
采用**温暖治愈的手绘风格**，使用柔和的色彩、不规则的线条和类似蜡笔/水彩的质感，营造轻松愉悦的氛围，让用户在记录计划时感到舒适和愉悦。

---

## 🎨 配色方案

### 方案一：温暖春日（推荐）
**风格**：清新自然，充满生机
```css
--primary: #FF8B6A;        /* 柔和橙红 */
--primary-light: #FFB3A3;
--primary-dark: #E56A4A;
--secondary: #7DD3A4;      /* 薄荷绿 */
--secondary-light: #A8E6C4;
--accent: #FFD97D;         /* 温暖黄 */
--bg-primary: #FFF8F0;     /* 米白底 */
--bg-secondary: #FFEFE5;
--text-primary: #5C4B3E;   /* 深棕 */
--text-secondary: #8B7355;
--border: #E8D9CC;
--success: #7DD3A4;
--warning: #FFD97D;
--error: #FF8B6A;
```

### 方案二：薰衣草梦境
**风格**：柔和梦幻，宁静致远
```css
--primary: #B39DDB;        /* 薰衣草紫 */
--primary-light: #D1C4E9;
--primary-dark: #9575CD;
--secondary: #80DEEA;      /* 水蓝 */
--secondary-light: #B2EBF2;
--accent: #FFCC80;         /* 浅橙 */
--bg-primary: #F8F4FC;     /* 淡紫底 */
--bg-secondary: #EDE7F6;
--text-primary: #4A3C5B;   /* 深紫棕 */
--text-secondary: #796A8A;
--border: #D1C4E9;
--success: #80DEEA;
--warning: #FFCC80;
--error: #EF9A9A;
```

### 方案三：森林小屋
**风格**：自然质朴，温馨舒适
```css
--primary: #8D6E63;        /* 木棕色 */
--primary-light: #A1887F;
--primary-dark: #6D4C41;
--secondary: #A5D6A7;      /* 森林绿 */
--secondary-light: #C8E6C9;
--accent: #FFCC80;         /* 蜂蜜黄 */
--bg-primary: #FAF7F2;     /* 亚麻底 */
--bg-secondary: #EFEBE9;
--text-primary: #42362E;   /* 深咖啡 */
--text-secondary: #6D5D52;
--border: #D7CCC8;
--success: #A5D6A7;
--warning: #FFCC80;
--error: #EF9A9A;
```

---

## ✏️ 手绘风格实现技巧

### 1. 不规则边框
使用 CSS 实现手绘效果的边框：
```css
.hand-drawn-border {
  border: 3px solid var(--border);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
}
```

### 2. 蜡笔质感
使用滤镜和渐变模拟蜡笔效果：
```css
.crayon-effect {
  filter: url(#crayon);
  background: linear-gradient(
    45deg,
    transparent 25%,
    rgba(255,255,255,0.3) 25%,
    rgba(255,255,255,0.3) 50%,
    transparent 50%,
    transparent 75%,
    rgba(255,255,255,0.3) 75%
  );
  background-size: 4px 4px;
}
```

### 3. 纸张纹理
添加纸张质感背景：
```css
.paper-texture {
  background-color: var(--bg-primary);
  background-image: 
    radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.03) 0%, transparent 70%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
}
```

### 4. 手绘按钮
```css
.btn-hand-drawn {
  position: relative;
  padding: 12px 28px;
  border: 3px solid var(--primary);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  background: var(--primary);
  color: white;
  font-family: 'Caveat', 'Comic Sans MS', cursive;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: rotate(-1deg);
}

.btn-hand-drawn:hover {
  transform: rotate(1deg) scale(1.05);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.15);
}
```

### 5. 手绘卡片
```css
.card-hand-drawn {
  background: white;
  border: 2px solid var(--border);
  border-radius: 30px 4px 30px 4px;
  padding: 20px;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.08);
  transform: rotate(-0.5deg);
  transition: transform 0.3s ease;
}

.card-hand-drawn:hover {
  transform: rotate(0.5deg) translateY(-4px);
}
```

---

## 📐 页面布局设计

### 登录/注册页
- 居中布局，手绘风格表单
- 背景使用纸张纹理
- 添加装饰性手绘元素（小花、星星等）

### 主页面
- 顶部：用户头像 + 日期显示
- 中间：计划列表区域
- 底部：添加计划按钮（悬浮 FAB）

### 计划项设计
- 左侧：复选框（手绘风格）
- 中间：计划内容（完成时显示删除线）
- 右侧：编辑/删除按钮

---

## 🎯 推荐方案
我推荐使用 **方案一：温暖春日**，因为：
1. 色彩明亮活泼，能提升用户心情
2. 橙红色和薄荷绿的搭配清新自然
3. 暖色调给人温暖舒适的感觉
4. 非常适合日常计划记录这类应用

---

请确认你更喜欢哪套配色方案，或者是否需要调整！
