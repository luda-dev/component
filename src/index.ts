/**
 * 低代码组件库
 * 主入口文件
 */

import type { App } from 'vue'

// 组件导入
import { ModularLoader } from './components/modular-loader'
import { DataTable } from './components/data-table'
import { ViewTabs } from './components/view-tabs'
import { VxeTableWrapper } from './components/vxe-table-wrapper'
import { GenericFilter } from './components/filter'

// 类型导出
export * from './types'

// 组件导出
export {
  ModularLoader,
  DataTable,
  ViewTabs,
  VxeTableWrapper,
  GenericFilter
}

// 所有组件列表
const components = [
  ModularLoader,
  DataTable,
  ViewTabs,
  VxeTableWrapper,
  GenericFilter
]

/**
 * 安装所有组件
 */
export function install(app: App) {
  components.forEach(component => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

/**
 * 默认导出
 */
export default {
  install,
  ModularLoader,
  DataTable,
  ViewTabs,
  VxeTableWrapper,
  GenericFilter
}
