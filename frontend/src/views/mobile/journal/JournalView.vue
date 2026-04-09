<template>
  <div class="journal-page">
    <!-- Header -->
    <header class="header sticky" @click="handleHeaderClick">
      <div class="header-top">
        <button class="back-btn" @click="goHome">
          <span class="material-symbols-outlined">home</span>
        </button>
        <h1 class="title">暗语随笔</h1>
        <div class="header-actions">
          <div class="profile-avatar">
            <img alt="User profile" :src="userStore.user?.avatar || defaultAvatar"/>
          </div>
        </div>
      </div>
      
      <div class="search-section">
        <div class="search-input-wrapper">
          <span class="material-symbols-outlined search-input-icon">search</span>
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索你的思绪..." 
            v-model="searchQuery"
          />
        </div>
      </div>
      
      <div class="categories-section">
        <div class="categories-container">
          <button 
            class="category-btn" 
            :class="{ active: selectedCategory === 'all' }"
            @click="selectedCategory = 'all'"
          >
            全部
          </button>
          <button 
            v-for="category in categories" 
            :key="category.id"
            class="category-btn"
            :class="{ active: selectedCategory === category.id }"
            @click="selectedCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>
        <div class="sticky-right">
          <button class="more-btn" @click="toggleCategoryDropdown">
            <span class="material-symbols-outlined dropdown-arrow" :class="{ rotated: showCategoryDropdown }">expand_more</span>
          </button>
        </div>
      </div>
      
      <!-- Categories Dropdown - Moved outside categories-section for proper positioning -->
      <div v-if="showCategoryDropdown" class="categories-dropdown-menu">
        <div 
          class="dropdown-item" 
          :class="{ active: selectedCategory === 'all' }"
          @click="selectedCategory = 'all'; showCategoryDropdown = false"
        >
          全部
        </div>
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="dropdown-item"
          :class="{ active: selectedCategory === category.id }"
          @click="selectedCategory = category.id; showCategoryDropdown = false"
        >
          {{ category.name }}
        </div>
        <div class="dropdown-item manage-category" @click="openManageCategoryModal(); showCategoryDropdown = false">
          <span class="material-symbols-outlined">settings</span> 管理分类
        </div>
        <div class="dropdown-item add-category" @click="openAddCategoryModal(); showCategoryDropdown = false">
          <span class="material-symbols-outlined">add</span> 新建分类
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="main-content">
      <div class="greeting-section">
        <h2 class="greeting">早安，<span class="text-primary">记录你的每一天。</span></h2>
        <p class="entry-count">本月已记录 {{ entriesCount }} 条</p>
      </div>
      
      <div class="notes-list">
        <article 
          v-for="note in filteredNotes" 
          :key="note.id"
          class="note-card"
          @click="openEditNoteModal(note)"
        >
          <span 
            class="category-tag"
            :class="getCategoryClass(note.category)"
          >
            {{ getCategoryName(note.category) || '草稿' }}
          </span>
          <div class="note-content">
            <h3 class="note-title">{{ note.title || truncateContent(note.content, 50) }}</h3>
          </div>
          <time class="note-date">{{ formatDate(note.updatedAt) }}</time>
        </article>
        
        <!-- Empty State -->
        <div v-if="filteredNotes.length === 0" class="empty-state">
          <p class="empty-state-text">暂无记录</p>
          <p class="empty-state-subtext">点击下方按钮添加你的第一条记录</p>
        </div>
      </div>
    </main>
    
    <!-- Floating Action Button -->
    <button class="fab-button" @click="openAddNoteModal">
      <span class="material-symbols-outlined">add</span>
    </button>
    
    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <a class="nav-item active" href="#">
        <span class="material-symbols-outlined">edit_note</span>
        <span class="nav-label">随笔</span>
      </a>
      <a class="nav-item" href="#">
        <span class="material-symbols-outlined">search</span>
        <span class="nav-label">搜索</span>
      </a>
      <a class="nav-item" href="#">
        <span class="material-symbols-outlined">analytics</span>
        <span class="nav-label">统计</span>
      </a>
      <a class="nav-item" href="#">
        <span class="material-symbols-outlined">settings</span>
        <span class="nav-label">设置</span>
      </a>
    </nav>

    <!-- Modal Overlay (Edit/Create View) -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingJournal ? '编辑随笔' : '添加随笔' }}</h2>
          <button class="modal-close" @click="closeModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="journal-form">
            <!-- 顶部：分类选择 -->
            <div class="form-group">
              <CustomSelect 
                v-model="formData.category" 
                :options="categoryOptions"
                placeholder="选择分类"
              />
            </div>
            
            <!-- 中间：内容输入 -->
            <div class="form-group">
              <textarea v-model="formData.content" class="form-input content-input" placeholder="写下你的随笔..." rows="8"></textarea>
            </div>
            
            <!-- 底部：启用标题选择框 -->
            <div class="form-group title-toggle">
              <label class="toggle-label">
                <input type="checkbox" v-model="formData.useTitle" class="toggle-checkbox">
                <span class="toggle-text">启用标题</span>
                <input v-if="formData.useTitle" v-model="formData.title" type="text" class="form-input title-input" placeholder="标题" />
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeModal">取消</button>
          <button class="modal-btn confirm-btn" @click="saveJournal">保存</button>
        </div>
      </div>
    </div>
    
    <!-- Add Category Modal -->
    <div v-if="showAddCategoryModal" class="modal-overlay" style="z-index: 1000" @click.self="showAddCategoryModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">新建分类</h2>
          <button class="modal-close" @click="showAddCategoryModal = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="journal-form">
            <input v-model="newCategoryName" type="text" class="form-input title-input" placeholder="分类名称" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="showAddCategoryModal = false">取消</button>
          <button class="modal-btn confirm-btn" @click="addCategory">添加</button>
        </div>
      </div>
    </div>
    
    <!-- Rename Category Modal -->
    <div v-if="showRenameCategoryModal" class="modal-overlay" style="z-index: 1200" @click.self="showRenameCategoryModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">重命名分类</h2>
          <button class="modal-close" @click="showRenameCategoryModal = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="journal-form">
            <input v-model="renameCategoryName" type="text" class="form-input title-input" placeholder="新分类名称" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="showRenameCategoryModal = false">取消</button>
          <button class="modal-btn confirm-btn" @click="renameCategory">保存</button>
        </div>
      </div>
    </div>
    
    <!-- Delete Category Modal -->
    <div v-if="showDeleteCategoryModal" class="modal-overlay" style="z-index: 1200" @click.self="showDeleteCategoryModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">删除分类</h2>
          <button class="modal-close" @click="showDeleteCategoryModal = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-message">确定要删除分类 "{{ categoryToDelete?.name }}" 吗？</p>
          <div class="form-group">
            <label class="form-label">将以下分类的内容移动到：</label>
            <CustomSelect 
              v-model="transferCategory" 
              :options="transferCategoryOptions"
              placeholder="无分类"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="showDeleteCategoryModal = false">取消</button>
          <button class="modal-btn confirm-btn" @click="deleteCategory">删除</button>
        </div>
      </div>
    </div>
    
    <!-- Modal Overlay (Manage Categories) -->
    <div v-if="showManageCategoryModal" class="modal-overlay" style="z-index: 1100" @click.self="closeManageCategoryModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">管理分类</h2>
          <button class="modal-close" @click="closeManageCategoryModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="manage-category-list">
            <div 
              v-for="(category, index) in managedCategories" 
              :key="category.id"
              class="manage-category-item"
            >
              <button class="drag-handle" @click="moveCategoryUp(index)" :disabled="index === 0">
                <span class="material-symbols-outlined">arrow_upward</span>
              </button>
              <span class="manage-category-name">{{ category.name }}</span>
              <div class="manage-category-actions">
                <button class="manage-action-btn" @click="openRenameCategoryModal(category)">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="manage-action-btn" @click="openDeleteCategoryModal(category)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
              <button class="drag-handle" @click="moveCategoryDown(index)" :disabled="index === managedCategories.length - 1">
                <span class="material-symbols-outlined">arrow_downward</span>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeManageCategoryModal">取消</button>
          <button class="modal-btn confirm-btn" @click="saveCategoryOrder">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../../stores/user'
