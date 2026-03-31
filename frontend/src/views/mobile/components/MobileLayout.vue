<template>
  <div class="mobile-layout">
    <HeaderBar :title="title" :show-back="showBack" />
    <main class="main-content">
      <slot></slot>
    </main>
    <NavBar />
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
  }
})
</script>

<style scoped>
.mobile-layout {
  min-height: 100vh;
  padding-top: 50px;
  padding-bottom: 60px;
}

.main-content {
  padding: 16px;
}
</style>