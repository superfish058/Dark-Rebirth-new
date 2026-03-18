<template>
  <div class="pc-layout">
    <TopNavbar />
    <div class="pc-layout__content">
      <SideMenu />
      <main class="pc-layout__main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useDeviceStore } from '@/stores/device'
import TopNavbar from '@/components/pc/TopNavbar.vue'
import SideMenu from '@/components/pc/SideMenu.vue'

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

.pc-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $bg-primary;

  &__content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  &__main {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-6;
    @include scrollbar;
  }
}
</style>