import CustomSelect from '../../../components/CustomSelect.vue'

const router = useRouter()
const userStore = useUserStore()

// 默认头像
const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSGN0Cm9Bxf1dh4sgXge21tfxPoA1zS4UJrOAZ0NdLM2CFGR4FElhuCJkTwiCmu_NAvIxXk7cj09ebPXoKJnPIlha0R4tpO0ewejnJRFLe4KDx7w1zv5XrXW8dOQCRrXAJgf5IBTrt7fGb4BcFrjcn5AmGPk1cHLgou6ONPBrDeNkZNXQlnyDab2SGV5lO2kRKqhkkqJGkOEyTxXodNJKfzzfQan-gGiSo_uyoDZJXIm5qFJOCet_YntMz6OgVwDWR4obhSWOk_Eo'

// 响应式数据
const showAddModal = ref(false)
  const editingJournal = ref(null)
  const formData = ref({ title: '', content: '', category: '', useTitle: false })
  const username = computed(() => userStore.user?.username || '用户')
  const categories = ref([])
  const notes = ref([])
  const selectedCategory = ref('all')
  const showCategoryDropdown = ref(false)
  const searchQuery = ref('')
  const showDeleteCategoryModal = ref(false)
  const categoryToDelete = ref(null)
  const transferCategory = ref('')
  const showManageCategoryModal = ref(false)
  const managedCategories = ref([])

