<template>
  <div class="favorites-view">
    <!-- 未登录状态 -->
    <div v-if="!isLoggedIn" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
      <h3 class="empty-title">请先登录</h3>
      <p class="empty-desc">登录后即可使用收藏功能</p>
    </div>

    <!-- 已登录状态 -->
    <template v-else>
      <!-- 页面头部 -->
      <div class="favorites-header">
        <button class="add-btn" @click="resetForm(); showAddDialog = true">
          <span class="add-icon">+</span>
          添加网站
        </button>
        <button class="edit-mode-btn" :class="{ active: isEditMode }" @click="toggleEditMode">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          编辑
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
        </div>
        <h3 class="empty-title">加载中...</h3>
      </div>

      <!-- 分类展示 -->
      <div v-else class="categories-container" :class="{ 'edit-mode': isEditMode }">
        <div v-for="category in categories" :key="category.id" class="category">
          <div class="category-header">
            <div class="category-title-container">
              <h3 class="category-title" v-if="!editingCategory || editingCategory.id !== category.id">{{ category.name }}</h3>
              <div v-else class="category-edit">
                <input 
                  ref="categoryInput"
                  v-model="editingCategory.name" 
                  type="text" 
                  class="category-edit-input" 
                  @keyup.esc="cancelCategoryEdit"
                  @input="validateCategoryName"
                />
                <div v-if="categoryNameError" class="category-error">{{ categoryNameError }}</div>
              </div>
              <div v-if="isEditMode && (!editingCategory || editingCategory.id !== category.id) && category.id !== '0'" class="category-actions">
                <button class="category-edit-btn" @click.stop="editCategory(category)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
              <div v-else-if="isEditMode && editingCategory && editingCategory.id === category.id" class="category-actions">
                <button class="category-save-btn" @click.stop="saveCategoryEdit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
                <button class="category-cancel-btn" @click.stop="cancelCategoryEdit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="websites-container">
            <div v-for="website in category.websites" :key="website.id" class="website-card" @click="openWebsite(website.url)">
              <div class="website-icon" :style="website.customIcon ? { backgroundColor: website.iconColor || '#0042a6' } : {}">
                <img v-if="website.icon && !website.customIcon" :src="website.icon" :alt="website.name" />
                <div v-else class="icon-placeholder" :style="website.customIcon ? { color: 'white' } : {}">{{ website.name.charAt(0) }}</div>
              </div>
              <div class="website-info">
                <h4 class="website-name">{{ website.name }}</h4>
              </div>
              <div v-if="isEditMode" class="website-actions">
                <button class="action-btn edit-btn" @click.stop="editWebsite(website)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && (categories.length === 0 || totalWebsites === 0)" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <h3 class="empty-title">暂无收藏</h3>
        <p class="empty-desc">添加你常用的网站，让访问更快捷</p>
        <button class="add-btn primary" @click="showAddDialog = true">
          <span class="add-icon">+</span>
          添加第一个网站
        </button>
      </div>
    </template>

    <!-- 添加网站对话框 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="showAddDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>{{ editingWebsite ? '编辑网站' : '添加网站' }}</h3>
          <button class="close-btn" @click="showAddDialog = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="saveWebsite">
            <div class="form-group url-preview-row">
              <div class="url-input-container">
                <label for="url">网页地址 *</label>
                <input
                  id="url"
                  v-model="formData.url"
                  type="url"
                  placeholder="https://example.com"
                  required
                  @input="updateIconPreview"
                />
              </div>
              <div class="icon-preview" :style="formData.customIcon ? { backgroundColor: formData.iconColor || '#0042a6' } : {}">
                <img v-if="previewIcon && !formData.customIcon" :src="previewIcon" alt="预览" />
                <div v-else class="preview-placeholder" :style="formData.customIcon ? { color: 'white' } : {}">
                  {{ formData.name ? formData.name.charAt(0) : '?' }}
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="name">网站名称 *</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="网站名称"
                required
                @input="updateIconPreview"
              />
            </div>

            <div class="form-group">
              <label for="category">分类</label>
              <div class="category-selector">
                <CustomSelect
                  id="category"
                  v-model="formData.categoryId"
                  :options="categoryOptions"
                  placeholder="选择现有分类"
                  @change="handleCategoryChange"
                />
                <button type="button" class="add-category-btn" @click="showAddCategory = true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  添加
                </button>
              </div>
            </div>
            <div class="form-group icon-options">
              <label class="custom-checkbox">
                <input type="checkbox" v-model="formData.customIcon" @change="handleCustomIconChange">
                <span class="checkbox-label">自定义图标</span>
              </label>
              <label class="custom-checkbox">
                <input type="checkbox" v-model="formData.useOnlineIcon" @change="handleOnlineIconChange">
                <span class="checkbox-label">使用在线图标</span>
              </label>
            </div>
            <div v-if="formData.useOnlineIcon" class="form-group">
              <label for="onlineIconUrl">在线图标地址</label>
              <input
                id="onlineIconUrl"
                v-model="formData.onlineIconUrl"
                type="url"
                placeholder="https://example.com/icon.png"
                @input="updateIconPreview"
              />
            </div>
            <div v-if="formData.customIcon && !formData.useOnlineIcon" class="form-group">
              <label for="iconColor">图标背景颜色</label>
              <div class="color-picker">
                <input
                  id="iconColor"
                  v-model="formData.iconColor"
                  type="color"
                  @change="updateIconPreview"
                />
                <div class="color-options">
                  <div 
                    v-for="color in colorOptions" 
                    :key="color"
                    class="color-option"
                    :style="{ backgroundColor: color }"
                    @click="formData.iconColor = color"
                  ></div>
                </div>
              </div>
            </div>
            <div class="dialog-footer">
              <button v-if="editingWebsite" type="button" class="cancel-btn delete-btn" @click="deleteWebsite(formData.categoryId, editingWebsite.id); showAddDialog = false">
                删除
              </button>
              <button type="button" class="cancel-btn" @click="showAddDialog = false">
                取消
              </button>
              <button type="submit" class="save-btn">
                {{ editingWebsite ? '保存' : '添加' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 添加分类对话框 -->
    <div v-if="showAddCategory" class="dialog-overlay" @click="showAddCategory = false">
      <div class="dialog-content dialog-sm" @click.stop>
        <div class="dialog-header">
          <h3>添加分类</h3>
          <button class="close-btn" @click="showAddCategory = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="addCategory">
            <div class="form-group">
              <label for="categoryName">分类名称</label>
              <input
                id="categoryName"
                v-model="newCategoryName"
                type="text"
                placeholder="分类名称"
                required
              />
            </div>
            <div class="dialog-footer">
              <button type="button" class="cancel-btn" @click="showAddCategory = false">
                取消
              </button>
              <button type="submit" class="save-btn">添加</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '../../../stores/user'
import { favoritesAPI } from '../../../api/favorites'
import notificationService from '../../../utils/notification'
import CustomSelect from '../../../components/CustomSelect.vue'

// 用户状态管理
const userStore = useUserStore()

// 状态管理
const categories = ref([])
const showAddDialog = ref(false)
const showAddCategory = ref(false)
const editingWebsite = ref(null)
const editingCategory = ref(null)
const categoryNameError = ref('')
const categoryInput = ref(null)
const newCategoryName = ref('')
const previewIcon = ref(null)
const isEditMode = ref(false)
const loading = ref(false)

// 计算属性：是否登录
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 获取收藏数据
async function fetchFavorites() {
  if (!isLoggedIn.value) return

  loading.value = true
  try {
    const response = await favoritesAPI.getFavorites()
    categories.value = response.data
  } catch (error) {
    // 错误处理由axios拦截器处理
    console.error('获取收藏数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  if (isLoggedIn.value) {
    fetchFavorites()
  }
})

// 切换编辑模式
function toggleEditMode() {
  if (isEditMode.value) {
    // 退出编辑模式时，取消正在编辑的标签
    if (editingCategory.value) {
      cancelCategoryEdit()
    }
  }
  isEditMode.value = !isEditMode.value
}

// 颜色选项
const colorOptions = [
  '#0042a6', '#0066cc', '#0088ff', '#33a0ff',
  '#ff4444', '#ff6600', '#ffaa00', '#44cc00',
  '#663399', '#9933cc', '#cc3399', '#ff3366'
]

// 表单数据
const formData = ref({
  url: '',
  name: '',
  description: '',
  icon: '',
  customIcon: false,
  useOnlineIcon: false,
  onlineIconUrl: '',
  iconColor: '#0042a6',
  categoryId: '0'
})

// 监听分类变化，自动设置默认分类为默认值
watch(categories, (newCategories) => {
  if (!formData.value.categoryId) {
    formData.value.categoryId = '0' // 默认选择默认分类
  }
}, { immediate: true })

// 计算属性：总网站数
const totalWebsites = computed(() => {
  return categories.value.reduce((total, category) => total + category.websites.length, 0)
})

// 计算属性：分类选项（添加默认分类）
const categoryOptions = computed(() => {
  return [
    { label: '默认分类', value: '0' },
    ...categories.value.map(cat => ({ label: cat.name, value: cat.id }))
  ]
})

// 处理分类选择变化
function handleCategoryChange(option) {
  formData.value.categoryId = option.value
}

// 获取网站所属的分类 ID
function getCategoryForWebsite(website, categories) {
  // 查找网站所在的分类
  const category = categories.find(cat => 
    cat.websites.some(w => w.id === website.id)
  )
  return category ? category.id : 'uncategorized'
}

// 打开网站
function openWebsite(url) {
  window.open(url, '_blank')
}

// 截断URL
function truncateUrl(url) {
  try {
    const domain = new URL(url).hostname
    return domain
  } catch (error) {
    return url.length > 30 ? url.substring(0, 30) + '...' : url
  }
}

// 处理自定义图标勾选变化
function handleCustomIconChange() {
  if (formData.value.customIcon) {
    formData.value.useOnlineIcon = false
  }
  updateIconPreview()
}

// 处理在线图标勾选变化
function handleOnlineIconChange() {
  if (formData.value.useOnlineIcon) {
    formData.value.customIcon = false
  }
  updateIconPreview()
}

// 更新图标预览
function updateIconPreview() {
  if (!formData.value.customIcon && !formData.value.useOnlineIcon && formData.value.url) {
    const faviconUrl = generateFaviconUrl(formData.value.url)
    previewIcon.value = faviconUrl
    formData.value.icon = faviconUrl
  } else if (formData.value.useOnlineIcon && formData.value.onlineIconUrl) {
    previewIcon.value = formData.value.onlineIconUrl
    formData.value.icon = formData.value.onlineIconUrl
  } else if (formData.value.customIcon) {
    // 选择自定义图标时，保持原有icon不变
    previewIcon.value = null
  } else {
    previewIcon.value = null
    formData.value.icon = null
  }
}

// 编辑网站
function editWebsite(website) {
  editingWebsite.value = website
  // 查找网站所属的分类
  const category = categories.value.find(cat => 
    cat.websites.some(w => w.id === website.id)
  )
  formData.value = {
    url: website.url,
    name: website.name,
    description: website.description,
    icon: website.icon,
    customIcon: website.customIcon || false,
    useOnlineIcon: website.useOnlineIcon || false,
    onlineIconUrl: website.icon ? website.icon : '',
    iconColor: website.iconColor || '#0042a6',
    categoryId: category ? category.id : '0' // 默认选择默认分类
  }
  updateIconPreview()
  showAddDialog.value = true
}

// 删除网站
async function deleteWebsite(categoryId, websiteId) {
  try {
    await favoritesAPI.deleteWebsite(websiteId)
    await fetchFavorites()
    notificationService.success('网站删除成功')
  } catch (error) {
    // 错误处理由axios拦截器处理
  }
}

// 生成网站图标地址
function generateFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname
    return `https://${domain}/favicon.ico`
  } catch (error) {
    return null
  }
}

