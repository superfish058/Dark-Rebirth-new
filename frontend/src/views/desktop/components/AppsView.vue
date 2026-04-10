<template>
  <div class="apps-view">
    <h2 class="apps-title">全部应用</h2>
    <div class="apps-grid">
      <div class="app-card" @click="navigateTo('/mobile/plan')">
        <div class="app-icon">📅</div>
        <div class="app-info">
          <h3 class="app-name">影途执记</h3>
          <p class="app-desc">管理你的日常任务和计划</p>
        </div>
      </div>
      <div class="app-card" @click="navigateTo('/mobile/journal')">
        <div class="app-icon">📝</div>
        <div class="app-info">
          <h3 class="app-name">暗语随笔</h3>
          <p class="app-desc">记录个人思考和感悟</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateTo(path) {
  router.push(path)
}
</script>

<style scoped>
.apps-view {
  height: 100%;
}

.apps-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.app-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.app-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #0ea5e9;
  cursor: pointer;
}

.app-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.app-info {
  flex: 1;
}

.app-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.app-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}
</style>