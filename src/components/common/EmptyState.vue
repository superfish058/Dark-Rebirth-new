<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <slot name="icon">
        <van-icon v-if="vantIcon" :name="vantIcon" :size="iconSize" />
        <el-icon v-else-if="elementIcon" :size="iconSize">
          <component :is="elementIcon" />
        </el-icon>
        <span v-else>{{ icon }}</span>
      </slot>
    </div>
    <div class="empty-state__text">{{ text }}</div>
    <div v-if="description" class="empty-state__description">
      {{ description }}
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Component } from 'vue'

interface Props {
  icon?: string
  vantIcon?: string
  elementIcon?: Component
  iconSize?: string | number
  text: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  icon: '📦',
  iconSize: 48
})
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.empty-state {
  @include flex-column;
  align-items: center;
  justify-content: center;
  padding: $spacing-12;
  text-align: center;
  color: $text-tertiary;

  &__icon {
    margin-bottom: $spacing-4;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__text {
    font-size: $font-size-base;
    margin-bottom: $spacing-2;
    color: $text-secondary;
  }

  &__description {
    font-size: $font-size-sm;
    color: $text-tertiary;
    margin-bottom: $spacing-4;
  }
}
</style>