// 保存网站
async function saveWebsite() {
  try {
    // 处理默认分类
    const websiteData = {
      ...formData.value,
      categoryId: formData.value.categoryId === '0' ? null : formData.value.categoryId
    }
    if (editingWebsite.value) {
      // 编辑现有网站
      await favoritesAPI.updateWebsite(editingWebsite.value.id, websiteData)
      await fetchFavorites()
      notificationService.success('网站更新成功')
    } else {
      // 添加新网站
      await favoritesAPI.createWebsite(websiteData)
      await fetchFavorites()
      notificationService.success('网站添加成功')
    }
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    // 错误处理由 axios 拦截器处理
  }
}

// 添加分类
async function addCategory() {
  if (newCategoryName.value) {
    try {
      const response = await favoritesAPI.createCategory(newCategoryName.value)
      const newCategory = response.data
      categories.value.push(newCategory)
      formData.value.categoryId = newCategory.id
      showAddCategory.value = false
      newCategoryName.value = ''
      notificationService.success('分类添加成功')
    } catch (error) {
      // 错误处理由axios拦截器处理
    }
  }
}

// 重置表单
function resetForm() {
  formData.value = {
    url: '',
    name: '',
    description: '',
    icon: '',
    customIcon: false,
    useOnlineIcon: false,
    onlineIconUrl: '',
    iconColor: '#0042a6',
    categoryId: '0' // 默认选择默认分类
  }
  previewIcon.value = null
  editingWebsite.value = null
}

