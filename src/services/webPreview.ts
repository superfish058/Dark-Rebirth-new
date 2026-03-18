import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

interface WebPreviewResult {
  success: boolean
  data?: {
    title?: string
    description?: string
    icon?: string
    image?: string
  }
  error?: string
}

class WebPreviewService {
  private cache = new Map<string, WebPreviewResult>()
  private cacheTimeout = 24 * 60 * 60 * 1000

  async getWebPreview(url: string): Promise<WebPreviewResult> {
    try {
      const normalizedUrl = this.normalizeUrl(url)
      
      const cached = this.cache.get(normalizedUrl)
      if (cached && this.isCacheValid(cached)) {
        return cached
      }

      const result = await this.fetchWebPreview(normalizedUrl)
      
      if (result.success) {
        this.cache.set(normalizedUrl, {
          ...result,
          data: {
            ...result.data,
            timestamp: Date.now()
          }
        })
      }

      return result
    } catch (error) {
      console.error('获取网页预览失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  private async fetchWebPreview(url: string): Promise<WebPreviewResult> {
    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&meta=true&screenshot=true&embed=screenshot.url`)
      
      if (!response.ok) {
        throw new Error('获取网页预览失败')
      }

      const data = await response.json()
      
      if (data.status === 'fail') {
        throw new Error(data.message || '获取网页预览失败')
      }

      const result = data.data
      
      return {
        success: true,
        data: {
          title: result.title,
          description: result.description,
          icon: result.logo?.url || result.image?.url,
          image: result.screenshot?.url
        }
      }
    } catch (error) {
      console.error('获取网页预览失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.toString()
    } catch {
      return url
    }
  }

  private isCacheValid(cached: WebPreviewResult): boolean {
    if (!cached.data || typeof cached.data !== 'object') return false
    const timestamp = (cached.data as any).timestamp
    if (!timestamp) return false
    return Date.now() - timestamp < this.cacheTimeout
  }

  clearCache() {
    this.cache.clear()
  }

  getCacheSize(): number {
    return this.cache.size
  }
}

export default new WebPreviewService()
