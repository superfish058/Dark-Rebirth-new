<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">✨ 暗皇新生</h1>
      <p class="subtitle">开启全新的旅程</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="input-hand-drawn"
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input-hand-drawn password-input"
              placeholder="请输入密码"
              required
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="showPassword = !showPassword"
              aria-label="切换密码可见性"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>
        
        <div class="form-group remember-me">
          <input
            id="remember"
            v-model="rememberMe"
            type="checkbox"
            class="checkbox-hand-drawn"
          />
          <label for="remember">记住我</label>
        </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <button type="submit" class="btn-hand-drawn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <p class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

// 页面加载时检查本地存储
const initForm = () => {
  const savedUsername = localStorage.getItem('rememberedUsername')
  if (savedUsername) {
    username.value = savedUsername
    rememberMe.value = true
  }
}

initForm()

// 检测设备类型
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    await userStore.login(username.value, password.value)
    
    // 处理记住我功能
    if (rememberMe.value) {
      localStorage.setItem('rememberedUsername', username.value)
    } else {
      localStorage.removeItem('rememberedUsername')
    }
    
    // 根据设备类型路由到不同视图
    if (isMobileDevice()) {
      router.push('/')
    } else {
      router.push('/desktop')
    }
  } catch (err) {
    error.value = err.response?.data?.error || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}


</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 30px 4px 30px 4px;
  border: 3px solid var(--border);
  box-shadow: 6px 6px 0 rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  transform: rotate(-0.5deg);
}

.title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 32px;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.error-message {
  color: var(--error);
  text-align: center;
  font-size: 14px;
  padding: 8px;
  background: rgba(255, 139, 106, 0.1);
  border-radius: 8px;
}

.btn-hand-drawn {
  width: 100%;
  margin-top: 8px;
}

.btn-hand-drawn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  color: var(--text-secondary);
  font-size: 14px;
}

.register-link a {
  color: var(--primary);
  font-weight: 600;
}



.remember-me {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.checkbox-hand-drawn {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
  transform: rotate(-1deg);
}

.remember-me label {
  font-weight: normal;
  cursor: pointer;
  transform: rotate(0.5deg);
  font-family: 'Comic Sans MS', 'Marker Felt', 'Arial Rounded MT Bold', sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  flex: 1;
  padding-right: 50px;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%) rotate(-1deg);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.password-toggle:hover {
  background: var(--bg-secondary);
  transform: translateY(-50%) rotate(1deg) scale(1.1);
}
</style>
