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
        <div class="header-icons">
          <button class="header-icon-btn" title="通知">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="notification-dot"></span>
          </button>
          <button class="header-icon-btn" title="设置">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
        <div class="user-dropdown">
          <div class="user-avatar" @click="toggleDropdown">
            <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" alt="用户头像" />
            <span v-else class="avatar-placeholder">{{ username.charAt(0) }}</span>
          </div>
          <div class="dropdown-menu" :class="{ show: showDropdown }">
             <div class="dropdown-header">
               <div class="dropdown-avatar">
                 <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" alt="用户头像" />
                 <span v-else class="dropdown-avatar-placeholder">{{ username.charAt(0) }}</span>
               </div>
               <div class="dropdown-user-info">
                 <span class="dropdown-username">{{ username }}</span>
               </div>
             </div>
             <div class="dropdown-divider"></div>
             <button class="dropdown-item logout" @click="handleLogout">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                 <polyline points="16 17 21 12 16 7"></polyline>
                 <line x1="21" y1="12" x2="9" y2="12"></line>
               </svg>
               退出登录
             </button>
          </div>
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
const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

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
  background-color: #0f172a;
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

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.header-icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #60a5fa;
}

.notification-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid #0f172a;
}

.user-dropdown {
  position: relative;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  cursor: pointer;
  transition: border-color 0.2s;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0042a6, #0066cc);
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid #e2e8f0;
  z-index: 100;
  overflow: hidden;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-header {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.dropdown-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0042a6, #0066cc);
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
}

.dropdown-username {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
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
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 24px 0;
  background-image: radial-gradient(rgba(0, 66, 166, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
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
  background-image: radial-gradient(rgba(0, 66, 166, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}
</style>