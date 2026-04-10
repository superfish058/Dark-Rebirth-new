<template>
  <div class="header-bar">
    <button v-if="showBack" class="back-btn" @click="goBack">
      <Icon icon="mdi:arrow-left" />
    </button>
    <div v-else class="left-space"></div>
    <h1 class="page-title" :style="{ color: titleColor }">{{ title }}</h1>
    <div class="right-space"></div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { Icon } from '@iconify/vue'

  const props = defineProps({
    title: {
      type: String,
      default: '页面标题'
    },
    showBack: {
      type: Boolean,
      default: false
    },
    titleColor: {
      type: String,
      default: 'var(--text-primary)'
    }
  })

  const router = useRouter()

  function goBack() {
    router.back()
  }
</script>

<style scoped>
  .header-bar {
    height: 50px;
    background: white;
    border-bottom: 2px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 100;
  }

  .back-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--text-primary);
    transition: all 0.2s;
  }

  .back-btn:hover {
    background: var(--bg-secondary);
    color: var(--primary);
  }

  .page-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    flex: 1;
    text-align: center;
  }

  .left-space,
  .right-space {
    width: 36px;
  }
</style>