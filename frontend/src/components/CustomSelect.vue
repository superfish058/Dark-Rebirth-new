<template>
  <div class="custom-select">
    <div 
      class="select-button" 
      @mousedown.prevent="toggleDropdown"
      :class="{ active: isDropdownOpen }"
    >
      <span class="selected-value">{{ selectedOption ? selectedOption.label : placeholder }}</span>
      <Icon icon="mdi:chevron-down" :class="{ rotated: isDropdownOpen }" />
    </div>
    <div v-if="isDropdownOpen" class="dropdown-menu" @mousedown.prevent>
      <div 
        v-for="option in options" 
        :key="option.value"
        class="dropdown-item"
        :class="{ active: selectedValue === option.value }"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: '选择选项'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isDropdownOpen = ref(false)

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const selectedOption = computed(() => {
  return props.options.find(option => option.value === selectedValue.value)
})

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function selectOption(option) {
  selectedValue.value = option.value
  emit('change', option)
  isDropdownOpen.value = false
}

function closeDropdown() {
  isDropdownOpen.value = false
}

defineExpose({
  closeDropdown
})
</script>

<style scoped>
/* Icon 大小共用类 */
.iconify {
  font-size: 20px;
}

.custom-select {
  position: relative;
  width: 100%;
}

.select-button {
    width: 100%;
    padding: 12px 16px;
    background: #f8faf8;
    border: 1px solid #dae5e1;
    border-radius: 8px;
    font-size: 15px;
    color: #2a3432;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
  }

.select-button:hover {
  border-color: #3b6934;
}

.select-button.active {
  border-color: #3b6934;
  box-shadow: 0 0 0 2px rgba(59, 105, 52, 0.1);
}

.selected-value {
    flex: 1;
    text-align: left;
  }



.select-button :deep(svg.rotated) {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: #ffffff;
  border: 1px solid #dae5e1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
    padding: 12px 16px;
    font-size: 16px;
    color: #2a3432;
    cursor: pointer;
    transition: background-color 0.2s;
  }

.dropdown-item:hover {
  background: #f0f5f2;
}

.dropdown-item.active {
  background: #bcf0ae;
  color: #1c4818;
}
</style>