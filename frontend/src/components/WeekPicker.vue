<template>
  <div v-if="visible" class="week-picker-overlay" @click="handleCancel">
    <div class="week-picker-container" @click.stop>
      <div class="week-picker-header">
        <button class="week-picker-btn" @click="handleCancel">取消</button>
        <h3 class="week-picker-title">选择周</h3>
        <button class="week-picker-btn confirm" @click="handleConfirm">确定</button>
      </div>
      
      <div class="week-picker-body">
        <div class="year-month-selector">
          <div class="year-selector">
            <button class="year-nav-btn" @click="previousYear">
              <Icon icon="mdi:chevron-left" />
            </button>
            <span class="year-display">{{ selectedYear }}年</span>
            <button class="year-nav-btn" @click="nextYear">
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>
          
          <div class="month-selector">
            <button class="month-nav-btn" @click="previousMonth">
              <Icon icon="mdi:chevron-left" />
            </button>
            <span class="month-display">{{ monthNames[selectedMonth] }}</span>
            <button class="month-nav-btn" @click="nextMonth">
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>
        </div>
        
        <div class="weeks-grid">
          <div 
            v-for="week in weeksInMonth" 
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
import { Icon } from '@iconify/vue'
import { getWeekStart, getWeekNumber } from '../utils/dateUtils'

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

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const selectedYear = ref(props.modelValue ? props.modelValue.getFullYear() : new Date().getFullYear())
const selectedMonth = ref(props.modelValue ? props.modelValue.getMonth() : new Date().getMonth())
const selectedWeekStart = ref(props.modelValue ? getWeekStart(props.modelValue) : getWeekStart(new Date()))

function formatShortDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const weeksInMonth = computed(() => {
  const weeks = []
  const year = selectedYear.value
  const month = selectedMonth.value
  
  // 计算该月的第一天
  const firstDayOfMonth = new Date(year, month, 1)
  // 计算该月的最后一天
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  // 找到该月第一周的开始日期
  let currentDate = getWeekStart(firstDayOfMonth)
  
  while (true) {
    const weekStart = new Date(currentDate)
    const weekEnd = new Date(currentDate)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    // 如果周的开始日期已经超过了该月的最后一天，则停止
    if (weekStart > lastDayOfMonth) {
      break
    }
    
    // 只添加与当前月份有交集的周
    if (weekStart <= lastDayOfMonth && weekEnd >= firstDayOfMonth) {
      const weekNumber = getWeekNumber(weekStart)
      const dateRange = `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`
      
      weeks.push({
        weekNumber,
        dateRange,
        startDate: new Date(weekStart),
        endDate: new Date(weekEnd)
      })
    }
    
    currentDate.setDate(currentDate.getDate() + 7)
    
    if (weeks.length > 10) break
  }
  
  return weeks
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedYear.value = newVal.getFullYear()
    selectedMonth.value = newVal.getMonth()
    selectedWeekStart.value = getWeekStart(newVal)
  }
}, { immediate: true })

function previousYear() {
  selectedYear.value--
}

function nextYear() {
  selectedYear.value++
}

function previousMonth() {
  selectedMonth.value--
  if (selectedMonth.value < 0) {
    selectedMonth.value = 11
    selectedYear.value--
  }
}

function nextMonth() {
  selectedMonth.value++
  if (selectedMonth.value > 11) {
    selectedMonth.value = 0
    selectedYear.value++
  }
}

function selectWeek(week) {
  selectedWeekStart.value = new Date(week.startDate)
  // 更新选中的月份为周所在的月份
  selectedMonth.value = week.startDate.getMonth()
  selectedYear.value = week.startDate.getFullYear()
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

.year-month-selector {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border, #E8D9CC);
}

.year-selector,
.month-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.year-nav-btn,
.month-nav-btn {
  width: 32px;
  height: 32px;
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

.year-nav-btn:hover,
.month-nav-btn:hover {
  border-color: var(--primary, #FF8B6A);
  color: var(--primary, #FF8B6A);
  background: var(--bg-secondary, #FFEFE5);
}

.year-display,
.month-display {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #5C4B3E);
  min-width: 80px;
  text-align: center;
  font-family: 'Comic Sans MS', 'Marker Felt', 'Arial Rounded MT Bold', sans-serif;
}

.month-display {
  min-width: 80px;
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