// 计算属性：过滤和排序记录
const filteredNotes = computed(() => {
  let result = [...notes.value]
  
  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    result = result.filter(note => note.category === selectedCategory.value)
  } else {
    // 全部分类视图包括所有记录
  }
  
  // 按搜索关键词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(note => 
      (note.title && note.title.toLowerCase().includes(query)) ||
      (note.content && note.content.toLowerCase().includes(query))
    )
  }
  
  // 按时间倒序排序
  result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  
  return result
})

// 计算属性：记录数量
const entriesCount = computed(() => notes.value.length)

// 计算属性：获取分类名称
const getCategoryName = computed(() => {
  return (categoryId) => {
    if (!categoryId) return ''
    const category = categories.value.find(c => c.id === categoryId)
    return category ? category.name : ''
  }
})

// 计算属性：分类选项
const categoryOptions = computed(() => {
  return [
    { label: '选择分类', value: '' },
    ...categories.value.map(category => ({ label: category.name, value: category.id }))
  ]
})

// 计算属性：转移分类选项
const transferCategoryOptions = computed(() => {
  return [
    { label: '无分类', value: '' },
    ...categories.value
      .filter(c => c.id !== categoryToDelete.value?.id)
      .map(category => ({ label: category.name, value: category.id }))
  ]
})

// 检测设备类型
const isMobile = computed(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

// 本地存储键名
const STORAGE_KEYS = {
  CATEGORIES: 'journal_categories',
  NOTES: 'journal_notes'
}

// 从本地存储读取数据
function loadFromStorage() {
  try {
    const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES)
    
    if (storedCategories) {
      categories.value = JSON.parse(storedCategories)
    }
    
    if (storedNotes) {
      notes.value = JSON.parse(storedNotes)
    }
  } catch (error) {
    console.error('从本地存储加载数据失败:', error)
  }
}

// 保存数据到本地存储
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories.value))
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes.value))
  } catch (error) {
    console.error('保存数据到本地存储失败:', error)
  }
}

// 响应式数据（分类管理）
const showAddCategoryModal = ref(false)
const showRenameCategoryModal = ref(false)
const newCategoryName = ref('')
const categoryToRename = ref(null)
const renameCategoryName = ref('')

// 方法
function navigateBack() {
  router.go(-1)
}

function goHome() {
  router.push('/')
}

function toggleCategoryDropdown() {
  showCategoryDropdown.value = !showCategoryDropdown.value
}

function handleHeaderClick(event) {
  if (showCategoryDropdown.value && !event.target.closest('.more-btn') && !event.target.closest('.categories-dropdown-menu')) {
    showCategoryDropdown.value = false
  }
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}

