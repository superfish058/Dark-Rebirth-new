import supabase from './supabase'
import type {
  Todo,
  ApiResponse,
  PaginatedResponse
} from '@/types'

interface CreateTodoDto {
  title: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed'
  due_date?: string
}

interface UpdateTodoDto {
  title?: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed'
  due_date?: string
}

interface FetchTodosOptions {
  status?: 'pending' | 'in_progress' | 'completed'
  page?: number
  pageSize?: number
  sortBy?: 'created_at' | 'due_date' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
}

class TodoService {
  async fetchAll(options: FetchTodosOptions = {}): Promise<ApiResponse<PaginatedResponse<Todo>>> {
    try {
      const {
        status,
        page = 1,
        pageSize = 20,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options

      let query = supabase
        .from('todos')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })

      if (status) {
        query = query.eq('status', status)
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

  async fetchById(id: string): Promise<ApiResponse<Todo>> {
    try {
      const { data, error } = await supabase
        .from('todos')
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
        data: data as Todo,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async create(dto: CreateTodoDto): Promise<ApiResponse<Todo>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return {
          data: null,
          error: '用户未登录'
        }
      }

      const { data, error } = await supabase
        .from('todos')
        .insert({
          user_id: user.id,
          ...dto
        })
        .select('*')
        .single()

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as Todo,
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async update(id: string, dto: UpdateTodoDto): Promise<ApiResponse<Todo>> {
    try {
      const { data, error } = await supabase
        .from('todos')
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
        data: data as Todo,
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
        .from('todos')
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

  async updateStatus(id: string, status: 'pending' | 'in_progress' | 'completed'): Promise<ApiResponse<Todo>> {
    return this.update(id, { status })
  }

  async toggleComplete(id: string): Promise<ApiResponse<Todo>> {
    try {
      const { data: current } = await this.fetchById(id)

      if (!current) {
        return {
          data: null,
          error: '待办事项不存在'
        }
      }

      const newStatus = current.status === 'completed' ? 'pending' : 'completed'
      return this.update(id, { status: newStatus })
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async getOverdueTodos(): Promise<ApiResponse<Todo[]>> {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .lt('due_date', new Date().toISOString())
        .in('status', ['pending', 'in_progress'])
        .order('due_date', { ascending: true })

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as Todo[],
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async getUpcomingTodos(days: number = 7): Promise<ApiResponse<Todo[]>> {
    try {
      const now = new Date()
      const future = new Date()
      future.setDate(now.getDate() + days)

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .gte('due_date', now.toISOString())
        .lte('due_date', future.toISOString())
        .in('status', ['pending', 'in_progress'])
        .order('due_date', { ascending: true })

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      return {
        data: data as Todo[],
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async getStats(): Promise<ApiResponse<{
    total: number
    pending: number
    inProgress: number
    completed: number
    overdue: number
  }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return {
          data: null,
          error: '用户未登录'
        }
      }

      const { data: allTodos, error } = await supabase
        .from('todos')
        .select('status, due_date')
        .eq('user_id', user.id)

      if (error) {
        return {
          data: null,
          error: error.message
        }
      }

      const now = new Date().toISOString()
      const stats = {
        total: allTodos?.length || 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0
      }

      allTodos?.forEach(todo => {
        if (todo.status === 'pending') {
          stats.pending++
          if (todo.due_date && todo.due_date < now) {
            stats.overdue++
          }
        } else if (todo.status === 'in_progress') {
          stats.inProgress++
          if (todo.due_date && todo.due_date < now) {
            stats.overdue++
          }
        } else if (todo.status === 'completed') {
          stats.completed++
        }
      })

      return {
        data: stats,
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

export default new TodoService()