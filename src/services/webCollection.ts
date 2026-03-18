import supabase from './supabase'
import type {
  WebCollection,
  ApiResponse,
  PaginatedResponse
} from '@/types'

interface CreateWebCollectionDto {
  url: string
  title?: string
  description?: string
  icon_url?: string
  category_id?: string
}

interface UpdateWebCollectionDto {
  url?: string
  title?: string
  description?: string
  icon_url?: string
  category_id?: string
}

interface FetchWebCollectionsOptions {
  categoryId?: string
  page?: number
  pageSize?: number
  sortBy?: 'created_at' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
}

class WebCollectionService {
  async fetchAll(options: FetchWebCollectionsOptions = {}): Promise<ApiResponse<PaginatedResponse<WebCollection>>> {
    try {
      const {
        categoryId,
        page = 1,
        pageSize = 20,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options

      let query = supabase
        .from('web_collections')
        .select(`
          *,
          category:categories(*)
        `)
        .order(sortBy, { ascending: sortOrder === 'asc' })

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await query.range(from, to)

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      const total = count || 0
      const hasMore = from + pageSize < total

      return {
        data: {
          data: data || [],
          total,
          page,
          pageSize,
          hasMore
        },
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async fetchById(id: string): Promise<ApiResponse<WebCollection>> {
    try {
      const { data, error } = await supabase
        .from('web_collections')
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
        data: data as WebCollection,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async create(dto: CreateWebCollectionDto): Promise<ApiResponse<WebCollection>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return {
          data: null,
          error: '用户未登录'
        }
      }

      const { data, error } = await supabase
        .from('web_collections')
        .insert({
          user_id: user.id,
          ...dto
        })
        .select(`
          *,
          category:categories(*)
        `)
        .single()

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as WebCollection,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async update(id: string, dto: UpdateWebCollectionDto): Promise<ApiResponse<WebCollection>> {
    try {
      const { data, error } = await supabase
        .from('web_collections')
        .update(dto)
        .eq('id', id)
        .select(`
          *,
          category:categories(*)
        `)
        .single()

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as WebCollection,
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
        .from('web_collections')
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

  async fetchIconUrl(url: string): Promise<string> {
    try {
      const domain = new URL(url).hostname

      const faviconUrls = [
        `https://${domain}/favicon.ico`,
        `https://${domain}/apple-touch-icon.png`,
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      ]

      for (const faviconUrl of faviconUrls) {
        try {
          const response = await fetch(faviconUrl, { method: 'HEAD' })
          if (response.ok) {
            return faviconUrl
          }
        } catch {
          continue
        }
      }

      return ''
    } catch {
      return ''
    }
  }

  async fetchPageTitle(url: string): Promise<string> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return ''
      }

      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const title = doc.querySelector('title')?.textContent || ''

      return title
    } catch {
      return ''
    }
  }
}

export default new WebCollectionService()