function closeModal() {
  showAddModal.value = false
  editingJournal.value = null
  formData.value = { title: '', content: '', category: '' }
}

function openAddNoteModal() {
  // 新建记录时，默认使用当前选中的分类（除了全部分类）
  formData.value = {
    title: '',
    content: '',
    category: selectedCategory.value === 'all' ? '' : selectedCategory.value,
    useTitle: false
  }
  editingJournal.value = null
  showAddModal.value = true
}

function openEditNoteModal(note) {
  formData.value = {
    title: note.title || '',
    content: note.content || '',
    category: note.category || '',
    useTitle: !!note.title
  }
  editingJournal.value = note
  showAddModal.value = true
}

function saveJournal() {
  if (!formData.value.content.trim()) return
  
  if (editingJournal.value) {
    // 编辑现有记录
    const index = notes.value.findIndex(note => note.id === editingJournal.value.id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        title: formData.value.useTitle ? formData.value.title : '',
        content: formData.value.content,
        category: formData.value.category,
        updatedAt: new Date().toISOString()
      }
    }
  } else {
    // 新建记录
    const newNote = {
      id: Date.now().toString(),
      title: formData.value.useTitle ? formData.value.title : '',
      content: formData.value.content,
      category: formData.value.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    notes.value.unshift(newNote)
  }
  
  saveToStorage()
  closeModal()
}

// 分类管理方法
function openAddCategoryModal() {
  newCategoryName.value = ''
  showAddCategoryModal.value = true
}

function saveCategory() {
  if (!newCategoryName.value.trim()) return
  
  const newCategory = {
    id: Date.now().toString(),
    name: newCategoryName.value.trim()
  }
  
  categories.value.push(newCategory)
  saveToStorage()
  showAddCategoryModal.value = false
}

function openRenameCategoryModal(category) {
  categoryToRename.value = category
  renameCategoryName.value = category.name
  showRenameCategoryModal.value = true
}

function renameCategory() {
  if (!renameCategoryName.value.trim() || !categoryToRename.value) return
  
  const index = categories.value.findIndex(c => c.id === categoryToRename.value.id)
  if (index !== -1) {
    categories.value[index].name = renameCategoryName.value.trim()
    if (showManageCategoryModal.value) {
      const managedIndex = managedCategories.value.findIndex(c => c.id === categoryToRename.value.id)
      if (managedIndex !== -1) {
        managedCategories.value[managedIndex].name = renameCategoryName.value.trim()
      }
    }
    saveToStorage()
  }
  
  showRenameCategoryModal.value = false
  categoryToRename.value = null
}

function openDeleteCategoryModal(category) {
  categoryToDelete.value = category
  transferCategory.value = ''
  showDeleteCategoryModal.value = true
}

function deleteCategory() {
  if (!categoryToDelete.value) return
  
  // 如果在管理分类弹窗中，先从管理列表中移除
  if (showManageCategoryModal.value) {
    managedCategories.value = managedCategories.value.filter(c => c.id !== categoryToDelete.value.id)
  }
  
  // 将该分类下的记录转移到其他分类
  notes.value.forEach(note => {
    if (note.category === categoryToDelete.value.id) {
      note.category = transferCategory.value
    }
  })
  
  // 删除分类
  categories.value = categories.value.filter(c => c.id !== categoryToDelete.value.id)
  
  // 如果当前选中的是被删除的分类，切换到全部分类
  if (selectedCategory.value === categoryToDelete.value.id) {
    selectedCategory.value = 'all'
  }
  
  saveToStorage()
  showDeleteCategoryModal.value = false
  categoryToDelete.value = null
  transferCategory.value = ''
}

function openManageCategoryModal() {
  managedCategories.value = [...categories.value]
  showManageCategoryModal.value = true
}

function closeManageCategoryModal() {
  showManageCategoryModal.value = false
  managedCategories.value = []
}

function saveCategoryOrder() {
  categories.value = [...managedCategories.value]
  saveToStorage()
  closeManageCategoryModal()
}

