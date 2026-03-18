import { vi } from 'vitest'
import { config } from '@vue/test-utils'

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

config.global.stubs = {
  'el-button': true,
  'el-input': true,
  'el-form': true,
  'el-form-item': true,
  'el-dialog': true,
  'el-select': true,
  'el-option': true,
  'el-checkbox': true,
  'el-dropdown': true,
  'el-dropdown-menu': true,
  'el-dropdown-item': true,
  'el-avatar': true,
  'el-table': true,
  'el-table-column': true,
  'van-tabbar': true,
  'van-tabbar-item': true,
  'van-swipe': true,
  'van-swipe-item': true,
  'van-nav-bar': true,
  'van-cell-group': true,
  'van-cell': true,
  'van-button': true,
  'van-image': true,
  'van-checkbox': true
}