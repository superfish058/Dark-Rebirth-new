<template>
  <div class="journal-wrapper">
    <!-- 桌面端布局 -->
    <div v-if="!isMobile" class="desktop-layout">
      <!-- 侧边栏 -->
      <aside class="desktop-sidebar">
        <nav class="sidebar-nav">
          <!-- 侧边栏内容 -->
        </nav>
      </aside>
      
      <!-- 主内容区 -->
      <main class="desktop-main">
        <!-- 顶部导航栏 -->
        <header class="desktop-topnav">
          <div class="topnav-content">
            <span class="topnav-title">暗语随笔</span>
            <div class="topnav-user">
              <span class="username">{{ username }}</span>
              <button class="logout-btn" @click="handleLogout">退出</button>
            </div>
          </div>
        </header>
        
        <!-- Main Canvas -->
        <div class="main-canvas">
          <!-- Header Controls Section -->
          <div class="header-controls">
            <div class="header-container">
              <div class="heading-section">
                <h1 class="main-title">Your Collected Thoughts</h1>
              </div>
              <div class="search-section">
                <div class="search-input-wrapper">
                  <input type="text" class="search-input" placeholder="Search through archives..." />
                  <div class="search-icon">
                    <i class="fas fa-search"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Categories Horizontal Scroll -->
            <div class="categories-section">
              <div class="categories-container">
                <div class="category-btn active">All Categories</div>
                <div class="category-btn">Journal</div>
                <div class="category-btn">Project: Xylophone</div>
                <div class="category-btn">Philosophy</div>
                <div class="category-btn">Sketchbook</div>
              </div>
              <button class="categories-more">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <!-- Notes Grid/List -->
          <div class="notes-grid">
            <!-- Note Card 1 -->
            <div class="note-card">
              <div class="note-content">
                <div class="note-header">
                  <div class="category-tag philosophy">Philosophy</div>
                  <div class="note-date">Oct 24, 2023 · 11:42 AM</div>
                </div>
                <h3 class="note-title">On the Nature of<br>Impermanence</h3>
                <p class="note-excerpt">The way light hits the silk at sunset reminds me of how quickly moments fade. We must capture the essence…</p>
              </div>
              <div class="note-margin">
                <div class="note-actions"></div>
              </div>
            </div>
            
            <!-- Note Card 2 -->
            <div class="note-card">
              <div class="note-content">
                <div class="note-header">
                  <div class="category-tag journal">Journal</div>
                  <div class="note-date">Oct 23, 2023 · 09:15 PM</div>
                </div>
                <h3 class="note-title">Quiet Evening in the Atelier</h3>
                <p class="note-excerpt">Rain against the skylight. The charcoal smell of the hearth. Finished the primary sketches for the new…</p>
              </div>
              <div class="note-margin">
                <div class="note-actions"></div>
              </div>
            </div>
            
            <!-- Note Card 3 -->
            <div class="note-card">
              <div class="note-content">
                <div class="note-header">
                  <div class="category-tag project">Project:<br>Xylophone</div>
                  <div class="note-date">Oct 21, 2023 · 02:30 PM</div>
                </div>
                <h3 class="note-title">Structural Integrity<br>Requirements</h3>
                <p class="note-excerpt">Reviewing the cantilever support systems for the main hall. Need to ensure the golden ratios are…</p>
              </div>
              <div class="note-margin">
                <div class="note-actions"></div>
              </div>
            </div>
            
            <!-- Image/Quote Card -->
            <div class="quote-card">
              <div class="quote-bg"></div>
              <div class="quote-overlay"></div>
              <div class="quote-content">
                <div class="quote-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <div class="quote-text-container">
                  <p class="quote-text">"The details are not the details. They make the design."</p>
                </div>
                <p class="quote-author">— Charles Eames</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Floating Action Button -->
      <button class="fab desktop-fab" @click="showAddModal = true">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <!-- 移动端布局 -->
    <div v-else class="mobile-layout">
      <!-- 顶部导航栏 -->
      <header class="mobile-topnav">
        <div class="mobile-topnav-content">
          <button class="back-btn" @click="navigateBack">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="mobile-topnav-title">暗语随笔</span>
          <div class="mobile-topnav-user">
            <span class="mobile-username">{{ username }}</span>
          </div>
        </div>
      </header>
      
      <!-- Main Canvas -->
      <div class="mobile-main-canvas">
        <!-- Header Controls Section -->
        <div class="mobile-header-controls">
          <div class="mobile-header-container">
            <div class="mobile-heading-section">
              <h1 class="mobile-main-title">Your Collected Thoughts</h1>
            </div>
            <div class="mobile-search-section">
              <div class="mobile-search-input-wrapper">
                <input 
                  type="text" 
                  class="mobile-search-input" 
                  placeholder="搜索记录..." 
                  v-model="searchQuery"
                />
                <div class="mobile-search-icon">
                  <i class="fas fa-search"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Categories Horizontal Scroll -->
          <div class="mobile-categories-section">
            <div class="mobile-categories-container">
              <div 
                class="mobile-category-btn" 
                :class="{ active: selectedCategory === 'all' }"
                @click="selectedCategory = 'all'"
              >
                全部分类
              </div>
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="mobile-category-btn"
                :class="{ active: selectedCategory === category.id }"
                @click="selectedCategory = category.id"
              >
                {{ category.name }}
              </div>
            </div>
            <div class="mobile-categories-dropdown">
              <button class="mobile-categories-more" @click="showCategoryDropdown = !showCategoryDropdown">
                <i class="fas fa-chevron-down"></i>
              </button>
              <div v-if="showCategoryDropdown" class="mobile-categories-dropdown-menu">
                <div 
                  class="dropdown-item" 
                  :class="{ active: selectedCategory === 'all' }"
                  @click="selectedCategory = 'all'; showCategoryDropdown = false"
                >
                  全部分类
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
                <div class="dropdown-item add-category" @click="openAddCategoryModal(); showCategoryDropdown = false">
                  <i class="fas fa-plus"></i> 新建分类
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notes Grid/List -->
        <div class="mobile-notes-grid">
          <div 
            v-for="note in filteredNotes" 
            :key="note.id"
            class="mobile-note-card"
            @click="openEditNoteModal(note)"
          >
            <div class="mobile-note-content">
              <div class="mobile-note-header">
                <div v-if="note.category" class="mobile-category-tag">
                  {{ getCategoryName(note.category) }}
                </div>
                <div class="mobile-note-date">
                  {{ formatDate(note.updatedAt) }}
                </div>
              </div>
              <h3 v-if="note.title" class="mobile-note-title">{{ note.title }}</h3>
              <p class="mobile-note-excerpt">{{ truncateContent(note.content, 150) }}</p>
            </div>
            <div class="mobile-note-margin">
              <div class="mobile-note-actions"></div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="filteredNotes.length === 0" class="empty-state">
            <p class="empty-state-text">暂无记录</p>
            <p class="empty-state-subtext">点击右下角按钮添加新记录</p>
          </div>
        </div>
      </div>
      
      <!-- Bottom NavBar -->
      <nav class="mobile-bottomnav">
        <div class="mobile-bottomnav-content">
          <!-- 底部导航内容 -->
        </div>
      </nav>
      
      <!-- Floating Action Button -->
      <button class="fab mobile-fab" @click="openAddNoteModal">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <!-- Modal Overlay (Edit/Create View) -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingJournal ? '编辑随笔' : '添加随笔' }}</h2>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="journal-form">
            <input v-model="formData.title" type="text" class="form-input title-input" placeholder="标题" />
            <textarea v-model="formData.content" class="form-input content-input" placeholder="写下你的随笔..." rows="8"></textarea>
            <div class="form-footer">
              <select v-model="formData.category" class="category-select">
                <option value="">选择分类</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
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
    <div v-if="showAddCategoryModal" class="modal-overlay" @click.self="showAddCategoryModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">新建分类</h2>
          <button class="modal-close" @click="showAddCategoryModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="journal-form">
            <input v-model="newCategoryName" type="text" class="form-input title-input" placeholder="分类名称" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="showAddCategoryModal = false">取消</button>
          <button class="modal-btn confirm-btn" @click="saveCategory">保存</button>
        </div>
      </div>
    </div>

    <!-- Rename Category Modal -->
    <div v-if="showRenameCategoryModal" class="modal-overlay" @click.self="showRenameCategoryModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">重命名分类</h2>
          <button class="modal-close" @click="showRenameCategoryModal = false">
            <i class="fas fa-times"></i>
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
    <div v-if="showDeleteCategoryModal" class="modal-overlay" @click.self="showDeleteCategoryModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">删除分类</h2>
          <button class="modal-close" @click="showDeleteCategoryModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-message">确定要删除分类 "{{ categoryToDelete?.name }}" 吗？</p>
          <p class="modal-message">请选择将该分类下的记录转移到其他分类：</p>
          <div class="journal-form">
            <select v-model="transferCategory" class="category-select">
              <option value="">无分类</option>
              <option v-for="category in categories.filter(c => c.id !== categoryToDelete?.id)" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="showDeleteCategoryModal = false">取消</button>
          <button class="modal-btn confirm-btn" @click="deleteCategory">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const showAddModal = ref(false)
