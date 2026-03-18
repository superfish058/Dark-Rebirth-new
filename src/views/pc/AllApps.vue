<template>
  <div class="all-apps-page">
    <h2 class="all-apps-page__title">全部应用</h2>
    <div class="all-apps-page__grid">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="app-category"
      >
        <div class="app-category__header">
          <span class="app-category__icon">
            <van-icon :name="getVantIcon(category.name)" :size="32" />
          </span>
          <h3 class="app-category__name">{{ category.name }}</h3>
        </div>
        <div class="app-category__apps">
          <div class="empty-state">
            <div class="empty-state__icon">
              <van-icon name="bag-o" size="32" />
            </div>
            <div class="empty-state__text">暂无应用</div>
          </div>
        </div>
      </div>

      <div class="app-category app-category--todo">
        <div class="app-category__header">
          <span class="app-category__icon">
            <van-icon name="todo-list-o" :size="32" />
          </span>
          <h3 class="app-category__name">待办事项</h3>
          <span class="app-category__badge">占位</span>
        </div>
        <div class="app-category__content">
          <div class="todo-placeholder">
            <div class="todo-placeholder__icon">
              <van-icon name="passed" size="48" />
            </div>
            <div class="todo-placeholder__title">待办事项功能</div>
            <div class="todo-placeholder__description">
              高效管理您的任务和计划
            </div>
            <div class="todo-placeholder__features">
              <div class="todo-placeholder__feature">
                <van-icon name="clock-o" />
                <span>任务追踪</span>
              </div>
              <div class="todo-placeholder__feature">
                <van-icon name="calendar-o" />
                <span>截止日期</span>
              </div>
              <div class="todo-placeholder__feature">
                <van-icon name="checked" />
                <span>状态管理</span>
              </div>
            </div>
            <div class="todo-placeholder__status">
              <van-icon name="info-o" />
              <span>功能开发中，敬请期待</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import categoryService from '@/services/category'

const categories = ref<any[]>([])

const filteredCategories = computed(() => {
  return categories.value.filter(category => 
    !['编程AI', '生活技能'].includes(category.name)
  )
})

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

onMounted(() => {
  loadCategories()
})
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.all-apps-page {
  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $spacing-6;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: $spacing-6;
  }
}

.app-category {
  @include card-style;

  &--todo {
    border: 2px solid $primary-color;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
  }

  &__header {
    @include flex-center;
    gap: $spacing-3;
    margin-bottom: $spacing-4;
    padding-bottom: $spacing-4;
    border-bottom: 1px solid $border-primary;
    position: relative;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__name {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $text-primary;
  }

  &__badge {
    position: absolute;
    right: 0;
    top: 0;
    padding: $spacing-1 $spacing-2;
    background: $primary-color;
    color: $text-primary;
    font-size: $font-size-xs;
    border-radius: $radius-sm;
    font-weight: $font-weight-medium;
  }

  &__apps {
    min-height: 200px;
  }

  &__content {
    min-height: 200px;
  }
}

.todo-placeholder {
  @include flex-column;
  align-items: center;
  justify-content: center;
  gap: $spacing-4;
  padding: $spacing-6;
  text-align: center;

  &__icon {
    color: $primary-color;
    opacity: 0.8;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }

  &__description {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  &__features {
    display: flex;
    gap: $spacing-4;
    margin: $spacing-2 0;
  }

  &__feature {
    @include flex-column;
    align-items: center;
    gap: $spacing-1;
    padding: $spacing-2;
    background: $bg-secondary;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    color: $text-secondary;

    .van-icon {
      color: $primary-color;
    }
  }

  &__status {
    @include flex-center;
    gap: $spacing-2;
    padding: $spacing-2 $spacing-3;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid $primary-color;
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    color: $primary-color;
    font-weight: $font-weight-medium;

    .van-icon {
      color: $primary-color;
    }
  }
}

@include tablet {
  .all-apps-page {
    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: $spacing-4;
    }
  }

  .app-category {
    &__header {
      flex-direction: column;
      gap: $spacing-2;
    }

    &__features {
      flex-direction: column;
      gap: $spacing-2;
    }
  }
}

@include mobile {
  .all-apps-page {
    &__title {
      font-size: $font-size-xl;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: $spacing-4;
    }
  }

  .app-category {
    &__header {
      padding: $spacing-3;
    }

    &__content {
      padding: $spacing-4;
    }
  }

  .todo-placeholder {
    &__features {
      flex-direction: column;
      gap: $spacing-2;
    }

    &__status {
      width: 100%;
      text-align: center;
    }
  }
}

@media (max-width: 480px) {
  .all-apps-page {
    &__title {
      font-size: $font-size-lg;
    }
  }

  .app-category {
    &__badge {
      position: static;
      margin-top: $spacing-1;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-category {
    &--todo {
      transition: none;
    }
  }
}

</style>