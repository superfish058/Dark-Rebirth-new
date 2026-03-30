<template>
  <div class="custom-select" :class="{ open: isOpen }">
    <div class="select-input" @click="toggleDropdown" ref="selectInput">
      <span class="selected-value">
        {{ selectedLabel || placeholder }}
      </span>
      <svg class="arrow-icon" :class="{ rotated: isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
    
    <Teleport to="body">
      <div 
        class="select-dropdown" 
        v-show="isOpen" 
        ref="dropdown"
        :style="dropdownStyle"
      >
        <div 
          v-for="option in options" 
          :key="option.value"
          class="select-option"
          :class="{ active: modelValue === option.value }"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: '请选择'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const selectInput = ref(null)
const dropdown = ref(null)
const dropdownStyle = ref({})

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : ''
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // 立即计算位置，然后在 nextTick 中再次计算以确保准确性
    updateDropdownPosition()
    nextTick(() => {
      updateDropdownPosition()
    })
  }
}

function updateDropdownPosition() {
  if (!selectInput.value || !dropdown.value) return
  
  const inputRect = selectInput.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  
  // 计算下拉框底部到视口底部的距离
  const spaceBelow = viewportHeight - inputRect.bottom
  const spaceAbove = inputRect.top
  
  // 估算下拉框高度（每个选项约 44px）
  const estimatedHeight = Math.min(props.options.length * 44, 240)
  
  let top, maxHeight
  
  // 如果下方空间足够，显示在下方
  if (spaceBelow >= estimatedHeight) {
    top = inputRect.bottom + 4
    maxHeight = Math.min(spaceBelow - 4, 240)
  } 
  // 否则显示在上方
  else if (spaceAbove >= estimatedHeight) {
    top = inputRect.top - estimatedHeight
    maxHeight = Math.min(spaceAbove - 4, 240)
  } 
  // 如果上下空间都不够，优先显示在下方，但限制最大高度
  else {
    top = inputRect.bottom + 4
    maxHeight = Math.max(spaceBelow, spaceAbove) - 4
  }
  
  dropdownStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${inputRect.left}px`,
    width: `${inputRect.width}px`,
    maxHeight: `${maxHeight}px`,
    zIndex: 9999
  }
}

// 监听窗口滚动和大小变化
function selectOption(option) {
  emit('update:modelValue', option.value)
  emit('change', option)
  isOpen.value = false
}

function handleClickOutside(event) {
  if (isOpen.value && 
      selectInput.value && !selectInput.value.contains(event.target) &&
      dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false
  }
}

// 监听窗口滚动和大小变化
function handleScroll() {
  if (isOpen.value) {
    updateDropdownPosition()
  }
}

function handleResize() {
  if (isOpen.value) {
    updateDropdownPosition()
  }
}

watch(isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      updateDropdownPosition()
    })
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
}

.select-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #334155;
}

.select-input:hover {
  border-color: #0042a6;
}

.select-input.open {
  border-color: #0042a6;
  box-shadow: 0 0 0 4px rgba(0, 66, 166, 0.1);
}

.selected-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
  color: #64748b;
  flex-shrink: 0;
  margin-left: 8px;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

.select-dropdown {
  background: white;
  border: 2px solid #0042a6;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 66, 166, 0.15);
  overflow-y: auto;
  animation: dropdownSlideIn 0.2s ease;
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.select-option {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #334155;
  font-size: 14px;
}

.select-option:hover {
  background-color: #f1f5f9;
  color: #0042a6;
}

.select-option.active {
  background-color: #e2e8f0;
  color: #0042a6;
  font-weight: 600;
}

.select-option:first-child {
  border-radius: 6px 6px 0 0;
}

.select-option:last-child {
  border-radius: 0 0 6px 6px;
}

/* 自定义滚动条 - 只在 hover 时显示 */
.select-dropdown::-webkit-scrollbar {
  width: 0;
}

.select-dropdown:hover::-webkit-scrollbar {
  width: 6px;
}

.select-dropdown::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.select-dropdown::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background 0.2s ease;
}

.select-dropdown::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
