<template>
  <nav class="bottom-nav" :class="{ rounded }">
    <a
      v-for="(item, index) in items"
      :key="index"
      class="nav-item"
      :class="{ active: item.active }"
      @click="navigate(item.path)"
    >
      <Icon :icon="item.icon" />
      <span class="nav-label">{{ item.label }}</span>
    </a>
  </nav>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  items: {
    type: Array,
    required: true
  },
  rounded: {
    type: Boolean,
    default: true
  }
})

function navigate(path) {
  if (path) {
    router.push(path)
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: rgba(248, 250, 248, 0.7);
  backdrop-filter: blur(10px);
  z-index: 50;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -8px 24px rgba(42, 52, 50, 0.06);
}

.bottom-nav.rounded {
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  border-radius: 16px;
  text-decoration: none;
  color: #78716c;
  transition: all 0.2s ease;
  cursor: pointer;
  flex: 1;
  max-width: 128px;
}

.nav-item.active {
  background-color: #dae5e1;
  color: #2D5A27;
}

.nav-item:active {
  transform: scale(0.9);
}

.nav-item .iconify {
  font-size: 20px;
  margin-bottom: 2px;
}

.nav-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
}
</style>
