<template>
  <div class="nav-bar">
    <div 
      v-for="item in navItems" 
      :key="item.path"
      class="nav-item"
      :class="{ active: currentPath === item.path }"
      @click="navigateTo(item.path)"
    >
      <i :class="item.icon"></i>
      <span class="nav-text">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const currentPath = computed(() => route.path)

  const navItems = [
    {
      name: '首页',
      path: '/mobile',
      icon: 'fas fa-home'
    },
    {
      name: '应用',
      path: '/mobile/apps',
      icon: 'fas fa-th-large'
    },
    {
      name: '我的',
      path: '/mobile/profile',
      icon: 'fas fa-user'
    }
  ]

  function navigateTo(path) {
    router.push(path)
  }
</script>

<style scoped>
  .nav-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
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

  .nav-item i {
    font-size: 20px;
    margin-bottom: 4px;
  }

  .nav-text {
    font-size: 12px;
    font-weight: 600;
  }
</style>