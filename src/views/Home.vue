<template>
  <div class="home-page">
    <div class="home-page__loading">
      <div class="loading-spinner"></div>
      <p class="home-page__text">正在加载...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const isMobile = window.innerWidth < 768
  router.replace(isMobile ? '/m/home' : '/pc/web-collection')
})
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.home-page {
  min-height: 100vh;
  @include flex-center;
  background: $bg-primary;

  &__loading {
    @include flex-column;
    align-items: center;
    gap: $spacing-4;
  }

  &__text {
    color: $text-secondary;
    font-size: $font-size-base;
  }
}
</style>