import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

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
        path: '',
        redirect: '/pc/web-collection'
      },
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
        path: '',
        redirect: '/m/home'
      },
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

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

export default router