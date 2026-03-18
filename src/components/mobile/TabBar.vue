<template>
  <van-tabbar v-model="active" class="tab-bar">
    <van-tabbar-item
      v-for="item in tabItems"
      :key="item.path"
      :to="item.path"
      :icon="item.icon"
    >
      {{ item.label }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TabItem {
  path: string
  icon: string
  label: string
}

const active = ref(0)
const tabItems = ref<TabItem[]>([
  {
    path: '/m/home',
    icon: 'home-o',
    label: '首页'
  },
  {
    path: '/m/app-list',
    icon: 'apps-o',
    label: '应用'
  },
  {
    path: '/m/profile',
    icon: 'user-o',
    label: '我的'
  }
])
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $bg-secondary;
  border-top: 1px solid $border-primary;
  z-index: 1000;
}

.tab-bar :deep(.van-tabbar-item) {
  color: $text-tertiary;
}

.tab-bar :deep(.van-tabbar-item--active) {
  color: $primary-color;
}
</style>
