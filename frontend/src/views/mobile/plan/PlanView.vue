<template>
    <div class="page-container">
        <PageHeader title="影途执策" :sticky="true" :no-shadow="true" @back="goHome">
            <template #actions>
                <div class="profile-avatar">
                    <img alt="User profile" :src="userStore.user?.avatar || defaultAvatar" />
                </div>
            </template>
        </PageHeader>

        <main class="main-content">
            <!-- Day View -->
            <section v-if="viewMode === 'day'" class="overview-card">
                <div class="segmented-toggle">
                    <button class="toggle-btn" :class="{ active: viewMode === 'day' }"
                        @click="viewMode = 'day'">每日</button>
                    <button class="toggle-btn" :class="{ active: viewMode === 'week' }"
                        @click="viewMode = 'week'">每周</button>
                </div>

                <div class="date-navigation">
                    <button class="nav-button" @click="navigatePrevious">
                        <span class="material-symbols-outlined">chevron_left</span>
                        <span>{{ viewMode === 'day' ? '上一天' : '上一周' }}</span>
                    </button>
                    <div class="current-date">
                        <span v-if="viewMode === 'day'" class="today-label">{{ dayOfWeek }}</span>
                        <span v-else class="week-number">{{ weekNumber }}</span>
                        <span class="date-value" v-if="viewMode === 'day'">{{ dayValue }}</span>
                        <span v-else class="week-range">{{ weekRange }}</span>
                    </div>
                    <button class="nav-button" @click="navigateNext">
                        <span>{{ viewMode === 'day' ? '下一天' : '下一周' }}</span>
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <div class="progress-section">
                    <div class="progress-header">
                        <label class="progress-label">{{ viewMode === 'day' ? '影途执策情况' : '本周完成进度' }}</label>
                        <span class="progress-percentage">{{ progressPercentage }}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                    </div>
                    <p class="progress-hint">{{ progressHint }}</p>
                </div>
            </section>

            <!-- Week View -->
            <section v-else class="overview-card">
                <div class="segmented-toggle">
                    <button class="toggle-btn" :class="{ active: viewMode === 'day' }"
                        @click="viewMode = 'day'">每日</button>
                    <button class="toggle-btn" :class="{ active: viewMode === 'week' }"
                        @click="viewMode = 'week'">每周</button>
                </div>

                <div class="date-navigation">
                    <button class="nav-button" @click="navigatePrevious">
                        <span class="material-symbols-outlined">chevron_left</span>
                        <span>上一周</span>
                    </button>
                    <div class="current-date">
                        <span class="week-number">{{ weekNumber }}</span>
                        <span class="week-range">{{ weekRange }}</span>
                    </div>
                    <button class="nav-button" @click="navigateNext">
                        <span>下一周</span>
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <div class="progress-section">
                    <div class="progress-header">
                        <label class="progress-label">本周完成进度</label>
                        <span class="progress-percentage">{{ progressPercentage }}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                    </div>
                    <p class="progress-hint">{{ progressHint }}</p>
                </div>
            </section>

            <!-- Day View: Empty State -->
            <section v-if="viewMode === 'day' && dayPlans.length === 0 && incompleteHistoryPlans.length === 0"
                class="task-section">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="indicator primary"></span>
                        正在进行计划
                    </h2>
                    <span class="badge secondary-badge">0 Tasks</span>
                </div>
            </section>

            <!-- Day View: Ongoing -->
            <section v-if="viewMode === 'day' && dayPlans.length > 0" class="task-section">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="indicator primary"></span>
                        正在进行计划
                    </h2>
                    <span class="badge secondary-badge">{{ dayPlans.length }} Tasks</span>
                </div>
                <div class="task-list">
                    <div v-for="(plan, index) in dayPlans" :key="plan.id" class="task-card"
                        :class="{ completed: plan.completed }">
                        <div class="task-number" :class="{ 'completed-num': plan.completed }">{{
                            String(index + 1).padStart(2, '0') }}</div>
                        <button class="checkbox-button" :class="{ checked: plan.completed }"
                            @click="toggleComplete(plan)">
                            <span class="material-symbols-outlined" :class="{ unchecked: !plan.completed }">{{
                                plan.completed ?
                                'check_box' : 'check_box_outline_blank' }}</span>
                        </button>
                        <div class="task-content">
                            <p class="task-title" :class="{ 'completed-text': plan.completed }">{{ plan.content }}</p>
                            <span class="task-date" :class="{ 'completed-date': plan.completed }">{{
                                formatDateLabel(plan.date)
                                }}</span>
                        </div>
                        <div v-if="plan.completed" class="completed-badge">
                            <span>已完成</span>
                        </div>
                        <div v-else class="task-actions">
                            <button class="action-btn" @click="startEdit(plan)">
                                <span class="material-symbols-outlined">edit_note</span>
                            </button>
                            <button class="action-btn" @click="deletePlan(plan)">
                                <span class="material-symbols-outlined">delete_outline</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Day View: History Incomplete -->
            <section v-if="viewMode === 'day' && incompleteHistoryPlans.length > 0" class="task-section">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="indicator error"></span>
                        历史未完成计划
                    </h2>
                    <span class="badge error-badge">{{ incompleteHistoryPlans.length }} Pending</span>
                </div>
                <div class="task-list">
                    <div v-for="(plan, index) in incompleteHistoryPlans" :key="'history-' + plan.id" class="task-card">
                        <div class="task-number">{{ String(dayPlans.length + index + 1).padStart(2, '0') }}</div>
                        <button class="checkbox-button" :class="{ checked: plan.completed }"
                            @click="toggleComplete(plan)">
                            <span class="material-symbols-outlined" :class="{ unchecked: !plan.completed }">{{
                                plan.completed ?
                                'check_box' : 'check_box_outline_blank' }}</span>
                        </button>
                        <div class="task-content">
                            <p class="task-title">{{ plan.content }}</p>
                            <span class="task-date error">{{ formatDateLabel(plan.date) }}</span>
                        </div>
                        <div class="task-actions">
                            <button class="action-btn" @click="startEdit(plan)">
                                <span class="material-symbols-outlined">edit_note</span>
                            </button>
                            <button class="action-btn" @click="deletePlan(plan)">
                                <span class="material-symbols-outlined">delete_outline</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Week View: Weekly Tasks -->
            <section v-if="viewMode === 'week'" class="week-task-section">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="indicator primary"></span>
                        本周计划
                    </h2>
                    <span class="badge secondary-badge">{{ totalPlans }} Tasks</span>
                </div>

                <div v-for="(dayData, index) in weekDays" :key="index" class="week-day-group">
                    <div class="week-day-header">
                        <span class="day-dot" :class="{ primary: isToday(dayData.date) }"></span>
                        <h3 class="week-day-title">{{ dayData.dayName }} · {{ formatWeekDay(dayData.date) }}</h3>
                    </div>
                    <div v-if="dayData.plans.length > 0" class="week-task-list">
                        <div v-for="(plan, planIndex) in dayData.plans" :key="plan.id" class="week-task-card"
                            :class="{ completed: plan.completed }">
                            <div class="week-task-number">{{ String(getWeekTaskNumber(index, planIndex)).padStart(2,
                                '0') }}
                            </div>
                            <div class="week-task-content">
                                <p class="week-task-title">{{ plan.content }}</p>
                            </div>
                            <span v-if="plan.completed" class="week-task-badge">已完成</span>
                        </div>
                    </div>
                    <div v-else class="week-empty-card">
                        <span class="material-symbols-outlined">calendar_today</span>
                        <p>该日无计划</p>
                    </div>
                </div>
            </section>
        </main>

        <button v-if="viewMode === 'day'" class="fab-button" @click="showAddModal = true">
            <Icon icon="mdi:plus" />
        </button>

        <BottomNav :items="navItems" />

        <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <h3>添加新计划</h3>
                <textarea v-model="newPlanContent" class="add-plan-textarea" placeholder="写下你的计划..." rows="2"
                    @keyup.enter.ctrl="addPlan" ref="addInput"></textarea>
                <div class="modal-actions">
                    <button class="modal-btn cancel-btn" @click="closeModal">取消</button>
                    <button class="modal-btn confirm-btn" @click="addPlan">添加</button>
                </div>
            </div>
        </div>

        <div v-if="showEditModal" class="modal-overlay" @click.self="cancelEdit">
            <div class="modal-content">
                <h3>编辑计划</h3>
                <textarea v-model="editContent" class="edit-textarea" placeholder="编辑你的计划..." rows="2"
                    ref="editTextarea"></textarea>
                <div class="modal-actions">
                    <button class="modal-btn cancel-btn" @click="cancelEdit">取消</button>
                    <button class="modal-btn confirm-btn" @click="saveEdit">保存</button>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal" class="modal-overlay" @click.self="cancelDelete">
            <div class="modal-content">
                <h3>删除计划</h3>
                <p class="delete-message">确定要删除这个计划吗？</p>
                <div class="modal-actions">
                    <button class="modal-btn cancel-btn" @click="cancelDelete">取消</button>
                    <button class="modal-btn confirm-btn delete-confirm" @click="confirmDelete">删除</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../../stores/user'
