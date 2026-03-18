import supabase from './supabase'
import type {
  Category,
  ApiResponse
} from '@/types'

interface CreateCategoryDto {
  name: string
  icon?: string
  sort_order?: number
}

interface UpdateCategoryDto {
  name?: string
  icon?: string
  sort_order?: number
}

class CategoryService {
  async fetchAll(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as Category[],
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async fetchById(id: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
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
        data: data as Category,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async create(dto: CreateCategoryDto): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
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
        data: data as Category,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
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
        data: data as Category,
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
        .from('categories')
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
}

export default new CategoryService()