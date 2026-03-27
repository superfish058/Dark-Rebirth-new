<template>
  <div class="favorites-view">
    <!-- 页面头部 -->
    <div class="favorites-header">
      <h2 class="favorites-title">网页收藏</h2>
      <button class="add-btn" @click="showAddDialog = true">
        <span class="add-icon">+</span>
        添加
      </button>
    </div>

    <!-- 分类展示 -->
    <div class="categories-container">
      <div v-for="category in categories" :key="category.id" class="category">
        <h3 class="category-title">{{ category.name }}</h3>
        <div class="websites-grid">
          <div v-for="website in category.websites" :key="website.id" class="website-card">
            <div class="website-icon">
              <img v-if="website.icon" :src="website.icon" :alt="website.name" />
              <div v-else class="icon-placeholder">{{ website.name.charAt(0) }}</div>
            </div>
            <div class="website-info">
              <h4 class="website-name">{{ website.name }}</h4>
              <p class="website-desc">{{ website.description }}</p>
            </div>
            <div class="website-actions">
              <button class="action-btn edit-btn" @click="editWebsite(website)">
                ✏️
              </button>
              <button class="action-btn delete-btn" @click="deleteWebsite(category.id, website.id)">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加网站对话框 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="showAddDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>{{ editingWebsite ? '编辑网站' : '添加网站' }}</h3>
          <button class="close-btn" @click="showAddDialog = false">×</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="saveWebsite">
            <div class="form-group">
              <label for="url">网页地址 *</label>
              <input
                id="url"
                v-model="formData.url"
                type="url"
                placeholder="https://example.com"
                required
              />
            </div>
            <div class="form-group">
              <label for="name">网站名称 *</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="网站名称"
                required
              />
            </div>
            <div class="form-group">
              <label for="description">网页简介</label>
              <textarea
                id="description"
                v-model="formData.description"
                placeholder="网站简介"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="icon">图标地址</label>
              <select id="icon" v-model="formData.icon">
                <option value="">选择常用图标</option>
                <option value="https://www.google.com/favicon.ico">Google</option>
                <option value="https://www.baidu.com/favicon.ico">百度</option>
                <option value="https://www.github.com/favicon.ico">GitHub</option>
                <option value="https://www.youtube.com/favicon.ico">YouTube</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div v-if="formData.icon === 'other'" class="form-group">
              <label for="customIcon">自定义图标文字</label>
              <input
                id="customIcon"
                v-model="formData.customIcon"
                type="text"
                placeholder="图标文字"
                maxlength="2"
              />
            </div>
            <div class="form-group">
              <label for="category">分类</label>
              <div class="category-selector">
                <select id="category" v-model="formData.categoryId">
                  <option value="">选择现有分类</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
                <button type="button" class="add-category-btn" @click="showAddCategory = true">
                  添加分类
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>图标预览</label>
              <div class="icon-preview">
                <img v-if="formData.icon && formData.icon !== 'other'" :src="formData.icon" alt="预览" />
                <div v-else-if="formData.icon === 'other'" class="preview-placeholder">
                  {{ formData.customIcon || '?' }}
                </div>
                <div v-else class="preview-placeholder">?</div>
              </div>
            </div>
            <div class="dialog-footer">
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
          <button class="close-btn" @click="showAddCategory = false">×</button>
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
import { ref, computed } from 'vue'

// 模拟数据
const categories = ref([
  {
    id: 1,
    name: '常用网站',
    websites: [
      {
        id: 1,
        name: 'Google',
        url: 'https://www.google.com',
        description: '全球最大的搜索引擎',
        icon: 'https://www.google.com/favicon.ico'
      },
      {
        id: 2,
        name: '百度',
        url: 'https://www.baidu.com',
        description: '中国最大的搜索引擎',
        icon: 'https://www.baidu.com/favicon.ico'
      }
    ]
  },
  {
    id: 2,
    name: '开发工具',
    websites: [
      {
        id: 3,
        name: 'GitHub',
        url: 'https://www.github.com',
        description: '代码托管平台',
        icon: 'https://www.github.com/favicon.ico'
      }
    ]
  }
])

