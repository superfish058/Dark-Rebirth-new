<template>
  <header class="page-header" :class="{ sticky: sticky, 'no-shadow': noShadow }">
    <div class="header-top">
      <button v-if="showBack" class="back-btn" @click="handleBack">
        <Icon :icon="backIcon" />
      </button>
      <div v-else class="header-spacer"></div>
      
      <h1 class="title">{{ title }}</h1>
      
      <div class="header-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <div v-if="$slots.subheader" class="header-subheader">
      <slot name="subheader"></slot>
    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  showBack: {
    type: Boolean,
    default: true
  },
  backIcon: {
    type: String,
    default: 'mdi:home'
  },
  sticky: {
    type: Boolean,
    default: true
  },
  noShadow: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back'])

function handleBack() {
  emit('back')
}
</script>

<style scoped>
.page-header {
  background-color: #f8faf8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-header.no-shadow {
  box-shadow: none;
}

.page-header:not(.sticky) {
  position: relative;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  height: 56px;
  box-sizing: border-box;
}

.header-spacer {
  width: 32px;
  height: 32px;
  flex: none;
}

.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #f0f5f2;
  color: #57615f;
  border: 1px solid #dae5e1;
  cursor: pointer;
  flex: none;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #e1eae7;
}

.back-btn:active {
  transform: scale(0.95);
}

.back-btn .iconify {
  width: 20px;
  height: 20px;
}

.title {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #2D5A27;
  margin: 0;
  flex: 1;
  text-align: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 32px;
  justify-content: flex-end;
}

.header-subheader {
  padding: 0 16px 12px;
}
</style>
