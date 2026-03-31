<template>
  <MobileLayout title="测试页面">
    <div class="test-container">
      <h1>测试页面</h1>
      <p>这是一个测试页面，用于检查标签闭合问题</p>
    </div>
  </MobileLayout>
</template>

<script setup>
import MobileLayout from './components/MobileLayout.vue'
</script>

<style scoped>
.test-container {
  padding: 16px;
}

h1 {
  color: var(--text-primary);
}

p {
  color: var(--text-secondary);
}
</style>