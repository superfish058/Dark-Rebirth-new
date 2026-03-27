<template>
  <div class="desktop-view">
    <!-- 顶部区域 -->
    <header class="desktop-header">
      <div class="header-left">
        <div class="logo">✨ 暗皇新生</div>
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
            <span class="nav-icon">⭐</span>
            <span class="nav-label">网页收藏</span>
          </div>
          <div class="nav-item" :class="{ active: activeMenu === 'apps' }" @click="setActiveMenu('apps')">
            <span class="nav-icon">📱</span>
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
  background-color: #0ea5e9;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left .logo {
  font-size: 20px;
  font-weight: 700;
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
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: #f1f5f9;
}

.nav-item.active {
  background-color: #e0f2fe;
  border-left-color: #0ea5e9;
  color: #0ea5e9;
  font-weight: 500;
}

.nav-icon {
  font-size: 18px;
}

.nav-label {
  font-size: 14px;
}

/* 右侧路由展示区域 */
.desktop-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f8fafc;
}
</style>