// 编辑分类
function editCategory(category) {
  if (!category || !category.id) {
    console.error('分类对象或ID不存在:', category)
    return
  }
  editingCategory.value = { ...category }
  categoryNameError.value = ''
  // 等待DOM更新后聚焦输入框
  setTimeout(() => {
    try {
      if (categoryInput.value && typeof categoryInput.value.focus === 'function') {
        categoryInput.value.focus()
        categoryInput.value.select()
      }
    } catch (error) {
      console.error('聚焦输入框失败:', error)
    }
  }, 100)
}

// 取消编辑分类
function cancelCategoryEdit() {
  editingCategory.value = null
  categoryNameError.value = ''
}

// 验证分类名称
function validateCategoryName() {
  if (editingCategory.value) {
    if (!editingCategory.value.name.trim()) {
      categoryNameError.value = '分类名称不能为空'
    } else if (editingCategory.value.name.length > 20) {
      categoryNameError.value = '分类名称不能超过20个字符'
    } else {
      categoryNameError.value = ''
    }
  }
}

// 保存分类编辑
async function saveCategoryEdit() {
  if (editingCategory.value) {
    // 检查是否是默认分类
    if (editingCategory.value.id === '0') {
      notificationService.error('默认分类不能编辑')
      editingCategory.value = null
      return
    }
    
    // 验证分类名称
    validateCategoryName()
    if (categoryNameError.value) {
      return
    }
    
    // 检查用户登录状态
    if (!isLoggedIn.value) {
      notificationService.error('请先登录')
      return
    }
    
    // 检查分类ID
    if (!editingCategory.value.id) {
      console.error('分类ID不存在:', editingCategory.value)
      notificationService.error('分类信息无效')
      return
    }

    try {
      await favoritesAPI.updateCategory(editingCategory.value.id, { name: editingCategory.value.name })
      
      // 更新本地数据
      const index = categories.value.findIndex(cat => cat.id === editingCategory.value.id)
      if (index !== -1) {
        categories.value[index].name = editingCategory.value.name
      }
      
      notificationService.success('分类更新成功')
      editingCategory.value = null
      categoryNameError.value = ''
    } catch (error) {
      // 详细错误处理
      console.error('分类更新失败:', error)
      let errorMessage = '更新失败，请稍后重试'
      if (error.response) {
        // 服务器返回错误
        console.error('错误响应:', error.response)
        console.error('错误状态码:', error.response.status)
        console.error('错误数据:', error.response.data)
        if (error.response.status === 400) {
          errorMessage = '分类名称无效'
        } else if (error.response.status === 401) {
          errorMessage = '未登录或登录已过期'
        } else if (error.response.status === 403) {
          errorMessage = '没有权限更新此分类'
        } else if (error.response.status === 404) {
          errorMessage = '分类不存在'
        } else if (error.response.status === 500) {
          errorMessage = '服务器错误'
        }
      } else if (error.request) {
        // 请求已发出但没有收到响应
        console.error('请求未收到响应:', error.request)
        errorMessage = '网络错误，请检查网络连接'
      } else {
        // 其他错误
        console.error('请求配置错误:', error.message)
        errorMessage = error.message || '未知错误'
      }
      notificationService.error(errorMessage)
    }
  }
}
</script>

