/**
 * 统一的日期处理工具模块
 * 提供北京时间转换、日期格式化、周计算等工具函数
 */

/**
 * 将日期转换为北京时间
 * @param {Date} date - 日期对象
 * @returns {Date} 北京时间的日期对象
 */
export function toBeijingTime(date) {
  const beijingOffset = 8 * 60 * 60 * 1000
  const localOffset = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() + localOffset + beijingOffset)
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
  const d = toBeijingTime(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化日期标签（用于显示）
 * @param {string} dateStr - 日期字符串
 * @returns {string} 格式化后的日期标签
 */
export function formatDateLabel(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const options = { month: 'short', day: 'numeric' }
  return d.toLocaleDateString('zh-CN', options)
}

/**
 * 获取一周的开始日期（周一）
 * @param {Date} date - 日期对象
 * @returns {Date} 周一的日期对象
 */
export function getWeekStart(date) {
  const d = toBeijingTime(new Date(date))
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

/**
 * 判断是否为今天
 * @param {Date} date - 日期对象
 * @returns {boolean} 是否为今天
 */
export function isToday(date) {
  const today = toBeijingTime(new Date())
  const d = toBeijingTime(date)
  return formatDate(today) === formatDate(d)
}

/**
 * 格式化周日期（用于周视图显示）
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的周日期
 */
export function formatWeekDay(date) {
  const d = toBeijingTime(date)
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * 获取周数
 * @param {Date} date - 日期对象
 * @returns {number} 周数
 */
export function getWeekNumber(date) {
  const d = toBeijingTime(new Date(date))
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  const days = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return weekNum
}

/**
 * 获取北京时间的日期时间字符串（用于后端）
 * @returns {string} 北京时间的日期时间字符串
 */
export function getBeijingDateTime() {
  const now = new Date()
  const beijingTime = toBeijingTime(now)
  return beijingTime.toISOString().replace('T', ' ').substring(0, 19)
}

/**
 * 获取本周的开始和结束日期
 * @param {Date} date - 日期对象
 * @returns {{ start: Date, end: Date }} 本周的开始和结束日期
 */
export function getWeekRange(date) {
  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return { start, end }
}

/**
 * 获取当前日期的本地日期字符串（YYYY-MM-DD格式）
 * @returns {string} 本地日期字符串
 */
export function getLocalDateString() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0]
}
