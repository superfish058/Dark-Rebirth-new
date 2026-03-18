<template>
  <div class="web-collection-page">
    <div class="web-collection-page__header">
      <h2 class="web-collection-page__title">网页收藏</h2>
      <el-button type="primary" @click="showAddDialog = true">
        添加网页
      </el-button>
    </div>

    <div class="web-collection-page__filters">
      <el-select
        v-model="selectedCategory"
        placeholder="选择分类"
        clearable
        @change="handleCategoryChange"
      >
        <el-option label="全部" value="" />
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>

      <el-input
        v-model="searchKeyword"
        placeholder="搜索网页"
        :prefix-icon="Search"
        clearable
        @input="handleSearch"
      />
    </div>

    <div v-loading="loading" class="web-collection-page__content">
      <div v-if="collections.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <el-icon :size="48">
            <van-icon name="bookmark-o" />
          </el-icon>
        </div>
        <div class="empty-state__text">暂无收藏</div>
        <div class="empty-state__description">点击上方按钮添加您的第一个网页收藏</div>
      </div>

      <div v-else class="web-collection-page__grid">
        <div
          v-for="item in filteredCollections"
          :key="item.id"
          class="web-card"
        >
          <a :href="item.url" target="_blank" class="web-card__link">
            <div class="web-card__icon">
              <img v-if="item.icon_url" :src="item.icon_url" :alt="item.title" />
              <el-icon v-else :size="32">
                <van-icon name="link-o" />
              </el-icon>
            </div>
            <div class="web-card__content">
              <h3 class="web-card__title">{{ item.title || item.url }}</h3>
              <p v-if="item.description" class="web-card__description">
                {{ item.description }}
              </p>
              <div v-if="item.category" class="web-card__category">
                {{ item.category.icon }} {{ item.category.name }}
              </div>
            </div>
          </a>
          <div class="web-card__actions">
            <el-button
              class="web-card__preview"
              type="info"
              :icon="Search"
              circle
              @click="handlePreview(item)"
            />
            <el-button
              class="web-card__delete"
              type="danger"
              :icon="Delete"
              circle
              @click="handleDelete(item.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showAddDialog"
      title="添加网页收藏"
      width="500px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="网址" prop="url">
          <el-input
            v-model="form.url"
            placeholder="请输入网址"
            @blur="handleUrlBlur"
          />
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="自动获取或手动输入"
          />
        </el-form-item>

        <el-form-item label="简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入简介"
          />
        </el-form-item>

        <el-form-item label="分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="选择分类">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          保存
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showPreviewDialog"
      :title="previewData?.title || '网页预览'"
      width="800px"
    >
      <div v-loading="previewLoading" class="web-preview">
        <div v-if="previewData?.image" class="web-preview__image">
          <img :src="previewData.image" :alt="previewData.title" />
        </div>
        <div v-if="previewData?.description" class="web-preview__description">
          {{ previewData.description }}
        </div>
        <div class="web-preview__url">
          <a :href="previewData?.url" target="_blank" class="web-preview__link">
            {{ previewData?.url }}
          </a>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Delete } from '@element-plus/icons-vue'
import { useWebCollectionStore } from '@/stores/webCollection'
import categoryService from '@/services/category'
import webPreviewService from '@/services/webPreview'
import { useAuthCheck } from '@/composables/useAuthCheck'

const webCollectionStore = useWebCollectionStore()
const { requireAuth } = useAuthCheck()

const showAddDialog = ref(false)
const showPreviewDialog = ref(false)
const submitting = ref(false)
const previewLoading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')
const categories = ref<any[]>([])
const formRef = ref()
const previewData = ref<any>(null)

const form = ref({
  url: '',
  title: '',
  description: '',
  category_id: ''
})

const rules = {
  url: [
    { required: true, message: '请输入网址', trigger: 'blur' },
    { type: 'url', message: '请输入正确的网址格式', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ]
}

const collections = computed(() => webCollectionStore.collections)
const loading = computed(() => webCollectionStore.loading)

const filteredCollections = computed(() => {
  let result = collections.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item =>
      (item.title || item.url).toLowerCase().includes(keyword) ||
      (item.description || '').toLowerCase().includes(keyword)
    )
  }

  if (selectedCategory.value) {
    result = result.filter(item => item.category_id === selectedCategory.value)
  }

  return result
})

async function loadCategories() {
  const result = await categoryService.fetchAll()
  if (result.data) {
    categories.value = result.data
  }
}

async function handleUrlBlur() {
  if (!form.value.url) return

  try {
    const iconUrl = await webCollectionStore.fetchIconUrl(form.value.url)
    if (iconUrl) {
      form.value.title = form.value.title || iconUrl
    }

    const pageTitle = await webCollectionStore.fetchPageTitle(form.value.url)
    if (pageTitle) {
      form.value.title = pageTitle
    }
  } catch (error) {
    console.error('获取网页信息失败:', error)
  }
}

