import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { addCollection } from '@iconify/vue'
import { icons as mdiIcons } from '@iconify-json/mdi'
import App from './App.vue'
import router from './router'
import './styles/global.css'

// 注册本地 Material Design Icons，避免网络加载延迟导致图标显示为文字
addCollection(mdiIcons)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
