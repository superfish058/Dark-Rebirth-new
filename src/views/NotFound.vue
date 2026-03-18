<template>
  <div class="not-found-page">
    <div class="not-found-page__content">
      <div class="not-found-page__icon">404</div>
      <h1 class="not-found-page__title">页面未找到</h1>
      <p class="not-found-page__description">
        抱歉，您访问的页面不存在
      </p>
      <el-button type="primary" @click="goHome">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.not-found-page {
  min-height: 100vh;
  @include flex-center;
  background: $bg-primary;
  padding: $spacing-4;

  &__content {
    @include flex-column;
    align-items: center;
    text-align: center;
    max-width: 400px;
  }

  &__icon {
    font-size: 120px;
    font-weight: $font-weight-bold;
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: $spacing-6;
  }

  &__title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $spacing-3;
  }

  &__description {
    color: $text-secondary;
    font-size: $font-size-base;
    margin-bottom: $spacing-6;
  }
}
</style>