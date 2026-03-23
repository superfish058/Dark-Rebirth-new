<template>
  <div class="home-container">
    <header class="header">
      <div class="user-info">
        <div class="avatar-section" @click="showAvatarUpload = !showAvatarUpload">
          <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" class="avatar" alt="头像" />
          <div v-else class="avatar-placeholder">
            {{ userStore.user?.username?.charAt(0).toUpperCase() || '?' }}
          </div>
        </div>
        <div class="user-details">
          <h2 class="username">{{ userStore.user?.username }}</h2>
          <p class="date">{{ formattedDate }}</p>
        </div>
        <button class="logout-btn" @click="showLogoutModal = true">退出</button>
      </div>
    </header>
    
    <div v-if="showAvatarUpload" class="avatar-upload-panel">
      <div class="upload-card">
        <h3>更换头像</h3>
        <div class="upload-btn-hand-drawn" @click="fileInput.click()">
          选择图片
        </div>
        <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" class="file-input" style="display: none;" />
        <div v-if="previewImage" class="preview-container">
          <img :src="previewImage" class="preview-image" alt="预览" />
        </div>
        <div class="upload-actions">
          <button class="btn-hand-drawn btn-secondary" @click="showAvatarUpload = false">取消</button>
          <button class="btn-hand-drawn" @click="handleUploadAvatar" :disabled="!selectedFile || uploading">
            {{ uploading ? '上传中...' : '上传' }}
          </button>
        </div>
      </div>
    </div>
    
    <main class="main-content">
      <div v-if="plans.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <p>今天还没有计划</p>
        <p class="empty-hint">点击下方按钮添加你的第一个计划吧！</p>
      </div>
      
      <div v-else>
        <div class="progress-section">
          <div class="progress-header">
            <h3>计划执行情况</h3>
            <span class="progress-info">{{ completedCount }}/{{ plans.length }} 已完成 ({{ progressPercentage }}%)</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
        
        <div class="plans-list">
        <div v-for="(plan, index) in plans" :key="plan.id" class="plan-item" :class="{ completed: plan.completed }">
          <div class="plan-number">{{ index + 1 }}</div>
          <input 
            type="checkbox" 
            :checked="plan.completed" 
            @change="toggleComplete(plan)"
            class="plan-checkbox"
          />
          <div v-if="editingPlanId === plan.id" class="edit-form">
            <input 
              v-model="editContent" 
              type="text" 
              class="input-hand-drawn edit-input"
              @keyup.enter="saveEdit(plan)"
              @keyup.escape="cancelEdit"
              ref="editInput"
            />
          </div>
          <div v-else class="plan-content">{{ plan.content }}</div>
          <div class="plan-actions">
            <button v-if="editingPlanId === plan.id" class="action-btn save-btn" @click="saveEdit(plan)">
            <i class="fas fa-check"></i>
          </button>
          <button v-else class="action-btn edit-btn" @click="startEdit(plan)">
            <i class="fas fa-edit"></i>
          </button>
          <button v-if="editingPlanId === plan.id" class="action-btn cancel-btn" @click="cancelEdit">
            <i class="fas fa-times"></i>
          </button>
          <button v-else class="action-btn delete-btn" @click="deletePlan(plan)">
            <i class="fas fa-trash"></i>
          </button>
          <div class="completed-badge" v-if="plan.completed">已完成</div>
          </div>
        </div>
        </div>
      </div>
    </main>
    
    <button class="fab-button" @click="showAddModal = true">
      <i class="fas fa-plus"></i>
    </button>
    
    <Modal 
      v-model:visible="showAddModal"
      title="添加新计划"
      size="large"
      @close="closeModal"
      @cancel="closeModal"
      @confirm="addPlan"
      :confirm-text="'添加'"
      :cancel-text="'取消'"
    >
      <input 
        v-model="newPlanContent" 
        type="text" 
        class="input-hand-drawn add-plan-input"
        placeholder="写下你的计划..."
        @keyup.enter="addPlan"
        ref="addInput"
      />
    </Modal>
    
    <Modal 
      v-model:visible="showLogoutModal"
      title="退出登录"
      size="small"
      @close="cancelLogout"
      @cancel="cancelLogout"
      @confirm="confirmLogout"
      :confirm-text="'确定'"
      :cancel-text="'取消'"
    >
      <p class="logout-message">确定要退出登录吗？</p>
    </Modal>
    
    <Modal 
      v-model:visible="showDeleteModal"
      title="删除计划"
      size="small"
      @close="cancelDelete"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
      :confirm-text="'删除'"
      :cancel-text="'取消'"
    >
      <p class="delete-message">确定要删除这个计划吗？</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import Modal from '../components/Modal.vue'

