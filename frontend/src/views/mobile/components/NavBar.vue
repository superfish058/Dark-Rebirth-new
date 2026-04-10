<template>
  <div class="nav-bar">
    <div 
      v-for="item in navItems" 
      :key="item.path"
      class="nav-item"
      :class="{ active: currentPath === item.path }"
      @click="navigateTo(item.path)"
    >
      <Icon :icon="item.icon" />
      <span class="nav-text">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Icon } from '@iconify/vue'

  const route = useRoute()
  const router = useRouter()

  const currentPath = computed(() => route.path)

  const navItems = [
    {
      name: '首页',
      path: '/mobile',
      icon: 'mdi:home'
    },
    {
      name: '应用',
      path: '/mobile/apps',
      icon: 'mdi:view-grid'
    },
    {
      name: '我的',
      path: '/mobile/profile',
      icon: 'mdi:account'
    }
  ]

  function navigateTo(path) {
    router.push(path)
  }
</script>

<style scoped>
  .nav-bar {
    height: 60px;
    background: white;
    border-top: 2px solid var(--border);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-item:hover {
    background: var(--bg-secondary);
  }

  .nav-item.active {
    color: var(--primary);
  }

  .nav-item :deep(.iconify) {
    font-size: 24px;
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
  }

  .nav-text {
    font-size: 12px;
    font-weight: 600;
  }
</style>