<style scoped>
.favorites-view {
  height: 100%;
  padding: 0;
  background: transparent;
}

/* 页面头部 */
.favorites-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 0;
  border-bottom: none;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #0042a6, #0066cc);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 66, 166, 0.2);
}

.edit-mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f8fafc;
  color: #334155;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}

.edit-mode-btn.active {
  background: #e2e8f0;
  color: #0042a6;
  border-color: #0042a6;
}

.add-icon {
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
}

/* 分类展示 */
.categories-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  backdrop-filter: none;
  border: none;
  transition: none;
}

.category:hover {
  transform: none;
  box-shadow: none;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.category-title-container {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin: 0;
  padding: 0;
  border-bottom: none;
}

.category-edit {
  flex: 1;
  max-width: 200px;
}

.category-edit-input {
  width: 100%;
  padding: 6px 10px;
  border: 2px solid #0042a6;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  background: white;
}

.category-edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-edit-btn:hover {
  background: #f1f5f9;
  color: #0042a6;
}

.category-cancel-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-cancel-btn:hover {
  background: #f1f5f9;
  color: #ef4444;
}

.category-save-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #4ade80;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-save-btn:hover {
  background: #f1f5f9;
  color: #22c55e;
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.category-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  padding: 0 4px;
}

.category-edit {
  flex: 1;
  max-width: 200px;
  display: flex;
  flex-direction: column;
}

