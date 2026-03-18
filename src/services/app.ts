import supabase from './supabase'
import type {
  App,
  ApiResponse
} from '@/types'

interface FetchAppsOptions {
  categoryId?: string
  isActive?: boolean
}

class AppService {
  async fetchAll(options: FetchAppsOptions = {}): Promise<ApiResponse<App[]>> {
    try {
      const {
        categoryId,
        isActive = true
      } = options

      let query = supabase
        .from('apps')
        .select(`
          *,
          category:categories(*)
        `)
        .order('sort_order', { ascending: true })

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      if (isActive !== undefined) {
        query = query.eq('is_active', isActive)
      }

      const { data, error } = await query

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as App[],
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async fetchById(id: string): Promise<ApiResponse<App>> {
    try {
      const { data, error } = await supabase
        .from('apps')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as App,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }
}

export default new AppService()
