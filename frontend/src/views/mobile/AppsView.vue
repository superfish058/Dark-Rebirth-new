<template>
  <MobileLayout title="应用">
    <div class="apps-container">
      <h3 class="section-title">应用中心</h3>
      <p class="section-description">这里是所有功能应用的入口</p>

      <!-- 应用列表 -->
      <div class="apps-list">
        <div class="app-category">
          <h4 class="category-title">计划管理</h4>
          <div class="app-items">
            <div class="app-item" @click="navigateTo('/mobile/plan')">
              <div class="app-icon">📅</div>
              <div class="app-info">
                <h5 class="app-name">影途执策</h5>
                <p class="app-description">管理每日和每周计划</p>
              </div>
              <div class="app-arrow">
                <Icon icon="mdi:chevron-right" />
              </div>
            </div>
          </div>
        </div>

        <div class="app-category">
          <h4 class="category-title">个人随笔</h4>
          <div class="app-items">
            <div class="app-item" @click="navigateTo('/mobile/journal')">
              <div class="app-icon">📝</div>
              <div class="app-info">
                <h5 class="app-name">暗语随笔</h5>
                <p class="app-description">记录个人思考和感悟</p>
              </div>
              <div class="app-arrow">
                <Icon icon="mdi:chevron-right" />
              </div>
            </div>
          </div>
        </div>

        <div class="app-category">
          <h4 class="category-title">待开发</h4>
          <div class="app-items">
            <div class="app-item disabled">
              <div class="app-icon">📊</div>
              <div class="app-info">
                <h5 class="app-name">数据分析</h5>
                <p class="app-description">影途执策数据分析</p>
              </div>
              <div class="app-status">
                <span class="status-badge">开发中</span>
              </div>
            </div>

            <div class="app-item disabled">
              <div class="app-icon">🔔</div>
              <div class="app-info">
                <h5 class="app-name">提醒中心</h5>
                <p class="app-description">计划提醒和通知</p>
              </div>
              <div class="app-status">
                <span class="status-badge">开发中</span>
              </div>
            </div>

            <div class="app-item disabled">
              <div class="app-icon">📁</div>
              <div class="app-info">
                <h5 class="app-name">文件管理</h5>
                <p class="app-description">管理相关文件</p>
              </div>
              <div class="app-status">
                <span class="status-badge">开发中</span>
              </div>
            </div>

            <div class="app-item disabled">
              <div class="app-icon">⚙️</div>
              <div class="app-info">
                <h5 class="app-name">设置</h5>
                <p class="app-description">应用设置和偏好</p>
              </div>
              <div class="app-status">
                <span class="status-badge">开发中</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 开发计划 -->
      <div class="development-plan">
        <h3 class="section-title">开发计划</h3>
        <div class="plan-card">
          <h4 class="plan-title">即将上线</h4>
          <ul class="plan-list">
            <li class="plan-item">
              <span class="plan-icon">📊</span>
              <span class="plan-text">数据分析功能</span>
              <span class="plan-status">预计 2 周后</span>
            </li>
            <li class="plan-item">
              <span class="plan-icon">🔔</span>
              <span class="plan-text">提醒中心</span>
              <span class="plan-status">预计 3 周后</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import MobileLayout from './components/MobileLayout.vue'
  import { Icon } from '@iconify/vue'

  const router = useRouter()

  function navigateTo(path) {
    router.push(path)
  }
</script>

<style scoped>
  .apps-container {
    padding: 0 16px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 8px;
  }

  .section-description {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0 0 24px;
  }

  .apps-list {
    margin-bottom: 32px;
  }

  .app-category {
    margin-bottom: 24px;
  }

  .category-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 12px;
    padding-left: 8px;
    border-left: 4px solid var(--primary);
  }

  .app-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .app-item {
    background: white;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .app-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .app-item.disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .app-item.disabled:hover {
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .app-icon {
    font-size: 28px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border-radius: 12px;
  }

  .app-info {
    flex: 1;
  }

  .app-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px;
  }

  .app-description {
    font-size: 12px;
    color: var(--text-secondary);
    margin: 0;
  }

  .app-arrow :deep(.iconify) {
    color: var(--text-secondary);
    font-size: 18px;
    width: 18px;
    height: 18px;
  }

  .app-status {
    display: flex;
    align-items: center;
  }

  .status-badge {
    padding: 4px 8px;
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .development-plan {
    margin-bottom: 32px;
  }

  .plan-card {
    background: white;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .plan-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 12px;
  }

  .plan-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .plan-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }

  .plan-item:last-child {
    border-bottom: none;
  }

  .plan-icon {
    font-size: 20px;
  }

  .plan-text {
    flex: 1;
    font-size: 14px;
    color: var(--text-primary);
  }

  .plan-status {
    font-size: 12px;
    color: var(--text-secondary);
  }
</style>