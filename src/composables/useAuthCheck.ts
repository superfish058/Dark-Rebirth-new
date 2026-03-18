import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

export function useAuthCheck() {
  const router = useRouter()
  const userStore = useUserStore()

  async function requireAuth(): Promise<boolean> {
    if (userStore.isAuthenticated) {
      return true
    }

    try {
      await ElMessageBox.confirm(
        '此功能需要登录后才能使用，是否前往登录页面？',
        '需要登录',
        {
          confirmButtonText: '前往登录',
          cancelButtonText: '取消',
          type: 'info',
          customClass: 'auth-confirm-dialog'
        }
      )

      router.push('/auth/login')
      return false
    } catch {
      return false
    }
  }

  async function checkAuth(): Promise<boolean> {
    return userStore.isAuthenticated
  }

  return {
    requireAuth,
    checkAuth
  }
}