const router = useRouter()
const userStore = useUserStore()

const plans = ref([])
const showAddModal = ref(false)
const newPlanContent = ref('')
const editingPlanId = ref(null)
const editContent = ref('')
const showAvatarUpload = ref(false)
const selectedFile = ref(null)
const previewImage = ref('')
const uploading = ref(false)

const fileInput = ref(null)
const addInput = ref(null)
const editInput = ref(null)
const showLogoutModal = ref(false)
const showDeleteModal = ref(false)
const currentPlan = ref(null)

// 计算属性
const completedCount = computed(() => {
  return plans.value.filter(plan => plan.completed).length
})

const progressPercentage = computed(() => {
  if (plans.value.length === 0) return 0
  return Math.round((completedCount.value / plans.value.length) * 100)
})

const formattedDate = computed(() => {
  const now = new Date()
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  return now.toLocaleDateString('zh-CN', options)
})

async function loadPlans() {
  try {
    plans.value = await userStore.getPlans()
  } catch (err) {
    console.error('加载计划失败', err)
  }
}

async function addPlan() {
  if (!newPlanContent.value.trim()) return
  
  try {
    const plan = await userStore.createPlan(newPlanContent.value)
    plans.value.push(plan)
    newPlanContent.value = ''
    showAddModal.value = false
  } catch (err) {
    console.error('添加计划失败', err)
  }
}

function startEdit(plan) {
  editingPlanId.value = plan.id
  editContent.value = plan.content
  nextTick(() => {
    editInput.value?.focus()
  })
}

async function saveEdit(plan) {
  if (!editContent.value.trim()) return
  
  try {
    await userStore.updatePlan(plan.id, editContent.value)
    plan.content = editContent.value
    editingPlanId.value = null
  } catch (err) {
    console.error('更新计划失败', err)
  }
}

function cancelEdit() {
  editingPlanId.value = null
  editContent.value = ''
}

function closeModal() {
  newPlanContent.value = ''
  showAddModal.value = false
}

function deletePlan(plan) {
  currentPlan.value = plan
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!currentPlan.value) return
  
  try {
    await userStore.deletePlan(currentPlan.value.id)
    plans.value = plans.value.filter(p => p.id !== currentPlan.value.id)
    showDeleteModal.value = false
    currentPlan.value = null
  } catch (err) {
    console.error('删除计划失败', err)
    showDeleteModal.value = false
    currentPlan.value = null
  }
}

function cancelDelete() {
  showDeleteModal.value = false
  currentPlan.value = null
}

