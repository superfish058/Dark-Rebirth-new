import supabase from './supabase'
import type {
  Banner,
  ApiResponse
} from '@/types'

interface CreateBannerDto {
  title?: string
  image_url: string
  link_url?: string
  sort_order?: number
  is_active?: boolean
}

interface UpdateBannerDto {
  title?: string
  image_url?: string
  link_url?: string
  sort_order?: number
  is_active?: boolean
}

class BannerService {
  async fetchAll(activeOnly: boolean = true): Promise<ApiResponse<Banner[]>> {
    try {
      let query = supabase
        .from('banners')
        .select('*')
        .order('sort_order', { ascending: true })

      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      const { data, error } = await query

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as Banner[],
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async fetchById(id: string): Promise<ApiResponse<Banner>> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as Banner,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async create(dto: CreateBannerDto): Promise<ApiResponse<Banner>> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert(dto)
        .select('*')
        .single()

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as Banner,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async update(id: string, dto: UpdateBannerDto): Promise<ApiResponse<Banner>> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update(dto)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as Banner,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id)

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

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

  async toggleActive(id: string): Promise<ApiResponse<Banner>> {
    try {
      const { data: current } = await this.fetchById(id)

      if (!current) {
        return {
          data: null,
          error: '轮播图不存在'
        }
      }

      return this.update(id, { is_active: !current.is_active })
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async updateSortOrder(updates: Array<{ id: string; sort_order: number }>): Promise<ApiResponse<void>> {
    try {
      const promises = updates.map(({ id, sort_order }) =>
        supabase
          .from('banners')
          .update({ sort_order })
          .eq('id', id)
      )

      const results = await Promise.all(promises)
      const errors = results.filter(result => result.error)

      if (errors.length > 0) {
        return {
          data: null,
          error: '部分更新失败'
        }
      }

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
}

export default new BannerService()