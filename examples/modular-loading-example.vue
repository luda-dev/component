<template>
  <div class="modular-loading-demo">
    <h1>模块化加载示例</h1>
    
    <section>
      <h2>1. 完整引入方式</h2>
      <pre><code>import { createApp } from 'vue'
import ComponentLibrary from '@luda-dev/component'
import '@luda-dev/component/style.css'

const app = createApp(App)
app.use(ComponentLibrary)
app.mount('#app')</code></pre>
      <p>✅ 适合使用多个组件的场景</p>
      <p>⚠️ 会引入所有组件，打包体积较大</p>
    </section>

    <section>
      <h2>2. 从主入口按需引入</h2>
      <pre><code>// 组件引入
import { ModularLoader, DataTable, ViewTabs } from '@luda-dev/component'

// Composables 引入
import { useDataTable, useFilter } from '@luda-dev/component'

// 工具函数引入
import { deepClone, formatDate } from '@luda-dev/component'

// 类型引入
import type { ModuleConfig } from '@luda-dev/component'</code></pre>
      <p>✅ 代码简洁，从单一入口引入</p>
      <p>⚠️ Tree-shaking 效果取决于打包工具配置</p>
    </section>

    <section>
      <h2>3. 模块化路径引入（推荐）</h2>
      <pre><code>// 按组件路径引入 - 最佳 Tree-shaking 效果
import { ModularLoader } from '@luda-dev/component/modular-loader'
import { DataTable } from '@luda-dev/component/data-table'
import { ViewTabs } from '@luda-dev/component/view-tabs'
import { VxeTableWrapper } from '@luda-dev/component/vxe-table-wrapper'
import { GenericFilter } from '@luda-dev/component/filter'

// 按功能模块引入
import { useModularLoader, useDataTable, useFilter } from '@luda-dev/component/composables'
import { deepClone, debounce, formatDate, generateId } from '@luda-dev/component/utils'
import type { ModuleConfig, DataTableConfig, FilterConfig } from '@luda-dev/component/types'

// 样式引入
import '@luda-dev/component/style.css'</code></pre>
      <p>✅ 最佳 Tree-shaking 效果，按需加载</p>
      <p>✅ 打包体积最小</p>
      <p>✅ 明确的依赖关系</p>
    </section>

    <section>
      <h2>4. 可用的模块路径</h2>
      <div class="module-paths">
        <h3>组件模块：</h3>
        <ul>
          <li><code>@luda-dev/component/modular-loader</code> - 模块化加载器</li>
          <li><code>@luda-dev/component/data-table</code> - 数据表组件</li>
          <li><code>@luda-dev/component/view-tabs</code> - 视图标签页</li>
          <li><code>@luda-dev/component/vxe-table-wrapper</code> - VXE Table 封装</li>
          <li><code>@luda-dev/component/filter</code> - 通用过滤器</li>
        </ul>

        <h3>功能模块：</h3>
        <ul>
          <li><code>@luda-dev/component/composables</code> - 组合式函数</li>
          <li><code>@luda-dev/component/utils</code> - 工具函数</li>
          <li><code>@luda-dev/component/types</code> - TypeScript 类型定义</li>
        </ul>

        <h3>样式：</h3>
        <ul>
          <li><code>@luda-dev/component/style.css</code> - 组件样式</li>
        </ul>
      </div>
    </section>

    <section>
      <h2>5. 实际使用示例</h2>
      <div class="example-code">
        <h3>示例 A: 只使用数据表组件</h3>
        <pre><code>// 最小化引入
import { DataTable } from '@luda-dev/component/data-table'
import { useDataTable } from '@luda-dev/component/composables'
import type { DataTableConfig } from '@luda-dev/component/types'
import '@luda-dev/component/style.css'

// 使用组件
const tableConfig: DataTableConfig = {
  columns: [/* ... */]
}

const { data, addColumn } = useDataTable(tableConfig.columns)</code></pre>
      </div>

      <div class="example-code">
        <h3>示例 B: 使用多个组件</h3>
        <pre><code>// 按需引入多个组件
import { DataTable } from '@luda-dev/component/data-table'
import { ViewTabs } from '@luda-dev/component/view-tabs'
import { GenericFilter } from '@luda-dev/component/filter'
import { deepClone, formatDate } from '@luda-dev/component/utils'
import '@luda-dev/component/style.css'

// 使用组件...
</code></pre>
      </div>

      <div class="example-code">
        <h3>示例 C: 工具函数独立使用</h3>
        <pre><code>// 只引入工具函数，不引入组件
import { deepClone, debounce, formatDate } from '@luda-dev/component/utils'

const cloned = deepClone(originalObject)
const formatted = formatDate(new Date(), 'YYYY-MM-DD')</code></pre>
      </div>
    </section>

    <section>
      <h2>6. 优势对比</h2>
      <table>
        <thead>
          <tr>
            <th>引入方式</th>
            <th>打包体积</th>
            <th>Tree-shaking</th>
            <th>类型支持</th>
            <th>推荐场景</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>完整引入</td>
            <td>最大</td>
            <td>❌</td>
            <td>✅</td>
            <td>使用多个组件</td>
          </tr>
          <tr>
            <td>主入口按需</td>
            <td>中等</td>
            <td>⚠️</td>
            <td>✅</td>
            <td>快速开发</td>
          </tr>
          <tr>
            <td>模块化路径</td>
            <td>最小</td>
            <td>✅</td>
            <td>✅</td>
            <td>生产环境（推荐）</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.modular-loading-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

section {
  margin-bottom: 40px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

h1 {
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

h2 {
  color: #42b983;
  margin-top: 0;
}

h3 {
  color: #2c3e50;
  margin-top: 20px;
}

pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}

code {
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

p {
  margin: 10px 0;
  line-height: 1.6;
}

.module-paths ul {
  list-style: none;
  padding-left: 0;
}

.module-paths li {
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.module-paths code {
  background: #e8f5e9;
  padding: 2px 6px;
  border-radius: 3px;
  color: #2e7d32;
}

.example-code {
  margin: 20px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  background: white;
}

th, td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background: #42b983;
  color: white;
  font-weight: bold;
}

tr:nth-child(even) {
  background: #f9f9f9;
}
</style>
