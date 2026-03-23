<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">🎉 加入我们</h1>
      <p class="subtitle">开始记录你的美好计划</p>
      
      <form @submit.prevent="handleRegister" class="register-form">
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
          <label for="email">邮箱</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input-hand-drawn"
            placeholder="请输入邮箱"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="input-hand-drawn"
            placeholder="请输入密码"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="input-hand-drawn"
            placeholder="请再次输入密码"
            required
          />
        </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <button type="submit" class="btn-hand-drawn" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <p class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
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
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await userStore.register(username.value, email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 30px 4px 30px 4px;
  border: 3px solid var(--border);
  box-shadow: 6px 6px 0 rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  transform: rotate(0.5deg);
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

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.login-link {
  text-align: center;
  margin-top: 24px;
  color: var(--text-secondary);
  font-size: 14px;
}

.login-link a {
  color: var(--primary);
  font-weight: 600;
}
</style>
