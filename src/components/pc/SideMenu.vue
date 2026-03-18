<template>
  <aside class="side-menu">
    <nav class="side-menu__nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="side-menu__item"
        active-class="side-menu__item--active"
      >
        <span class="side-menu__icon">
          <van-icon :name="item.vantIcon" :size="24" />
        </span>
        <span class="side-menu__label">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MenuItem {
  path: string
  vantIcon: string
  label: string
}

const menuItems = ref<MenuItem[]>([
  {
    path: '/pc/web-collection',
    vantIcon: 'bookmark-o',
    label: '网页收藏'
  },
  {
    path: '/pc/all-apps',
    vantIcon: 'apps-o',
    label: '全部应用'
  }
])
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.side-menu {
  width: 200px;
  background: $bg-secondary;
  border-right: 1px solid $border-primary;
  padding: $spacing-4;

  &__nav {
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
  }

  &__item {
    @include flex-center;
    flex-direction: column;
    gap: $spacing-2;
    padding: $spacing-4 $spacing-3;
    border-radius: $radius-base;
    color: $text-secondary;
    text-decoration: none;
    transition: all $duration-fast $ease-out;
    cursor: pointer;
    text-align: center;

    &:hover {
      background: $bg-hover;
      color: $text-primary;
      transform: translateX(4px);
    }

    &--active {
      background: $primary-gradient;
      color: $text-primary;
      font-weight: $font-weight-medium;
      box-shadow: $glow-primary;

      &:hover {
        transform: translateX(4px) scale(1.02);
        box-shadow: $glow-primary, $shadow-lg;
      }
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__label {
    font-size: $font-size-sm;
    text-align: center;
    line-height: 1.2;
  }
}
</style>