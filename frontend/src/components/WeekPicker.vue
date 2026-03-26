<template>
  <div v-if="visible" class="week-picker-overlay" @click="handleCancel">
    <div class="week-picker-container" @click.stop>
      <div class="week-picker-header">
        <button class="week-picker-btn" @click="handleCancel">取消</button>
        <h3 class="week-picker-title">选择周</h3>
        <button class="week-picker-btn confirm" @click="handleConfirm">确定</button>
      </div>
      
      <div class="week-picker-body">
        <div class="year-selector">
          <button class="year-nav-btn" @click="previousYear">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="year-display">{{ selectedYear }}年</span>
          <button class="year-nav-btn" @click="nextYear">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="weeks-grid">
          <div 
            v-for="week in weeksInYear" 
            :key="week.weekNumber"
            class="week-item"
            :class="{ 
              active: isSelectedWeek(week),
              current: isCurrentWeek(week)
            }"
            @click="selectWeek(week)"
          >
            <div class="week-number">第{{ week.weekNumber }}周</div>
            <div class="week-date-range">{{ week.dateRange }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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

const selectedYear = ref(props.modelValue ? props.modelValue.getFullYear() : new Date().getFullYear())
const selectedWeekStart = ref(props.modelValue ? getWeekStart(props.modelValue) : getWeekStart(new Date()))

function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const weeksInYear = computed(() => {
  const weeks = []
  const year = selectedYear.value
  
  let currentDate = new Date(year, 0, 1)
  const day = currentDate.getDay()
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1)
  currentDate = new Date(currentDate.setDate(diff))
  
  if (currentDate.getFullYear() > year) {
    currentDate.setDate(currentDate.getDate() - 7)
  }
  
  while (true) {
    const weekStart = new Date(currentDate)
    const weekEnd = new Date(currentDate)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    if (weekStart.getFullYear() > year || (weekStart.getFullYear() === year && weekEnd.getFullYear() > year && weekStart.getMonth() === 11)) {
      break
    }
    
    const weekNumber = getWeekNumber(weekStart)
    const dateRange = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
    
    weeks.push({
      weekNumber,
      dateRange,
      startDate: new Date(weekStart),
      endDate: new Date(weekEnd)
    })
    
    currentDate.setDate(currentDate.getDate() + 7)
    
    if (weeks.length > 60) break
  }
  
  return weeks
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedYear.value = newVal.getFullYear()
    selectedWeekStart.value = getWeekStart(newVal)
  }
}, { immediate: true })

function previousYear() {
  selectedYear.value--
}

function nextYear() {
  selectedYear.value++
}

function selectWeek(week) {
  selectedWeekStart.value = new Date(week.startDate)
}

function isSelectedWeek(week) {
  if (!selectedWeekStart.value) return false
  return week.startDate.getTime() === selectedWeekStart.value.getTime()
}

function isCurrentWeek(week) {
  const currentWeekStart = getWeekStart(new Date())
  return week.startDate.getTime() === currentWeekStart.getTime()
}

function handleConfirm() {
  emit('confirm', selectedWeekStart.value)
  emit('update:visible', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.week-picker-overlay {
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

.week-picker-container {
  background: white;
  width: 100%;
  max-width: 500px;
  max-height: 70vh;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.week-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #E8D9CC);
  flex-shrink: 0;
}

.week-picker-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #5C4B3E);
}

.week-picker-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #8B7355);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.week-picker-btn.confirm {
  color: var(--primary, #FF8B6A);
  font-weight: 600;
}

.week-picker-btn:hover {
  color: var(--primary, #FF8B6A);
}

.week-picker-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.year-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border, #E8D9CC);
}

.year-nav-btn {
  width: 36px;
  height: 36px;
  border: 2px solid var(--border, #E8D9CC);
  border-radius: 50%;
  background: white;
  color: var(--text-secondary, #8B7355);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.year-nav-btn:hover {
  border-color: var(--primary, #FF8B6A);
  color: var(--primary, #FF8B6A);
  background: var(--bg-secondary, #FFEFE5);
}

.year-display {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #5C4B3E);
  min-width: 80px;
  text-align: center;
}

.weeks-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.week-item {
  padding: 12px 16px;
  border: 2px solid var(--border, #E8D9CC);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.week-item:hover {
  border-color: var(--primary, #FF8B6A);
  background: var(--bg-secondary, #FFEFE5);
}

.week-item.active {
  border-color: var(--primary, #FF8B6A);
  background: var(--primary, #FF8B6A);
}

.week-item.active .week-number,
.week-item.active .week-date-range {
  color: white;
}

.week-item.current {
  border-color: var(--primary, #FF8B6A);
  box-shadow: 0 0 0 2px rgba(255, 139, 106, 0.2);
}

.week-number {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #5C4B3E);
}

.week-date-range {
  font-size: 14px;
  color: var(--text-secondary, #8B7355);
}

@media (max-width: 480px) {
  .week-picker-body {
    padding: 12px;
  }
  
  .week-item {
    padding: 10px 12px;
  }
  
  .week-number {
    font-size: 14px;
  }
  
  .week-date-range {
    font-size: 12px;
  }
}
</style>