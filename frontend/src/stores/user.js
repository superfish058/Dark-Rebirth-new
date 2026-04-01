import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { authAPI } from '../api/auth'
import { plansAPI } from '../api/plans'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userData = JSON.parse(localStorage.getItem('user') || 'null')
  const user = reactive(userData || {})

  const isLoggedIn = computed(() => !!token.value && !!user)

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
    const response = await authAPI.register(username, email, password)
    setAuth(response.data.token, response.data.user)
    return response.data
  }

  async function login(username, password) {
    const response = await authAPI.login(username, password)
    setAuth(response.data.token, response.data.user)
    return response.data
  }

  function logout() {
    clearAuth()
  }

  async function updateAvatar(file) {
    const response = await authAPI.uploadAvatar(file)
    user.avatar = response.data.avatar
    localStorage.setItem('user', JSON.stringify(user))
    return response.data
  }

  async function getPlans() {
    const response = await plansAPI.getPlans()
    return response.data
  }

  async function getPlansByDate(date) {
    const response = await plansAPI.getPlansByDate(date)
    return response.data
  }

  async function getPlansByWeek(startDate) {
    const response = await plansAPI.getPlansByWeek(startDate)
    return response.data
  }

  async function getIncompletePlans() {
    const response = await plansAPI.getIncompletePlans()
    return response.data
  }

  async function createPlan(content, date = null) {
    const response = await plansAPI.createPlan(content, date)
    return response.data
  }

  async function updatePlan(id, content) {
    const response = await plansAPI.updatePlan(id, content)
    return response.data
  }

  async function deletePlan(id) {
    await plansAPI.deletePlan(id)
  }

  async function toggleComplete(id, completed) {
    const response = await plansAPI.toggleComplete(id, completed)
    return response.data
  }

  async function getPlanStats() {
    const response = await plansAPI.getPlanStats()
    return response.data
  }

  return {
    token,
    user,
    isLoggedIn,
    register,
    login,
    logout,
    updateAvatar,
    getPlans,
    getPlansByDate,
    getPlansByWeek,
    getIncompletePlans,
    createPlan,
    updatePlan,
    deletePlan,
    toggleComplete,
    getPlanStats
  }
})