/* 网站卡片容器 */
.websites-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  visibility: visible;
}



/* 网站卡片 */
.website-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  min-width: 200px;
  max-width: 220px;
  transition: transform 0.2s ease;
  position: relative;
  z-index: 10;
}

.website-card:hover:not(.edit-mode) {
  transform: translateY(-2px);
  z-index: 100;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 编辑模式下的卡片样式 */
.edit-mode .website-card {
  transition: none;
}

.edit-mode .website-card:hover {
  transform: none;
}

/* 网站图标 */
.website-icon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.website-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.icon-placeholder {
  font-size: 20px;
  font-weight: 600;
  color: #0042a6;
  text-transform: uppercase;
}

/* 网站信息 */
.website-info {
  flex: 1;
  min-width: 0;
}

.website-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 网站操作按钮 */
.website-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.edit-btn {
  color: #0042a6;
}

.edit-btn:hover {
  background: rgba(0, 66, 166, 0.1);
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}



.icon-options {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

/* 自定义复选框 */
.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  white-space: nowrap;
}

.custom-checkbox input[type="checkbox"] {
  display: none;
}

.checkbox-label {
  position: relative;
  padding-left: 28px;
  cursor: pointer;
}

.checkbox-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  transition: all 0.3s ease;
}

.custom-checkbox input[type="checkbox"]:checked + .checkbox-label::before {
  background: #0042a6;
  border-color: #0042a6;
}

.custom-checkbox input[type="checkbox"]:checked + .checkbox-label::after {
  content: '';
  position: absolute;
  left: 7px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2.5px 2.5px 0;
  transform: rotate(45deg);
}

/* 颜色选择器 */
.color-picker {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-picker input[type="color"] {
  width: 100%;
  height: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  background: none;
  padding: 0;
}

.color-picker input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
  border-color: #e2e8f0;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 40px;
}

.empty-icon {
  margin-bottom: 24px;
  color: #94a3b8;
  opacity: 0.8;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-desc {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
  max-width: 400px;
}

/* 对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  width: 90%;
  max-width: 550px;
  max-height: 85vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid #e2e8f0;
  animation: dialogSlideIn 0.3s ease;
  display: flex;
  flex-direction: column;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.dialog-sm {
  max-width: 450px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px 12px 0 0;
  flex-shrink: 0;
  overflow: hidden;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.close-btn:hover {
  background-color: #e2e8f0;
  color: #1e293b;
  transform: rotate(90deg);
}

.dialog-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  max-height: calc(85vh - 120px);
}

/* 表单样式 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-color: white;
  cursor: pointer;
}

.form-group select:hover {
  border-color: #0042a6;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #0042a6;
  box-shadow: 0 0 0 4px rgba(0, 66, 166, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.category-selector {
  display: flex;
  gap: 12px;
  flex: 1;
}

.category-selector > :first-child {
  flex: 1;
}

.url-preview-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.url-input-container {
  flex: 1;
}

.add-category-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background-color: #f1f5f9;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-category-btn:hover {
  background-color: #e2e8f0;
  border-color: #cbd5e1;
}

/* 图标预览 */
.icon-preview {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  margin-top: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.icon-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.icon-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.preview-placeholder {
  font-size: 36px;
  font-weight: 700;
  color: #0042a6;
  text-transform: uppercase;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f1f5f9;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}

.save-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #0042a6, #0066cc);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 66, 166, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .favorites-view {
    padding: 16px;
  }
  
  .favorites-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-left {
    width: 100%;
    justify-content: space-between;
  }
  
  .websites-grid {
    grid-template-columns: 1fr;
  }
  
  .category {
    padding: 16px;
  }
  
  .website-card {
    padding: 16px;
  }
  
  .dialog-content {
    width: 95%;
    max-height: 90vh;
  }
}
</style>