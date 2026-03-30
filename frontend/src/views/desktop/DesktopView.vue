<template>
  <div class="desktop-view">
    <!-- 顶部区域 -->
    <header class="desktop-header">
      <div class="header-left">
        <div class="logo">
          <img src="/logo.png" alt="Logo" class="logo-img" />
          <span class="logo-text">Dark Rebirth</span>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <span class="username">{{ username }}</span>
          <button class="logout-btn" @click="handleLogout">退出登录</button>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="desktop-main">
      <!-- 左侧菜单栏 -->
      <aside class="desktop-sidebar">
        <nav class="sidebar-nav">
          <div class="nav-item" :class="{ active: activeMenu === 'favorites' }" @click="setActiveMenu('favorites')">
            <span class="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
            <span class="nav-label">网页收藏</span>
          </div>
          <div class="nav-item" :class="{ active: activeMenu === 'apps' }" @click="setActiveMenu('apps')">
            <span class="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </span>
            <span class="nav-label">全部应用</span>
          </div>
        </nav>
      </aside>

      <!-- 右侧路由展示区域 -->
      <section class="desktop-content">
        <FavoritesView v-if="activeMenu === 'favorites'" />
        <AppsView v-else-if="activeMenu === 'apps'" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import FavoritesView from './components/FavoritesView.vue'
import AppsView from './components/AppsView.vue'

const router = useRouter()
const userStore = useUserStore()
const activeMenu = ref('favorites')
const username = ref(userStore.user?.username || '用户')

function setActiveMenu(menu) {
  activeMenu.value = menu
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.desktop-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

/* 顶部区域 */
.desktop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background-color: #0042a6;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left .logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
}

.logo-img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: contain;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.header-right .user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-weight: 500;
}

.logout-btn {
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 主内容区域 */
.desktop-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧菜单栏 */
.desktop-sidebar {
  width: 240px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  padding: 24px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 3px;
  margin: 0 8px;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #0042a6;
  transform: scaleY(0);
  transition: transform 0.2s ease;
}

.nav-item:hover {
  background-color: #f8fafc;
}

.nav-item.active {
  background-color: rgba(0, 66, 166, 0.08);
  color: #0042a6;
  font-weight: 500;
}

.nav-item.active::before {
  transform: scaleY(1);
}

.nav-icon {
  font-size: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background: rgba(0, 66, 166, 0.1);
  color: #0042a6;
  transition: all 0.2s;
}

.nav-item.active .nav-icon {
  background: #0042a6;
  color: white;
}

.nav-label {
  font-size: 14px;
  font-weight: 400;
  transition: all 0.2s;
}

.nav-item.active .nav-label {
  font-weight: 600;
}

/* 右侧路由展示区域 */
.desktop-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f8fafc;
}
</style>