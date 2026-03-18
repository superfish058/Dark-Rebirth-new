<template>
  <div class="todo-page">
    <div class="todo-page__header">
      <h2 class="todo-page__title">待办事项</h2>
      <el-button type="primary" @click="showAddDialog = true">
        添加待办
      </el-button>
    </div>

    <div class="todo-page__filters">
      <el-radio-group v-model="filterStatus" @change="handleFilterChange">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="pending">待处理</el-radio-button>
        <el-radio-button label="in_progress">进行中</el-radio-button>
        <el-radio-button label="completed">已完成</el-radio-button>
      </el-radio-group>

      <el-select v-model="sortBy" @change="handleSortChange">
        <el-option label="创建时间" value="created_at" />
        <el-option label="截止日期" value="due_date" />
      </el-select>
    </div>

    <div v-loading="loading" class="todo-page__content">
      <div v-if="filteredTodos.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <van-icon name="passed" size="48" />
        </div>
        <div class="empty-state__text">暂无待办事项</div>
        <div class="empty-state__description">点击上方按钮添加您的第一个待办</div>
      </div>

      <div v-else class="todo-list">
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo-item"
          :class="`todo-item--${todo.status}`"
        >
          <el-checkbox
            :model-value="todo.status === 'completed'"
            @change="toggleTodo(todo.id)"
            class="todo-item__checkbox"
          />
          <div class="todo-item__content">
            <h3 class="todo-item__title">{{ todo.title }}</h3>
            <p v-if="todo.description" class="todo-item__description">
              {{ todo.description }}
            </p>
            <div class="todo-item__meta">
              <span v-if="todo.due_date" class="todo-item__due-date">
                <van-icon name="clock-o" /> {{ formatDate(todo.due_date) }}
              </span>
              <span class="todo-item__status">{{ getStatusText(todo.status) }}</span>
            </div>
          </div>
          <div class="todo-item__actions">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              circle
              @click="handleEdit(todo)"
            />
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              circle
              @click="handleDelete(todo.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showAddDialog"
      :title="editingTodo ? '编辑待办' : '添加待办'"
      width="500px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入待办标题"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="选择状态">
            <el-option label="待处理" value="pending" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>

        <el-form-item label="截止日期" prop="due_date">
          <el-date-picker
            v-model="form.due_date"
            type="datetime"
            placeholder="选择截止日期"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ssZ"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/types'

const todoStore = useTodoStore()

const showAddDialog = ref(false)
const submitting = ref(false)
const editingTodo = ref<Todo | null>(null)
const filterStatus = ref('')
const sortBy = ref<'created_at' | 'due_date'>('created_at')
const formRef = ref()

const form = ref({
  title: '',
  description: '',
  status: 'pending' as 'pending' | 'in_progress' | 'completed',
  due_date: ''
})

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ]
}

const todos = computed(() => todoStore.todos)
const loading = computed(() => todoStore.loading)

const filteredTodos = computed(() => {
  let result = todos.value

  if (filterStatus.value) {
    result = result.filter(todo => todo.status === filterStatus.value)
  }

  return result
})

async function handleSubmit() {
  try {
    await formRef.value.validate()
    submitting.value = true

    if (editingTodo.value) {
      const result = await todoStore.update(editingTodo.value.id, {
        title: form.value.title,
        description: form.value.description,
        status: form.value.status,
        due_date: form.value.due_date || undefined
      })

      if (result.error) {
        ElMessage.error(result.error)
        return
      }

      ElMessage.success('更新成功')
    } else {
      const result = await todoStore.create({
        title: form.value.title,
        description: form.value.description,
        status: form.value.status,
        due_date: form.value.due_date || undefined
      })

      if (result.error) {
        ElMessage.error(result.error)
        return
      }

      ElMessage.success('添加成功')
    }

    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    submitting.value = false
  }
}

async function toggleTodo(id: string) {
  await todoStore.toggleComplete(id)
}

function handleEdit(todo: Todo) {
  editingTodo.value = todo
  form.value = {
    title: todo.title,
    description: todo.description || '',
    status: todo.status,
    due_date: todo.due_date || ''
  }
  showAddDialog.value = true
}

async function handleDelete(id: string) {
  try {
    await ElMessageBox.confirm('确定要删除这个待办吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const result = await todoStore.remove(id)
    if (result.error) {
      ElMessage.error(result.error)
      return
    }

    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

async function handleFilterChange() {
  await todoStore.fetchAll({
    status: filterStatus.value || undefined,
    sortBy: sortBy.value,
    sortOrder: 'desc'
  })
}

async function handleSortChange() {
  await todoStore.fetchAll({
    status: filterStatus.value || undefined,
    sortBy: sortBy.value,
    sortOrder: 'desc'
  })
}

function resetForm() {
  editingTodo.value = null
  form.value = {
    title: '',
    description: '',
    status: 'pending',
    due_date: ''
  }
  formRef.value?.resetFields()
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成'
  }
  return statusMap[status] || status
}

onMounted(async () => {
  await todoStore.fetchAll({
    sortBy: sortBy.value,
    sortOrder: 'desc'
  })
})
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.todo-page {
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
    flex-wrap: wrap;
  }

  &__content {
    min-height: 400px;
  }
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
}

.todo-item {
  @include card-style;
  @include flex-between;
  gap: $spacing-4;
  transition: all $duration-base $ease-out;

  &:hover {
    transform: translateX(4px);
  }

  &--completed {
    opacity: 0.6;

    .todo-item__title {
      text-decoration: line-through;
      color: $text-tertiary;
    }
  }

  &__checkbox {
    flex-shrink: 0;
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

  &__meta {
    display: flex;
    gap: $spacing-4;
    font-size: $font-size-xs;
  }

  &__due-date {
    color: $text-tertiary;
  }

  &__status {
    padding: $spacing-1 $spacing-2;
    border-radius: $radius-sm;
    background: $bg-secondary;
    color: $text-secondary;
  }

  &__actions {
    display: flex;
    gap: $spacing-2;
    opacity: 0;
    transition: opacity $duration-fast $ease-out;
  }

  &:hover &__actions {
    opacity: 1;
  }
}

@include tablet {
  .todo-page {
    &__header {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-3;
    }

    &__filters {
      width: 100%;
      justify-content: flex-start;
    }
  }
}

@include mobile {
  .todo-page {
    &__title {
      font-size: $font-size-xl;
    }

    &__filters {
      flex-direction: column;
      align-items: stretch;
    }

    .el-button {
      width: 100%;
    }
  }

  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-3;

    &__checkbox {
      align-self: flex-start;
    }

    &__content {
      width: 100%;
    }

    &__actions {
      opacity: 1;
      width: 100%;
      justify-content: flex-end;
    }
  }
}

@media (max-width: 480px) {
  .todo-page {
    &__title {
      font-size: $font-size-lg;
    }
  }

  .el-dialog {
    width: 95% !important;
    margin: 0 auto;
  }

  .el-radio-group {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .el-radio-button {
    width: 100%;
  }
}

</style>