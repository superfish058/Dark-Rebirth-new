<template>
  <div class="app-list-page">
    <van-nav-bar title="应用列表" fixed placeholder />

    <div class="app-list-page__content">
      <div v-if="filteredCategories.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <van-icon name="apps-o" size="48" />
        </div>
        <div class="empty-state__text">暂无应用分类</div>
        <div class="empty-state__description">敬请期待更多精彩应用</div>
      </div>

      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="category-section"
      >
        <h3 class="category-section__title">
          <van-icon :name="getVantIcon(category.name)" />
          {{ category.name }}
        </h3>
        <div class="category-section__apps">
          <div
            v-for="app in getAppsByCategory(category.id)"
            :key="app.id"
            class="app-card"
            @click="handleAppClick(app)"
          >
            <div class="app-card__icon">
              <van-icon :name="getAppIcon(app.icon)" :size="32" />
            </div>
            <div class="app-card__name">{{ app.name }}</div>
          </div>
          <div v-if="getAppsByCategory(category.id).length === 0" class="empty-state">
            <div class="empty-state__icon">
              <van-icon name="bag-o" size="32" />
            </div>
            <div class="empty-state__text">暂无应用</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import categoryService from '@/services/category'
import appService from '@/services/app'

const router = useRouter()

const categories = ref<any[]>([])
const apps = ref<any[]>([])

const filteredCategories = computed(() => {
  return categories.value.filter(category => 
    !['编程AI', '生活技能'].includes(category.name)
  )
})

function getAppsByCategory(categoryId: string) {
  return apps.value.filter(app => app.category_id === categoryId)
}

function getVantIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    '学习教育': 'book-o',
    '娱乐休闲': 'play-circle-o',
    '工作效率': 'fire-o',
    '其他': 'apps-o'
  }
  return iconMap[categoryName] || 'apps-o'
}

function getAppIcon(icon: string | null): string {
  if (!icon) return 'apps-o'
  
  const iconMap: Record<string, string> = {
    'chat': 'chat-o',
    'video': 'video-o',
    'music': 'music-o',
    'photo': 'photo-o',
    'file': 'folder-o',
    'browser': 'browser-o',
    'game': 'game-o',
    'shop': 'shopping-cart-o',
    'news': 'newspaper-o',
    'social': 'friends-o',
    'tool': 'tools-o',
    'study': 'book-o',
    'work': 'fire-o',
    'life': 'flower-o',
    'health': 'health-o',
    'finance': 'gold-coin-o',
    'travel': 'guide-o',
    'food': 'food-o',
    'sports': 'sport-o',
    'art': 'art-o'
  }
  
  return iconMap[icon] || 'apps-o'
}

function handleAppClick(app: any) {
  if (app.url) {
    window.open(app.url, '_blank')
  }
}

async function loadCategories() {
  const result = await categoryService.fetchAll()
  if (result.data) {
    categories.value = result.data
  }
}

async function loadApps() {
  const result = await appService.fetchAll()
  if (result.data) {
    apps.value = result.data
  }
}

onMounted(async () => {
  await loadCategories()
  await loadApps()
})
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.app-list-page {
  min-height: 100vh;
  background: $bg-primary;

  &__content {
    padding: $spacing-4;
    padding-bottom: $spacing-12;
  }
}

.category-section {
  margin-bottom: $spacing-6;

  &__title {
    @include flex-center;
    gap: $spacing-2;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    margin-bottom: $spacing-4;
    color: $text-primary;
  }

  &__apps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-4;
  }
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
    font-size: $font-size-2xl;
  }

  &__name {
    font-size: $font-size-xs;
    color: $text-secondary;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .category-section {
    &__title {
      font-size: $font-size-base;
    }

    &__apps {
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-3;
    }
  }

  .empty-state {
    padding: $spacing-8;

    &__icon {
      font-size: $font-size-3xl;
    }
  }
}

@media (min-width: 768px) {
  .app-list-page {
    max-width: 768px;
    margin: 0 auto;
  }

  .category-section {
    &__apps {
      grid-template-columns: repeat(6, 1fr);
    }
  }
}

</style>