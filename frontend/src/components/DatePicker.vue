<template>
  <div v-if="visible" class="date-picker-overlay" @click="handleCancel">
    <div class="date-picker-container" @click.stop>
      <div class="date-picker-header">
        <button class="date-picker-btn" @click="handleCancel">取消</button>
        <h3 class="date-picker-title">选择日期</h3>
        <button class="date-picker-btn confirm" @click="handleConfirm">确定</button>
      </div>
      
      <div class="date-picker-body">
        <div class="date-picker-column">
          <div class="column-header">年</div>
          <div class="column-scroll" ref="yearScroll">
            <div 
              v-for="year in years" 
              :key="year"
              class="column-item"
              :class="{ active: selectedYear === year }"
              @click="selectYear(year)"
            >
              {{ year }}
            </div>
          </div>
        </div>
        
        <div class="date-picker-column">
          <div class="column-header">月</div>
          <div class="column-scroll" ref="monthScroll">
            <div 
              v-for="month in months" 
              :key="month"
              class="column-item"
              :class="{ active: selectedMonth === month }"
              @click="selectMonth(month)"
            >
              {{ month + 1 }}
            </div>
          </div>
        </div>
        
        <div class="date-picker-column">
          <div class="column-header">日</div>
          <div class="column-scroll" ref="dayScroll">
            <div 
              v-for="day in days" 
              :key="day"
              class="column-item"
              :class="{ active: selectedDay === day }"
              @click="selectDay(day)"
            >
              {{ day }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Date,
    default: () => new Date()
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

const selectedYear = ref(props.modelValue.getFullYear())
const selectedMonth = ref(props.modelValue.getMonth())
const selectedDay = ref(props.modelValue.getDate())

const yearScroll = ref(null)
const monthScroll = ref(null)
const dayScroll = ref(null)

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i)
  }
  return years
})

const months = computed(() => {
  return Array.from({ length: 12 }, (_, i) => i)
})

const days = computed(() => {
  const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedYear.value = newVal.getFullYear()
    selectedMonth.value = newVal.getMonth()
    selectedDay.value = newVal.getDate()
  }
}, { immediate: true })

watch(() => props.visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      scrollToSelected()
    })
  }
})

function scrollToSelected() {
  const itemHeight = 40
  const containerHeight = 200
  
  if (yearScroll.value) {
    const yearIndex = years.value.indexOf(selectedYear.value)
    yearScroll.value.scrollTop = yearIndex * itemHeight - containerHeight / 2 + itemHeight / 2
  }
  
  if (monthScroll.value) {
    monthScroll.value.scrollTop = selectedMonth.value * itemHeight - containerHeight / 2 + itemHeight / 2
  }
  
  if (dayScroll.value) {
    dayScroll.value.scrollTop = (selectedDay.value - 1) * itemHeight - containerHeight / 2 + itemHeight / 2
  }
}

function selectYear(year) {
  selectedYear.value = year
  adjustDay()
}

function selectMonth(month) {
  selectedMonth.value = month
  adjustDay()
}

function selectDay(day) {
  selectedDay.value = day
}

function adjustDay() {
  const maxDay = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
  if (selectedDay.value > maxDay) {
    selectedDay.value = maxDay
  }
}

function handleConfirm() {
  const date = new Date(selectedYear.value, selectedMonth.value, selectedDay.value)
  emit('confirm', date)
  emit('update:visible', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.date-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.date-picker-container {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.date-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #E8D9CC);
}

.date-picker-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #5C4B3E);
}

.date-picker-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #8B7355);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.date-picker-btn.confirm {
  color: var(--primary, #FF8B6A);
  font-weight: 600;
}

.date-picker-btn:hover {
  color: var(--primary, #FF8B6A);
}

.date-picker-body {
  display: flex;
  padding: 20px;
  gap: 10px;
}

.date-picker-column {
  flex: 1;
  text-align: center;
}

.column-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary, #8B7355);
  margin-bottom: 10px;
}

.column-scroll {
  height: 200px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.column-item {
  padding: 10px;
  font-size: 16px;
  color: var(--text-primary, #5C4B3E);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
}

.column-item:hover {
  background: var(--bg-secondary, #FFEFE5);
}

.column-item.active {
  background: var(--primary, #FF8B6A);
  color: white;
  font-weight: 600;
}

@media (max-width: 480px) {
  .date-picker-body {
    padding: 16px;
    gap: 8px;
  }
  
  .column-item {
    padding: 8px;
    font-size: 14px;
  }
}
</style>