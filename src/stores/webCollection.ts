import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import webCollectionService from '@/services/webCollection'
import type { WebCollection, PaginatedResponse } from '@/types'

export const useWebCollectionStore = defineStore('webCollection', () => {
  const collections = ref<WebCollection[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  const hasMore = computed(() => currentPage.value * pageSize.value < total.value)

  const collectionsByCategory = computed(() => {
    const grouped: Record<string, WebCollection[]> = {}
    collections.value.forEach(item => {
      const categoryId = item.category_id || 'uncategorized'
      if (!grouped[categoryId]) {
        grouped[categoryId] = []
      }
      grouped[categoryId].push(item)
    })
    return grouped
  })

  async function fetchAll(options?: {
    categoryId?: string
    page?: number
    pageSize?: number
    sortBy?: 'created_at' | 'updated_at'
    sortOrder?: 'asc' | 'desc'
  }) {
    loading.value = true
    try {
      const result = await webCollectionService.fetchAll({
        categoryId: options?.categoryId,
        page: options?.page || currentPage.value,
        pageSize: options?.pageSize || pageSize.value,
        sortBy: options?.sortBy || 'created_at',
        sortOrder: options?.sortOrder || 'desc'
      })

      if (result.error) {
        throw new Error(result.error)
      }

      const data = result.data as PaginatedResponse<WebCollection>
      if (options?.page === 1) {
        collections.value = data.data
      } else {
        collections.value = [...collections.value, ...data.data]
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
      const result = await webCollectionService.fetchById(id)
      if (result.error) {
        throw new Error(result.error)
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function create(data: {
    url: string
    title?: string
    description?: string
    icon_url?: string
    category_id?: string
  }) {
    loading.value = true
    try {
      const result = await webCollectionService.create(data)
      if (result.error) {
        throw new Error(result.error)
      }
      if (result.data) {
        collections.value.unshift(result.data)
        total.value++
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: {
    url?: string
    title?: string
    description?: string
    icon_url?: string
    category_id?: string
  }) {
    loading.value = true
    try {
      const result = await webCollectionService.update(id, data)
      if (result.error) {
        throw new Error(result.error)
      }
      const index = collections.value.findIndex(item => item.id === id)
      if (index !== -1) {
        collections.value[index] = result.data!
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    try {
      const result = await webCollectionService.delete(id)
      if (result.error) {
        throw new Error(result.error)
      }
      collections.value = collections.value.filter(item => item.id !== id)
      total.value--
      return result
    } finally {
      loading.value = false
    }
  }

  async function fetchIconUrl(url: string) {
    return await webCollectionService.fetchIconUrl(url)
  }

  async function fetchPageTitle(url: string) {
    return await webCollectionService.fetchPageTitle(url)
  }

  function reset() {
    collections.value = []
    currentPage.value = 1
    total.value = 0
  }

  return {
    collections,
    loading,
    currentPage,
    pageSize,
    total,
    hasMore,
    collectionsByCategory,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    fetchIconUrl,
    fetchPageTitle,
    reset
  }
})