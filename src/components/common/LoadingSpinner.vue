<template>
  <div v-if="loading" class="loading-spinner">
    <div class="loading-spinner__circle"></div>
    <p v-if="text" class="loading-spinner__text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  text?: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.loading-spinner {
  @include flex-column;
  align-items: center;
  gap: $spacing-4;
  padding: $spacing-8;

  &__circle {
    width: 40px;
    height: 40px;
    border: 3px solid $border-primary;
    border-top-color: $primary-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__text {
    color: $text-secondary;
    font-size: $font-size-sm;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>