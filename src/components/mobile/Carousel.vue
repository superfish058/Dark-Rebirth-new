<template>
  <van-swipe
    v-if="banners.length > 0"
    class="carousel"
    :autoplay="3000"
    indicator-color="white"
  >
    <van-swipe-item v-for="banner in banners" :key="banner.id">
      <a v-if="banner.link_url" :href="banner.link_url" class="carousel__link">
        <img :src="banner.image_url" :alt="banner.title" class="carousel__image" />
        <div v-if="banner.title" class="carousel__title">
          {{ banner.title }}
        </div>
      </a>
      <div v-else class="carousel__item">
        <img :src="banner.image_url" :alt="banner.title" class="carousel__image" />
        <div v-if="banner.title" class="carousel__title">
          {{ banner.title }}
        </div>
      </div>
    </van-swipe-item>
  </van-swipe>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import bannerService from '@/services/banner'

const banners = ref<any[]>([])

async function loadBanners() {
  const result = await bannerService.fetchAll(true)
  if (result.data) {
    banners.value = result.data
  }
}

onMounted(() => {
  loadBanners()
})
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.carousel {
  width: 100%;
  height: 180px;
  border-radius: $radius-lg;
  overflow: hidden;
  margin-bottom: $spacing-4;

  &__link,
  &__item {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
    text-decoration: none;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: $spacing-3 $spacing-4;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: $text-primary;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
  }
}
</style>