import PageHeader from '../../../components/PageHeader.vue'
import BottomNav from '../../../components/BottomNav.vue'
import { Icon } from '@iconify/vue'
import { toBeijingTime, formatDate, formatDateLabel, getWeekStart, isToday, formatWeekDay, getWeekNumber } from '../../../utils/dateUtils'

const router = useRouter()
const userStore = useUserStore()

function goHome() {
    router.push('/')
}

const defaultAvatar = '/logo.png'

const navItems = [
  { icon: 'mdi:checkbox-marked-circle-outline', label: '执策', path: '/mobile/plan', active: true },
  { icon: 'mdi:note-edit', label: '随笔', path: '/mobile/journal', active: false },
  { icon: 'mdi:account', label: '我的', path: '/mobile/profile', active: false }
]

const viewMode = ref('day')
const currentDate = ref(toBeijingTime(new Date()))
const dayPlans = ref([])
const allPlans = ref([])
const showAddModal = ref(false)
const newPlanContent = ref('')
const editingPlanId = ref(null)
const editContent = ref('')
const addInput = ref(null)
const editTextarea = ref(null)
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const currentPlan = ref(null)

const weekDays = computed(() => {
    const days = []
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const startOfWeek = getWeekStart(toBeijingTime(currentDate.value))

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        const dateStr = formatDate(date)
        const plans = allPlans.value.filter(p => p.date === dateStr)
        days.push({
            date,
            dayName: dayNames[i],
            plans
        })
    }
    return days
})

