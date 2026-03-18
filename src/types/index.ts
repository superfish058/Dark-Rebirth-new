export interface User {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface App {
  id: string
  name: string
  description: string | null
  icon: string | null
  url: string | null
  category_id: string
  category?: Category
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  icon: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface WebCollection {
  id: string
  user_id: string
  url: string
  title: string | null
  description: string | null
  icon_url: string | null
  category_id: string | null
  category?: Category
  created_at: string
  updated_at: string
}

export interface Todo {
  id: string
  user_id: string
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  title: string | null
  image_url: string
  link_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: User
  access_token: string
  refresh_token: string
  expires_at: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  nickname?: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}