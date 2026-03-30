import api from './index'

export const authAPI = {
  register(username, email, password) {
    return api.post('/register', { username, email, password })
  },
  
  login(username, password) {
    return api.post('/login', { username, password })
  },
  
  getUser() {
    return api.get('/user')
  },
  
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
