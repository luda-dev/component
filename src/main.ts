import { createApp } from 'vue'
import App from './App.vue'

// 导入 UnoCSS
import 'uno.css'
// 导入全局样式
import './styles/index.css'

// 导入 vxe-table 样式
import 'vxe-table/lib/style.css'

const app = createApp(App)

app.mount('#app')
