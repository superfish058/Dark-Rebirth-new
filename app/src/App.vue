<script setup>
// Capacitor 通过 server.url 直接加载前端应用
// 此页面仅在 Capacitor 配置异常时作为 fallback 显示
</script>

<template>
  <div class="loading-screen">
    <div class="spinner"></div>
    <p>正在加载 Dark Rebirth...</p>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { height: 100%; width: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #FFF8F0;
  color: #5a3e2b;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-screen {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #ffe0c8;
  border-top-color: #FF8B6A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
