import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders correctly when loading is true', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        loading: true,
        text: '加载中...'
      }
    })
    
    expect(wrapper.text()).toContain('加载中...')
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })

  it('does not render when loading is false', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        loading: false
      }
    })
    
    expect(wrapper.find('.loading-spinner').exists()).toBe(false)
  })

  it('displays text when provided', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        loading: true,
        text: '请稍候'
      }
    })
    
    expect(wrapper.find('.loading-spinner__text').text()).toBe('请稍候')
  })
})