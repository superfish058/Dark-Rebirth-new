import api from './index'

export const plansAPI = {
  getPlans() {
    return api.get('/plans/today')
  },
  
  getPlansByDate(date) {
    return api.get(`/plans/date/${date}`)
  },
  
  getPlansByWeek(startDate) {
    return api.get(`/plans/week/${startDate}`)
  },
  
  getIncompletePlans() {
    return api.get('/incomplete-plans')
  },
  
  createPlan(content, date = null) {
    return api.post('/plans', { content, date })
  },
  
  updatePlan(id, content) {
    return api.put(`/plans/${id}`, { content })
  },
  
  deletePlan(id) {
    return api.delete(`/plans/${id}`)
  },
  
  toggleComplete(id, completed) {
    return api.patch(`/plans/${id}/complete`, { completed })
  }
}