const completedCount = computed(() => {
    if (viewMode.value === 'day') {
        return dayPlans.value.filter(p => p.completed).length
    } else {
        const allWeekPlans = weekDays.value.flatMap(d => d.plans)
        return allWeekPlans.filter(p => p.completed).length
    }
})

const totalPlans = computed(() => {
    if (viewMode.value === 'day') {
        return dayPlans.value.length
    } else {
        return weekDays.value.flatMap(d => d.plans).length
    }
})

const progressPercentage = computed(() => {
    if (totalPlans.value === 0) return 0
    return Math.round((completedCount.value / totalPlans.value) * 100)
})

const progressHint = computed(() => {
    if (totalPlans.value === 0) {
        return '还没有计划，点击下方添加'
    }
    if (completedCount.value === totalPlans.value) {
        return '太棒了！任务已全部完成'
    }
    const remaining = totalPlans.value - completedCount.value
    return `还有 ${remaining} 个任务待完成，加油！`
})

const incompleteHistoryPlans = computed(() => {
    const currentDateStr = formatDate(toBeijingTime(currentDate.value))
    return allPlans.value
        .filter(plan => {
            if (!plan.date) return false
            return plan.date < currentDateStr && !plan.completed
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
})

const formattedDate = computed(() => {
    const d = toBeijingTime(currentDate.value)
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
    return d.toLocaleDateString('zh-CN', options)
})

const dayOfWeek = computed(() => {
    const d = toBeijingTime(currentDate.value)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return dayNames[d.getDay()]
})

const dayValue = computed(() => {
    const d = toBeijingTime(currentDate.value)
    const month = d.getMonth() + 1
    const day = d.getDate()
    return `${month}月${day}日`
})

const weekNumber = computed(() => {
    const d = toBeijingTime(currentDate.value)
    const weekNum = getWeekNumber(d)
    return `第${weekNum}周`
})

const weekRange = computed(() => {
    const d = toBeijingTime(currentDate.value)
    const weekStart = getWeekStart(d)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    const startMonth = weekStart.getMonth() + 1
    const startDay = weekStart.getDate()
    const endMonth = weekEnd.getMonth() + 1
    const endDay = weekEnd.getDate()
    return `${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')} — ${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`
})

function getWeekTaskNumber(dayIndex, planIndex) {
    let count = 1
    for (let i = 0; i < dayIndex; i++) {
        count += weekDays.value[i].plans.length
    }
    return count + planIndex
}

function showDatePicker() {
    const dateStr = prompt('请输入日期 (YYYY-MM-DD)', formatDate(toBeijingTime(currentDate.value)))
    if (dateStr) {
        const newDate = new Date(dateStr)
        if (!isNaN(newDate.getTime())) {
            currentDate.value = toBeijingTime(newDate)
            loadPlansForCurrentView()
        }
    }
}

function navigatePrevious() {
    if (viewMode.value === 'day') {
        currentDate.value = toBeijingTime(new Date(currentDate.value.getTime() - 24 * 60 * 60 * 1000))
    } else {
        currentDate.value = toBeijingTime(new Date(currentDate.value.getTime() - 7 * 24 * 60 * 60 * 1000))
    }
    loadPlansForCurrentView()
}

function navigateNext() {
    if (viewMode.value === 'day') {
        currentDate.value = toBeijingTime(new Date(currentDate.value.getTime() + 24 * 60 * 60 * 1000))
    } else {
        currentDate.value = toBeijingTime(new Date(currentDate.value.getTime() + 7 * 24 * 60 * 60 * 1000))
    }
    loadPlansForCurrentView()
}

async function loadPlansForCurrentView() {
    try {
        if (viewMode.value === 'day') {
            const dateStr = formatDate(toBeijingTime(currentDate.value))
            const plans = await userStore.getPlansByDate(dateStr)
            dayPlans.value = plans
            allPlans.value = await userStore.getIncompletePlans()
        } else {
            const weekStart = getWeekStart(toBeijingTime(currentDate.value))
            const weekStartStr = formatDate(weekStart)
            const weekData = await userStore.getPlansByWeek(weekStartStr)
            allPlans.value = weekData
        }
    } catch (err) {
        console.error('加载计划失败', err)
    }
}

async function loadPlans() {
    try {
        await loadPlansForCurrentView()
    } catch (err) {
        console.error('加载计划失败', err)
    }
}

async function addPlan() {
    if (!newPlanContent.value.trim()) return

    try {
        const dateStr = viewMode.value === 'day' ? formatDate(toBeijingTime(currentDate.value)) : null
        const plan = await userStore.createPlan(newPlanContent.value, dateStr)
        if (viewMode.value === 'day') {
            dayPlans.value.push(plan)
        }
        allPlans.value.push(plan)
        newPlanContent.value = ''
        showAddModal.value = false
    } catch (err) {
        console.error('添加计划失败', err)
    }
}

function startEdit(plan) {
    currentPlan.value = plan
    editContent.value = plan.content
    showEditModal.value = true
    nextTick(() => {
        editTextarea.value?.focus()
    })
}

async function saveEdit() {
    if (!editContent.value.trim() || !currentPlan.value) return

    try {
        await userStore.updatePlan(currentPlan.value.id, editContent.value)
        currentPlan.value.content = editContent.value
        showEditModal.value = false
        editContent.value = ''
        currentPlan.value = null
    } catch (err) {
        console.error('更新计划失败', err)
    }
}

function cancelEdit() {
    showEditModal.value = false
    editContent.value = ''
    currentPlan.value = null
}

function closeModal() {
    newPlanContent.value = ''
    showAddModal.value = false
}

function deletePlan(plan) {
    currentPlan.value = plan
    showDeleteModal.value = true
}

async function confirmDelete() {
    if (!currentPlan.value) return

    try {
        await userStore.deletePlan(currentPlan.value.id)
        dayPlans.value = dayPlans.value.filter(p => p.id !== currentPlan.value.id)
        allPlans.value = allPlans.value.filter(p => p.id !== currentPlan.value.id)
        showDeleteModal.value = false
        currentPlan.value = null
    } catch (err) {
        console.error('删除计划失败', err)
        showDeleteModal.value = false
        currentPlan.value = null
    }
}

function cancelDelete() {
    showDeleteModal.value = false
    currentPlan.value = null
}

async function toggleComplete(plan) {
    try {
        await userStore.toggleComplete(plan.id, !plan.completed)
        plan.completed = !plan.completed
    } catch (err) {
        console.error('更新计划状态失败', err)
    }
}

watch(viewMode, () => {
    loadPlansForCurrentView()
})

onMounted(() => {
    loadPlans()
})

watch(showAddModal, (val) => {
    if (val) {
        nextTick(() => {
            addInput.value?.focus()
        })
    }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.page-container {
    min-height: 100vh;
    background-color: #f8faf8;
    color: #2a3432;
    font-family: 'Manrope', sans-serif;
    -webkit-tap-highlight-color: transparent;
    padding-bottom: 100px;
}

.top-appbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 56px;
    background-color: rgba(248, 250, 248, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(218, 229, 225, 0.5);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.title-section {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.app-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 18px;
    line-height: 1.2;
    color: #2D5A27;
    text-align: center;
    margin: 0;
}

.date-label {
    font-size: 10px;
    color: #57615f;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-align: center;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.profile-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #dae5e1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.icon-button {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: transparent;
    border: none;
    color: #5e605b;
    cursor: pointer;
    transition: background-color 0.2s;
}

.icon-button:hover {
    background-color: #f0f5f2;
}

.icon-button:active {
    transform: scale(0.95);
}

.material-symbols-outlined {
    font-size: 24px;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.material-symbols-outlined.filled {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.main-content {
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 128px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.overview-card {
    background-color: #f0f5f2;
    border-radius: 24px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow: 0px 8px 24px rgba(42, 52, 50, 0.06);
    border: 1px solid rgba(114, 125, 122, 0.1);
}

.segmented-toggle {
    display: flex;
    padding: 4px;
    background-color: rgba(218, 229, 225, 0.5);
    border-radius: 8px;
}

.toggle-btn {
    flex: 1;
    padding: 8px 0;
    font-size: 14px;
    font-weight: 700;
    border: none;
    border-radius: 6px;
    background-color: #ffffff;
    color: #2D5A27;
    cursor: pointer;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
}

.toggle-btn:not(.active) {
    background: transparent;
    color: #57615f;
    font-weight: 500;
    box-shadow: none;
}

.toggle-btn:not(.active):hover {
    color: #2D5A27;
}

.date-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav-button {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #2D5A27;
    font-size: 14px;
    font-weight: 700;
    padding: 8px 12px;
    min-height: 48px;
    border-radius: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
}

.nav-button:hover {
    background-color: rgba(45, 90, 39, 0.05);
}

.nav-button:active {
    transform: scale(0.95);
}

.nav-button .material-symbols-outlined {
    font-size: 14px;
}

.current-date {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.today-label {
    font-size: 10px;
    color: #57615f;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.date-value {
    font-size: 16px;
    font-weight: 800;
    color: #2a3432;
}

.week-number {
    font-size: 18px;
    font-weight: 800;
    color: #2a3432;
}

.week-range {
    font-size: 12px;
    font-weight: 700;
    color: #57615f;
}

.progress-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.progress-label {
    font-size: 14px;
    font-weight: 800;
    color: #2a3432;
}

.progress-percentage {
    font-size: 12px;
    font-weight: 900;
    color: #2D5A27;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background-color: #e1eae7;
    border-radius: 9999px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: #2D5A27;
    border-radius: 9999px;
    transition: width 0.7s ease;
}

.progress-hint {
    font-size: 11px;
    color: #57615f;
    font-weight: 500;
    line-height: 1.6;
}

.task-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.week-task-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
}

.section-title {
    font-size: 14px;
    font-weight: 800;
    color: #57615f;
    display: flex;
    align-items: center;
    gap: 8px;
}

.indicator {
    width: 4px;
    height: 16px;
    border-radius: 9999px;
}

.indicator.error {
    background-color: #9e422c;
}

.indicator.primary {
    background-color: #bcf0ae;
}

.badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.error-badge {
    background-color: #fe8b70;
    color: #742410;
}

.secondary-badge {
    background-color: #e2e3dd;
    color: #50524e;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.task-card {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 72px;
    box-shadow: 0px 4px 12px rgba(42, 52, 50, 0.04);
    border: 1px solid rgba(114, 125, 122, 0.1);
}

.task-card.completed {
    background-color: #d6f3d7;
    border: 1px solid rgba(45, 90, 39, 0.1);
}

.task-number {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background-color: #e1eae7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 900;
    color: #57615f;
    flex-shrink: 0;
}

.task-number.completed-num {
    background-color: rgba(68, 93, 71, 0.1);
    color: #445d47;
}

.checkbox-button {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: transparent;
    border: none;
    color: #727d7a;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.checkbox-button:active {
    transform: scale(0.9);
}

.checkbox-button.checked {
    color: #2D5A27;
}

.checkbox-button .material-symbols-outlined {
    font-size: 28px;
}

.checkbox-button .unchecked {
    font-variation-settings: 'FILL' 0;
}

.task-content {
    flex: 1;
    min-width: 0;
}

.task-title {
    font-size: 14px;
    font-weight: 700;
    color: #2a3432;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.task-title.completed-text {
    color: #445d47;
}

.task-date {
    font-size: 10px;
    color: #57615f;
    font-weight: 600;
}

.task-date.error {
    color: #9e422c;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
}

.task-date.completed-date {
    color: #2D5A27;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
}

.task-actions {
    display: flex;
    align-items: center;
    gap: 0;
}

.action-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: transparent;
    border: none;
    color: #57615f;
    cursor: pointer;
    transition: background-color 0.2s;
}

.action-btn:hover {
    background-color: #f0f5f2;
}

.action-btn .material-symbols-outlined {
    font-size: 20px;
}

.completed-badge {
    display: flex;
    align-items: center;
    padding-right: 8px;
}

.completed-badge span {
    background-color: #2D5A27;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Week View Styles */
.week-day-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.week-day-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
}

.day-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #a9b4b1;
}

.day-dot.primary {
    background-color: #2D5A27;
}

.week-day-title {
    font-size: 11px;
    font-weight: 700;
    color: #57615f;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.week-task-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.week-task-card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0px 4px 12px rgba(42, 52, 50, 0.04);
    border: 1px solid rgba(114, 125, 122, 0.1);
}

.week-task-card.completed {
    background-color: #d6f3d7;
    border: 1px solid rgba(45, 90, 39, 0.1);
}

.week-task-number {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: #e1eae7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 900;
    color: #57615f;
    flex-shrink: 0;
}

.week-task-card.completed .week-task-number {
    background-color: rgba(68, 93, 71, 0.1);
    color: #445d47;
}

.week-task-content {
    flex: 1;
    min-width: 0;
}

.week-task-title {
    font-size: 14px;
    font-weight: 700;
    color: #2a3432;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.week-task-card.completed .week-task-title {
    color: #445d47;
}

.week-task-badge {
    background-color: #2D5A27;
    color: #ffffff;
    font-size: 9px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
}

.week-empty-card {
    border: 2px dashed rgba(114, 125, 122, 0.3);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: rgba(240, 245, 242, 0.3);
}

.week-empty-card .material-symbols-outlined {
    font-size: 24px;
    color: #727d7a;
}

.week-empty-card p {
    font-size: 12px;
    font-weight: 700;
    color: #57615f;
}

.fab-button {
    position: fixed;
    bottom: 105px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background-color: #2D5A27;
    color: white;
    box-shadow: 0 4px 12px rgba(42, 52, 50, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    z-index: 50;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.fab-button:active {
    transform: scale(0.9);
}

.fab-button .iconify {
    font-size: 30px;
    font-weight: 700;
}

.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 50;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background-color: rgba(248, 250, 248, 0.7);
    backdrop-filter: blur(10px);
    border-top: 1px solid #e9efed;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    box-shadow: 0 -8px 24px rgba(42, 52, 50, 0.06);
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 20px;
    border-radius: 16px;
    text-decoration: none;
    color: #78716c;
    transition: all 0.2s ease;
    cursor: pointer;
    flex: 1;
    max-width: 128px;
}

.nav-item.active {
    background-color: #dae5e1;
    color: #2D5A27;
}

.nav-item:not(.active):hover {
    color: #2D5A27;
}

.nav-item:active {
    transform: scale(0.9);
}

.nav-item .material-symbols-outlined {
    font-size: 20px;
    margin-bottom: 2px;
}

.nav-label {
    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-align: center;
    margin-top: 0;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 150;
    padding: 20px;
}

.modal-content {
    background: white;
    padding: 24px;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 24px rgba(42, 52, 50, 0.2);
}

.modal-content h3 {
    margin: 0 0 16px;
    text-align: center;
    color: #2a3432;
    font-size: 18px;
    font-weight: 700;
}

.add-plan-textarea {
    font-size: 16px;
    padding: 12px 16px;
    min-height: 80px;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    border: 2px solid #e1eae7;
    border-radius: 12px;
    font-family: 'Manrope', sans-serif;
    outline: none;
    transition: border-color 0.2s;
}

.add-plan-textarea:focus {
    border-color: #2D5A27;
}

.edit-textarea {
    font-size: 16px;
    padding: 12px 16px;
    min-height: 80px;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    border: 2px solid #e1eae7;
    border-radius: 12px;
    font-family: 'Manrope', sans-serif;
    outline: none;
    transition: border-color 0.2s;
}

.edit-textarea:focus {
    border-color: #2D5A27;
}

.delete-message {
    text-align: center;
    color: #57615f;
    font-size: 14px;
    margin: 0;
    padding: 16px 0;
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 20px;
}

.modal-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.cancel-btn {
    background: #e2e3dd;
    color: #50524e;
}

.cancel-btn:hover {
    background: #d1d3d0;
}

.confirm-btn {
    background: #2D5A27;
    color: white;
}

.confirm-btn:hover {
    background: #234a1f;
}

.delete-confirm {
    background: #9e422c;
    color: white;
}

.delete-confirm:hover {
    background: #7d3524;
}
</style>
