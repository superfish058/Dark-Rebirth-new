import api from './index'

export const favoritesAPI = {
  getFavorites() {
    return api.get('/favorites')
  },
  
  createWebsite(data) {
    return api.post('/favorites/websites', data)
  },
  
  updateWebsite(id, data) {
    return api.put(`/favorites/websites/${id}`, data)
  },
  
  deleteWebsite(id) {
    return api.delete(`/favorites/websites/${id}`)
  },
  
  createCategory(name) {
    return api.post('/favorites/categories', { name })
  },
  
  updateCategory(id, data) {
    return api.put(`/favorites/categories/${id}`, data)
  },
  
  deleteCategory(id) {
    return api.delete(`/favorites/categories/${id}`)
  }
}
