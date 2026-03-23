import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userData = JSON.parse(localStorage.getItem('user') || 'null')
  const user = reactive(userData || {})

  const isLoggedIn = computed(() => !!token.value && !!user)

  const api = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  api.interceptors.request.use((config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  function setAuth(newToken, newUser) {
    token.value = newToken
    Object.assign(user, newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function clearAuth() {
    token.value = ''
    Object.keys(user).forEach(key => delete user[key])
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function register(username, email, password) {
    const response = await api.post('/register', { username, email, password })
    setAuth(response.data.token, response.data.user)
    return response.data
  }

  async function login(username, password) {
    const response = await api.post('/login', { username, password })
    setAuth(response.data.token, response.data.user)
    return response.data
  }

  function logout() {
    clearAuth()
  }

  async function updateAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await api.post('/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    user.avatar = response.data.avatar
    localStorage.setItem('user', JSON.stringify(user))
    return response.data
  }

  async function getPlans() {
    const response = await api.get('/plans/today')
    return response.data
  }

  async function createPlan(content) {
    const response = await api.post('/plans', { content })
    return response.data
  }

  async function updatePlan(id, content) {
    const response = await api.put(`/plans/${id}`, { content })
    return response.data
  }

  async function deletePlan(id) {
    await api.delete(`/plans/${id}`)
  }

  async function toggleComplete(id, completed) {
    const response = await api.patch(`/plans/${id}/complete`, { completed })
    return response.data
  }

  return {
    token,
    user,
    isLoggedIn,
    api,
    register,
    login,
    logout,
    updateAvatar,
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
    toggleComplete
  }
})