// 状态管理
const showAddDialog = ref(false)
const showAddCategory = ref(false)
const editingWebsite = ref(null)
const newCategoryName = ref('')

// 表单数据
const formData = ref({
  url: '',
  name: '',
  description: '',
  icon: '',
  customIcon: '',
  categoryId: ''
})

// 编辑网站
function editWebsite(website) {
  editingWebsite.value = website
  formData.value = {
    url: website.url,
    name: website.name,
    description: website.description,
    icon: website.icon,
    customIcon: '',
    categoryId: categories.value.find(cat => 
      cat.websites.some(w => w.id === website.id)
    ).id
  }
  showAddDialog.value = true
}

// 删除网站
function deleteWebsite(categoryId, websiteId) {
  const category = categories.value.find(cat => cat.id === categoryId)
  if (category) {
    category.websites = category.websites.filter(w => w.id !== websiteId)
  }
}

// 保存网站
function saveWebsite() {
  if (editingWebsite.value) {
    // 编辑现有网站
    const category = categories.value.find(cat => cat.id === formData.value.categoryId)
    if (category) {
      const website = category.websites.find(w => w.id === editingWebsite.value.id)
      if (website) {
        website.url = formData.value.url
        website.name = formData.value.name
        website.description = formData.value.description
        website.icon = formData.value.icon === 'other' ? null : formData.value.icon
      }
    }
  } else {
    // 添加新网站
    const category = categories.value.find(cat => cat.id === formData.value.categoryId)
    if (category) {
      const newWebsite = {
        id: Date.now(),
        name: formData.value.name,
        url: formData.value.url,
        description: formData.value.description,
        icon: formData.value.icon === 'other' ? null : formData.value.icon
      }
      category.websites.push(newWebsite)
    }
  }
  showAddDialog.value = false
  resetForm()
}

// 添加分类
function addCategory() {
  if (newCategoryName.value) {
    const newCategory = {
      id: Date.now(),
      name: newCategoryName.value,
      websites: []
    }
    categories.value.push(newCategory)
    formData.value.categoryId = newCategory.id
    showAddCategory.value = false
    newCategoryName.value = ''
  }
}

// 重置表单
function resetForm() {
  formData.value = {
    url: '',
    name: '',
    description: '',
    icon: '',
    customIcon: '',
    categoryId: ''
  }
  editingWebsite.value = null
}
</script>

<style scoped>
.favorites-view {
  height: 100%;
}

/* 页面头部 */
.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.favorites-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.add-btn:hover {
  background-color: #0284c7;
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 分类展示 */
.categories-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

/* 网站卡片网格 */
.websites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.website-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 6px;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.website-card:hover {
  background-color: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 网站图标 */
.website-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0f2fe;
}

.website-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-placeholder {
  font-size: 24px;
  font-weight: 600;
  color: #0ea5e9;
}

/* 网站信息 */
.website-info {
  flex: 1;
  min-width: 0;
}

.website-name {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.website-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 网站操作按钮 */
.website-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.website-card:hover .website-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background-color: #fef3c7;
  color: #92400e;
}

.edit-btn:hover {
  background-color: #fde68a;
}

.delete-btn {
  background-color: #fee2e2;
  color: #b91c1c;
}

.delete-btn:hover {
  background-color: #fecaca;
}

/* 对话框 */
.dialog-overlay {
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
}

.dialog-content {
  background-color: white;
  border-radius: 8px;
  padding: 0;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.dialog-sm {
  max-width: 400px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f1f5f9;
}

.dialog-body {
  padding: 20px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.category-selector {
  display: flex;
  gap: 8px;
}

.category-selector select {
  flex: 1;
}

.add-category-btn {
  padding: 8px 12px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.add-category-btn:hover {
  background-color: #e2e8f0;
}

/* 图标预览 */
.icon-preview {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0f2fe;
  margin-top: 8px;
}

.icon-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  font-size: 32px;
  font-weight: 600;
  color: #0ea5e9;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background-color: #e2e8f0;
}

.save-btn {
  padding: 8px 16px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #0284c7;
}
</style>