async function toggleComplete(plan) {
  try {
    await userStore.toggleComplete(plan.id, !plan.completed)
    plan.completed = !plan.completed
  } catch (err) {
    console.error('更新计划状态失败', err)
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function handleUploadAvatar() {
  if (!selectedFile.value) return
  
  uploading.value = true
  try {
    await userStore.updateAvatar(selectedFile.value)
    showAvatarUpload.value = false
    selectedFile.value = null
    previewImage.value = ''
  } catch (err) {
    console.error('上传头像失败', err)
  } finally {
    uploading.value = false
  }
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}

function confirmLogout() {
  showLogoutModal.value = false
  handleLogout()
}

function cancelLogout() {
  showLogoutModal.value = false
}

onMounted(() => {
  loadPlans()
})

watch(showAddModal, (val) => {
  if (val) {
    nextTick(() => {
      addInput.value?.focus()
    })
  }
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding-bottom: 100px;
}

.header {
  padding: 20px;
  background: white;
  border-bottom: 3px solid var(--border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.avatar-section {
  cursor: pointer;
  position: relative;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary);
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  border: 3px solid var(--primary);
}

.user-details {
  flex: 1;
}

.username {
  font-size: 20px;
  margin: 0;
  color: var(--text-primary);
}

.date {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 0;
}

.logout-btn {
  padding: 8px 16px;
  border: 2px solid var(--border);
  border-radius: 12px;
  background: white;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.logout-btn:hover {
  border-color: var(--error);
  color: var(--error);
}

.avatar-upload-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.upload-card {
  background: white;
  padding: 30px;
  border-radius: 30px 4px 30px 4px;
  border: 3px solid var(--border);
  width: 100%;
  max-width: 360px;
}

.upload-card h3 {
  margin: 0 0 20px;
  text-align: center;
  color: var(--text-primary);
}

.upload-btn-hand-drawn {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid var(--primary);
  border-radius: 20px 4px 20px 4px;
  background: white;
  color: var(--primary);
  text-align: center;
  cursor: pointer;
  font-family: 'Comic Sans MS', 'Marker Felt', 'Arial Rounded MT Bold', sans-serif;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
  margin-bottom: 16px;
  transform: rotate(-0.5deg);
}

.upload-btn-hand-drawn:hover {
  background: var(--primary);
  color: white;
  transform: rotate(0.5deg);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
}

.file-input {
  display: none;
}

.preview-container {
  text-align: center;
  margin-bottom: 16px;
}

.preview-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary);
}

.upload-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.main-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 8px 0;
}

.empty-hint {
  font-size: 14px;
}

.progress-section {
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 2px solid var(--border);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
  font-family: 'Comic Sans MS', 'Marker Felt', 'Arial Rounded MT Bold', sans-serif;
}

.progress-info {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: bold;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid var(--border);
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 2px 0 0 rgba(0,0,0,0.1);
}

.plans-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plan-item {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  min-height: 56px;
}

.plan-item:nth-child(even) {
  /* 移除旋转效果 */
}

.plan-item:hover {
  box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
}

.plan-item.completed {
  opacity: 0.9;
  border-color: var(--primary);
  background: var(--bg-secondary);
  position: relative;
  min-height: 56px;
}

.plan-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  width: 80px;
  height: 36px;
  align-items: center;
  justify-content: flex-start;
}

.plan-item.completed .plan-actions {
  justify-content: flex-end;
}

.plan-item.completed .action-btn {
  display: none;
}

.completed-badge {
  background: var(--primary);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
  animation: slideIn 0.3s ease;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes slideIn {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 移除完成状态的对勾图标 */

.plan-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  appearance: none;
  -webkit-appearance: none;
  position: relative;
}

.plan-checkbox:hover {
  border-color: var(--primary);
}

.plan-checkbox:checked {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
}

.plan-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: bold;
  color: white;
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.plan-number {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 1px 1px 0 rgba(0,0,0,0.1);
}

.plan-content {
  flex: 1;
  font-size: 16px;
  color: var(--text-primary);
  transition: all 0.2s;
}

.plan-item.completed .plan-content {
  color: var(--text-secondary);
  font-style: italic;
}

.edit-form {
  flex: 1;
}

.edit-input {
  padding: 8px 12px;
}

/* 已在上方定义 */

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn i {
  transition: all 0.2s;
  color: var(--text-secondary);
  font-size: 16px;
}

.action-btn:hover i {
  color: var(--primary);
}

.save-btn i {
  color: var(--primary);
}

.edit-btn i {
  color: var(--primary);
}

.cancel-btn i {
  color: var(--text-secondary);
}

.delete-btn i {
  color: var(--text-secondary);
}

.save-btn:hover i {
  color: var(--primary);
}

.edit-btn:hover i {
  color: var(--primary);
}

.cancel-btn:hover i {
  color: var(--primary);
}

.delete-btn:hover i {
  color: var(--error);
}

.action-btn:hover {
  background: var(--bg-secondary);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
}

.save-btn:hover {
  background: var(--primary-light);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
}

.edit-btn:hover {
  background: var(--primary-light);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
}

.delete-btn:hover {
  background: var(--error-light);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 30px 4px 30px 4px;
  border: 3px solid var(--border);
  width: 100%;
  max-width: 500px;
  transform: rotate(-0.5deg);
}

.add-plan-input {
  font-size: 18px;
  padding: 16px 20px;
  min-height: 60px;
  width: 100%;
  box-sizing: border-box;
}

.logout-message,
.delete-message {
  text-align: center;
  color: var(--text-primary);
  font-size: 16px;
  margin: 0;
  padding: 20px 0;
  font-family: 'Comic Sans MS', 'Marker Felt', 'Arial Rounded MT Bold', sans-serif;
}

/* 缩小整体外边距 */
.header {
  padding: 16px 20px;
}

.main-content {
  padding: 20px;
}

.upload-card {
  padding: 24px;
}

.modal-content.large {
  padding: 32px;
}

.modal-actions {
  margin-top: 24px;
  gap: 16px;
}

.modal-content h3 {
  margin: 0 0 20px;
  text-align: center;
  color: var(--text-primary);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
