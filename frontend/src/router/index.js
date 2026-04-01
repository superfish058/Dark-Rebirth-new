import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import DesktopView from '../views/desktop/DesktopView.vue'

// 检测设备类型
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 移动端路由
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/desktop',
    name: 'Desktop',
    component: DesktopView,
    meta: { requiresAuth: true }
  },
  // 移动端路由
  {
    path: '/mobile',
    name: 'MobileHome',
    component: () => import('../views/mobile/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/apps',
    name: 'MobileApps',
    component: () => import('../views/mobile/AppsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/profile',
    name: 'MobileProfile',
    component: () => import('../views/mobile/profile/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/plan',
    name: 'MobilePlan',
    component: () => import('../views/mobile/plan/PlanView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/journal',
    name: 'MobileJournal',
    component: () => import('../views/mobile/journal/JournalView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresGuest && userStore.isLoggedIn) {
    // 根据设备类型重定向到不同视图
    if (isMobileDevice()) {
      next('/mobile')
    } else {
      next('/desktop')
    }
  } else {
    next()
  }
})

export default router