function moveCategoryUp(index) {
  if (index > 0) {
    const temp = managedCategories.value[index]
    managedCategories.value[index] = managedCategories.value[index - 1]
    managedCategories.value[index - 1] = temp
  }
}

function moveCategoryDown(index) {
  if (index < managedCategories.value.length - 1) {
    const temp = managedCategories.value[index]
    managedCategories.value[index] = managedCategories.value[index + 1]
    managedCategories.value[index + 1] = temp
  }
}

// 辅助函数：格式化日期
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 辅助函数：截断内容
function truncateContent(content, maxLength) {
  if (!content) return ''
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

// 辅助函数：获取分类样式类
function getCategoryClass(categoryId) {
  const category = categories.value.find(c => c.id === categoryId)
  if (!category) return 'drafts'
  
  const categoryMap = {
    'personal': 'personal',
    'work': 'work',
    'ideas': 'ideas',
    'drafts': 'drafts'
  }
  
  return categoryMap[category.name.toLowerCase()] || 'drafts'
}

// 初始化数据
onMounted(() => {
  loadFromStorage()
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})

function handleDocumentClick(event) {
  if (showCategoryDropdown.value && 
      !event.target.closest('.more-btn') && 
      !event.target.closest('.categories-dropdown-menu') &&
      !event.target.closest('.sticky-right')) {
    showCategoryDropdown.value = false
  }
}
</script>

<style scoped>
/* 组件特定的 CSS 变量 */
.journal-page {
  --primary: #3b6934;
  --primary-dim: #2f5c29;
  --primary-container: #bcf0ae;
  --on-primary: #e6ffdb;
  --on-primary-container: #2f5c28;
  --secondary: #5e605b;
  --secondary-container: #e2e3dd;
  --on-secondary: #f9f9f3;
  --on-secondary-container: #50524e;
  --tertiary: #4c654f;
  --tertiary-container: #d6f3d7;
  --on-tertiary: #e8ffe8;
  --on-tertiary-container: #445d47;
  --background: #f8faf8;
  --surface: #f8faf8;
  --surface-container: #e9efed;
  --surface-container-low: #f0f5f2;
  --surface-container-lowest: #ffffff;
  --surface-container-high: #e1eae7;
  --surface-container-highest: #dae5e1;
  --surface-variant: #dae5e1;
  --on-background: #2a3432;
  --on-surface: #2a3432;
  --on-surface-variant: #57615f;
  --outline: #727d7a;
  --outline-variant: #a9b4b1;
}

/* Material Symbols Outlined 图标设置 */
.journal-page .material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24 !important;
  font-family: 'Material Symbols Outlined' !important;
  font-style: normal !important;
  font-weight: normal !important;
  font-size: 24px !important;
  line-height: 1 !important;
  letter-spacing: normal !important;
  text-transform: none !important;
  display: inline-block !important;
  white-space: nowrap !important;
  word-wrap: normal !important;
  direction: ltr !important;
  -webkit-font-feature-settings: 'liga' !important;
  -webkit-font-smoothing: antialiased !important;
}
</style>

<style scoped>
/* 页面容器 */
.journal-page {
  min-height: 100vh;
  background-color: var(--background);
  padding-bottom: 100px;
}

/* 头部样式 */
.header {
  background-color: var(--surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

/* 头部顶部区域 */
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  height: 56px;
  box-sizing: border-box;
}

/* 返回/首页按钮 */
.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--surface-container-low);
  color: var(--on-surface-variant);
  border: 1px solid var(--surface-variant);
  cursor: pointer;
  flex: none;
}

.back-btn .material-symbols-outlined {
  font-size: 20px;
}

/* 头部标题 */
.title {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #2D5A27;
  margin: 0;
  flex: 1;
  text-align: center;
}

/* 头部操作区域 */
.header-actions {
  display: flex;
  align-items: center;
}

/* 搜索图标 */
.search-icon {
  color: #727d7a;
  font-size: 24px;
  cursor: pointer;
}

/* 用户头像 */
.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--surface-variant);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 搜索部分 */
.search-section {
  padding: 0 1.5rem 1rem;
}

