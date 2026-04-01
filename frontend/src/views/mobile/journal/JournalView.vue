<template>
  <MobileLayout title="暗语随笔" :show-back="true" @back="navigateBack">
    <div class="journal-container">
      <!-- 顶部操作栏 -->
      <div class="journal-header">
        <button class="add-btn" @click="showAddModal = true">
          <i class="fas fa-plus"></i> 添加随笔
        </button>
      </div>

      <!-- 随笔列表 -->
      <div v-if="journals.length > 0" class="journal-list">
        <div v-for="journal in journals" :key="journal.id" class="journal-item">
          <div class="journal-content">
            <h3 class="journal-title">{{ journal.title }}</h3>
            <p class="journal-excerpt">{{ journal.content.substring(0, 50) }}...</p>
            <p class="journal-date">{{ formatDate(journal.date) }}</p>
          </div>
          <div class="journal-actions">
            <button class="action-btn edit-btn" @click="editJournal(journal)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" @click="deleteJournal(journal)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <p>还没有随笔</p>
        <p class="empty-hint">点击上方按钮添加你的第一篇随笔吧！</p>
      </div>

      <!-- 添加/编辑随笔模态框 -->
      <Modal v-model:visible="showAddModal" :title="editingJournal ? '编辑随笔' : '添加随笔'" size="large" @close="closeModal" @cancel="closeModal" @confirm="saveJournal" :confirm-text="'保存'" :cancel-text="'取消'">
        <div class="journal-form">
          <input v-model="formData.title" type="text" class="input-hand-drawn title-input" placeholder="标题" />
          <textarea v-model="formData.content" class="input-hand-drawn content-input" placeholder="写下你的随笔..." rows="6"></textarea>
        </div>
      </Modal>

      <!-- 删除确认模态框 -->
      <Modal v-model:visible="showDeleteModal" title="删除随笔" size="small" @close="cancelDelete" @cancel="cancelDelete" @confirm="confirmDelete" :confirm-text="'删除'" :cancel-text="'取消'">
        <p class="delete-message">确定要删除这篇随笔吗？</p>
      </Modal>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MobileLayout from '../components/MobileLayout.vue'
import Modal from '../../../components/Modal.vue'

const router = useRouter()

// 响应式数据
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const editingJournal = ref(null)
const currentJournal = ref(null)
const formData = ref({ title: '', content: '' })
const journals = ref([])

// 方法
function navigateBack() {
  router.go(-1)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return d.toLocaleDateString('zh-CN', options)
}

function openAddModal() {
  editingJournal.value = null
  formData.value = { title: '', content: '' }
  showAddModal.value = true
}

function editJournal(journal) {
  editingJournal.value = journal
  formData.value = { title: journal.title, content: journal.content }
  showAddModal.value = true
}

function deleteJournal(journal) {
  currentJournal.value = journal
  showDeleteModal.value = true
}

function closeModal() {
  showAddModal.value = false
  editingJournal.value = null
  formData.value = { title: '', content: '' }
}

function cancelDelete() {
  showDeleteModal.value = false
  currentJournal.value = null
}

function saveJournal() {
  if (!formData.value.title.trim() || !formData.value.content.trim()) return

  if (editingJournal.value) {
    // 编辑现有随笔
    const index = journals.value.findIndex(j => j.id === editingJournal.value.id)
    if (index !== -1) {
      journals.value[index] = {
        ...editingJournal.value,
        title: formData.value.title,
        content: formData.value.content
      }
    }
  } else {
    // 添加新随笔
    const newJournal = {
      id: Date.now().toString(),
      title: formData.value.title,
      content: formData.value.content,
      date: new Date().toISOString().split('T')[0]
    }
    journals.value.unshift(newJournal)
  }

  closeModal()
}

function confirmDelete() {
  if (!currentJournal.value) return

  journals.value = journals.value.filter(j => j.id !== currentJournal.value.id)
  cancelDelete()
}

// 模拟数据
function loadMockData() {
  journals.value = [
    {
      id: '1',
      title: '初次尝试',
      content: '这是我的第一篇暗语随笔，记录下此刻的心情和想法...',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      title: '思考人生',
      content: '今天思考了很多关于人生的问题，感觉收获颇丰...',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    }
  ]
}

// 生命周期
onMounted(() => {
  loadMockData()
})
</script>

<style scoped>
.journal-container {
  padding: 16px;
}

.journal-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.add-btn {
  padding: 8px 16px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.add-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.journal-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.journal-item {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.2s;
}

.journal-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.journal-content {
  flex: 1;
  margin-right: 12px;
}

.journal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.journal-excerpt {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 8px;
  line-height: 1.4;
}

.journal-date {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.journal-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn i {
  transition: all 0.2s;
  color: var(--text-secondary);
}

.action-btn:hover i {
  color: var(--primary);
}

.edit-btn:hover {
  background: var(--primary-light);
}

.delete-btn:hover i {
  color: var(--error);
}

.delete-btn:hover {
  background: var(--error-light);
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

.journal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title-input {
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 8px;
}

.content-input {
  font-size: 14px;
  padding: 12px 16px;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
}

.delete-message {
  text-align: center;
  color: var(--text-primary);
  font-size: 16px;
  margin: 0;
  padding: 20px 0;
}
</style>