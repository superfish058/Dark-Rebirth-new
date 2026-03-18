import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

describe('UserStore', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should initialize with null user', () => {
    const store = useUserStore()
    expect(store.user).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should update user nickname', () => {
    const store = useUserStore()
    store.user = {
      id: 'test-id',
      email: 'test@example.com',
      nickname: 'Test User',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    expect(store.userNickname).toBe('Test User')
  })

  it('should return default nickname when user is null', () => {
    const store = useUserStore()
    expect(store.userNickname).toBe('未登录')
  })
})