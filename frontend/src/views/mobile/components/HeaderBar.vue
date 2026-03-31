<template>
  <div class="header-bar">
    <button v-if="showBack" class="back-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
    <h1 class="page-title">{{ title }}</h1>
    <div class="right-space"></div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  const props = defineProps({
    title: {
      type: String,
      default: '页面标题'
    },
    showBack: {
      type: Boolean,
      default: false
    }
  })

  const router = useRouter()

  function goBack() {
    router.back()
  }
</script>

<style scoped>
  .header-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
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
    color: var(--text-primary);
    margin: 0;
    flex: 1;
    text-align: center;
  }

  .right-space {
    width: 36px;
  }
</style>