/* 搜索输入框容器 */
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--surface-container-low);
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  width: 100%;
}

.search-input-wrapper:focus-within {
  background-color: var(--surface-container-lowest);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 搜索输入框图标 */
.search-input-icon {
  color: var(--outline-variant);
  margin-right: 0.75rem;
  font-size: 1.25rem;
  flex: none;
}

/* 搜索输入框 */
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface);
  padding: 0;
  line-height: 1.5;
}

.search-input::placeholder {
  color: rgba(87, 97, 95, 0.5);
  font-weight: 500;
}

/* 分类部分 */
.categories-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px 12px;
  overflow-x: auto;
  border-bottom: 1px solid var(--surface-container);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.categories-section::-webkit-scrollbar {
  display: none;
}

/* 分类容器 */
.categories-container {
  display: flex;
  gap: 8px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

.categories-container::-webkit-scrollbar {
  display: none;
}

/* 分类按钮 */
.category-btn {
  white-space: nowrap;
  padding: 6px 16px;
  border-radius: 6px;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--surface-variant);
  background: none;
  color: var(--on-surface-variant);
  flex: none;
}

.category-btn.active {
  background-color: var(--primary);
  color: var(--on-primary);
  border-color: var(--primary);
}

/* 粘性右侧区域 */
.sticky-right {
  position: sticky;
  right: 0;
  background: linear-gradient(to left, var(--surface), transparent);
  padding-left: 1rem;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 更多按钮 */
.more-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: var(--surface-container-low);
  color: var(--on-surface-variant);
  border: 1px solid var(--surface-variant);
  cursor: pointer;
  flex: none;
}

/* 下拉箭头旋转动画 */
.dropdown-arrow {
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* 分类下拉菜单 */
.categories-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: var(--surface);
  border: 1px solid var(--surface-variant);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 192px;
  overflow: hidden;
}

/* 下拉菜单项 */
.dropdown-item {
  padding: 8px 16px;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: var(--on-surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.dropdown-item.active {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
}

.dropdown-item.add-category {
  color: var(--primary);
}

.dropdown-item.manage-category {
  color: var(--secondary);
  border-top: 1px solid var(--surface-variant);
  margin-top: 4px;
  padding-top: 12px;
}

.dropdown-item .material-symbols-outlined {
  font-size: 14px;
  flex: none;
}

/* 分类标签样式 */
.main-content {
  margin-top: 1rem;
}

/* 问候语 */
.greeting-section {
  padding: 0 1.5rem 1.5rem;
}

.greeting {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--on-surface);
  letter-spacing: -0.02em;
  margin: 0;
}

.greeting .text-primary {
  color: var(--primary);
}

/* 条目计数 */
.entry-count {
  margin-top: 0.25rem;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.0625rem;
  color: var(--on-surface-variant);
  margin-bottom: 0;
}

/* 笔记列表 */
.notes-list {
  display: flex;
  flex-direction: column;
}

/* 笔记卡片 */
.note-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--surface-container);
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.note-card:active {
  background-color: var(--surface-container);
}

/* 分类标签 */
.category-tag {
  flex: none;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 56px;
  line-height: 1.2;
}

/* 分类标签样式 */
.category-tag.personal {
  background-color: rgba(188, 240, 174, 0.3);
  color: var(--primary);
}

.category-tag.work {
  background-color: rgba(214, 243, 215, 0.5);
  color: var(--tertiary);
}

.category-tag.ideas {
  background-color: rgba(188, 240, 174, 0.3);
  color: var(--primary);
}

.category-tag.drafts {
  background-color: var(--surface-container-highest);
  color: var(--on-surface-variant);
}

/* 笔记内容 */
.note-content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

/* 笔记标题 */
.note-title {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: var(--on-surface);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

/* 笔记日期 */
.note-date {
  flex: none;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--on-surface-variant);
  white-space: nowrap;
  line-height: 1.4;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
  text-align: center;
}

.empty-state-text {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 18px;
  color: var(--on-surface-variant);
  margin-bottom: 8px;
  margin-top: 0;
}

