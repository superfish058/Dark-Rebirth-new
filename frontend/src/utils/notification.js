import { ref } from 'vue'

const notifications = ref([])
let nextId = 1

const notificationService = {
  addNotification: (message, type = 'info', duration = 3000) => {
    const id = nextId++
    notifications.value.push({
      id,
      message,
      type,
      duration
    })
    
    if (duration > 0) {
      setTimeout(() => {
        notificationService.closeNotification(id)
      }, duration)
    }
    
    return id
  },
  
  closeNotification: (id) => {
    notifications.value = notifications.value.filter(notification => notification.id !== id)
  },
  
  success: (message, duration = 3000) => {
    return notificationService.addNotification(message, 'success', duration)
  },
  
  error: (message, duration = 3000) => {
    return notificationService.addNotification(message, 'error', duration)
  },
  
  warning: (message, duration = 3000) => {
    return notificationService.addNotification(message, 'warning', duration)
  },
  
  info: (message, duration = 3000) => {
    return notificationService.addNotification(message, 'info', duration)
  }
}

export default notificationService
export { notifications }