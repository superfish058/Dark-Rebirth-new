import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const userNickname = computed(() => user.value?.nickname || '未登录')
  const userAvatar = computed(() => user.value?.avatar_url || '')
  const userEmail = computed(() => user.value?.email || '')

  async function init() {
    loading.value = true
    try {
      user.value = await authService.getCurrentUser()
    } catch (error) {
      console.error('初始化用户状态失败:', error)
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const result = await authService.login({ email, password })
      if (result.error) {
        throw new Error(result.error)
      }
      user.value = result.data?.user || null
      return result
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, nickname?: string) {
    loading.value = true
    try {
      const result = await authService.register({ email, password, nickname })
      if (result.error) {
        throw new Error(result.error)
      }
      user.value = result.data?.user || null
      return result
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authService.logout()
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(updates: Partial<Pick<User, 'nickname' | 'avatar_url'>>) {
    loading.value = true
    try {
      const result = await authService.updateProfile(updates)
      if (result.error) {
        throw new Error(result.error)
      }
      user.value = result.data || null
      return result
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    userNickname,
    userAvatar,
    userEmail,
    init,
    login,
    register,
    logout,
    updateProfile
  }
}, {
  persist: {
    key: 'dark-rebirth-user',
    storage: localStorage,
    paths: ['user']
  }
})