.empty-state-subtext {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
  margin: 0;
}

/* 浮动操作按钮 */
.fab-button {
  position: fixed;
  bottom: 105px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: var(--primary);
  color: var(--on-primary);
  box-shadow: 0 4px 12px rgba(42, 52, 50, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  border: none;
  cursor: pointer;
  flex: none;
}

.fab-button .material-symbols-outlined {
  font-size: 24px;
  font-weight: bold;
}

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.75rem 1rem 1.5rem;
  background-color: rgba(248, 250, 248, 0.7);
  backdrop-filter: blur(10px);
  z-index: 50;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  box-shadow: 0 -8px 24px rgba(42, 52, 50, 0.06);
}

/* 导航项 */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  border-radius: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  flex: 1;
  max-width: 8rem;
}

.nav-item:active {
  transform: scale(0.9);
}

/* 活动状态的导航项 */
.nav-item.active {
  background-color: #dae5e1;
  color: #2D5A27;
}

/* 非活动状态的导航项 */
.nav-item:not(.active) {
  color: #78716c;
}

/* 导航图标 */
.nav-item .material-symbols-outlined {
  margin-bottom: 0.125rem;
  font-size: 1.25rem;
}

/* 导航标签 */
.nav-label {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.03125rem;
  text-align: center;
  margin: 0;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: fadeIn 0.3s ease;
}

.modal-overlay.manage-modal {
  z-index: 1100;
}

.modal-content {
  background-color: var(--surface);
  border-radius: 16px;
  width: 100%;
  max-width: 448px;
  padding: 20px;
  animation: slideUp 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 上滑动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 模态框头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px 0;
  border-bottom: 1px solid var(--surface-container);
}

/* 模态框标题 */
.modal-title {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--on-surface);
  margin: 0;
}

/* 模态框关闭按钮 */
.modal-close {
  background: none;
  border: none;
  color: var(--outline);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 模态框主体 */
.modal-body {
  margin-bottom: 16px;
}

/* 模态框底部 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--surface-container);
}

/* 表单组 */
.form-group {
  margin-bottom: 1rem;
}

/* 表单标签 */
.form-label {
  display: block;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  margin-bottom: 8px;
  margin-top: 0;
}

/* 表单输入框 */
.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--surface-variant);
  border-radius: 8px;
  background-color: var(--surface-container-low);
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 1rem;
  color: var(--on-surface);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary);
}

/* 文本域 */
.form-textarea {
  resize: vertical;
  min-height: 10rem;
  line-height: 1.5;
}

/* 模态框按钮 */
.modal-btn {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  flex: none;
  min-width: 96px;
  text-align: center;
}

/* 取消按钮 */
.cancel-btn {
  background-color: var(--surface-container-low);
  color: var(--on-surface-variant);
  border: 1px solid var(--surface-variant);
}

/* 确认按钮 */
.confirm-btn {
  background-color: var(--primary);
  color: var(--on-primary);
  border: 1px solid var(--primary);
}

/* 标题开关 */
.title-toggle {
  margin-top: 8px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  min-height: 3rem;
}

.toggle-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: var(--primary);
}

.toggle-text {
  font-size: 1rem;
  color: var(--on-surface);
}

.toggle-label .title-input {
  flex: 1;
  min-width: 12.5rem;
}

/* 模态框消息 */
.modal-message {
  font-size: 16px;
  color: var(--on-surface);
  margin: 0 0 16px 0;
}

/* 管理分类列表 */
.manage-category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.manage-category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: var(--surface-container-low);
  border-radius: 8px;
  border: 1px solid var(--surface-variant);
}

.drag-handle {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--on-surface-variant);
  cursor: pointer;
  border-radius: 4px;
  flex: none;
}

.drag-handle:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.drag-handle .material-symbols-outlined {
  font-size: 20px;
}

.manage-category-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
}

.manage-category-actions {
  display: flex;
  gap: 4px;
}

.manage-action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--on-surface-variant);
  cursor: pointer;
  border-radius: 4px;
}

.manage-action-btn .material-symbols-outlined {
  font-size: 18px;
}
</style>