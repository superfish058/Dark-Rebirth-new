<template>
  <MobileLayout title="首页">
    <!-- 顶部用户信息 -->
    <div class="user-info-section">
      <div class="user-avatar" @click="navigateTo('/mobile/profile')">
        <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" alt="头像" />
        <div v-else class="avatar-placeholder">
          {{ userStore.user?.username?.charAt(0).toUpperCase() || '?' }}
        </div>
      </div>
      <div class="user-details">
        <h2 class="username">{{ userStore.user?.username || '用户' }}</h2>
        <p class="welcome-message">欢迎回来！</p>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="overview-section">
      <h3 class="section-title">计划概览</h3>
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-top">
            <div class="card-icon">🔄</div>
            <p class="card-value">{{ planStats.incomplete }}</p>
          </div>
          <p class="card-label">未完成计划</p>
        </div>
        <div class="overview-card">
          <div class="card-top">
            <div class="card-icon">➕</div>
            <p class="card-value">{{ planStats.today }}</p>
          </div>
          <p class="card-label">今日新增计划</p>
        </div>
        <div class="overview-card">
          <div class="card-top">
            <div class="card-icon">✅</div>
            <p class="card-value">{{ planStats.completed }}</p>
          </div>
          <p class="card-label">已完成计划</p>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions-section">
      <h3 class="section-title">快捷功能</h3>
      <div class="quick-actions-grid">
          <div class="quick-action-item" @click="navigateTo('/mobile/plan')">
            <div class="action-icon">📅</div>
            <p class="action-label">影途执策</p>
          </div>
          <div class="quick-action-item" @click="showAddPlanModal = true">
            <div class="action-icon">➕</div>
            <p class="action-label">添加计划</p>
          </div>
          <div class="quick-action-item" @click="navigateTo('/mobile/journal')">
            <div class="action-icon">📝</div>
            <p class="action-label">暗语随笔</p>
          </div>
          <div class="quick-action-item" @click="navigateTo('/mobile/apps')">
            <div class="action-icon">📱</div>
            <p class="action-label">应用中心</p>
          </div>
          <div class="quick-action-item" @click="navigateTo('/mobile/profile')">
            <div class="action-icon">👤</div>
            <p class="action-label">个人中心</p>
          </div>
        </div>
    </div>

    <!-- 待办提醒 -->
    <div class="reminders-section">
      <h3 class="section-title">待办提醒</h3>
      <div v-if="upcomingPlans.length > 0" class="reminders-list">
        <div v-for="plan in upcomingPlans" :key="plan.id" class="reminder-item">
          <div class="reminder-icon">⏰</div>
          <div class="reminder-content">
            <p class="reminder-text">{{ plan.content }}</p>
            <p class="reminder-date">{{ formatDate(plan.date) }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-reminders">
        <p>暂无待办提醒</p>
      </div>
    </div>

    <!-- 最近访问 -->
    <div class="recent-section">
      <h3 class="section-title">最近访问</h3>
      <div v-if="recentActivities.length > 0" class="recent-list">
        <div v-for="(activity, index) in recentActivities" :key="index" class="recent-item">
          <div class="recent-icon">📋</div>
          <div class="recent-content">
            <p class="recent-text">{{ activity.text }}</p>
            <p class="recent-time">{{ activity.time }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-recent">
        <p>暂无最近访问记录</p>
      </div>
    </div>

    <!-- 添加计划模态框 -->
    <Modal v-model:visible="showAddPlanModal" title="添加新计划" size="large" @close="showAddPlanModal = false" @cancel="showAddPlanModal = false" @confirm="addPlan" :confirm-text="'添加'" :cancel-text="'取消'">
      <input v-model="newPlanContent" type="text" class="input-hand-drawn add-plan-input" placeholder="写下你的计划..." @keyup.enter="addPlan" ref="addInput" />
    </Modal>
  </MobileLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import MobileLayout from './components/MobileLayout.vue'
import Modal from '../../components/Modal.vue'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const showAddPlanModal = ref(false)
const newPlanContent = ref('')
const addInput = ref(null)
const todayPlans = ref([])
const upcomingPlans = ref([])
const recentActivities = ref([])
const planStats = ref({ total: 0, completed: 0, incomplete: 0 })

// 计算属性
const todayPlansCount = computed(() => todayPlans.value.length)
const completedPlansCount = computed(() => todayPlans.value.filter(p => p.completed).length)
const completionRate = computed(() => {
  if (todayPlans.value.length === 0) return 0
  return Math.round((completedPlansCount.value / todayPlans.value.length) * 100)
})

// 方法
function navigateTo(path) {
  router.push(path)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const options = { month: 'short', day: 'numeric' }
  return d.toLocaleDateString('zh-CN', options)
}

async function loadTodayPlans() {
  try {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const plans = await userStore.getPlansByDate(dateStr)
    todayPlans.value = plans
  } catch (err) {
    console.error('加载今日计划失败', err)
  }
}

async function loadUpcomingPlans() {
  try {
    const allPlans = await userStore.getIncompletePlans()
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    
    upcomingPlans.value = allPlans
      .filter(plan => plan.date >= todayStr)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
  } catch (err) {
    console.error('加载待办提醒失败', err)
  }
}

function loadRecentActivities() {
  // 模拟最近访问记录
  recentActivities.value = [
    { text: '查看了今日计划', time: '10分钟前' },
    { text: '添加了新计划', time: '1小时前' },
    { text: '完成了一个计划', time: '2小时前' }
  ]
}

async function loadPlanStats() {
  try {
    const stats = await userStore.getPlanStats()
    planStats.value = stats
  } catch (err) {
    console.error('加载计划统计信息失败', err)
  }
}

async function addPlan() {
  if (!newPlanContent.value.trim()) return

  try {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    await userStore.createPlan(newPlanContent.value, dateStr)
    newPlanContent.value = ''
    showAddPlanModal.value = false
    // 重新加载今日计划
    await loadTodayPlans()
  } catch (err) {
    console.error('添加计划失败', err)
  }
}

// 生命周期
onMounted(async () => {
  await loadTodayPlans()
  await loadUpcomingPlans()
  await loadPlanStats()
  loadRecentActivities()
})

// 监听模态框显示
watch(showAddPlanModal, (val) => {
  if (val) {
    nextTick(() => {
      addInput.value?.focus()
    })
  }
})
</script>

<style scoped>
.user-info-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  cursor: pointer;
}

.user-avatar img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary);
}

.avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  border: 3px solid var(--primary);
}

.user-details h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.welcome-message {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px;
}

.overview-section {
  margin-bottom: 24px;
}

.overview-cards {
  display: flex;
  gap: 12px;
}

.overview-card {
  flex: 1;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.card-content {
  width: 100%;
}

.card-value {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--primary);
}

.card-label {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  width: 100%;
}

.quick-actions-section {
  margin-bottom: 24px;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.quick-action-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 28px;
}

.action-label {
  margin: 0;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.reminders-section {
  margin-bottom: 24px;
}

.reminders-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.reminder-item {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.reminder-item:last-child {
  border-bottom: none;
}

.reminder-icon {
  font-size: 20px;
}

.reminder-content {
  flex: 1;
}

.reminder-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-primary);
}

.reminder-date {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.empty-reminders {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: var(--text-secondary);
}

.recent-section {
  margin-bottom: 24px;
}

.recent-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.recent-item {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-icon {
  font-size: 20px;
}

.recent-content {
  flex: 1;
}

.recent-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-primary);
}

.recent-time {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.empty-recent {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: var(--text-secondary);
}

.add-plan-input {
  font-size: 16px;
  padding: 12px 16px;
  min-height: 50px;
  width: 100%;
  box-sizing: border-box;
}
</style>