async function handleCategoryChange() {
  await webCollectionStore.fetchAll({
    categoryId: selectedCategory.value || undefined
  })
}

function handleSearch() {
}

async function handlePreview(item: any) {
  try {
    previewLoading.value = true
    showPreviewDialog.value = true
    previewData.value = { ...item }

    const result = await webPreviewService.getWebPreview(item.url)
    if (result.success && result.data) {
      previewData.value = {
        ...previewData.value,
        ...result.data
      }
    }
  } catch (error) {
    console.error('获取预览失败:', error)
    ElMessage.error({
      message: '获取预览失败',
      plain: true
    })
  } finally {
    previewLoading.value = false
  }
}

async function handleSubmit() {
  const isAuthenticated = await requireAuth()
  if (!isAuthenticated) {
    showAddDialog.value = false
    return
  }

  try {
    await formRef.value.validate()
    submitting.value = true

    const result = await webCollectionStore.create({
      url: form.value.url,
      title: form.value.title,
      description: form.value.description,
      category_id: form.value.category_id || undefined
    })

    if (result.error) {
      ElMessage.error({
        message: result.error,
        plain: true
      })
      return
    }

    ElMessage.success({
      message: '添加成功',
      plain: true
    })
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('添加失败:', error)
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: string) {
  const isAuthenticated = await requireAuth()
  if (!isAuthenticated) {
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除这个网页收藏吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const result = await webCollectionStore.remove(id)
    if (result.error) {
      ElMessage.error({
        message: result.error,
        plain: true
      })
      return
    }

    ElMessage.success({
      message: '删除成功',
      plain: true
    })
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

function resetForm() {
  form.value = {
    url: '',
    title: '',
    description: '',
    category_id: ''
  }
  formRef.value?.resetFields()
}

onMounted(async () => {
  await loadCategories()
  await webCollectionStore.fetchAll()
})
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.web-collection-page {
  &__header {
    @include flex-between;
    margin-bottom: $spacing-6;
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
  }

  &__filters {
    display: flex;
    gap: $spacing-4;
    margin-bottom: $spacing-6;
  }

  &__content {
    min-height: 400px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-4;
  }
}

.web-card {
  @include card-style;
  position: relative;
  transition: all $duration-base $ease-out;
  @include hover-lift;

  &__link {
    display: flex;
    gap: $spacing-4;
    text-decoration: none;
    color: inherit;
  }

  &__icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    @include flex-center;
    border-radius: $radius-md;
    background: $bg-secondary;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__default-icon {
    font-size: $font-size-2xl;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    margin-bottom: $spacing-1;
    @include text-ellipsis;
  }

  &__description {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-2;
    @include line-clamp(2);
  }

  &__category {
    font-size: $font-size-xs;
    color: $text-tertiary;
    padding: $spacing-1 $spacing-2;
    background: $bg-secondary;
    border-radius: $radius-sm;
    display: inline-block;
  }

  &__actions {
    position: absolute;
    top: $spacing-2;
    right: $spacing-2;
    display: flex;
    gap: $spacing-2;
    opacity: 0;
    transition: opacity $duration-fast $ease-out;
  }

  &__preview,
  &__delete {
    opacity: 0;
    transition: opacity $duration-fast $ease-out;
  }

  &:hover &__actions {
    opacity: 1;
  }

  &:hover &__preview,
  &:hover &__delete {
    opacity: 1;
  }
}

.web-preview {
  &__image {
    width: 100%;
    border-radius: $radius-md;
    overflow: hidden;
    margin-bottom: $spacing-4;

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &__description {
    font-size: $font-size-base;
    color: $text-secondary;
    margin-bottom: $spacing-4;
    line-height: 1.6;
  }

  &__url {
    padding: $spacing-3;
    background: $bg-secondary;
    border-radius: $radius-md;
    border: 1px solid $border-primary;
  }

  &__link {
    color: $primary-color;
    text-decoration: none;
    font-size: $font-size-sm;
    word-break: break-all;

    &:hover {
      text-decoration: underline;
    }
  }
}

@include tablet {
  .web-collection-page {
    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: $spacing-4;
    }
  }

  .web-card {
    &__icon {
      width: 40px;
      height: 40px;
    }
  }
}

@include mobile {
  .web-collection-page {
    &__header {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-3;
    }

    &__filters {
      flex-direction: column;
      gap: $spacing-3;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: $spacing-3;
    }
  }

  .web-card {
    &__link {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-2;
    }

    &__icon {
      width: 48px;
      height: 48px;
    }

    &__actions {
      opacity: 1;
      position: static;
      margin-top: $spacing-3;
      justify-content: flex-end;
    }
  }
}

@media (max-width: 480px) {
  .web-collection-page {
    &__title {
      font-size: $font-size-xl;
    }
  }

  .el-dialog {
    width: 95% !important;
    margin: 0 auto;
  }
}

</style>