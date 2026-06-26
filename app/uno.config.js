import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
  ],
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200',
    'btn-primary': 'btn bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
    'btn-ghost': 'btn bg-transparent text-gray-300 hover:bg-white/10',
    'input-base': 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors',
    'card': 'bg-white/5 backdrop-blur-sm rounded-xl border border-white/10',
  },
  theme: {
    colors: {
      dark: {
        bg: '#0f0f1a',
        surface: '#1a1a2e',
        card: '#16213e',
        accent: '#0f3460',
        primary: '#e94560',
      }
    }
  }
})
