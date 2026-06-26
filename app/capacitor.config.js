/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.darkrebirth.app',
  appName: 'Dark Rebirth',
  webDir: 'www',
  server: {
    // 开发时指向前端 dev server，实现一套代码多端互通
    // 打包时注释掉此行，改用 build 产物或服务器地址
    url: 'http://localhost:5173',
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#FFF8F0'
    }
  }
}

export default config
