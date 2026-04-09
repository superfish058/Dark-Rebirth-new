<template>
  <div class="mobile-layout">
    <HeaderBar :title="title" :show-back="showBack" :title-color="titleColor" />
    <main class="main-content">
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </main>
    <NavBar v-if="showNav" />
  </div>
</template>

<script setup>
import HeaderBar from './HeaderBar.vue'
import NavBar from './NavBar.vue'

const props = defineProps({
  title: {
    type: String,
    default: '移动端'
  },
  showBack: {
    type: Boolean,
    default: false
  },
  titleColor: {
    type: String,
    default: 'var(--text-primary)'
  },
  showNav: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.mobile-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.content-wrapper {
  padding: 16px;
  height: 100%;
}
</style>