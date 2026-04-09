import axios from 'axios'
import notificationService from '../utils/notification'
import { useUserStore } from '../stores/user'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status
      let message = '请求失败'
      
      switch (status) {
        case 401:
          message = '未授权，请重新登录'
          // 清除认证信息
          const userStore = useUserStore()
          userStore.logout()
          break
        case 403:
          message = '拒绝访问'
          // 清除认证信息
          const userStore403 = useUserStore()
          userStore403.logout()
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data.error || '请求失败'
      }
      
      notificationService.error(message)
    } else if (error.request) {
      // 请求已发送但没有收到响应
      notificationService.error('网络错误，无法连接到服务器')
    } else {
      // 请求配置出错
      notificationService.error('请求配置错误')
    }
    return Promise.reject(error)
  }
)

export default api
