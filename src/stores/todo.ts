import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import todoService from '@/services/todo'
import type { Todo, PaginatedResponse } from '@/types'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  const hasMore = computed(() => currentPage.value * pageSize.value < total.value)

  const pendingTodos = computed(() => 
    todos.value.filter(todo => todo.status === 'pending')
  )
  
  const inProgressTodos = computed(() => 
    todos.value.filter(todo => todo.status === 'in_progress')
  )
  
  const completedTodos = computed(() => 
    todos.value.filter(todo => todo.status === 'completed')
  )

  async function fetchAll(options?: {
    status?: 'pending' | 'in_progress' | 'completed'
    page?: number
    pageSize?: number
    sortBy?: 'created_at' | 'due_date' | 'updated_at'
    sortOrder?: 'asc' | 'desc'
  }) {
    loading.value = true
    try {
      const result = await todoService.fetchAll({
        status: options?.status,
        page: options?.page || currentPage.value,
        pageSize: options?.pageSize || pageSize.value,
        sortBy: options?.sortBy || 'created_at',
        sortOrder: options?.sortOrder || 'desc'
      })

      if (result.error) {
        throw new Error(result.error)
      }

      const data = result.data as PaginatedResponse<Todo>
      if (options?.page === 1) {
        todos.value = data.data
      } else {
        todos.value = [...todos.value, ...data.data]
      }
      total.value = data.total
      currentPage.value = data.page
      return result
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    try {
      const result = await todoService.fetchById(id)
      if (result.error) {
        throw new Error(result.error)
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function create(data: {
    title: string
    description?: string
    status?: 'pending' | 'in_progress' | 'completed'
    due_date?: string
  }) {
    loading.value = true
    try {
      const result = await todoService.create(data)
      if (result.error) {
        throw new Error(result.error)
      }
      todos.value.unshift(result.data!)
      total.value++
      return result
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: {
    title?: string
    description?: string
    status?: 'pending' | 'in_progress' | 'completed'
    due_date?: string
  }) {
    loading.value = true
    try {
      const result = await todoService.update(id, data)
      if (result.error) {
        throw new Error(result.error)
      }
      const index = todos.value.findIndex(item => item.id === id)
      if (index !== -1) {
        todos.value[index] = result.data!
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    try {
      const result = await todoService.delete(id)
      if (result.error) {
        throw new Error(result.error)
      }
      todos.value = todos.value.filter(item => item.id !== id)
      total.value--
      return result
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: string, status: 'pending' | 'in_progress' | 'completed') {
    return await update(id, { status })
  }

  async function toggleComplete(id: string) {
    loading.value = true
    try {
      const result = await todoService.toggleComplete(id)
      if (result.error) {
        throw new Error(result.error)
      }
      const index = todos.value.findIndex(item => item.id === id)
      if (index !== -1) {
        todos.value[index] = result.data!
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function getOverdueTodos() {
    loading.value = true
    try {
      const result = await todoService.getOverdueTodos()
      if (result.error) {
        throw new Error(result.error)
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function getUpcomingTodos(days: number = 7) {
    loading.value = true
    try {
      const result = await todoService.getUpcomingTodos(days)
      if (result.error) {
        throw new Error(result.error)
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function getStats() {
    loading.value = true
    try {
      const result = await todoService.getStats()
      if (result.error) {
        throw new Error(result.error)
      }
      return result
    } finally {
      loading.value = false
    }
  }

  function reset() {
    todos.value = []
    currentPage.value = 1
    total.value = 0
  }

  return {
    todos,
    loading,
    currentPage,
    pageSize,
    total,
    hasMore,
    pendingTodos,
    inProgressTodos,
    completedTodos,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    updateStatus,
    toggleComplete,
    getOverdueTodos,
    getUpcomingTodos,
    getStats,
    reset
  }
})