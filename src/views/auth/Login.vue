<template>
  <div class="login-page">
    <div class="login-page__container">
      <div class="login-page__header">
        <h1 class="login-page__title">欢迎回来</h1>
        <p class="login-page__subtitle">登录您的 Dark Rebirth 账户</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-page__form"
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

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            native-type="submit"
            class="login-page__button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-page__footer">
        <span class="login-page__text">还没有账户？</span>
        <router-link to="/auth/register" class="login-page__link">
          立即注册
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    loading.value = true

    const result = await userStore.login(form.email, form.password)
    
    if (result.error) {
      ElMessage.error({
        message: result.error || '登录失败，请检查您的邮箱和密码',
        plain: true
      })
      return
    }

    ElMessage.success({
      message: '登录成功',
      plain: true
    })
    
    const isMobile = window.innerWidth < 768
    router.push(isMobile ? '/m/home' : '/pc/web-collection')
  } catch (error: any) {
    console.error('登录失败:', error)
    ElMessage.error({
      message: error.message || '登录失败，请稍后重试',
      plain: true
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.login-page {
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