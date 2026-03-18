<template>
  <div class="mobile-layout">
    <main class="mobile-layout__main">
      <router-view />
    </main>
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useDeviceStore } from '@/stores/device'
import TabBar from '@/components/mobile/TabBar.vue'

const deviceStore = useDeviceStore()

onMounted(() => {
  deviceStore.onMounted()
})

onUnmounted(() => {
  deviceStore.onUnmounted()
})
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.mobile-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $bg-primary;
  padding-bottom: 60px;

  &__main {
    flex: 1;
    overflow-y: auto;
  }
}
</style>