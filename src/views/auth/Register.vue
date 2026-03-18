<template>
  <div class="register-page">
    <div class="register-page__container">
      <div class="register-page__header">
        <h1 class="register-page__title">创建账户</h1>
        <p class="register-page__subtitle">注册您的 Dark Rebirth 账户</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="register-page__form"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱"
            size="large"
            :prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item prop="nickname">
          <el-input
            v-model="form.nickname"
            placeholder="请输入昵称（可选）"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请确认密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            native-type="submit"
            class="register-page__button"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-page__footer">
        <span class="register-page__text">已有账户？</span>
        <router-link to="/auth/login" class="register-page__link">
          立即登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  email: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  nickname: [
    { max: 20, message: '昵称长度不能超过20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    loading.value = true

    const result = await userStore.register(form.email, form.password, form.nickname)
    
    if (result.error) {
      ElMessage.error(result.error)
      return
    }

    ElMessage.success('注册成功')
    
    const isMobile = window.innerWidth < 768
    router.push(isMobile ? '/m/home' : '/pc/web-collection')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.register-page {
  min-height: 100vh;
  @include flex-center;
  background: $bg-primary;
  padding: $spacing-4;

  &__container {
    width: 100%;
    max-width: 400px;
    @include card-style;
  }

  &__header {
    text-align: center;
    margin-bottom: $spacing-8;
  }

  &__title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-2;
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__subtitle {
    color: $text-secondary;
    font-size: $font-size-base;
  }

  &__form {
    margin-bottom: $spacing-6;
  }

  &__button {
    width: 100%;
    background: $primary-gradient;
    border: none;
    font-weight: $font-weight-medium;
  }

  &__footer {
    text-align: center;
    color: $text-secondary;
  }

  &__text {
    margin-right: $spacing-2;
  }

  &__link {
    color: $primary-color;
    font-weight: $font-weight-medium;
  }
}
</style>