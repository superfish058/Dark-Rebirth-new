import supabase from './supabase'
import type {
  User,
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  ApiResponse
} from '@/types'

class AuthService {
  private currentUser: User | null = null

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await this.loadUserProfile(session.user.id)
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await this.loadUserProfile(session.user.id)
      } else {
        this.currentUser = null
      }
    })
  }

  private async loadUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('加载用户信息失败:', error)
      return
    }

    if (data) {
      this.currentUser = {
        id: data.id,
        email: '', 
        nickname: data.nickname,
        avatar_url: data.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      if (data.user && data.session) {
        await this.loadUserProfile(data.user.id)
        return {
          data: {
            user: this.currentUser!,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at!
          },
          error: null
        }
      }

      return {
        data: null,
        error: '登录失败'
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthSession>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            nickname: credentials.nickname || credentials.email.split('@')[0]
          }
        }
      })

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      if (data.user && data.session) {
        await this.loadUserProfile(data.user.id)
        return {
          data: {
            user: this.currentUser!,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at!
          },
          error: null
        }
      }

      return {
        data: null,
        error: '注册失败'
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      this.currentUser = null
      return {
        data: null,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser
  }

  async updateProfile(updates: Partial<Pick<User, 'nickname' | 'avatar_url'>>): Promise<ApiResponse<User>> {
    if (!this.currentUser) {
      return {
        data: null,
        error: '用户未登录'
      }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', this.currentUser.id)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      if (data) {
        this.currentUser = {
          ...this.currentUser,
          ...updates
        }
        return {
          data: this.currentUser,
          error: null
        }
      }

      return {
        data: null,
        error: '更新失败'
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async resetPassword(email: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: null,
        error: null,
        message: '密码重置邮件已发送'
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }
}

export default new AuthService()