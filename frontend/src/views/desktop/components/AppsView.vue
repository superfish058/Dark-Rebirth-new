<template>
  <div class="apps-view">
    <h2 class="apps-title">全部应用</h2>
    <div class="apps-grid">
      <div class="app-card">
        <div class="app-icon">📅</div>
        <div class="app-info">
          <h3 class="app-name">每日计划</h3>
          <p class="app-desc">管理你的日常任务和计划</p>
        </div>
      </div>
      <div class="app-card">
        <div class="app-icon">📚</div>
        <div class="app-info">
          <h3 class="app-name">知识库</h3>
          <p class="app-desc">存储和管理你的知识内容</p>
        </div>
      </div>
      <div class="app-card">
        <div class="app-icon">📊</div>
        <div class="app-info">
          <h3 class="app-name">数据分析</h3>
          <p class="app-desc">分析和可视化你的数据</p>
        </div>
      </div>
      <div class="app-card">
        <div class="app-icon">💬</div>
        <div class="app-info">
          <h3 class="app-name">消息中心</h3>
          <p class="app-desc">查看和管理你的消息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 应用数据可以从后端获取，这里使用模拟数据
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