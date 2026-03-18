import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDeviceStore = defineStore('device', () => {
  const width = ref(window.innerWidth)
  const isMobile = computed(() => width.value < 768)
  const isTablet = computed(() => width.value >= 768 && width.value < 992)
  const isDesktop = computed(() => width.value >= 992)

  function updateWidth() {
    width.value = window.innerWidth
  }

  function onMounted() {
    window.addEventListener('resize', updateWidth)
  }

  function onUnmounted() {
    window.removeEventListener('resize', updateWidth)
  }

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    updateWidth,
    onMounted,
    onUnmounted
  }
})