const editingJournal = ref(null)
const formData = ref({ title: '', content: '', category: '' })
const username = computed(() => userStore.user?.username || '用户')
const categories = ref([])
const notes = ref([])
const selectedCategory = ref('all')
const showCategoryDropdown = ref(false)
const searchQuery = ref('')
const showDeleteCategoryModal = ref(false)
const categoryToDelete = ref(null)
const transferCategory = ref('')

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

// 计算属性：获取分类名称
const getCategoryName = computed(() => {
  return (categoryId) => {
    if (!categoryId) return ''
    const category = categories.value.find(c => c.id === categoryId)
    return category ? category.name : ''
  }
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
    category: selectedCategory.value === 'all' ? '' : selectedCategory.value
  }
  editingJournal.value = null
  showAddModal.value = true
}

function openEditNoteModal(note) {
  formData.value = {
    title: note.title || '',
    content: note.content || '',
    category: note.category || ''
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
        title: formData.value.title,
        content: formData.value.content,
        category: formData.value.category,
        updatedAt: new Date().toISOString()
      }
    }
  } else {
    // 新建记录
    const newNote = {
      id: Date.now().toString(),
      title: formData.value.title,
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

// 辅助函数：格式化日期
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
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

// 初始化数据
onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped>
/* ===== 通用样式 ===== */
.journal-wrapper {
  min-height: 100vh;
  background-color: #131313;
  color: #E5E2E1;
}

/* ===== 桌面端样式 ===== */
.desktop-layout {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏 */
.desktop-sidebar {
  width: 256px;
  background-color: #0C0A09;
  padding: 96px 16px 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
}

/* 主内容区 */
.desktop-main {
  flex: 1;
  margin-left: 256px;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.desktop-topnav {
  background-color: rgba(12, 10, 9, 0.8);
  backdrop-filter: blur(24px);
  padding: 16px 24px;
  position: fixed;
  top: 0;
  left: 256px;
  right: 0;
  z-index: 100;
}

.topnav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topnav-title {
  font-family: 'Liberation Serif', serif;
  font-size: 18px;
  font-weight: 700;
  color: #E5E2E1;
}

.topnav-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #E5E2E1;
}

.logout-btn {
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: #E5E2E1;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Main Canvas */
.main-canvas {
  padding: 96px 48px 123px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* Header Controls Section */
.header-controls {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 24px;
}

.heading-section {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-family: 'Liberation Serif', serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 1.111;
  letter-spacing: -2.5%;
  color: #E5E2E1;
  margin: 0;
}

.search-section {
  display: flex;
  flex-direction: column;
}

.search-input-wrapper {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 13px 12px 13px 48px;
  background-color: #353535;
  border: none;
  border-radius: 12px;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #E5E2E1;
  outline: none;
}

.search-input::placeholder {
  color: #78716C;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #78716C;
  font-size: 16px;
}

/* Categories Section */
.categories-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(41, 37, 36, 0.3);
}

.categories-container {
  display: flex;
  gap: 12px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

.categories-container::-webkit-scrollbar {
  display: none;
}

.category-btn {
  padding: 8px 24px;
  background-color: #20201F;
  border: none;
  border-radius: 9999px;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #E5E2E1;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn.active {
  background-color: #E9C349;
  color: #131313;
}

.categories-more {
  width: 36px;
  height: 36px;
  background-color: transparent;
  border: 1px solid #353535;
  border-radius: 9999px;
  color: #E5E2E1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Notes Grid */
.notes-grid {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* Note Card */
.note-card {
  background-color: #1C1B1B;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 270px;
}

.note-content {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.category-tag {
  padding: 4px 12px;
  border-radius: 9999px;
  font-family: 'Manrope', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 10%;
  text-transform: uppercase;
}

.category-tag.philosophy {
  background-color: rgba(233, 195, 73, 0.1);
  color: #E9C349;
}

.category-tag.journal {
  background-color: rgba(231, 189, 177, 0.1);
  color: #E7BDB1;
}

.category-tag.project {
  background-color: rgba(233, 195, 73, 0.1);
  color: #E9C349;
}

.note-date {
  font-family: 'Manrope', sans-serif;
  font-size: 12px;
  color: #78716C;
}

.note-title {
  font-family: 'Liberation Serif', serif;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.333;
  color: #E5E2E1;
  margin: 0;
}

.note-excerpt {
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.625;
  color: #D1C5B4;
  margin: 0;
}

.note-margin {
  padding-top: 32px;
}

.note-actions {
  display: flex;
  justify-content: flex-end;
}

/* Quote Card */
.quote-card {
  position: relative;
  border-radius: 12px;
  padding: 32px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
}

.quote-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800');
  background-size: cover;
  background-position: center;
  opacity: 0.4;
}

.quote-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(12, 10, 9, 0.6);
}

.quote-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.quote-icon {
  font-size: 32px;
  color: #E5E2E1;
  opacity: 0.7;
}

.quote-text-container {
  padding: 0 26px;
}

.quote-text {
  font-family: 'Liberation Serif', serif;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.333;
  color: #E5E2E1;
  margin: 0;
  font-style: italic;
}

.quote-author {
  font-family: 'Manrope', sans-serif;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 10%;
  text-transform: uppercase;
  color: #E9C349;
  margin: 0;
}

/* Floating Action Button */
.fab {
  position: fixed;
  width: 64px;
  height: 64px;
  background-color: #E9C349;
  border: none;
  border-radius: 9999px;
  color: #131313;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(233, 195, 73, 0.4);
  z-index: 1000;
  transition: transform 0.2s;
}

.fab:hover {
  transform: scale(1.1);
}

.desktop-fab {
  right: 48px;
  bottom: 48px;
}

/* ===== 移动端样式 ===== */
.mobile-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

/* 移动端顶部导航栏 */
.mobile-topnav {
  background-color: rgba(12, 10, 9, 0.8);
  backdrop-filter: blur(24px);
  padding: 16px 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.mobile-topnav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  background: none;
  border: none;
  color: #E5E2E1;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
}

.mobile-topnav-title {
  font-family: 'Liberation Serif', serif;
  font-size: 18px;
  font-weight: 700;
  color: #E5E2E1;
}

.mobile-topnav-user {
  display: flex;
  align-items: center;
}

.mobile-username {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #E5E2E1;
}

/* 移动端 Main Canvas */
.mobile-main-canvas {
  padding: 96px 24px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  flex: 1;
}

/* 移动端 Header Controls */
.mobile-header-controls {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.mobile-header-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mobile-heading-section {
  display: flex;
  flex-direction: column;
}

.mobile-main-title {
  font-family: 'Liberation Serif', serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.111;
  letter-spacing: -2.5%;
  color: #E5E2E1;
  margin: 0;
}

.mobile-search-section {
  display: flex;
  flex-direction: column;
}

.mobile-search-input-wrapper {
  position: relative;
  width: 100%;
}

.mobile-search-input {
  width: 100%;
  padding: 13px 12px 13px 48px;
  background-color: #353535;
  border: none;
  border-radius: 12px;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #E5E2E1;
  outline: none;
}

.mobile-search-input::placeholder {
  color: #78716C;
}

.mobile-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #78716C;
  font-size: 16px;
}

/* 移动端 Categories */
.mobile-categories-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(41, 37, 36, 0.3);
}

.mobile-categories-container {
  display: flex;
  gap: 12px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

.mobile-categories-container::-webkit-scrollbar {
  display: none;
}

.mobile-category-btn {
  padding: 8px 24px;
  background-color: #20201F;
  border: none;
  border-radius: 9999px;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #E5E2E1;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-category-btn.active {
  background-color: #E9C349;
  color: #131313;
}

.mobile-categories-more {
  width: 36px;
  height: 36px;
  background-color: transparent;
  border: 1px solid #353535;
  border-radius: 9999px;
  color: #E5E2E1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移动端 Notes Grid */
.mobile-notes-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

/* 移动端 Note Card */
.mobile-note-card {
  background-color: #1C1B1B;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 120px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 16px;
}

.mobile-note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
}

.mobile-note-card:active {
  transform: translateY(0);
}

.mobile-note-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.mobile-category-tag {
  padding: 4px 12px;
  border-radius: 9999px;
  font-family: 'Manrope', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 10%;
  text-transform: uppercase;
  background-color: rgba(233, 195, 73, 0.1);
  color: #E9C349;
}

.mobile-note-date {
  font-family: 'Manrope', sans-serif;
  font-size: 12px;
  color: #78716C;
}

.mobile-note-title {
  font-family: 'Liberation Serif', serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.333;
  color: #E5E2E1;
  margin: 0;
  margin-bottom: 8px;
}

.mobile-note-excerpt {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #D1C5B4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-note-margin {
  padding-top: 32px;
}

.mobile-note-actions {
  display: flex;
  justify-content: flex-end;
}

/* 移动端 Quote Card */
.mobile-quote-card {
  position: relative;
  border-radius: 12px;
  padding: 32px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
}

.mobile-quote-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800');
  background-size: cover;
  background-position: center;
  opacity: 0.4;
}

.mobile-quote-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(12, 10, 9, 0.6);
}

.mobile-quote-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.mobile-quote-icon {
  font-size: 32px;
  color: #E5E2E1;
  opacity: 0.7;
}

.mobile-quote-text-container {
  padding: 0 26px;
}

.mobile-quote-text {
  font-family: 'Liberation Serif', serif;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.333;
  color: #E5E2E1;
  margin: 0;
  font-style: italic;
}

.mobile-quote-author {
  font-family: 'Manrope', sans-serif;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 10%;
  text-transform: uppercase;
  color: #E9C349;
  margin: 0;
}

/* 移动端底部导航 */
.mobile-bottomnav {
  background-color: rgba(12, 10, 9, 0.9);
  backdrop-filter: blur(12px);
  box-shadow: 0px -4px 20px 0px rgba(0, 0, 0, 0.5);
  padding: 12px 24px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.mobile-bottomnav-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/* 移动端 FAB */
.mobile-fab {
  right: 24px;
  bottom: 80px;
}

/* Categories Dropdown */
.mobile-categories-dropdown {
  position: relative;
}

.mobile-categories-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: #1C1B1B;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  padding: 12px 16px;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #E5E2E1;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-item.active {
  background-color: rgba(233, 195, 73, 0.1);
  color: #E9C349;
}

.dropdown-item.add-category {
  border-top: 1px solid rgba(41, 37, 36, 0.3);
  margin-top: 8px;
  padding-top: 16px;
  color: #E9C349;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.empty-state-text {
  font-family: 'Liberation Serif', serif;
  font-size: 18px;
  color: #78716C;
  margin: 0 0 8px 0;
}

.empty-state-subtext {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #78716C;
  margin: 0;
}

/* ===== Modal Overlay ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(19, 19, 19, 0.95);
  backdrop-filter: blur(24px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-content {
  background-color: #1C1B1B;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(41, 37, 36, 0.3);
}

.modal-title {
  font-family: 'Liberation Serif', serif;
  font-size: 24px;
  font-weight: 400;
  color: #E5E2E1;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #78716C;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
}

.modal-body {
  padding: 24px;
}

.journal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-input {
  padding: 12px 16px;
  background-color: #353535;
  border: none;
  border-radius: 8px;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #E5E2E1;
  outline: none;
}

.form-input::placeholder {
  color: #78716C;
}

.title-input {
  font-size: 16px;
}

.content-input {
  min-height: 200px;
  resize: vertical;
}

.category-select {
  padding: 12px 16px;
  background-color: #353535;
  border: none;
  border-radius: 8px;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #E5E2E1;
  outline: none;
  cursor: pointer;
}

.category-select option {
  background-color: #1C1B1B;
  color: #E5E2E1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid rgba(41, 37, 36, 0.3);
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: transparent;
  color: #78716C;
}

.cancel-btn:hover {
  color: #E5E2E1;
}

.confirm-btn {
  background-color: #E9C349;
  color: #131313;
}

.confirm-btn:hover {
  background-color: #f0d050;
}

/* Modal Message */
.modal-message {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: #E5E2E1;
  margin: 0 0 16px 0;
}

/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
  .desktop-layout {
    display: none;
  }
}

@media (min-width: 769px) {
  .mobile-layout {
    display: none;
  }
}
</style>