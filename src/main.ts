import { createApp } from 'vue'
import App from './App.vue'

// 导入 UnoCSS
import 'uno.css'
// 导入全局样式
import './styles/index.css'

// 导入和配置 VXE Table
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

const app = createApp(App)

// 安装 VXE Table
app.use(VXETable)

app.mount('#app')
