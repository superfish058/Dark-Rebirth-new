<template>
  <div class="mobile-home-page">
    <Carousel />

    <div class="mobile-home-page__section">
      <div class="section-header">
        <h3 class="section-header__title">待办通知</h3>
        <router-link to="/m/todo" class="section-header__link">查看全部</router-link>
      </div>

      <div v-if="pendingTodos.length > 0" class="todo-list">
        <div
          v-for="todo in pendingTodos.slice(0, 3)"
          :key="todo.id"
          class="todo-item"
        >
          <div class="todo-item__content">
            <h4 class="todo-item__title">{{ todo.title }}</h4>
            <p v-if="todo.description" class="todo-item__description">
              {{ todo.description }}
            </p>
          </div>
          <van-checkbox
            :model-value="todo.status === 'completed'"
            @click="toggleTodo(todo.id)"
          />
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-state__icon">
          <van-icon name="passed" size="48" />
        </div>
        <div class="empty-state__text">暂无待办事项</div>
      </div>
    </div>

    <div class="mobile-home-page__section">
      <div class="section-header">
        <h3 class="section-header__title">常用应用</h3>
        <router-link to="/m/app-list" class="section-header__link">查看全部</router-link>
      </div>

      <div class="app-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="app-card"
          @click="handleCategoryClick(category)"
        >
          <div class="app-card__icon">
            <van-icon :name="getVantIcon(category.name)" :size="32" />
          </div>
          <div class="app-card__name">{{ category.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/todo'
import categoryService from '@/services/category'

const router = useRouter()
const todoStore = useTodoStore()

const categories = ref<any[]>([])

const pendingTodos = computed(() => todoStore.pendingTodos)

function getVantIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    '学习教育': 'book-o',
    '娱乐休闲': 'play-circle-o',
    '工作效率': 'fire-o',
    '其他': 'apps-o'
  }
  return iconMap[categoryName] || 'apps-o'
}

async function loadCategories() {
  const result = await categoryService.fetchAll()
  if (result.data) {
    categories.value = result.data
  }
}

async function toggleTodo(id: string) {
  await todoStore.toggleComplete(id)
}

function handleCategoryClick(category: any) {
  router.push(`/m/app-list?category=${category.id}`)
}

onMounted(async () => {
  await loadCategories()
  await todoStore.fetchAll({ status: 'pending', pageSize: 10 })
})
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.mobile-home-page {
  padding: $spacing-4;
  padding-bottom: $spacing-12;

  &__section {
    margin-bottom: $spacing-6;
  }
}

.section-header {
  @include flex-between;
  margin-bottom: $spacing-4;

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
  }

  &__link {
    font-size: $font-size-sm;
    color: $primary-color;
    text-decoration: none;
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
  gap: $spacing-3;

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
    @include line-clamp(2);
  }
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-4;
}

.app-card {
  @include flex-column;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-3;
  background: $bg-card;
  border-radius: $radius-md;
  border: 1px solid $border-primary;
  cursor: pointer;
  transition: all $duration-fast $ease-out;

  &:active {
    transform: scale(0.95);
    background: $bg-hover;
  }

  &__icon {
    color: $text-secondary;
  }

  &__name {
    font-size: $font-size-xs;
    color: $text-secondary;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .app-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-3;
  }

  .app-card {
    padding: $spacing-2;

    &__icon {
      font-size: $font-size-xl;
    }

    &__name {
      font-size: 10px;
    }
  }

  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-2;

    &__checkbox {
      align-self: flex-start;
    }
  }
}

@media (min-width: 768px) {
  .mobile-home-page {
    max-width: 768px;
    margin: 0 auto;
  }

  .app-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-card {
    &:active {
      transform: none;
    }
  }
}

</style>